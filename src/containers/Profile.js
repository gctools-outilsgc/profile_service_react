import React from 'react';

import { Container, Row } from 'reactstrap';
import PropTypes from 'prop-types';

import ProfileInfo from '../components/GQLProfileInfo';
import OrgManager from '../components/GQLOrgManager';

const Profile = ({ match }) => (
  <Container>
    <Row>
      <ProfileInfo gcID={match.params.id} />
    </Row>
    <Row>
      <OrgManager gcID={match.params.id} />
    </Row>
  </Container>
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
