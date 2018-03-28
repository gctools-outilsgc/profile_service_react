import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Item, Icon, Button, List, Dropdown }
  from 'semantic-ui-react';
import PropTypes from 'prop-types';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import ReactI18nEdit from '@gctools-components/react-i18n-edit';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      // ready: false,
      profile: props.profile,
      saving: false,
    };
    this.onSave = this.onSave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile &&
        nextProps.profile !== this.props.profile) {
      this.setState({ profile: nextProps.profile, saving: false });
    }
  }

  onAddressChange(data, addressComponent) {
    const address = Object.assign(
      {},
      this.state.profile.address,
    );
    address[addressComponent] = data.value;
    this.setState({
      profile: Object.assign(
        {},
        this.state.profile,
        { address },
      ),
    });
  }

  onSave() {
    const rf = (a, b, f) => {
      for (let i = 0; i < f.length; i += 1) {
        delete a[f[i]]; // eslint-disable-line no-param-reassign
        delete b[f[i]]; // eslint-disable-line no-param-reassign
      }
    };

    const {
      mutateProfile,
      mutateAddress,
      mutateOrg,
      mutateOrgTier,
      refetch,
    } = this.props;
    const oldProfile = Object.assign({}, this.props.profile);
    const newProfile = Object.assign({}, this.state.profile);
    const oldAddress = Object.assign({}, this.props.profile.address);
    const newAddress = Object.assign({}, this.state.profile.address);
    const oldOrganization
      = Object.assign({}, this.props.profile.org.organization);
    const newOrganization
      = Object.assign({}, this.state.profile.org.organization);

    rf(oldProfile, newProfile, ['__typename', 'org', 'address', 'gcID']);
    rf(oldAddress, newAddress, ['__typename', 'id']);
    rf(oldOrganization, newOrganization, ['__typename', 'id']);

    let profileChanged = false;
    const fields = Object.keys(oldProfile);
    for (let i = 0; i < fields.length; i += 1) {
      if (oldProfile[fields[i]] !== newProfile[fields[i]]) {
        profileChanged = true;
        break;
      }
    }
    let addressChanged = false;
    const addressFields = Object.keys(oldAddress);
    for (let i = 0; i < addressFields.length; i += 1) {
      if (oldAddress[addressFields[i]] !== newAddress[addressFields[i]]) {
        addressChanged = true;
        break;
      }
    }
    let organizationChanged = false;
    const organizationFields = Object.keys(oldOrganization);
    for (let i = 0; i < organizationFields.length; i += 1) {
      if (oldOrganization[organizationFields[i]]
        !== newOrganization[organizationFields[i]]) {
        organizationChanged = true;
        break;
      }
    }

    const operations = [];
    this.setState({ saving: true });

    if (profileChanged) {
      operations.push(mutateProfile({
        variables: {
          gcID: this.props.profile.gcID,
          dataToModify: newProfile,
        },
      }));
    }

    if (addressChanged) {
      operations.push(mutateAddress({
        variables: {
          addressID: this.props.profile.address.id,
          dataToModify: newAddress,
        },
      }));
    }

    if (organizationChanged) {
      operations.push(mutateOrg({
        variables: {
          orgId: this.props.profile.org.organization.id,
          dataToModify: newOrganization,
        },
      }));
    }

    if (this.props.profile.org.organization.id
      !== this.state.profile.org.organization.id) {
      operations.push(mutateOrgTier({
        variables: {
          orgId: this.props.profile.org.id,
          dataToModify: {
            organizationId: this.state.profile.org.organization.id,
          },
        },
      }));
    }

    if (operations.length > 0) {
      this.setState({ editMode: false, saving: true });
      Promise.all(operations).then(() => {
        refetch();
      }).catch(() => {
        console.log('An error has occured.');
        this.setState({ editMode: true, saving: false });
      });
    } else {
      this.setState({ editMode: false });
      console.log('Nothing to save...');
    }
  }

  render() {
    const {
      loading,
      error,
    } = this.props;
    if (error) return 'Error';
    const capitalize = function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

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
            onClick={this.onSave}
          >
            <Icon size="tiny" name="save" />{__('Save')}
          </Button>
          <Button
            floated="right"
            size="small"
            basic
            onClick={() => {
              this.setState({
                editMode: false,
                profile: this.props.profile,
              });
            }}
          >
            <Icon size="tiny" name="cancel" />{__('Cancel')}
          </Button>
        </div>
      );
    }
    return (
      <Segment>
        <Dimmer active={loading || this.state.saving} inverted>
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
                    lang: '',
                    value: this.state.profile.name || '',
                    placeholder: 'name',
                  }]}
                  showLabel={false}
                  onChange={(data) => {
                    this.setState({
                      profile: Object.assign(
                        {},
                        this.state.profile,
                        { name: data.value },
                      ),
                    });
                  }}
                />
              </Item.Header>
              <Item.Meta>
                <ReactI18nEdit
                  edit={this.state.editMode}
                  lang={localizer.lang}
                  values={[
                    {
                      lang: 'en_CA',
                      value: this.state.profile.titleEn || '',
                      placeholder: __('Title'),
                    },
                    {
                      lang: 'fr_CA',
                      value: this.state.profile.titleFr || '',
                      placeholder: __('Title'),
                    },
                  ]}
                  onChange={(data) => {
                    const changeObj = {};
                    changeObj[`title${capitalize(data.lang.split('_', 1)[0])}`]
                      = data.value;
                    this.setState({
                      profile: Object.assign(
                        {},
                        this.state.profile,
                        changeObj,
                      ),
                    });
                  }}
                />
              </Item.Meta>
              <Item.Meta>
                <Query query={gql`
                  query organizationQuery {
                    organizations {
                      id
                      nameEn
                      nameFr
                    }
                  }`}
                >
                  {({ orgLoading, orgError, data }) => {
                    if (orgLoading) return undefined;
                    if (orgError) return `Error...${orgError.message}`;
                    const lang = capitalize(localizer.lang.split('_', 1)[0]);
                    let retVal = false;
                    if (this.state.profile.org.organization[`name${lang}`]) {
                      retVal =
                        this.state.profile.org.organization[`name${lang}`];
                      if (this.state.editMode === true) {
                        const options = [];
                        // eslint-disable-next-line
                        for (const key of data.organizations) {
                          options.push({
                            key: key.id,
                            text: key[`name${lang}`],
                            value: key.id,
                          });
                        }
                        retVal = (
                          <Dropdown
                            value={this.state.profile.org.organization.id}
                            options={options}
                            closeOnBlur
                            selection
                            onChange={(e, data1) => {
                              const changeObj = {};
                              changeObj.id = data1.value;
                              const organization = Object.assign(
                                {},
                                this.state.profile.org.organization,
                                changeObj,
                              );
                              this.setState({
                                profile: Object.assign(
                                  {},
                                  this.state.profile,
                                  { org: { organization } },
                                ),
                              });
                            }}
                          />
                        );
                      }
                    }
                    return retVal;
                  }}
                </Query>
                {/* <ReactI18nEdit
                  edit={this.state.editMode}
                  lang={localizer.lang}
                  values={[
                    {
                      lang: 'en_CA',
                      value: this.state.profile.org.organization.nameEn || '',
                      placeholder: __('Organization'),
                    },
                    {
                      lang: 'fr_CA',
                      value: this.state.profile.org.organization.nameFr || '',
                      placeholder: __('Organization'),
                    },
                  ]}
                  onChange={(data) => {
                    const changeObj = {};
                    changeObj[`name${capitalize(data.lang.split('_', 1)[0])}`]
                      = data.value;
                    const organization = Object.assign(
                      {},
                      this.state.profile.org.organization,
                      changeObj,
                    );
                    this.setState({
                      profile: Object.assign(
                        {},
                        this.state.profile,
                        { org: { organization } },
                      ),
                    });
                  }}
                /> */}
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
                            lang: '',
                            value: this.state.profile.officePhone || '',
                            placeholder: __('Phone number'),
                          }]}
                          showLabel={false}
                          onChange={(data) => {
                            if (data.value.length <= 15) {
                              this.setState({
                                profile: Object.assign(
                                  {},
                                  this.state.profile,
                                  { officePhone: data.value },
                                ),
                              });
                            }
                          }}
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
                            lang: '',
                            value: this.state.profile.mobilePhone || '',
                            placeholder: __('Mobile phone number'),
                          }]}
                          showLabel={false}
                          onChange={(data) => {
                            if (data.value.length <= 15) {
                              this.setState({
                                profile: Object.assign(
                                  {},
                                  this.state.profile,
                                  { mobilePhone: data.value },
                                ),
                              });
                            }
                          }}
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
                            lang: '',
                            value:
                              this.state.profile.address.streetAddress || '',
                            placeholder: __('Address'),
                          }]}
                          showLabel={false}
                          onChange={data =>
                            this.onAddressChange(data, 'streetAddress')
                          }
                        /><br />
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            lang: '',
                            value: this.state.profile.address.city || '',
                            placeholder: __('City'),
                          }]}
                          showLabel={false}
                          onChange={data => this.onAddressChange(data, 'city')}
                        />,
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            lang: '',
                            value: this.state.profile.address.province || '',
                            placeholder: __('Province'),
                          }]}
                          showLabel={false}
                          onChange={data =>
                            this.onAddressChange(data, 'province')
                          }
                        /><br />
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            lang: '',
                            value: this.state.profile.address.postalCode || '',
                            placeholder: __('Postal Code'),
                          }]}
                          showLabel={false}
                          onChange={data =>
                            this.onAddressChange(data, 'postalCode')
                          }
                        /><br />
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            lang: '',
                            value: this.state.profile.address.country || '',
                            placeholder: __('Country'),
                          }]}
                          showLabel={false}
                          onChange={data =>
                            this.onAddressChange(data, 'country')
                          }
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
                            lang: '',
                            value: this.state.profile.email || '',
                            placeholder: __('Email'),
                          }]}
                          showLabel={false}
                          onChange={(data) => {
                            this.setState({
                              profile: Object.assign(
                                {},
                                this.state.profile,
                                { email: data.value },
                              ),
                            });
                          }}
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
  profile: { org: { organization: {} }, address: {} },
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
  mutateProfile: PropTypes.func.isRequired,
  mutateAddress: PropTypes.func.isRequired,
  mutateOrg: PropTypes.func.isRequired,
  mutateOrgTier: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default LocalizedComponent(ProfileInfo);
