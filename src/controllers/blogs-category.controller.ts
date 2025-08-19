import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Blogs,
CategoryBlogsLink,
Category,
} from '../models';
import {BlogsRepository} from '../repositories';

export class BlogsCategoryController {
  constructor(
    @repository(BlogsRepository) protected blogsRepository: BlogsRepository,
  ) { }

  @get('/blogs/{id}/categories', {
    responses: {
      '200': {
        description: 'Array of Blogs has many Category through CategoryBlogsLink',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.blogsRepository.categories(id).find(filter);
  }

  @post('/blogs/{id}/categories', {
    responses: {
      '200': {
        description: 'create a Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Category)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Blogs.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategoryInBlogs',
            exclude: ['id'],
          }),
        },
      },
    }) category: Omit<Category, 'id'>,
  ): Promise<Category> {
    return this.blogsRepository.categories(id).create(category);
  }

  @patch('/blogs/{id}/categories', {
    responses: {
      '200': {
        description: 'Blogs.Category PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Partial<Category>,
    @param.query.object('where', getWhereSchemaFor(Category)) where?: Where<Category>,
  ): Promise<Count> {
    return this.blogsRepository.categories(id).patch(category, where);
  }

  @del('/blogs/{id}/categories', {
    responses: {
      '200': {
        description: 'Blogs.Category DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Category)) where?: Where<Category>,
  ): Promise<Count> {
    return this.blogsRepository.categories(id).delete(where);
  }
}
