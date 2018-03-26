import React from 'react';
import { Header, Item, Icon, Button, Segment, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const fakeProps = {
  name: 'John Doe',
  titleEn: 'Job Title (en)',
  titleFR: 'Job Title (fr)',
  department: 'Department',
  phone: {
    work: '1234567890',
    mobile: '0987654321',
  },
  address: {
    street: '123 Fake Street',
    city: 'Ottawa',
    postal: 'k1A0R5',
    country: 'Canada',
  },
  email: 'john.doe@mail.mail',
};

const style = {
  imageExample: {
    backgroundColor: 'blue',
    height: '80px',
  },
};

const Profile = ({ match }) => (
  <div>
    <ProfileInfo id={match.params.id} />
    <Segment>
      <Header> Here is where the org chart goes </Header>
    </Segment>
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
  <Item.Group>
    <Item>
      <Item.Image style={style.imageExample} size="tiny" />
      <Item.Content>
        <Button icon="edit" floated="right" basic size="small">
          <Icon name="edit" /> Edit
        </Button>
        <Item.Header as="h1"> {fakeProps.name} </Item.Header>
        <Item.Meta> {fakeProps.titleEn} / {fakeProps.titleFR} </Item.Meta>
        <Item.Meta> {fakeProps.department} </Item.Meta>
        <Item.Description style={{ marginTop: '20px' }}>
          <List horizontal>
            <List.Item>
              <List.Icon size="large" name="phone" />
              <List.Content>
                <List.Header> Work </List.Header>
                <List.Description>
                  {fakeProps.phone.work}
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon size="large" name="mobile" />
              <List.Content>
                <List.Header> Mobile </List.Header>
                <List.Description>
                  {fakeProps.phone.mobile}
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon size="large" name="point" />
              <List.Content>
                <List.Header> Address </List.Header>
                <List.Description>
                  {fakeProps.address.street}<br />
                  {fakeProps.address.city}<br />
                  {fakeProps.address.postal}<br />
                  {fakeProps.address.country}
                </List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Icon size="large" name="mail" />
              <List.Content>
                <List.Header> Email </List.Header>
                <List.Description> {fakeProps.email} </List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Item.Description>
      </Item.Content>
    </Item>
  </Item.Group>
);

export default Profile;
