import {authenticate, AuthenticationBindings} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {Count, DefaultTransactionalRepository, IsolationLevel, repository} from "@loopback/repository";
import {del, get, getModelSchemaRef, param, post, requestBody} from "@loopback/rest";
import {UserProfile} from "@loopback/security";
import {PermissionKeys} from "../authorization/permission-keys";
import {JobPortalDataSource} from "../datasources";
import {Comments} from "../models";
import {CommentsRepository} from "../repositories";

// ----------------------------------------------------------------------------------------------------------------------

export class CommentsController {
  constructor(
    @inject('datasources.job_portal')
    public dataSource: JobPortalDataSource,
    @repository(CommentsRepository)
    public commentsRepository: CommentsRepository,
  ) { }

  // add new comment...
  @authenticate({
    strategy: 'jwt',
    options: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER]
  })
  @post('/comment')
  async newComment(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comments, {
            title: 'NewComment',
            exclude: ['id'],
          }),
        },
      },
    })
    commentData: Omit<Comments, 'id'>
  ): Promise<{success: boolean, message: string}> {
    const repo = new DefaultTransactionalRepository(Comments, this.dataSource);
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      const data = {
        ...commentData,
        userId: currentUser.id
      };
      await this.commentsRepository.create(data, {
        transaction: tx,
      });

      await tx.commit();

      return {
        success: true,
        message: 'Comment Added Successfully'
      }
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  // get parent comments....
  // @authenticate({
  //   strategy : 'jwt',
  //   options : [PermissionKeys.ADMIN, PermissionKeys.LISTENER]
  // })
  @get('/comments/{blogId}')
  async getParentComments(
    @param.path.number('blogId') blogId: number,
    @param.query.number('limit') limit: number,
    @param.query.number('skip') skip: number,
  ): Promise<{
    success: boolean,
    message: string,
    data: object,
    commentsCount: Count,
    totalCommentCount: number
  }> {
    try {
      // Fetch parent comments
      const comments = await this.commentsRepository.find({
        where: {
          blogsId: blogId,
          isParentComment: true
        },
        limit: limit || 10,
        skip: skip || 0,
        order: ['createdAt DESC'],
        include: [
          {
            relation: 'user',
            scope: {
              fields: {
                id: true,
                fullName: true,
                avatar: true
              },
            },
          },
        ]
      });

      //  Count only parent comments
      const commentsCount = await this.commentsRepository.count({
        isParentComment: true,
        blogsId: blogId
      });

      //  Count total comments
      const totalComments = await this.commentsRepository.count({
        blogsId: blogId
      });

      // Add replies count to each parent comment
      const filteredComments: any[] = [];

      await Promise.all(comments.map(async (comment) => {
        const replies = await this.commentsRepository.find({
          where: {repliedCommentId: comment.id}
        });

        const repliesCount = replies.length;

        filteredComments.push({
          ...comment,
          repliesCount: repliesCount
        });
      }));

      //  Return all counts + data
      return {
        success: true,
        message: 'comments list',
        data: filteredComments,
        commentsCount: commentsCount,           // parent only
        totalCommentCount: totalComments.count  // all comments
      };

    } catch (error) {
      throw error;
    }
  }


  // get comments replies...
  @get('/comment-replies/{commentId}')
  async getCommentReplies(
    @param.path.number('commentId') commentId: number,
    @param.query.number('limit') limit: number,
    @param.query.number('skip') skip: number
  ): Promise<{success: boolean, message: string, data: object, repliesCount: Count}> {
    try {
      // fetching replies...
      const replies = await this.commentsRepository.find(
        {
          where: {
            repliedCommentId: commentId
          },
          limit: limit || 10,
          skip: skip || 0,
          include: [
            {
              relation: 'user',
              scope: {
                fields: {
                  id: true,
                  fullName: true,
                  avatar: true
                },
              },
            },
          ]
        }
      );

      // fetching replies count...
      const repliesCount = await this.commentsRepository.count({repliedCommentId: commentId});

      let finalReplies: any = []

      // fetching nested replies count...
      await Promise.all(replies.map(async (reply) => {
        const nestedReplies = await this.commentsRepository.find({where: {repliedCommentId: reply.id}});

        const repliesCount = nestedReplies.length;

        finalReplies.push({
          ...reply,
          repliesCount: repliesCount
        })
      }))

      return {
        success: true,
        message: 'Replies on comment',
        data: finalReplies,
        repliesCount: repliesCount
      }
    } catch (error) {
      throw error;
    }
  }

  // delete comment and its replies...
  @authenticate({
    strategy: 'jwt',
    options: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER]
  })
  @del('/comment/{commentId}')
  async deleteCommentById(
    @param.path.number('commentId') commentId: number
  ): Promise<{success: boolean, message: string}> {
    try {
      await this.commentsRepository.deleteById(commentId);

      await this.commentsRepository.deleteAll({repliedCommentId: commentId});

      return {
        success: true,
        message: 'Comment Deleted'
      }
    } catch (error) {
      throw error;
    }
  }
}
