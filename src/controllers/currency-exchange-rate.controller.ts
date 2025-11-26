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
import { CurrencyExchangeRate } from '../models';
import { CurrencyExchangeRateRepository } from '../repositories';
import { PermissionKeys } from '../authorization/permission-keys';
import { authenticate } from '@loopback/authentication';

export class CurrencyExchangeRateController {
  constructor(
    @repository(CurrencyExchangeRateRepository)
    public currencyExchangeRateRepository: CurrencyExchangeRateRepository,
  ) { }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/currency-exchange-rates')
  @response(200, {
    description: 'CurrencyExchangeRate model instance',
    content: { 'application/json': { schema: getModelSchemaRef(CurrencyExchangeRate) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CurrencyExchangeRate, {
            title: 'NewCurrencyExchangeRate',
            exclude: ['id'],
          }),
        },
      },
    })
    currencyExchangeRate: Omit<CurrencyExchangeRate, 'id'>,
  ): Promise<CurrencyExchangeRate> {
    return this.currencyExchangeRateRepository.create(currencyExchangeRate);
  }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  // })
  @get('/currency-exchange-rates')
  @response(200, {
    description: 'Array of CurrencyExchangeRate model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CurrencyExchangeRate, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(CurrencyExchangeRate) filter?: Filter<CurrencyExchangeRate>,
  ): Promise<CurrencyExchangeRate[]> {
    return this.currencyExchangeRateRepository.find({...filter, order: ['createdAt desc']});
  }

  @patch('/currency-exchange-rates')
  @response(200, {
    description: 'CurrencyExchangeRate PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CurrencyExchangeRate, { partial: true }),
        },
      },
    })
    currencyExchangeRate: CurrencyExchangeRate,
    @param.where(CurrencyExchangeRate) where?: Where<CurrencyExchangeRate>,
  ): Promise<Count> {
    return this.currencyExchangeRateRepository.updateAll(currencyExchangeRate, where);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @patch('/currency-exchange-rates/{id}')
  @response(204, {
    description: 'CurrencyExchangeRate PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CurrencyExchangeRate, { partial: true }),
        },
      },
    })
    currencyExchangeRate: CurrencyExchangeRate,
  ): Promise<void> {
    await this.currencyExchangeRateRepository.updateById(id, currencyExchangeRate);
  }
}
