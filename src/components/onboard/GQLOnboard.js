import React, { Component } from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { connect } from 'react-redux';

import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import StepWizard from 'react-step-wizard';
import OnboardNav from './OnboardNav';
import OnboardStep1 from './OnboardStep1';
import OnboardStep2 from './OnboardStep2';
import OnboardStep3 from './OnboardStep3';
import OnboardStep4 from './OnboardStep4';
import OnboardStep5 from './OnboardStep5';
import OnboardStep6 from './OnboardStep6';
/* eslint react/prop-types: 0 */

const profileInfoQuery = gql`
query profileInfoQuery($gcID: String!) {
  profiles(gcID: $gcID) {
    gcID
    name
    email
    avatar
    mobilePhone
    officePhone
    supervisor {
      gcID
      name
    }
    address {
      id
      streetAddress
      city
      province
      postalCode
      country
    }
    titleEn
    titleFr
    org {
      id
      nameEn
      nameFr
      organization {
        id
        nameEn
        nameFr
        acronymEn
        acronymFr
      }
    }
  }
}`;

const mapStateToProps = ({ user }) => {
  const props = {};
  if (user) {
    props.accessToken = user.access_token;
    props.myGcID = user.profile.sub;
    props.modifyProfile = user.profile.modify_profile === 'True';
  }
  return props;
};

class OnboardMod extends Component {
  render() {
    const {
      myGcID,
      accessToken,
    } = this.props;
    const customTransitions = {
      enterRight: 'fadeIn animated',
      enterLeft: 'fadeIn animated',
      exitRight: 'fadeIn animated',
      exitLeft: 'fadeIn animated',
    };
    return (
      <Query
        variables={{ gcID: (String(myGcID)) }}
        skip={!myGcID}
        query={profileInfoQuery}
      >
        {({ loading, error, data }) => {
                if (loading) return 'loading ...';
                if (error) return `Error!: ${error}`;
          const userInfo = data.profiles[0];
                return (
                  <div>
                    <StepWizard
                      transitions={customTransitions}
                      nav={<OnboardNav />}
                    >
                      <OnboardStep1 />
                      <OnboardStep2
                        gcID={userInfo.gcID}
                        userObject={userInfo}
                        token={accessToken}
                      />
                      <OnboardStep3
                        userObject={userInfo}
                        token={accessToken}
                      />
                      <OnboardStep4 />
                      <OnboardStep5
                        userObject={userInfo}
                        token={accessToken}
                      />
                      <OnboardStep6
                        forwardID={userInfo.gcID}
                      />
                    </StepWizard>
                  </div>
                );
              }}
      </Query>
    );
  }
}

export default connect(mapStateToProps)(LocalizedComponent(OnboardMod));
