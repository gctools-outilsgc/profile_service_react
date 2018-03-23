import React from 'react';
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

const App = () => (
  <BrowserRouter>
    <Container>
      <Menu size="massive">
        <Menu.Item>
          <Header >GCProfile</Header>
        </Menu.Item>
        <Menu.Item>
          <Link to="/" href="/">Home</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/profile/hello" href="/profile/hello">
            Profile Route - id is hello
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={changeLanguage}>{localizer.lang}</Button>
        </Menu.Item>
      </Menu>

      <Switch>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/profile/:id" component={Profile} />
        </div>
      </Switch>

    </Container>
  </BrowserRouter>
);

export default LocalizedComponent(App);
