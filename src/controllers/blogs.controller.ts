import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import slugify from 'slugify';
import {Blogs} from '../models';
import {BlogsRepository} from '../repositories';

export class BlogsController {
  constructor(
    @repository(BlogsRepository)
    public blogsRepository: BlogsRepository,
  ) { }


  @post('/blogs')
  @response(200, {
    description: 'Blogs model instance',
    content: {'application/json': {schema: getModelSchemaRef(Blogs)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Blogs, {
            title: 'NewBlogs',
            exclude: ['id'],
          }),
        },
      },
    })
    blogs: Omit<Blogs, 'id'>,
  ): Promise<Blogs> {
    const slug = slugify(blogs.title, {lower: true, strict: true});

    const existing = await this.blogsRepository.findOne({where: {slug}});
    if (existing) {
      throw new HttpErrors.BadRequest('A blog with this title already exists.');
    }

    return this.blogsRepository.create({
      ...blogs,
      slug,
    });
  }


  @get('/blogs')
  @response(200, {
    description: 'Array of Blogs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Blogs, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Blogs) filter?: Filter<Blogs>,
  ): Promise<Blogs[]> {
    return this.blogsRepository.find(filter);
  }

  @get('/blogs/{id}')
  @response(200, {
    description: 'Blogs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Blogs, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Blogs, {exclude: 'where'}) filter?: FilterExcludingWhere<Blogs>
  ): Promise<Blogs> {
    return this.blogsRepository.findById(id, filter);
  }

  @get('/blogs/slug/{slug}')
  @response(200, {
    description: 'Get blog by slug',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Blogs, {includeRelations: true}),
      },
    },
  })
  async findBySlug(
    @param.path.string('slug') slug: string
  ): Promise<Blogs> {
    const blog = await this.blogsRepository.findOne({where: {slug}});

    if (!blog) {
      throw new HttpErrors.NotFound('Blog not found with this slug');
    }

    return blog;
  }


  @patch('/blogs/{id}')
  @response(204, {
    description: 'Blogs PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Blogs, {partial: true}),
        },
      },
    })
    blogs: Blogs,
  ): Promise<void> {
    await this.blogsRepository.updateById(id, blogs);
  }


  @del('/blogs/{id}')
  @response(204, {
    description: 'Blogs DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.blogsRepository.deleteById(id);
  }
}
