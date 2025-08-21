import {
  Filter,
  FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import slugify from 'slugify';
import {Blogs} from '../models';
import {BlogsRepository, CategoryBlogsLinkRepository} from '../repositories';

export class BlogsController {
  constructor(
    @repository(BlogsRepository)
    public blogsRepository: BlogsRepository,
    @repository(CategoryBlogsLinkRepository)
    public categoryBlogsLinkRepository: CategoryBlogsLinkRepository,
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
          }).definitions?.Blogs?.properties,
          categories: {
            type: 'array',
            items: {
              type: 'number',
            },
          },
        },
      },
    })
    data: Omit<Blogs, 'id'> & {categories?: number[]},
  ): Promise<Blogs> {
    const {categories, ...blogs} = data;
    const slug = slugify(blogs.title, {lower: true, strict: true});

    const existing = await this.blogsRepository.findOne({where: {slug}});
    if (existing) {
      throw new HttpErrors.BadRequest('A blog with this title already exists.');
    }

    const savedBlog = await this.blogsRepository.create({
      ...blogs,
      slug,
    });

    if (categories && categories.length > 0) {
      for (const categoryId of categories) {
        await this.blogsRepository.categories(savedBlog.id).link(categoryId);
      }
    }

    return savedBlog;
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
    @param.query.number('categoryId') categoryId?: number,
  ): Promise<{blogs: Blogs[], count: number}> {
    if (categoryId) {
      const blogCategories = await this.categoryBlogsLinkRepository.find({
        where: {categoryId},
      });
      const blogIds = blogCategories.map(bc => bc.blogsId);

      const blogs = await this.blogsRepository.find({
        ...filter,
        where: {id: {inq: blogIds}},
        include: filter?.include,
      });

      return {
        blogs,
        count: blogs.length
      };
    }

    const blogs = await this.blogsRepository.find(filter);
    const count = await this.blogsRepository.count();
    return {
      blogs,
      count: count.count
    }
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
    return this.blogsRepository.findById(id, {...filter, include: [{relation: 'categories'}]});
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
    const blog = await this.blogsRepository.findOne({where: {slug}, include: [{relation: 'categories'}]});

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
          schema: getModelSchemaRef(Blogs, {partial: true}).definitions?.Blogs?.properties,
          categories: {
            type: 'array',
            items: {
              type: 'number',
            },
          },
        },
      },
    })
    data: Blogs & {categories?: number[]},
  ): Promise<void> {
    const {categories, ...blogs} = data;
    const slug = slugify(blogs.title, {lower: true, strict: true});

    const existing = await this.blogsRepository.findOne({where: {slug}});
    if (existing) {
      throw new HttpErrors.BadRequest('A blog with this title already exists.');
    }

    const newUpdatedData = {...blogs, slug};
    await this.blogsRepository.updateById(id, newUpdatedData);

    if (categories && categories.length > 0) {
      await this.blogsRepository.categories(id).unlinkAll();

      for (const cat of categories) {
        await this.blogsRepository.categories(id).link(cat);
      }
    }
  }


  @del('/blogs/{id}')
  @response(204, {
    description: 'Blogs DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.blogsRepository.deleteById(id);
  }
}
