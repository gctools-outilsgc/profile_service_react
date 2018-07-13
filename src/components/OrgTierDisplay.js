import React from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';
// import { Mutation } from 'react-apollo';
// import gql from 'graphql-tag';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

// import organizationTierQuery from './GQLOrgManager';

function OrgTierDisplay(props) {
  return (
    <List.Item >
      <Button
        floated="right"
        size="small"
        negative
        onClick={(e) => {
          e.preventDefault();
          props.fn({
            variables: {
              orgTierId: props.team.value,
            },
          });
        }
        }
      >
        delete
      </Button>
      <List.Header>
        {props.team.text}
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
  fn: PropTypes.func.isRequired,
  // id: PropTypes.string.isRequired,
};

export default LocalizedComponent(OrgTierDisplay);
