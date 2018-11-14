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
          <div>
            <h1>Step 2</h1>
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
              <Button onClick={this.props.previousStep}>
                Back
              </Button>
              <Button type="submit">
                Next
              </Button>
            </Form>
          </div>
      )}
      </Mutation>
    );
  }
}

export default LocalizedComponent(OnboardStep2);
