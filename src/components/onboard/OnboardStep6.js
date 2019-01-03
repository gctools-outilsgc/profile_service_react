import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { Button, Row } from 'reactstrap';
/* eslint react/prefer-stateless-function: 0 */

class OnboardStep6 extends Component {
  render() {
    const {
      forwardID,
    } = this.props;
    return (
      <div>
        <h1 className="h3 border-bottom mb-2 pb-2">
          {__('Step6T1')}
        </h1>
        <p>{__('Step6D1')}</p>
        <p>{__('Step6D2')}</p>
        <p>{__('Step6D3')}</p>
        <p>{__('Step6D4')}</p>
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

OnboardStep6.propTypes = {
  forwardID: PropTypes.string.isRequired,
};

export default LocalizedComponent(OnboardStep6);
