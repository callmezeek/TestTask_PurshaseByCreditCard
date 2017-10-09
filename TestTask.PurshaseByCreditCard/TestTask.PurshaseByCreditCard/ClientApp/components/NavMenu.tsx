import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import i18next from 'i18next';
import { Modal, ModalHeader, Button } from 'react-bootstrap';

export class NavMenu extends React.Component<{}, {}> {
  state = {
    alertIsOpen: false,
    alertMessage: ''
  };

  constructor() {
    super();
    this.alertOpen = this.alertOpen.bind(this);
    this.alertClose = this.alertClose.bind(this);
  }

  getCookie(name: string) {
    let results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return results ? results[2] : null;
  }

  alertOpen(message: string) {
    this.setState({ alertIsOpen: true, alertMessage: message });
  }

  alertClose() {
    this.setState({ alertIsOpen: false });
  }

  componentWillMount() {
    let culture = this.getCookie('.AspNetCore.Culture');
    this.setLanguage(culture || 'ru');
  }

  setLanguage(language: string, update: boolean = false) {
    if (update) {
      return fetch('api/Home/SetLanguage?culture=' + language).then(response => {
        if (response.status === 200) {
          i18next.init({
            lng: language,
            resources: require(`../locales/${language}.json`)
          });

          this.forceUpdate();
          return true;
        } else {
          this.alertOpen(i18next.t('locales.changeLanguageServerError'));
          return false;
        }
      }).catch(e => {
        this.alertOpen(i18next.t('locales.changeLanguageServerError'));
        return false;
      });
    } else {
      i18next.init({
        lng: language,
        resources: require(`../locales/${language}.json`)
      });
      fetch('api/Home/SetLanguage?culture=' + language);
      return Promise.resolve(true);
    }
  }

  changeLanguage(event: React.FormEvent<HTMLSelectElement>) {
    let select = event.currentTarget,
      curLang = i18next.language;
    this.setLanguage(select.value, true).then(success => {
      if (!success) {
        select.value = curLang;
      }
    });
  }

  public render() {
    return <div className='main-nav'>
      <Modal show={this.state.alertIsOpen} onHide={this.alertClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.alertMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={this.alertClose}>OK</Button>
        </Modal.Footer>
      </Modal>
      <div className='navbar navbar-inverse'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
            <span className='sr-only'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
          <Link className='navbar-brand' to={'/'}>{i18next.t('menu.header')}</Link>
        </div>
        <div className='clearfix'></div>
        <div className='navbar-collapse collapse'>
          <ul className='nav navbar-nav'>
            <li>
              <NavLink to={'/'} exact activeClassName='active'>
                <span className='glyphicon glyphicon-home'></span> {i18next.t('menu.purshase')}
              </NavLink>
            </li>
            <li>
              <NavLink to={'/editViewPurshase'} activeClassName='active'>
                <span className='glyphicon glyphicon-th-list'></span> {i18next.t('menu.viewPurshases')}
              </NavLink>
            </li>
            <li>
              <select onChange={e => this.changeLanguage(e)}>
                <option value='ru'>Русский</option>
                <option value='en'>English</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </div>;
  }
}
