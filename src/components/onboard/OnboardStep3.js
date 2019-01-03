import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { Button, Form, Row, Col } from 'reactstrap';
import ReactI18nEdit from '@gctools-components/react-i18n-edit';

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

  handleClick() {
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
            <h1 className="mb-2 pb-2 h3 text-primary">
              {__('Step3T1')}
            </h1>
            <p>{__('Step3D1')}</p>
            <Row>
              <Col>
                <h2 className="border-bottom mb-4 pb-2 h4 text-primary">
                  {__('Step3SubT2')}
                </h2>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <ReactI18nEdit
                  edit
                  forId="streetAddress"
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
              <Col md="4">
                <ReactI18nEdit
                  edit
                  forId="city"
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
              <Col md="4">
                <ReactI18nEdit
                  edit
                  forId="province"
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
            <Row className="mb-2">
              <Col md="3">
                <ReactI18nEdit
                  edit
                  forId="postalCode"
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
              <Col md="3">
                <ReactI18nEdit
                  edit
                  forId="country"
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
            </Row>
            <h2 className="border-bottom mb-4 pb-2 h4 text-primary">
              {__('Step3T2')}
            </h2>
            <Row>
              <Col md="3">
                <label htmlFor="officePhone">
                  {__('Phone number')}
                  <small className="text-muted ml-2">
                        1234567890
                  </small>
                  <input
                    id="officePhone"
                    type="tel"
                    className="form-control"
                    value={this.state.officePhone || ''}
                    pattern="^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$"
                    onChange={(e) => {
                      this.setState({
                        officePhone: e.target.value,
                      });
                    }}
                  />
                </label>
              </Col>
              <Col md="3">
                <label htmlFor="mobilePhone">
                  {__('Mobile phone number')}
                  <small className="text-muted ml-2">
                        1234567890
                  </small>
                  <input
                    id="mobilePhone"
                    type="tel"
                    className="form-control"
                    value={this.state.mobilePhone || ''}
                    pattern="^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$"
                    onChange={(e) => {
                      this.setState({
                        mobilePhone: e.target.value,
                      });
                    }}
                  />
                </label>
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

OnboardStep3.defaultProps = {
  userObject: { address: {} },
  nextStep: undefined,
  previousStep: undefined,
};

OnboardStep3.propTypes = {
  userObject: PropTypes.shape({
    gcID: PropTypes.string,
    mobilePhone: PropTypes.string,
    officePhone: PropTypes.string,
    address: PropTypes.shape({
      id: PropTypes.string,
      streetAddress: PropTypes.string,
      city: PropTypes.string,
      province: PropTypes.string,
      postalCode: PropTypes.string,
      country: PropTypes.string,
    }),
  }),
  token: PropTypes.string.isRequired,
  nextStep: PropTypes.func,
  previousStep: PropTypes.func,
};

export default LocalizedComponent(OnboardStep3);
