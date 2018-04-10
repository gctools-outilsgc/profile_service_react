import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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

const modifyProfileMutation = gql`
mutation modifyPr($gcID: String!, $dataToModify: ModifyProfileInput!) {
  modifyProfile(gcId: $gcID, dataToModify: $dataToModify) {
    gcID
    name
    email
    titleEn
    titleFr
    avatar
    mobilePhone
    officePhone
  }
}
`;

const modifyAddressMutation = gql`
mutation modifyAddr($addressID: Int!, $dataToModify: ModifyAddressInput!) {
  modifyAddress(addressId: $addressID, dataToModify:$dataToModify) {
    streetAddress
    city
    province
    postalCode
    country
  }
}`;

const createAddressMutation = gql`
mutation createAddr(
  $streetAddress: String!,
  $city: String!,
  $province: String!,
  $postalCode: String!,
  $country: String!
) {
  createAddress(
    streetAddress: $streetAddress,
    city: $city,
    province: $province,
    postalCode: $postalCode,
    country: $country
  ) {
    city
  }
}`;


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

export default graphql(profileInfoQuery, {
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
      ) : undefined,
  }),
  options: ({ gcID }) => ({
    variables: {
      gcID,
    },
  }),
})(graphql(modifyProfileMutation, {
  props: props => ({ mutateProfile: props.mutate }),
})(graphql(modifyAddressMutation, {
  props: props => ({ mutateAddress: props.mutate }),
})(graphql(createAddressMutation, {
  props: props => ({ createAddressMutation: props.mutate }),
})(graphql(modifyOrgMutation, {
  props: props => ({ mutateOrg: props.mutate }),
})(graphql(createOrgTier, {
  props: props => ({ mutateCreateOrgTier: props.mutate }),
})(ProfileInfo))))));
