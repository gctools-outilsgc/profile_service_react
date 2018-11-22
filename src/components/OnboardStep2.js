import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { Button, Form, Row, Col } from 'reactstrap';
import ReactI18nEdit from '@gctools-components/react-i18n-edit';
/* eslint react/prop-types: 0 */

const modifyProfileMutation = gql`
mutation modifyPr($gcID: String!, $profileInfo: ModifyProfileInput!) {
  modifyProfile(gcId: $gcID, profileInfo: $profileInfo) {
    gcID
  }
}
`;

class OnboardStep2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.userObject.name || '',
      email: this.props.userObject.email || '',
      titleEn: this.props.userObject.titleEn || '',
      titleFr: this.props.userObject.titleFr || '',
    };
    this.handleNext = this.handleNext.bind(this);
  }

  componentDidMount() {
    console.log('clam down');
  }

  handleNext() {
    this.props.nextStep();
  }

  render() {
    const {
      userObject,
      token,
    } = this.props;
    return (
      <Mutation
        mutation={modifyProfileMutation}
        context={{
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
        }
      >
        {modifyProfile => (
          <div className="basic-form-holder">
            <h1 className="sr-only">
              Hidden Heading?
            </h1>
            <Form
              onSubmit={(e) => {
              e.preventDefault();
              modifyProfile({
                variables: {
                  gcID: (String(userObject.gcID)),
                  profileInfo: {
                    name: this.state.name,
                    email: this.state.email,
                    titleEn: this.state.titleEn,
                    titleFr: this.state.titleFr,
                  },
                },
              });
              this.props.nextStep();
            }}
            >
              <Row className="border-bottom pb-2 mb-2 mt-3">
                <Col sm="12">
                  <h2 className="h4 mb-2 pb-2 border-bottom text-primary">
                    {__('Step2T1')}
                  </h2>
                  <p>{__('Step2D1')}</p>
                </Col>
                <Col>
                  <ReactI18nEdit
                    edit
                    values={[{
                lang: '',
                value: this.state.name || '',
                placeholder: 'Name',
              }]}
                    showLabel={false}
                    onChange={(e) => {
                this.setState({
                  name: e.value,
                });
              }}
                  />
                </Col>
                <Col>
                  <ReactI18nEdit
                    edit
                    values={[{
                lang: '',
                value: this.state.email || '',
                placeholder: 'Email',
              }]}
                    showLabel={false}
                    onChange={(e) => {
                this.setState({
                  email: e.value,
                });
              }}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="12">
                  <h2 className="h4 text-primary">
                    {__('Step2T2')}
                  </h2>
                  <p>{__('Step2D2')}</p>
                </Col>
                <Col>
                  <ReactI18nEdit
                    edit
                    lang={localizer.lang}
                    values={[
                {
                  lang: 'en_CA',
                  value: this.state.titleEn || '',
                  placeholder: __('Title'),
                },
              ]}
                    onChange={(e) => {
                this.setState({
                  titleEn: e.value,
                });
              }}
                  />
                </Col>
                <Col>
                  <ReactI18nEdit
                    edit
                    lang={localizer.lang}
                    values={[
                {
                  lang: 'fr_CA',
                  value: this.state.titleFr || '',
                  placeholder: __('Title'),
                },
              ]}
                    onChange={(e) => {
                this.setState({
                  titleFr: e.value,
                });
              }}
                  />
                </Col>
              </Row>
              <Row className="m-2 border-top">
                <div className="ml-auto mt-3">
                  <Button
                    type="submit"
                    color="primary"
                  >
                    {__('Next')}
                  </Button>
                </div>
              </Row>
            </Form>
          </div>
      )}
      </Mutation>
    );
  }
}

export default LocalizedComponent(OnboardStep2);
