import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Segment,
  Dimmer,
  Loader
} from 'semantic-ui-react';


import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import OrgTierDisplay from './OrgTierDisplay';

const organizationTierQuery = gql`
query organizationTierQuery($gcID: String!) {
  profiles(gcID: $gcID) {
    name
    OwnerOfOrgTier {
      id
      nameEn
      nameFr
      OrgMembers {
        name
      }
    }
  }
}`;

const deleteGQL = gql`
    mutation ($orgTierId : Int){
      deleteOrgTier(orgTierId: $orgTierId) {
        successfulDelete
  }
}
  `;

class OrgManager extends React.Component {
  render() {
    const {
      gcID,
      // editMode,
    } = this.props;
    return (
      <Query
        variables={{ gcID: (String(gcID)) }}
        skip={!gcID}
        query={organizationTierQuery}
      >
        {({
          error,
          data,
          loading,
        }) => {
          if (error) return `Error...${error.message}`;
          if (loading) return 'loading...';

          const OwnerOfOrgTier =
            (data.profiles && data.profiles.length === 1) ?
              data.profiles[0].OwnerOfOrgTier.slice(0) : [];
          const tierOptions = [];
          OwnerOfOrgTier.forEach(tier =>
            tierOptions.push({
              key: `orgtier-${tier.id}`,
              text: tier.nameEn,
              value: tier.id,
              data: (
                tier.OrgMembers.map(member =>
                  <List.Item> {member.name} </List.Item>)),
            }));

          /* const listTeam = tierOptions.map(element => (
            <OrgTierDisplay team={element} key={element.key} />
          )); */

          return (
            <Mutation
              mutation={deleteGQL}
              refetchQueries={[{
                query: organizationTierQuery,
                variables: { gcID: (String(gcID)) },
              }]}
            >
              {mutate => (
                <Segment>
                  <Dimmer active={loading} inverted>
                    <Loader content={__('Loading')} />
                  </Dimmer>
                  <Dimmer active={!loading && !gcID}>
                    {__('Specified profile does not exist.')}
                  </Dimmer>
                  <List divided>
                    {tierOptions.map(element => (
                      <OrgTierDisplay
                        team={element}
                        key={element.key}
                        fn={mutate}
                        id={(String(gcID))}
                      />
                    ))}
                  </List>
                </Segment>
              )}
            </Mutation>);
        }}
      </Query>
    );
  }
}


OrgManager.defaultProps = {
  // editMode: false,
};

OrgManager.propTypes = {
  gcID: PropTypes.string.isRequired,
};

export default LocalizedComponent(OrgManager);
