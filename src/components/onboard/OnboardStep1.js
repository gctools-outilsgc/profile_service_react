import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { Button, Row } from 'reactstrap';
/* eslint react/prop-types: 0 */
/* eslint react/prefer-stateless-function: 0 */

class OnboardStep1 extends Component {
  render() {
    return (
      <div>
        <h1 className="h3 mb-2 pb-1">
          {__('Welcome')}
        </h1>
        <h2 className="h4 mb-2 pb-1 border-bottom">
          {__('Step1Sub1')}
        </h2>
        <p>{__('welcome body')}</p>
        <ul>
          <li>{__('Step1List1')}</li>
          <li>{__('Step1List2')}</li>
          <li>{__('Step1List3')}</li>
          <li>{__('Step1List4')}</li>
        </ul>
        <h2 className="h4 mb-2 pb-1 border-bottom">
          {__('Step1Sub2')}
        </h2>
        <p>{__('Step1Sub2Desc')}</p>
        <p>{__('Step1Sub2Desc2')}</p>
        <Row className="m-1 border-top">
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

