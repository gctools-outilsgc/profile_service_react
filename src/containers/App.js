import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import {
  Container,
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { connect } from 'react-redux';

import Login from '@gctools-components/gc-login';

import oidcConfig from 'oidcConfig'; // eslint-disable-line

import Home from './Home';
import Profile from './Profile';
import Onboard from './Onboard';
import ProfileSearch from '../components/ProfileSearch';

import { loginAction, logoutAction, clearErrorAction } from '../store';
import '../Search.css';

const changeLanguage = () => {
  const lang = (localizer.lang === 'en_CA') ? 'fr_CA' : 'en_CA';
  localizer.setLanguage(lang);
  document.cookie = `lang=${lang};path=/`;
};

const LanguageToggle = () => (
  <Button compact onClick={changeLanguage}>
    {__('FR')}
  </Button>
);

const style = {
  menu: {
    marginBottom: '20px',
  },
  logo: {
    image: {
      width: '50px',
      marginRight: '10px',
    },
    text: {
      fontSize: '22px',
    },
  },
  content: {
    paddingLeft: '13px',
    paddingRight: '13px',
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: false, id: false };
  }
  componentWillMount() {
    const cookies = decodeURIComponent(document.cookie).split(';');
    cookies
      .filter(c => c.trim().indexOf('lang=') === 0)
      .forEach((c) => {
        const lang = c.split('=', 2)[1];
        if (localizer.hasLanguage(lang)) {
          localizer.setLanguage(lang);
        }
      });
  }
  render() {
    const {
      onLogin,
      onLogout,
      showError,
      onErrorClose,
    } = this.props;

    const doLogin = (user) => {
      this.setState({ name: user.profile.name, id: user.profile.sub });
      onLogin(user);
    };

    const doLogout = () => {
      this.setState({ name: false, id: false });
      onLogout();
    };

    return (
      <BrowserRouter>
        <div>
          <Modal
            open={showError.length > 0}
            onClose={onErrorClose}
            size="small"
          >
            <ModalHeader>Error</ModalHeader>
            <div>
              <ModalBody
                error
                list={showError}
              >
                There was some errors
              </ModalBody>
            </div>
          </Modal>
          <Navbar color="white" className="shadow-sm" style={style.menu}>
            <Container>
              <NavbarBrand href="/">
                <span style={style.logo.text}>{__('GCProfile')}</span>
              </NavbarBrand>
              <Nav className="ml-auto">
                <NavItem className="mr-2">
                  <Route render={({ history }) => (
                    <ProfileSearch
                      onResultSelect={(result) => {
                      const newPath = `/profile/${result.id}`;
                      if (newPath !== history.location.pathname) {
                        history.push(newPath);
                      }
                    }}
                    />
                  )}
                  />
                </NavItem>
                <NavItem className="mr-2">
                  <Login
                    oidcConfig={oidcConfig}
                    onUserLoaded={doLogin}
                    onUserFetched={doLogin}
                    onLogoutClick={(e, oidc) => {
                    oidc.logout();
                    doLogout();
                  }}
                  >
                    {({ onClick }) => (
                      <Route render={({ history }) => (
                        <Dropdown
                          icon={null}
                          pointing="top"
                          trigger={(
                            <Button
                              onClick={(e) => {
                              if (!this.state.name) {
                                e.stopPropagation();
                                onClick(e);
                              }
                            }}
                              label={this.state.name || __('Login')}
                              primary
                              compact
                            >
                              {this.state.name || __('Login')}
                            </Button>
                        )}
                          options={(this.state.name) ? [{
                          key: 'logout',
                          text: __('Logout'),
                          icon: 'sign out',
                          onClick,
                        }, {
                          key: 'view-profile',
                          text: __('View my profile'),
                          icon: 'user',
                          onClick: () => {
                            const newPath = `/profile/${this.state.id}`;
                            if (newPath !== history.location.pathname) {
                              history.push(newPath);
                            }
                          },
                        }] : null}
                        />)}
                      />
                  )}
                  </Login>
                </NavItem>
                <NavItem>
                  <LanguageToggle />
                </NavItem>
              </Nav>
            </Container>
          </Navbar>
          <Container>
            <Switch>
              <Fragment>
                <Route exact path="/" component={Home} />
                <Route path="/profile/:id" component={Profile} />
                <Route path="/onboard" component={Onboard} />
              </Fragment>
            </Switch>
          </Container>

        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onErrorClose: PropTypes.func.isRequired,
  showError: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStToProps = ({ showError }) => ({ showError: showError || [] });

const mapDispToProps = dispatch => ({
  onLogin: profile => dispatch(loginAction(profile)),
  onLogout: () => dispatch(logoutAction()),
  onErrorClose: () => dispatch(clearErrorAction()),
});

export default connect(mapStToProps, mapDispToProps)(LocalizedComponent(App));
