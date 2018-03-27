import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Item, Icon, Button, List }
  from 'semantic-ui-react';
import PropTypes from 'prop-types';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import ReactI18nEdit from '@gctools-components/react-i18n-edit';

const style = {
  imageExample: {
    backgroundColor: 'blue',
    height: '80px',
  },
  list: {
    float: 'left',
    marginTop: '0px',
    marginRight: '15px',
    listItem: {
      marginBottom: '10px',
    },
  },
};

class ProfileInfo extends Component {
  constructor() {
    super();
    this.state = {
      editMode: false,
      ready: false,
      profile: undefined,
    };
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile &&
        nextProps.profile !== this.props.profile) {
      this.setState({
        profile: nextProps.profile, ready: true,
      });
    }
  }

  handleSave() {
    console.log('saved!'); // eslint-disable-line
    this.setState({ editMode: false });
  }

  render() {
    const {
      loading,
      error,
    } = this.props;
    if (error) return `Error!: ${error}`;
    if (this.state.ready === false) return false;
    let editButtons = (
      <Button
        floated="right"
        size="small"
        basic
        onClick={() => this.setState({ editMode: true })}
      >
        <Icon size="tiny" name="edit" />{__('Edit')}
      </Button>
    );
    if (this.state.editMode) {
      editButtons = (
        <div>
          <Button
            floated="right"
            size="small"
            basic
            onClick={this.handleSave}
          >
            <Icon size="tiny" name="save" />{__('Save')}
          </Button>
          <Button
            floated="right"
            size="small"
            basic
            onClick={() => this.setState({ editMode: false })}
          >
            <Icon size="tiny" name="cancel" />{__('Cancel')}
          </Button>
        </div>
      );
    }
    return (
      <Segment>
        <Dimmer active={loading}>
          <Loader content={__('Loading')} />
        </Dimmer>
        <Item.Group>
          <Item>
            <Item.Image style={style.imageExample} size="tiny" />
            <Item.Content>
              {editButtons}
              <Item.Header>
                <ReactI18nEdit
                  edit={this.state.editMode}
                  values={[{
                    value: this.state.profile.name,
                    placeholder: 'name',
                  }]}
                  showLabel={false}
                />
              </Item.Header>
              <Item.Meta>
                <ReactI18nEdit
                  edit={this.state.editMode}
                  lang={localizer.lang}
                  values={[
                    {
                      lang: 'en_CA',
                      value: this.state.profile.titleEn,
                      placeholder: __('Title'),
                    },
                    {
                      lang: 'fr_CA',
                      value: this.state.profile.titleFr,
                      placeholder: __('Title'),
                    },
                  ]}
                />
              </Item.Meta>
              <Item.Meta>
                <ReactI18nEdit
                  edit={this.state.editMode}
                  lang={localizer.lang}
                  values={[
                    {
                      lang: 'en_CA',
                      value: this.state.profile.org.nameEn,
                      placeholder: __('Organization'),
                    },
                    {
                      lang: 'fr_CA',
                      value: this.state.profile.org.nameFr,
                      placeholder: __('Organization'),
                    },
                  ]}
                />
              </Item.Meta>
              <Item.Description style={{ marginTop: '20px' }}>
                <List style={style.list}>
                  <List.Item style={style.list.listItem}>
                    <List.Icon size="large" name="phone" />
                    <List.Content>
                      <List.Header> {__('Work')} </List.Header>
                      <List.Description>
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            value: this.state.profile.officePhone,
                            placeholder: __('Phone number'),
                          }]}
                          showLabel={false}
                        />
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon size="large" name="mobile" />
                    <List.Content>
                      <List.Header> {__('Mobile')} </List.Header>
                      <List.Description>
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            value: this.state.profile.mobilePhone,
                            placeholder: __('Mobile phone number'),
                          }]}
                          showLabel={false}
                        />
                      </List.Description>
                    </List.Content>
                  </List.Item>
                </List>
                <List style={style.list}>
                  <List.Item>
                    <List.Icon size="large" name="point" />
                    <List.Content>
                      <List.Header> {__('Address')} </List.Header>
                      <List.Description>
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            value: this.state.profile.address.streetAddress,
                            placeholder: __('Address'),
                          }]}
                          showLabel={false}
                        /><br />
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            value: this.state.profile.address.city,
                            placeholder: __('City'),
                          }]}
                          showLabel={false}
                        />,
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            value: this.state.profile.address.province,
                            placeholder: __('Province'),
                          }]}
                          showLabel={false}
                        /><br />
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            value: this.state.profile.address.postalCode,
                            placeholder: __('Postal Code'),
                          }]}
                          showLabel={false}
                        /><br />
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            value: this.state.profile.address.country,
                            placeholder: __('Country'),
                          }]}
                          showLabel={false}
                        />
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon size="large" name="mail" />
                    <List.Content>
                      <List.Header>{__('Email')} </List.Header>
                      <List.Description>
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            value: this.state.profile.email,
                            placeholder: __('Email'),
                          }]}
                          showLabel={false}
                        />
                      </List.Description>
                    </List.Content>
                  </List.Item>
                </List>
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    );
  }
}

ProfileInfo.defaultProps = {
  profile: undefined,
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
      organization: PropTypes.shape({
        id: PropTypes.string,
        nameEn: PropTypes.string,
        nameFr: PropTypes.string,
      }),
    }),
  }),
};

export default LocalizedComponent(ProfileInfo);
