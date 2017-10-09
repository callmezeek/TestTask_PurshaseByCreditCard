import { CreditCard, ICreditCard } from './CreditCard';
import { ValidateNested, IsNotEmpty } from 'class-validator';
import i18next from 'i18next';
import v4 from 'uuid';

export class Purshase implements IPurshasePut {
  id: string;

  @IsNotEmpty({ message: i18next.t('validation.purshase.number') })
  number?: number;

  @IsNotEmpty({ message: i18next.t('validation.purshase.price') })
  price?: number;
  currency: Currency;

  @ValidateNested()
  creditCard: CreditCard;

  createTime: Date;

  constructor() {
    this.id = v4();
    this.creditCard = new CreditCard();
    this.currency = Currency.RUB;
  }
}

export class PurshasePut implements IPurshasePut {
  id: string;
  number?: number;
  price?: number;
  currency: Currency;
  
  public static getFromPurshase(purshase: Purshase) {
    let result = new PurshasePut();
    result.id = purshase.id;
    result.number = purshase.number;
    result.price = purshase.price;
    result.currency = purshase.currency;
    return result;
  }
}

export interface IPurshasePut {
  id: string;
  number?: number;
  price?: number;
  currency: Currency;
}

export class PurshasePostResult {
  succeed: boolean;
  validationError: string;

  constructor(success: boolean, validationError: string = '') {
    this.succeed = success;
    this.validationError = validationError;
  }
}

export enum Currency {
  RUB,
  USD
}

export class CurrencyTransform {
  public static transformCurrency(enumVal: Currency) {
    switch(enumVal) {
      case Currency.RUB:
        return 'RUB';
      case Currency.USD:
        return 'USD';
    }

    if (typeof enumVal == 'string') {
      switch(enumVal as string) {
        case '0':
          return 'RUB';
        case '1':
          return 'USD';
      }
    }

    return enumVal;
  }

  public static transformToCurrency(enumVal: any) {
    switch(enumVal) {
      case '0':
      case 'RUB':
        return Currency.RUB;
      case '1':
      case 'USD':
        return Currency.USD;
    }

    return enumVal;
  }

  public static getCurrencyDict() {
    return Object.keys(Currency).map((k: any) => { return { key: k, val: Currency[k] }; }).filter((v: any) => typeof v.val === 'string');
  }
}