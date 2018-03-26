import React from 'react';
import { Segment, Dimmer, Loader, Item, Icon, Button, List }
  from 'semantic-ui-react';
import PropTypes from 'prop-types';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

const style = {
  imageExample: {
    backgroundColor: 'blue',
    height: '80px',
  },
};

const ProfileInfo = (props) => {
  const {
    loading,
    error,
    profile,
  } = props;
  if (error) return `Error!: ${error}`;
  return (
    <Segment>
      <Dimmer active={loading}>
        <Loader content={__('Loading')} />
      </Dimmer>
      <Item.Group>
        <Item>
          <Item.Image style={style.imageExample} size="tiny" />
          <Item.Content>
            <Button floated="right" basic size="small">
              <Icon size="tiny" name="edit" /> {__('Edit')}
            </Button>
            <Item.Header> {profile.name} </Item.Header>
            <Item.Meta> {profile.titleEn} / {profile.titleFR} </Item.Meta>
            <Item.Meta> {profile.org.nameEn} </Item.Meta>
            <Item.Description style={{ marginTop: '20px' }}>
              <List horizontal>
                <List.Item>
                  <List.Icon size="large" name="phone" />
                  <List.Content>
                    <List.Header> {__('Work')} </List.Header>
                    <List.Description>
                      {profile.officePhone}
                    </List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon size="large" name="mobile" />
                  <List.Content>
                    <List.Header> {__('Mobile')} </List.Header>
                    <List.Description>
                      {profile.mobilePhone}
                    </List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon size="large" name="point" />
                  <List.Content>
                    <List.Header> {__('Address')} </List.Header>
                    <List.Description>
                      {profile.address.streetAddress}
                    </List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon size="large" name="mail" />
                  <List.Content>
                    <List.Header>{__('Email')} </List.Header>
                    <List.Description> {profile.email} </List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    </Segment>
  );
};

ProfileInfo.defaultProps = {
  profile: { org: {}, address: {} },
  error: undefined,
};

ProfileInfo.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
  profile: PropTypes.shape({
    gcID: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    mobilePhone: PropTypes.string,
    officePhone: PropTypes.string,
    address: PropTypes.shape({
      id: PropTypes.string,
      streetAddress: PropTypes.string,
      city: PropTypes.string,
      province: PropTypes.string,
      postalCode: PropTypes.string,
      country: PropTypes.string,
    }),
    titleEn: PropTypes.string,
    titleFr: PropTypes.string,
    org: PropTypes.shape({
      id: PropTypes.string,
      nameEn: PropTypes.string,
      nameFr: PropTypes.string,
    }),
  }),
};

export default LocalizedComponent(ProfileInfo);
