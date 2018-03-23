import React from 'react';
import { Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';


const Profile = ({ match }) => (
  <div>
    Profile Info for = {match.params.id}
    <ProfileInfo />
  </div>
);

Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
};

Profile.defaultProps = {
  match: { params: { id: 0 } },
};

const ProfileInfo = () => (
  <div>
    <Header> Example Component </Header>
  </div>
);

export default Profile;
