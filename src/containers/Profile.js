import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ProfileInfo from '../components/GQLProfileInfo';
import OrgChart from '../components/GQLOrgChart';

const Profile = ({ match }) => (
  <div>
    <ProfileInfo gcID={match.params.id} />
    <Segment>
      <Header> Here is where the org chart goes </Header>
      <OrgChart gcID={match.params.id} />
    </Segment>
  </div>
);

Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

Profile.defaultProps = {
  match: { params: { id: 0 } },
};

export default Profile;
