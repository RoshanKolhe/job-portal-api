import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {WaitList} from '../models';
import {WaitListRepository} from '../repositories';

export class WaitListController {
  constructor(
    @repository(WaitListRepository)
    public waitListRepository : WaitListRepository,
  ) {}

  @post('/wait-lists')
  @response(200, {
    description: 'WaitList model instance',
    content: {'application/json': {schema: getModelSchemaRef(WaitList)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WaitList, {
            title: 'NewWaitList',
            exclude: ['id'],
          }),
        },
      },
    })
    waitList: Omit<WaitList, 'id'>,
  ): Promise<WaitList> {
    const existingWaitlist = await this.waitListRepository.findOne({
      where : {
        email: waitList.email
      }
    });

    if(existingWaitlist){
      return existingWaitlist;
    }
    return this.waitListRepository.create(waitList);
  }

  @get('/wait-lists/count')
  @response(200, {
    description: 'WaitList model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(WaitList) where?: Where<WaitList>,
  ): Promise<Count> {
    return this.waitListRepository.count(where);
  }

  @get('/wait-lists')
  @response(200, {
    description: 'Array of WaitList model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(WaitList, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(WaitList) filter?: Filter<WaitList>,
  ): Promise<WaitList[]> {
    return this.waitListRepository.find(filter);
  }

  @patch('/wait-lists')
  @response(200, {
    description: 'WaitList PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WaitList, {partial: true}),
        },
      },
    })
    waitList: WaitList,
    @param.where(WaitList) where?: Where<WaitList>,
  ): Promise<Count> {
    return this.waitListRepository.updateAll(waitList, where);
  }

  @get('/wait-lists/{id}')
  @response(200, {
    description: 'WaitList model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(WaitList, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(WaitList, {exclude: 'where'}) filter?: FilterExcludingWhere<WaitList>
  ): Promise<WaitList> {
    return this.waitListRepository.findById(id, filter);
  }

  @patch('/wait-lists/{id}')
  @response(204, {
    description: 'WaitList PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WaitList, {partial: true}),
        },
      },
    })
    waitList: WaitList,
  ): Promise<void> {
    await this.waitListRepository.updateById(id, waitList);
  }

  @put('/wait-lists/{id}')
  @response(204, {
    description: 'WaitList PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() waitList: WaitList,
  ): Promise<void> {
    await this.waitListRepository.replaceById(id, waitList);
  }

  @del('/wait-lists/{id}')
  @response(204, {
    description: 'WaitList DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.waitListRepository.deleteById(id);
  }
}
