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
  HttpErrors,
} from '@loopback/rest';
import { WaitList } from '../models';
import { WaitListRepository } from '../repositories';

export class WaitListController {
  constructor(
    @repository(WaitListRepository)
    public waitListRepository: WaitListRepository,
  ) { }

  @post('/wait-lists')
  @response(200, {
    description: 'WaitList model instance',
    content: { 'application/json': { schema: getModelSchemaRef(WaitList) } },
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
  ): Promise<{ success: boolean; message: string; isNew: boolean; data: WaitList }> {
    const existingWaitlist = await this.waitListRepository.findOne({
      where: {
        and: [
          { email: waitList.email },
          { type: waitList.type }
        ]
      }
    });

    if (existingWaitlist) {
      if (existingWaitlist.type === "subscription") {
        return {
          success: true,
          isNew: false,
          message: "You are already subscribed.",
          data: existingWaitlist
        };
      } else if (existingWaitlist.type === "notification") {
        return {
          success: true,
          isNew: false,
          message: "You have already registered for notifications.",
          data: existingWaitlist
        };
      } else if (existingWaitlist.type === "reminder-fobo_resume") {
        return {
          success: true,
          isNew: false,
          message: "You have already registered for a FOBO resume reminder.",
          data: existingWaitlist
        };
      } else if (existingWaitlist.type === "lead-enterprise") {
        return {
          success: true,
          isNew: false,
          message: "Welcome back! You already have access to the benchmark report.",
          data: existingWaitlist
        };
      }

      // For any other type, return generic duplicate message
      return {
        success: true,
        isNew: false,
        message: "You have already registered with this email.",
        data: existingWaitlist
      };
    }

    const newWaitList = await this.waitListRepository.create(waitList);

    if (newWaitList.type === "subscription") {
      return {
        success: true,
        isNew: true,
        message: "Your subscription has been added successfully.",
        data: newWaitList
      };
    } else if (newWaitList.type === "notification") {
      return {
        success: true,
        isNew: true,
        message: "Thank you. Your registration for notifications was successful. You will be the first to know about important updates.",
        data: newWaitList
      };
    } else if (newWaitList.type === "reminder-fobo_resume") {
      return {
        success: true,
        isNew: true,
        message: "Thank you! We will send you a reminder link to complete your FOBO risk assessment.",
        data: newWaitList
      };
    } else if (newWaitList.type === "lead-enterprise") {
      return {
        success: true,
        isNew: true,
        message: "Access granted! Your benchmark report is ready for download.",
        data: newWaitList
      };
    }

    // For any other type, return generic success message
    return {
      success: true,
      isNew: true,
      message: "Registration successful.",
      data: newWaitList
    };
  }

  @get('/wait-lists/count')
  @response(200, {
    description: 'WaitList model count',
    content: { 'application/json': { schema: CountSchema } },
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
          items: getModelSchemaRef(WaitList, { includeRelations: true }),
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
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WaitList, { partial: true }),
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
        schema: getModelSchemaRef(WaitList, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(WaitList, { exclude: 'where' }) filter?: FilterExcludingWhere<WaitList>
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
          schema: getModelSchemaRef(WaitList, { partial: true }),
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
