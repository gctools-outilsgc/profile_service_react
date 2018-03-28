import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

class Home extends Component {
  componentDidMount() {
    document.title = 'Home Page';
  }

  render() {
    return (
      <div>
        {__('This is the home page')}
      </div>
    );
  }
}

export default LocalizedComponent(Home);
