import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Purshase, Currency, CurrencyTransform, PurshasePostResult, IPurshasePut, PurshasePut } from '../models/Purshase';
import i18next from 'i18next';
import NumberFormat from 'react-number-format';
import { Modal, ModalHeader, Button, ButtonGroup } from 'react-bootstrap';
var Moment = require('moment');

interface EditViewRowProp {
  purshase: Purshase;
  index: number;
  alertOpen: Function;
}

interface EditViewRowState {
  isEditEnabled: boolean;
  editData?: Purshase;
  oldData?: Purshase;
}

class EditViewRow extends React.Component<EditViewRowProp, EditViewRowState> {
  constructor() {
    super();

    this.onEditClick = this.onEditClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onNumberChange = this.onNumberChange.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
    this.state = { 
      isEditEnabled: false,
      editData: undefined,
      oldData: undefined
    };
  }

  onNumberChange(e:any, values:any) {
    if (this.state.editData) {
      this.state.editData.number = values.value ? values.floatValue : undefined;
    }
  }

  onPriceChange(e:any, values:any) {
    if (this.state.editData) {
      this.state.editData.price = values.value ? values.floatValue : undefined;
    }
  }
  
  onCurrencyChange(e: any) {
    const target = e.target;
    if (this.state.editData) {
      this.state.editData.currency = CurrencyTransform.transformToCurrency(target.value);
    }
  }

  onEditClick() {
    this.setState({ isEditEnabled: true, editData: this.props.purshase, oldData: Object.assign({}, this.props.purshase) });
  }

  onSaveClick() {
    if (this.state.editData) {
      let requestParams = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(PurshasePut.getFromPurshase(this.state.editData))
      };
      fetch('api/Purshase', requestParams).then(response => {
        switch (response.status) {
          case 200:
          case 422:
            return response.json() as Promise<PurshasePostResult>;
          default:
            return Promise.resolve(new PurshasePostResult(false, i18next.t('forms.editViewPurshase.operationFailed')));
        }
      }).then(result => {
        if (result.succeed) {
          this.setState({ isEditEnabled: false });
        } else {
          this.props.alertOpen(result.validationError);
        }
      });
    } else {
      this.setState({ isEditEnabled: false });
    }
  }

  onCancelClick() {
    if (this.state.editData && this.state.oldData) {
      this.state.editData.number = this.state.oldData.number;
      this.state.editData.price = this.state.oldData.price;
      this.state.editData.currency = this.state.oldData.currency;
    }

    this.setState({ isEditEnabled: false });
  }

  private renderReadonly() {
    return <tr id={this.props.purshase.id}>
      <td>{Moment(Moment.utc(this.props.purshase.createTime).toDate()).format('HH:mm:ss DD.MM.YYYY')}</td>
      <td>{this.props.purshase.creditCard == null ? null : this.props.purshase.creditCard.cardholder}</td>
      <td>{this.props.purshase.creditCard == null ? null : this.props.purshase.creditCard.number}</td>
      <td>{this.props.purshase.number}</td>
      <td>{this.props.purshase.price}</td>
      <td>{CurrencyTransform.transformCurrency(this.props.purshase.currency)}</td>
      <td>
        <Button onClick={this.onEditClick} className='btn-purshase-edit' title={i18next.t('forms.editViewPurshase.operations.edit')}><i className='glyphicon glyphicon-edit' aria-hidden='true'/></Button>
      </td>
    </tr>;
  }

  private renderEditable() {
    let numberId = 'number' + this.props.index,
        priceId = 'price' + this.props.index,
        currencyId = 'currency' + this.props.index;
    return <tr id={this.props.purshase.id} className={this.state.isEditEnabled ? 'editing-purshase-row' : ''}>
      <td><span>{Moment(Moment.utc(this.props.purshase.createTime).toDate()).format('HH:mm:ss DD.MM.YYYY')}</span></td>
      <td><span>{this.props.purshase.creditCard == null ? null : this.props.purshase.creditCard.cardholder}</span></td>
      <td><span>{this.props.purshase.creditCard == null ? null : this.props.purshase.creditCard.number}</span></td>
      <td>
        <NumberFormat
          decimalPrecision={0}
          type='text'
          name={numberId}
          value={this.props.purshase.number}
          onChange={this.onNumberChange}
        />
      </td>
      <td>
        <NumberFormat
          decimalPrecision={2}
          type='text'
          name={priceId}
          value={this.props.purshase.price}
          onChange={this.onPriceChange}
        />
      </td>
      <td>
          <select name={currencyId} defaultValue={CurrencyTransform.transformToCurrency(this.props.purshase.currency)} onChange={this.onCurrencyChange}>
          {
            CurrencyTransform.getCurrencyDict().map((o, i) => {
              let val = o.val.toString();
              return <option key={i} value={o.key}>{val}</option>;
            })
          }
        </select>
      </td>
      <td>
          <ButtonGroup>
            <Button onClick={this.onSaveClick} title={i18next.t('forms.editViewPurshase.operations.save')}><i className='glyphicon glyphicon-floppy-save' aria-hidden='true'></i></Button>
            <Button onClick={this.onCancelClick} title={i18next.t('forms.editViewPurshase.operations.cancel')}><i className='glyphicon glyphicon-remove-circle' aria-hidden='true'/></Button>
          </ButtonGroup>
      </td>
    </tr>;
  }

  render() {
    return this.state.isEditEnabled ? this.renderEditable() : this.renderReadonly();
  }
}

