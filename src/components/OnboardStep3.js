import React, { Component } from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { Button, Form } from 'reactstrap';
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
          >
            <h1>Step 3</h1>
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
            <Button onClick={this.handleClick}>
        Back
            </Button>
            <Button type="submit">
        Next
            </Button>
          </Form>
      )}

      </Mutation>
    );
  }
}

export default LocalizedComponent(OnboardStep3);
