import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Menu,
  Divider,
  Image,
  Button,
  Modal,
  Message,
  Header,
  Dropdown
} from 'semantic-ui-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { connect } from 'react-redux';

import Login from '@gctools-components/gc-login';

import Home from './Home';
import Profile from './Profile';
import ProfileSearch from '../components/ProfileSearch';
import logo from '../assets/logo.png';
import logoWhite from '../assets/logoWhite.png';

import { loginAction, logoutAction, clearErrorAction } from '../store';

const changeLanguage = () => {
  if (localizer.lang === 'en_CA') {
    localizer.setLanguage('fr_CA');
  } else {
    localizer.setLanguage('en_CA');
  }
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
      fontSize: '24px',
    },
  },
  content: {
    paddingLeft: '13px',
    paddingRight: '13px',
  },
};

const url = window.location.origin;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: false, id: false };
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
        <Container>
          <Modal
            open={showError.length > 0}
            onClose={onErrorClose}
            size="small"
            basic
          >
            <Header>Error</Header>
            <Modal.Content>
              <Message
                error
                header="There was some errors"
                list={showError}
              />
            </Modal.Content>
          </Modal>
          <Menu secondary style={style.menu}>
            <Menu.Item>
              <Image
                src={logo}
                style={style.logo.image}
                verticalAlign="middle"
              />
              <span style={style.logo.text}>{__('GCProfile')}</span>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
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
              </Menu.Item>
              <Menu.Item>
                <Login
                  oidcConfig={{
                    authority: 'https://dev.account.gccollab.ca/openid',
                    client_id: '738632',
                    client_secret:
                    'd3141d5522b62b37ab1af4eb4d8ba61988c8d68cdd07bb27a7fc56cd',
                    scope: 'openid modify_profile email profile',
                    post_logout_redirect_uri: `${url}/#!logout`,
                    redirect_uri: `${url}/#!callback`,
                    silent_redirect_uri: `${url}/#!silent`,
                  }}
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
                            icon={
                              <img src={logoWhite} alt="GCTools" width="20" />
                            }
                            primary
                            compact
                          />
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
              </Menu.Item>
              <Menu.Item>
                <LanguageToggle />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <Divider />
          <Switch>
            <Fragment>
              <Route exact path="/" component={Home} />
              <Route path="/profile/:id" component={Profile} />
            </Fragment>
          </Switch>
        </Container>
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

// App.contextTypes = {
//   router: PropTypes.object,
// };

const mapStToProps = ({ showError }) => ({ showError: showError || [] });

const mapDispToProps = dispatch => ({
  onLogin: profile => dispatch(loginAction(profile)),
  onLogout: () => dispatch(logoutAction()),
  onErrorClose: () => dispatch(clearErrorAction()),
});

export default connect(mapStToProps, mapDispToProps)(LocalizedComponent(App));
