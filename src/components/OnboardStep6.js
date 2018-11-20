import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { Button, Row } from 'reactstrap';
/* eslint react/prop-types: 0 */

class OnboardStep6 extends Component {
  componentDidMount() {
    console.log('clam down');
  }

  render() {
    const {
      forwardID,
    } = this.props;
    return (
      <div>
        <h1 className="h4 border-bottom">
          {__('Step6T1')}
        </h1>
        <p>{__('Step6D1')}</p>
        <Row className="m-2 border-top">
          <div className="ml-auto mt-3">
            <Button
              href={`/profile/${forwardID}`}
              color="primary"
            >
              {__('View my Profile')}
            </Button>
          </div>
        </Row>
      </div>
    );
  }
}

export default LocalizedComponent(OnboardStep6);
