import { Entity, model, property } from '@loopback/repository';

@model()
export class CurrencyExchangeRate extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  baseCurrency: string;

  @property({
    type: 'string',
    required: true,
  })
  targetCurrency: string;

  @property({
    type: 'number',
    required: true,
  })
  rate: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt?: Date;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @property({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
  constructor(data?: Partial<CurrencyExchangeRate>) {
    super(data);
  }
}

export interface CurrencyExchangeRateRelations {
  // describe navigational properties here
}

export type CurrencyExchangeRateWithRelations = CurrencyExchangeRate & CurrencyExchangeRateRelations;
