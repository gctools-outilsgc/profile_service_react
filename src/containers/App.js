import React, { Fragment } from 'react';
import { Container, Menu, Divider, Image, Button } from 'semantic-ui-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import Home from './Home';
import Profile from './Profile';
import logo from '../assets/logo.png';


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

const App = () => (
  <BrowserRouter>
    <Container>
      <Menu secondary style={style.menu}>
        <Menu.Item>
          <Image src={logo} style={style.logo.image} verticalAlign="middle" />
          <span style={style.logo.text}>{__('GCProfile')}</span>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <LanguageToggle />
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Divider />
      <div style={style.content}>
        <Switch>
          <Fragment>
            <Route exact path="/" component={Home} />
            <Route path="/profile/:id" component={Profile} />
          </Fragment>
        </Switch>
      </div>
    </Container>
  </BrowserRouter>
);

export default LocalizedComponent(App);
