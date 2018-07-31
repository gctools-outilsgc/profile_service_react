import React from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import ReactI18nEdit from '@gctools-components/react-i18n-edit';

import { organizationTierQuery } from './GQLOrgManager';

const mutateTeamName = gql`
mutation ($orgId: Int, $ModifyOrgTierInput: ModifyOrgTierInput!){
  modifyOrgTier(orgId: $orgId, dataToModify: $ModifyOrgTierInput) {
    nameEn
  }
}
`;

function OrgTierDisplay(props) {
  return (
    <List.Item >
      <List.Header>
        <Mutation
          mutation={mutateTeamName}
          refetchQueries={[{
            query: organizationTierQuery,
            variables: { gcID: props.id },
          }]}
        >
          {mutate => (
            <ReactI18nEdit
              edit
              values={[{
                lang: '',
                value: props.team.text || '',
                placeholder: __('Team name'),
              }]}
              showLabel={false}
              onChange={(data) => {
                mutate({
                  variables: {
                    orgId: props.team.value,
                    ModifyOrgTierInput: {
                      nameFr: data.value,
                    },
                  },
                });
              }
              }
            />
          )}
        </Mutation>
        {props.team.text}
        <Button
          floated="right"
          size="small"
          negative
          onClick={(e) => {
            e.preventDefault();
            props.onDeleteClick({
              variables: {
                orgTierId: props.team.value,
              },
            });
          }
          }
        >
          Disband Team
        </Button>
      </List.Header>
      <List>
        <List.Header> Members and id #{props.team.value} </List.Header>
        {props.team.data}
      </List>
    </List.Item>
  );
}

OrgTierDisplay.propTypes = {
  team: PropTypes.shape({
    text: PropTypes.string.isRequired,
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    key: PropTypes.string,
    value: PropTypes.string.isRequired,
  }).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default LocalizedComponent(OrgTierDisplay);