interface EditViewPurshaseState {
  purshases: Purshase[];
  loading: boolean;
  alertIsOpen: boolean;
  alertMessage: string;
}

export class EditViewPurshase extends React.Component<RouteComponentProps<{}>, EditViewPurshaseState> {
  constructor() {
    super();

    this.alertOpen = this.alertOpen.bind(this);
    this.alertClose = this.alertClose.bind(this);
    this.state = {
      alertIsOpen: false,
      alertMessage: '',
      purshases: [], loading: true
    };

    fetch('api/Purshase/GetAllPurshases')
      .then(response => response.json() as Promise<Purshase[]>)
      .then(data => {
        this.setState({ purshases: data, loading: false });
      });
  }
  
  alertOpen(message: string, needToReloadPage: boolean = false) {
    this.setState({ alertIsOpen: true, alertMessage: message });
  }

  alertClose() {
    this.setState({ alertIsOpen: false });
  }

  componentWillMount() {
    let self = this;
    i18next.on('languageChanged', lng => {
      self.forceUpdate();
    });
  }

  public render() {
    let contents = this.state.loading
      ? <div className='purshase-loading'>
          <span className='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>
          <span>{i18next.t('forms.loading')}</span>
        </div>
      : this.renderPurshsesTable(this.state.purshases);

    return <div>
      <h1>{i18next.t('forms.editViewPurshase.caption')}</h1>
      {contents}
    </div>;
  }

  private renderPurshsesTable(purshases: Purshase[]) {
    return <div>
      <Modal show={this.state.alertIsOpen} onHide={this.alertClose} backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.alertMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={this.alertClose}>OK</Button>
        </Modal.Footer>
      </Modal>
      <table className='table edit-view-purshase'>
        <thead>
          <tr>
            <th>{i18next.t('models.purshase.createTime')}</th>
            <th>{i18next.t('forms.editViewPurshase.cardholder')}</th>
            <th>{i18next.t('forms.editViewPurshase.cardNumber')}</th>
            <th>{i18next.t('models.purshase.number')}</th>
            <th>{i18next.t('models.purshase.price')}</th>
            <th>{i18next.t('models.purshase.currency')}</th>
            <th className='operations'></th>
          </tr>
        </thead>
        <tbody>
          {purshases.map((purshase, index) =>
            <EditViewRow purshase={purshase} index={index} alertOpen={this.alertOpen} />
          )}
        </tbody>
      </table>
    </div>;
  }
}
