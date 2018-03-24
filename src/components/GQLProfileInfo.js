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
    }
  }
}`;


export default graphql(profileInfoQuery, {
  props: props => ({
    error: props.data.error,
    loading: props.data.loading,
    profile: (props.data.profiles && props.data.profiles.length === 1) ?
      Object.assign({}, props.data.profiles[0], (props.data.profiles[0].org) ?
        {} : { org: {} }) : undefined,
  }),
  options: ({ gcID }) => ({
    variables: {
      gcID,
    },
  }),
})(ProfileInfo);
