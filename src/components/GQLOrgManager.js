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

// import OrgTierDisplay from './OrgTierDisplay';

// import ReactI18nEdit from '@gctools-components/react-i18n-edit';
import InputForm from './FormComponent';

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

/* const deleteGQL = gql`
    mutation ($orgTierId : Int){
      deleteOrgTier(orgTierId: $orgTierId) {
        successfulDelete
  }
}
  `; */
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
          let textInput = React.createRef(); // eslint-disable-line 
          return data.profiles[0].OwnerOfOrgTier.map(({
            id,
            nameEn,
            nameFr,
          }) => (
              <Mutation // eslint-disable-line 
                mutation={mutateTeamName}
                key={nameEn}
              >
                {modifyOrgTier => (
                  <Segment>
                    <Dimmer active={loading} inverted>
                      <Loader content={__('Loading')} />
                    </Dimmer>
                    <Dimmer active={!loading && !gcID}>
                      {__('Specified profile does not exist.')}
                    </Dimmer>
                    <h1>nameEn: {nameEn}</h1>
                    <h1>nameFr: {nameFr}</h1>
                    {/*  <ReactI18nEdit
                      edit
                      values={[{
                        lang: '',
                        value: nameFr || '',
                        placeholder: __('Team name'),
                      }]}
                      showLabel={false}
                      onChange={(info) => {
                        modifyOrgTier({
                          variables: {
                            orgId: id,
                            ModifyOrgTierInput: {
                              nameFr: info.value,
                            },
                          },
                        });
                      }
                      }
                    /> */}
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
                  </Segment>
                )}
              </Mutation>
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
