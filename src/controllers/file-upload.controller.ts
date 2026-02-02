import { inject } from '@loopback/core';
import crypto from 'crypto';
import {
  get,
  HttpErrors,
  oas,
  param,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY } from '../keys';
import { FileUploadHandler } from '../types';
import { authenticate } from '@loopback/authentication';

const readdir = promisify(fs.readdir);

const fileAccessTokens = new Map<
  string,
  { fileName: string; expiresAt: number; userId?: string }
>();

/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) { }

  // @authenticate('jwt')
  @post('/files', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) {
          response.writeHead(404);
          response.end('Something Went Wrong');
        } else {
          resolve(FileUploadController.getFilesAndFields(request));
        }
      });
    });
  }

  @authenticate('jwt')
  @post('/private/files/{filename}/access', {
    responses: {
      200: {
        description: 'Generate temporary access URL',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessUrl: { type: 'string' },
                expiresIn: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  async generatePrivateFileAccess(
    @param.path.string('filename') fileName: string,
  ): Promise<{ accessUrl: string; expiresIn: number }> {
    // TODO: add permission check if needed (owner/admin/etc)

    const token = crypto.randomUUID();
    const expiresInMs = 60 * 1000; // 60 seconds

    fileAccessTokens.set(token, {
      fileName,
      expiresAt: Date.now() + expiresInMs,
    });

    return {
      accessUrl: `/private/files/view?token=${token}`,
      expiresIn: 60,
    };
  }

  @get('/private/files/view')
  @oas.response.file()
  async viewPrivateFile(
    @param.query.string('token') token: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const tokenData = fileAccessTokens.get(token);

    if (!tokenData) {
      throw new HttpErrors.Unauthorized('Invalid or expired link');
    }

    if (Date.now() > tokenData.expiresAt) {
      fileAccessTokens.delete(token);
      throw new HttpErrors.Unauthorized('Link expired');
    }

    // OPTIONAL: single-use token
    fileAccessTokens.delete(token);

    const filePath = this.validateFileName(tokenData.fileName);

    response.setHeader('Content-Disposition', 'inline');
    response.setHeader('Content-Type', 'application/octet-stream');

    fs.createReadStream(filePath).pipe(response);
    return response;
  }

  private static getFilesAndFields(request: Request) {
    const ALLOWED_MIME_TYPES = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx'];

    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => {
      console.log('file', f);
      const ext = path.extname(f.originalname).toLowerCase();

      if (
        !ALLOWED_MIME_TYPES.includes(f.mimetype) ||
        !ALLOWED_EXTENSIONS.includes(ext)
      ) {
        throw new HttpErrors.BadRequest(
          `Invalid file type: ${f.originalname}. Only images, PDF, DOC allowed.`,
        );
      }

      return {
        fieldname: f.fieldname,
        fileName: f.originalname,
        newFileName: f.filename,
        fileUrl: `${process.env.API_ENDPOINT}/files/${f.filename}`, // Use f.filename instead of f.originalname
        encoding: f.encoding,
        mimetype: f.mimetype,
        size: f.size,
      };
    };
    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }

    return { files, fields: request.body };
  }

  @get('/files/{filename}')
  @oas.response.file()
  downloadFile(
    @param.path.string('filename') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const file = this.validateFileName(fileName);
    fs.readFile(file, function (err, data) {
      if (err) {
        response.writeHead(404);
        response.end('Something Went Wrong');
      } else {
        response.writeHead(200);
        response.end(data); // Send the file data to the browser.
      }
    });
    return response;
  }

  private validateFileName(fileName: string) {
    const resolved = path.resolve(this.storageDirectory, fileName);
    if (resolved.startsWith(this.storageDirectory)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
  }
}
