import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { Button, Row } from 'reactstrap';
/* eslint react/prop-types: 0 */

class OnboardStep4 extends Component {
  componentDidMount() {
    console.log('clam down');
  }

  render() {
    return (
      <div>
        <h1 className="h3 border-bottom mb-2 pb-2">
          {__('Step4T1')}
        </h1>
        <Row>
          <p>{__('Step4D1')}</p>
          <p>{__('Step4D2')}</p>
        </Row>
        <Row className="m-2">
          <div className="ml-auto mt-3">
            <Button
              onClick={this.props.previousStep}
              color="primary"
            >
              {__('Back')}
            </Button>
            <Button
              onClick={this.props.nextStep}
              color="primary"
              className="ml-3"
            >
              {__('Next')}
            </Button>
          </div>
        </Row>
      </div>
    );
  }
}

export default LocalizedComponent(OnboardStep4);
