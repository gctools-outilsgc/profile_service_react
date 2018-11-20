import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { Button, Row } from 'reactstrap';
/* eslint react/prop-types: 0 */

class OnboardStep1 extends Component {
  componentDidMount() {
    console.log('clam down');
  }

  render() {
    return (
      <div>
        <h1 className="h4 border-bottom">
          {__('Welcome')}
        </h1>
        <p>{__('welcome body')}</p>
        <Row className="m-2 border-top">
          <div className="ml-auto mt-3">
            <Button
              onClick={this.props.nextStep}
              color="primary"
            >
              {__('Get Started')}
            </Button>
          </div>
        </Row>
      </div>
    );
  }
}

export default LocalizedComponent(OnboardStep1);

