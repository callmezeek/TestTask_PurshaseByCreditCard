import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Purshase, PurshasePostResult, Currency, CurrencyTransform } from '../models/Purshase';
import i18next from 'i18next';
import Payment from 'payment';
import { v4 } from 'uuid';
import { validateSync, ValidationError } from 'class-validator';
import { Modal, ModalHeader, Button, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import NumberFormat from 'react-number-format';

interface PurshaseState {
  purshase: Purshase;
  alertIsOpen: boolean;
  alertMessage: string;
  needToReloadPage: boolean;
  errors: string[];
}

export class PurshaseComponent extends React.Component<RouteComponentProps<{}>, PurshaseState> {
  constructor() {
    super();

    this.alertOpen = this.alertOpen.bind(this);
    this.alertClose = this.alertClose.bind(this);
    this.submitPurshase = this.submitPurshase.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onNumericInputChange = this.onNumericInputChange.bind(this);
    let newP = new Purshase();
    this.state = {
      purshase: newP,
      alertIsOpen: false,
      alertMessage: '',
      needToReloadPage: false,
      errors: this.getValidationErrorsForForm(validateSync(newP))
    };
  }

  getValidationErrorsForForm(errors: ValidationError[], path: string = '') {
    let result: string[] = [];
    if (errors && errors.length) {
      errors.forEach(item => {
        let curPath = path ? `${path}.${item.property}` : item.property;
        result.push(curPath);
        this.getValidationErrorsForForm(item.children, curPath).forEach(chItem => {
          result.push(chItem);
        });
      });
    }

    return result;
  }

  alertOpen(message: string, needToReloadPage: boolean = false) {
    this.setState({ alertIsOpen: true, alertMessage: message, needToReloadPage: needToReloadPage });
  }

  alertClose() {
    if (this.state.needToReloadPage) {
      this.props.history.push('/editViewPurshase');
    } else {
      this.setState({ alertIsOpen: false });
    }
  }

  componentDidMount() {
    Payment.formatCardNumber(document.querySelector('[name="cardNumber"]') as HTMLInputElement);
    Payment.formatCardCVC(document.querySelector('[name="cvv"]') as HTMLInputElement);
  }

  componentWillMount() {
    let self = this;
    i18next.on('languageChanged', lng => {
      self.forceUpdate();
    });
  }

  onNumericInputChange(e: any, values: any) {
    const target = e.target;
    switch (target.name) {
      case 'orderNumber':
        this.state.purshase.number = values.value ? values.floatValue : undefined;
        break;
      case 'orderPrice':
        this.state.purshase.price = values.value ? values.floatValue : undefined;
        break;
    }
    
    this.setState({ purshase: this.state.purshase, errors: this.getValidationErrorsForForm(validateSync(this.state.purshase)) });
  }

  onInputChange(e: any) {
    const target = e.target;
    switch (target.name) {
      case 'cardholder':
        this.state.purshase.creditCard.cardholder = target.value;
        break;
      case 'cardNumber':
        this.state.purshase.creditCard.number = target.value.replace(/ /g, '');
        break;
      case 'cvv':
        this.state.purshase.creditCard.cvv = target.value;
        break;
      case 'cardExpDateMonth':
        this.state.purshase.creditCard.expDateMonth = target.value ? parseInt(target.value) : 1;
        break;
      case 'cardExpDateYear':
        this.state.purshase.creditCard.expDateYear = target.value ? parseInt(target.value) : new Date().getFullYear();
        break;
      case 'orderCurrency':
        this.state.purshase.currency = CurrencyTransform.transformToCurrency(target.value);
        break;
    }

    this.setState({ purshase: this.state.purshase, errors: this.getValidationErrorsForForm(validateSync(this.state.purshase)) });
  }

  submitPurshase(e: any) {
    if (this.state.errors.length) {
      this.alertOpen(i18next.t('forms.purshase.notAllFieldsIsValid'));
    } else {
      let requestParams = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.purshase)
      };
      fetch('api/Purshase', requestParams).then(response => {
        switch (response.status) {
          case 201:
          case 422:
            return response.json() as Promise<PurshasePostResult>;
          default:
            return Promise.resolve(new PurshasePostResult(false, i18next.t('forms.purshase.operationFailed')));
        }
      }).then(result => {
        if (result.succeed) {
          let m : string = i18next.t('forms.purshase.operationSucceed');
          this.alertOpen(m, true);
        } else {
          this.alertOpen(result.validationError);
        }
      });
    }
  }

  public render() {
    let curYear = new Date().getFullYear();

    return <div className='credit-card'>
      <Modal show={this.state.alertIsOpen} onHide={this.alertClose} backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.alertMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={this.alertClose}>OK</Button>
        </Modal.Footer>
      </Modal>
      <div>
        <Form>
          <div className='row'>
            <FormGroup className='col-xs-6' validationState={this.state.errors.some(item => { return item === 'number'; }) ? 'error' : undefined}>
              <ControlLabel>{i18next.t('models.purshase.number')}</ControlLabel>
              <NumberFormat
                decimalPrecision={0}
                type='text'
                className='form-control'
                name='orderNumber'
                value={this.state.purshase.number}
                onChange={this.onNumericInputChange}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup className='col-xs-6' validationState={this.state.errors.some(item => { return item === 'price'; }) ? 'error' : undefined}>
              <ControlLabel>{i18next.t('models.purshase.price')}</ControlLabel>
              <div className='input-group price'>
                <NumberFormat
                  decimalPrecision={2}
                  role='group'
                  type='text'
                  className='form-control'
                  name='orderPrice'
                  onChange={this.onNumericInputChange}
                />
                <FormControl.Feedback />
                <div className='input-group-btn'>
                    <select className='form-control' role='group' name='orderCurrency' defaultValue={CurrencyTransform.transformToCurrency(this.state.purshase.currency)} onChange={this.onInputChange}>
                    {
                      CurrencyTransform.getCurrencyDict().map((o, i) => {
                        let val = o.val.toString();
                        return <option key={i} value={o.key}>{val}</option>;
                      })
                    }
                  </select>
                </div>
              </div>
            </FormGroup>
          </div>
          <fieldset className='payment'>
            <legend>{i18next.t('models.purshase.creditCard')}</legend>
            <FormGroup validationState={this.state.errors.some(item => { return item === 'creditCard.number'; }) ? 'error' : undefined}>
              <ControlLabel>{i18next.t('models.creditCard.number')}</ControlLabel>
              <input
                type='text'
                className='form-control'
                name='cardNumber'
                onKeyUp={this.onInputChange}
              />
              <FormControl.Feedback />
            </FormGroup>
            <div className='row'>
              <FormGroup className='col-xs-9' validationState={this.state.errors.some(item => { return item === 'creditCard.cardholder'; }) ? 'error' : undefined}>
                <ControlLabel>{i18next.t('models.creditCard.cardholder')}</ControlLabel>
                <input
                  type='text'
                  className='form-control'
                  name='cardholder'
                  onKeyUp={this.onInputChange}
                />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup className='col-xs-3' validationState={this.state.errors.some(item => { return item === 'creditCard.cvv'; }) ? 'error' : undefined}>
                <ControlLabel>{i18next.t('models.creditCard.cvv')}</ControlLabel>
                <input
                  type='text'
                  className='form-control'
                  name='cvv'
                  autoComplete='off'
                  onKeyUp={this.onInputChange}
                />
                <FormControl.Feedback />
              </FormGroup>
            </div>
            <FormGroup>
              <label htmlFor='cardExpDateMonth'>{i18next.t('forms.purshase.expDate')}</label>
              <div className='input-group'>
                <select className='input-group-addon' role='group' name='cardExpDateMonth'
                  defaultValue={this.state.purshase.creditCard.expDateMonth.toString()}
                  onChange={this.onInputChange}>
                  {
                    // Заполнение месяцев.
                    Array.from(new Array(12), (x, i) => i + 1).map((o, i) => {
                      let val = o.toString();
                      return <option key={i} value={val.length === 1 ? '0' + val : val}>{i18next.t('calendar.months.' + val)}</option>;
                    })
                  }
                </select>
                <select className='input-group-addon' role='group' name='cardExpDateYear'
                  defaultValue={this.state.purshase.creditCard.expDateYear.toString()}
                  onChange={this.onInputChange}>
                  {
                    // Заполнение годов +/- 9 от текущего.
                    Array.from(new Array(19), (x, i) => i + curYear - 9).map((o, i) => {
                      let val = o.toString();
                      return <option key={i} value={val}>{val}</option>;
                    })
                  }
                </select>
              </div>
            </FormGroup>
          </fieldset>
          <FormGroup>
            <button type='button' onClick={this.submitPurshase} className='btn btn-primary' id='confirm-purchase'>{i18next.t('forms.purshase.buy')}</button>
          </FormGroup>
        </Form>
      </div>
    </div>;
  }
}
