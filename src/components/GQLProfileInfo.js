import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { connect } from 'react-redux';

import ProfileInfo from './ProfileInfo';

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

const profileMeQuery = gql`
query profileMeQuery($gcID: String!) {
  profiles(gcID: $gcID) {
    supervisor {
      gcID
    }
  }
}
`;

const modifyProfileMutation = gql`
mutation modifyPr($gcID: String!, $profileInfo: ModifyProfileInput!) {
  modifyProfile(gcId: $gcID, profileInfo: $profileInfo) {
    gcID
  }
}
`;

const modifyOrgMutation = gql`
mutation modifyOrg($orgId: Int!, $dataToModify: ModifyOrganizationInput!) {
  modifyOrganization(organizationId: $orgId, dataToModify: $dataToModify) {
    nameEn
    nameFr
    acronymFr
    acronymEn
  }
}`;

const createOrgTier = gql`
mutation createOrgTier(
  $nameEn: String!,
  $nameFr: String!,
  $organizationId: Int!,
  $ownerGcId: String!
) {
  createOrgTier(
    nameEn: $nameEn,
    nameFr: $nameFr,
    organizationId: $organizationId,
    ownerGcId: $ownerGcId
  ) {
    nameEn
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

export default connect(mapStateToProps)(graphql(profileInfoQuery, {
  props: props => ({
    error: props.data.error,
    loading: props.data.loading,
    refetch: props.data.refetch,
    profile: (props.data.profiles && props.data.profiles.length === 1) ?
      Object.assign(
        {},
        props.data.profiles[0],
        (props.data.profiles[0].org) ? {} : { org: { organization: {} } },
        (props.data.profiles[0].address) ? {} : { address: {} },
        (props.data.profiles[0].supervisor) ? {} : { supervisor: {} },
      ) : undefined,
  }),
  options: ({ gcID }) => ({
    variables: {
      gcID,
    },
  }),
})(graphql(profileMeQuery, {
  props: props => ({
    mySupervisor: (props.data.profiles && props.data.profiles.length === 1) ?
      props.data.profiles[0].supervisor.gcID : undefined,
  }),
  skip: ({ myGcID }) => !myGcID,
  options: ({ myGcID }) => ({
    variables: {
      gcID: myGcID,
    },
  }),
})(graphql(modifyProfileMutation, {
  props: props => ({ mutateProfile: props.mutate }),
})(graphql(modifyOrgMutation, {
  props: props => ({ mutateOrg: props.mutate }),
})(graphql(createOrgTier, {
  props: props => ({ mutateCreateOrgTier: props.mutate }),
})(ProfileInfo))))));
