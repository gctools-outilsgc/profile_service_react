import React, { Fragment } from 'react';
import { Container, Menu, Header, Button } from 'semantic-ui-react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import Home from './Home';
import Profile from './Profile';

const changeLanguage = () => {
  if (localizer.lang === 'en_CA') {
    localizer.setLanguage('fr_CA');
  } else {
    localizer.setLanguage('en_CA');
  }
};

const style = {
  menu: {
    marginBottom: '30px',
  },
};

const App = () => (
  <BrowserRouter>
    <Container>
      <Menu secondary style={style.menu}>
        <Menu.Item>
          <Header >{__('GCProfile')}</Header>
        </Menu.Item>
        <Menu.Item>
          <Link to="/" href="/">{__('Home')}</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/profile/2" href="/profile/2">
            Profile Route - gcID is 2
          </Link>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Button onClick={changeLanguage}>{localizer.lang}</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Switch>
        <Fragment>
          <Route exact path="/" component={Home} />
          <Route path="/profile/:id" component={Profile} />
        </Fragment>
      </Switch>

    </Container>
  </BrowserRouter>
);

export default LocalizedComponent(App);
