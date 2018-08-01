import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Segment,
  Dimmer,
  Loader,
  Button
} from 'semantic-ui-react';


import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

// import OrgTierDisplay from './OrgTierDisplay';

// import ReactI18nEdit from '@gctools-components/react-i18n-edit';
import InputForm from './InputForm';

export const organizationTierQuery = gql`
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
const mutateTeamName = gql`
  mutation ($orgId: Int, $ModifyOrgTierInput: ModifyOrgTierInput!){
    modifyOrgTier(orgId: $orgId, dataToModify: $ModifyOrgTierInput) {
      nameEn
      nameFr
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
          return data.profiles[0].OwnerOfOrgTier.map(({
            id,
            nameEn,
            nameFr,
            // OrgMembers,
          }) => (
            <Segment>
              <Dimmer active={loading} inverted>
                <Loader content={__('Loading')} />
              </Dimmer>
              <Dimmer active={!loading && !gcID}>
                {__('Specified profile does not exist.')}
              </Dimmer>
              <Mutation
                mutation={deleteGQL}
                refetchQueries={[{
                  query: organizationTierQuery,
                  variables: { gcID: String(gcID) },
                }]}
              >
                {deleteOrgTier => (
                  <Button
                    floated="right"
                    size="small"
                    negative
                    onClick={() => {
                      deleteOrgTier({
                        variables: {
                          orgTierId: id,
                        },
                      });
                    }
                    }
                  >
                    Disband Team
                  </Button>
                )}
              </Mutation>
              <h1>nameEn: {nameEn}</h1>
              <h1>id: {id}</h1>
              <h1>nameFr: {nameFr}</h1>
              <Mutation
                mutation={mutateTeamName}
              >
                {modifyOrgTier => (
                  <InputForm
                    handleSubmit={(value) => { // Added an arrow function
                      modifyOrgTier({
                        variables: {
                          orgId: id,
                          ModifyOrgTierInput: {
                            nameFr: value,
                          },
                        },
                      });
                    }}
                    id={id}
                    value={nameFr}
                    placeholder="french name"
                    name="NameFr"
                  />
                )}
              </Mutation>
            </Segment>
            ));
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
