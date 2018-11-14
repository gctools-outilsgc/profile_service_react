import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { Button } from 'reactstrap';
/* eslint react/prop-types: 0 */

class OnboardStep5 extends Component {
  componentDidMount() {
    console.log('clam down');
  }

  render() {
    return (
      <div>
        <h1>Step 5</h1>
        <Button onClick={this.props.previousStep}>
          Back
        </Button>
        <Button onClick={this.props.nextStep}>
          Next Step
        </Button>
      </div>
    );
  }
}

export default LocalizedComponent(OnboardStep5);
