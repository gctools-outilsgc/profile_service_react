import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { Button } from 'reactstrap';
/* eslint react/prop-types: 0 */

class OnboardStep6 extends Component {
  componentDidMount() {
    console.log('clam down');
  }

  render() {
    return (
      <div>
        <h1>Step 6</h1>
        <Button onClick={this.props.previousStep}>
          Finish
        </Button>
      </div>
    );
  }
}

export default LocalizedComponent(OnboardStep6);
