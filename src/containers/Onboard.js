import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { Card, CardBody } from 'reactstrap';

import OnboardMod from '../components/GQLOnboard';

class Onboard extends Component {
  componentDidMount() {
    document.title = 'Onboard';
  }

  render() {
    return (
      <Card>
        <CardBody>
          <OnboardMod />
        </CardBody>
      </Card>
    );
  }
}

export default LocalizedComponent(Onboard);
