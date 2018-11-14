import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { Button } from 'reactstrap';
/* eslint react/prop-types: 0 */

class OnboardStep1 extends Component {
  componentDidMount() {
    console.log('clam down');
  }

  render() {
    return (
      <div>
        <h1>Welcome</h1>
        <p>This is the space for the text</p>
        <p>So much text so great!</p>
        <p>TODO: language</p>
        <Button onClick={this.props.nextStep}>Start</Button>
      </div>
    );
  }
}

export default LocalizedComponent(OnboardStep1);

