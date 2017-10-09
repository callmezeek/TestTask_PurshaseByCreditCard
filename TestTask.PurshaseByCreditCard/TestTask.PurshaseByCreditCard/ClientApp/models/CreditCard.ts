import { Matches, IsNotEmpty } from 'class-validator';
import i18next from 'i18next';
import v4 from 'uuid';

export class CreditCard implements ICreditCard {
  id: string;

  @Matches(/^[0-9]{16}$|^[0-9]{19}$/)
  @IsNotEmpty({ message: i18next.t('validation.creditCard.number') })
  number: string;

  @IsNotEmpty({ message: i18next.t('validation.creditCard.cardholder') })
  cardholder: string;

  expDateMonth: number;
  expDateYear: number;
  @Matches(/^[0-9]{3,4}$/)
  cvv: string;

  constructor() {
    this.id = v4();
    this.expDateMonth = 1;
    this.expDateYear = new Date().getFullYear();
  }
}

export interface ICreditCard {
  id: string;
  number: string;
  cardholder: string;
  expDateMonth: number;
  expDateYear: number;
  cvv: string;
}