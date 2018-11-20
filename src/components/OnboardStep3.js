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

class OnboardStep3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      officePhone: this.props.userObject.officePhone || '',
      mobilePhone: this.props.userObject.mobilePhone || '',
      streetAddress: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    console.log('clam down 3');
  }

  handleClick() {
    console.log('CLICKED');
    this.props.previousStep();
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
          <Form
            onSubmit={(e) => {
          e.preventDefault();
          modifyProfile({
            variables: {
              gcID: (String(userObject.gcID)),
              profileInfo: {
                officePhone: this.state.officePhone,
                mobilePhone: this.state.mobilePhone,
                address: {
                  streetAddress: this.state.streetAddress,
                  city: this.state.city,
                  province: this.state.province,
                  postalCode: this.state.postalCode,
                  country: this.state.country,
                },
              },
            },
          });
          this.props.nextStep();
        }

        }
            className="basic-form-holder"
          >
            <h1 className="border-bottom h4 text-primary">
              {__('Step3T1')}
            </h1>
            <Row>
              <Col>
                <p>{__('Step3D1')}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <ReactI18nEdit
                  edit
                  values={[{
          lang: '',
          value: this.state.streetAddress || '',
          placeholder: __('Address'),
        }]}
                  showLabel={false}
                  onChange={(e) => {
          this.setState({
            streetAddress: e.value,
          });
        }}
                />
              </Col>
              <Col>
                <ReactI18nEdit
                  edit
                  values={[{
          lang: '',
          value: this.state.city || '',
          placeholder: __('City'),
        }]}
                  showLabel={false}
                  onChange={(e) => {
          this.setState({
            city: e.value,
          });
        }}
                />
              </Col>
              <Col>
                <ReactI18nEdit
                  edit
                  values={[{
          lang: '',
          value: this.state.province || '',
          placeholder: __('Province'),
        }]}
                  showLabel={false}
                  onChange={(e) => {
          this.setState({
            province: e.value,
          });
        }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ReactI18nEdit
                  edit
                  values={[{
          lang: '',
          value: this.state.postalCode || '',
          placeholder: __('Postal Code'),
        }]}
                  showLabel={false}
                  onChange={(e) => {
          this.setState({
            postalCode: e.value,
          });
        }}
                />
              </Col>
              <Col>
                <ReactI18nEdit
                  edit
                  values={[{
          lang: '',
          value: this.state.country || '',
          placeholder: __('Country'),
        }]}
                  showLabel={false}
                  onChange={(e) => {
          this.setState({
            country: e.value,
          });
        }}
                />
              </Col>
              <Col>
                <ReactI18nEdit
                  edit
                  values={[{
                          lang: '',
                          value: this.state.officePhone || '',
                          placeholder: __('Phone number'),
                        }]}
                  showLabel={false}
                  type="tel"
                  onChange={(e) => {
                          if (e.value.length <= 15) {
                            this.setState({
                              officePhone: e.value,
                            });
                          }
                        }}
                />
              </Col>
              <Col>
                <ReactI18nEdit
                  edit
                  values={[{
                          lang: '',
                          value: this.state.mobilePhone || '',
                          placeholder: __('Mobile phone number'),
                        }]}
                  showLabel={false}
                  type="tel"
                  onChange={(e) => {
                          if (e.value.length <= 15) {
                            this.setState({
                              mobilePhone: e.value,
                            });
                          }
                        }}
                />
              </Col>
            </Row>
            <Row className="m-2 border-top">
              <div className="ml-auto mt-3">
                <Button
                  onClick={this.handleClick}
                  color="primary"
                >
                  {__('Back')}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="ml-3"
                >
                  {__('Next')}
                </Button>
              </div>
            </Row>
          </Form>
      )}

      </Mutation>
    );
  }
}

export default LocalizedComponent(OnboardStep3);
