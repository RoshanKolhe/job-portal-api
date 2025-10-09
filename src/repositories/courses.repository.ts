import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {Courses, CoursesRelations, KeyOutComes, ProgramModule} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {KeyOutComesRepository} from './key-out-comes.repository';
import {ProgramModuleRepository} from './program-module.repository';

export class CoursesRepository extends TimeStampRepositoryMixin<
  Courses,
  typeof Courses.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Courses,
      typeof Courses.prototype.id,
      CoursesRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly keyOutComes: HasManyRepositoryFactory<KeyOutComes, typeof Courses.prototype.id>;

  public readonly programModules: HasManyRepositoryFactory<ProgramModule, typeof Courses.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('KeyOutComesRepository') protected keyOutComesRepositoryGetter: Getter<KeyOutComesRepository>, @repository.getter('ProgramModuleRepository') protected programModuleRepositoryGetter: Getter<ProgramModuleRepository>,
  ) {
    super(Courses, dataSource);
    this.programModules = this.createHasManyRepositoryFactoryFor('programModules', programModuleRepositoryGetter,);
    this.registerInclusionResolver('programModules', this.programModules.inclusionResolver);
    this.keyOutComes = this.createHasManyRepositoryFactoryFor('keyOutComes', keyOutComesRepositoryGetter,);
    this.registerInclusionResolver('keyOutComes', this.keyOutComes.inclusionResolver);
  }
}
