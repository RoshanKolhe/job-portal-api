import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {Blogs, BlogsRelations, Category, CategoryBlogsLink} from '../models';
import {CategoryBlogsLinkRepository} from './category-blogs-link.repository';
import {CategoryRepository} from './category.repository';

export class BlogsRepository extends TimeStampRepositoryMixin<
  Blogs,
  typeof Blogs.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Blogs,
      typeof Blogs.prototype.id,
      BlogsRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly categories: HasManyThroughRepositoryFactory<Category, typeof Category.prototype.id,
          CategoryBlogsLink,
          typeof Blogs.prototype.id
        >;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('CategoryBlogsLinkRepository') protected categoryBlogsLinkRepositoryGetter: Getter<CategoryBlogsLinkRepository>, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Blogs, dataSource);
    this.categories = this.createHasManyThroughRepositoryFactoryFor('categories', categoryRepositoryGetter, categoryBlogsLinkRepositoryGetter,);
    this.registerInclusionResolver('categories', this.categories.inclusionResolver);
  }
}

