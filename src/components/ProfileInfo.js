import React, { Component, Fragment } from 'react';
import {
  Segment,
  Dimmer,
  Modal,
  Loader,
  Item,
  Icon,
  Button,
  List,
  Popup,
  Header,
  Dropdown
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import ReactI18nEdit from '@gctools-components/react-i18n-edit';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { connect } from 'react-redux';

const style = {
  imageExample: {
    textAlign: 'center',
    height: '80px',
    width: '80px',
    margin: '0 auto',
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

const defaultNewOrgTier = { nameEn: '', nameFr: '' };

class ProfileInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      profile: Object.assign({}, props.profile),
      saving: false,
      createOrgTierOpen: false,
      newOrgTier: defaultNewOrgTier,
      avatarLoading: 0,
      errorState: {},
    };
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    document.title = 'Profile Page';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile && JSON.stringify(nextProps.profile) !==
      JSON.stringify(this.props.profile)) {
      this.setState({ profile: nextProps.profile, saving: false });
    } else if (this.state.saving) {
      this.setState({ editMode: true, saving: false });
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
      refetch,
    } = this.props;
    const oldProfile = Object.assign(
      {},
      this.props.profile,
      { org: { orgId: this.props.profile.org.id } },
    );
    const newProfile = Object.assign(
      {},
      this.state.profile,
      { org: { orgId: this.state.profile.org.id } },
    );
    const oldAddress = Object.assign({}, this.props.profile.address);
    const newAddress = Object.assign({}, this.state.profile.address);

    rf(
      oldProfile,
      newProfile,
      ['__typename', 'address', 'gcID', 'avatar', 'avatarFile'],
    );
    rf(oldAddress, newAddress, ['__typename', 'id']);

    let profileChanged = (this.state.profile.avatarFile !== undefined);
    const fields = Object.keys(oldProfile);
    for (let i = 0; i < fields.length; i += 1) {
      if (fields[i] === 'org') {
        if (oldProfile.org.orgId !== newProfile.org.orgId) {
          profileChanged = true;
          break;
        }
      } else if (oldProfile[fields[i]] !== newProfile[fields[i]]) {
        profileChanged = true;
        break;
      }
    }

    let addressChanged = false;
    const addressFields = Object.keys(oldAddress);
    if (addressFields.length === 0) {
      const newAddressFields = Object.keys(newAddress);
      for (let i = 0; i < newAddressFields.length; i += 1) {
        if (newAddress[newAddressFields[i]] !== '') {
          addressChanged = true;
          break;
        }
      }
    } else {
      for (let i = 0; i < addressFields.length; i += 1) {
        if (oldAddress[addressFields[i]] !== newAddress[addressFields[i]]) {
          addressChanged = true;
          break;
        }
      }
    }

    const operations = [];
    this.setState({ saving: true });

    const valid = () => {
      const errorState = {};

      if (addressChanged) {
        errorState.streetAddress = !newAddress.streetAddress;
        errorState.city = !newAddress.city;
        errorState.province = !newAddress.province;
        errorState.postalCode = !newAddress.postalCode;
        errorState.country = !newAddress.country;
      }

      errorState.orgTier = !newProfile.org.orgId;

      const error =
        Object.keys(errorState).reduce((b, a) => b || errorState[a], false);
      this.setState({ errorState, saving: !error });
      return !error;
    };

    if (valid()) {
      if (profileChanged || addressChanged) {
        const variables = {
          gcID: this.props.profile.gcID,
          profileInfo: newProfile,
        };

        if (addressChanged) {
          variables.profileInfo.address = newAddress;
        }

        if (this.state.profile.avatarFile !== undefined) {
          variables.avatar = this.state.profile.avatarFile;
        }

        operations.push(mutateProfile({
          context: {
            headers: {
              Authorization: `Bearer ${this.props.accessToken}`,
            },
          },
          variables,
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
        this.setState({ editMode: false, saving: false });
      }
    }
  }

  render() {
    const {
      loading,
      error,
      accessToken,
      myGcID,
      modifyProfile,
      profile: { gcID },
    } = this.props;
    if (error) return 'Error';
    const capitalize = function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const canEdit = (accessToken !== '') && modifyProfile && (gcID === myGcID);

    let editButtons = (
      <Button
        floated="right"
        size="small"
        disabled={!canEdit}
        basic
        onClick={() => this.setState({ editMode: true })}
      >
        <Icon name="edit" />{__('Edit')}
      </Button>
    );
    if (this.state.editMode) {
      editButtons = (
        <div>
          <Button
            floated="right"
            size="small"
            primary
            onClick={this.onSave}
          >
            <Icon name="save" />{__('Save')}
          </Button>
          <Button
            floated="right"
            size="small"
            basic
            onClick={() => {
              this.setState({
                editMode: false,
                profile: Object.assign(
                  {},
                  this.props.profile,
                  { avatarFile: undefined },
                ),
                errorState: {},
              });
            }}
          >
            <Icon name="cancel" />{__('Cancel')}
          </Button>
        </div>
      );
    }
    const { avatar: avatarUrl } = this.state.profile;
    const avClass = (this.state.avatarLoading === 0) ? 'avatar-loading' : '';
    const avatar = (this.state.avatarLoading < 2) ? (
      <img
        width={80}
        height={80}
        src={
          ((typeof avatarUrl !== 'undefined') || (!loading && !gcID)) ?
            avatarUrl || 'b'
          : undefined
        }
        alt="avatar"
        onLoad={() => { this.setState({ avatarLoading: 1 }); }}
        onError={() => { this.setState({ avatarLoading: 2 }); }}
      />
    ) : (
      <Icon
        name="user"
        size="huge"
        aria-label={__('This person has no avatar image.')}
        style={{ color: '#aaa' }}
      />
    );
    return (
      <Segment>
        <Dimmer active={loading || this.state.saving} inverted>
          <Loader content={__('Loading')} />
        </Dimmer>
        <Dimmer active={!loading && !gcID}>
          {__('Specified profile does not exist.')}
        </Dimmer>
        {editButtons}
        <div style={style.imageExample} className={avClass}>
          {avatar}
        </div>
        <Button
          size="small"
          basic
          style={{
            margin: '0 auto',
            display: (this.state.editMode) ? 'block' : 'none',
          }}
        >
          <label htmlFor="avatarUpload">
            {__('Change')}
            <input
              type="file"
              id="avatarUpload"
              style={{ display: 'none' }}
              required
              onChange={({ target }) => {
                if (target.validity.valid) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    this.setState({
                      avatarLoading: 0,
                      profile: Object.assign(
                        {},
                        this.state.profile,
                        {
                          avatar: reader.result,
                          avatarFile: target.files[0],
                        },
                      ),
                    });
                  };
                  reader.readAsDataURL(target.files[0]);
                }
              }}
            />
          </label>
        </Button>
        <Item.Group>
          <Item>
            <Item.Content>
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
                      OrgTiers {
                        id
                        nameEn
                        nameFr
                      }
                    }
                  }`}
                >
                  {({
                    orgLoading,
                    orgError,
                    data: orgData,
                    refetch: orgRefetch,
                  }) => {
                    if (orgError) return `Error...${orgError.message}`;
                    const lang = capitalize(localizer.lang.split('_', 1)[0]);
                    const selectedOrg = this.state.profile.org.organization;
                    if (this.state.editMode !== true) {
                      if (selectedOrg[`name${lang}`]) {
                        return selectedOrg[`name${lang}`];
                      }
                      return __('Unknown department');
                    }
                    const options = [];
                    if (!this.props.profile.org.organization.id) {
                      options.push({
                        key: 'org-undefined',
                        text: '',
                        value: undefined,
                      });
                    }
                    orgData.organizations.forEach(key =>
                      options.push({
                        key: `org-${key.id}`,
                        text: key[`name${lang}`],
                        value: key.id,
                      }));
                    const tierOptions = [];
                    if (!this.props.profile.org.id) {
                      tierOptions.push({
                        key: 'orgtier-undefined',
                        text: '',
                        value: undefined,
                      });
                    }
                    orgData.organizations
                      .filter(key => key.id === selectedOrg.id)
                      .forEach(key =>
                      key.OrgTiers.forEach(tier =>
                        tierOptions.push({
                          key: `orgtier-${tier.id}`,
                          text: tier[`name${lang}`],
                          value: tier.id,
                        })));

                    const { mutateCreateOrgTier } = this.props;

                    return (
                      <Fragment>
                        <Dropdown
                          value={selectedOrg.id}
                          options={options}
                          closeOnBlur
                          selection
                          loading={orgLoading}
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
                        <Dropdown
                          value={this.state.profile.org.id}
                          options={tierOptions}
                          closeOnBlur
                          selection
                          error={this.state.errorState.orgTier}
                          loading={orgLoading}
                          onChange={(e, data1) => {
                            const changeObj = {};
                            changeObj.id = data1.value;
                            const org = Object.assign(
                              {},
                              this.state.profile.org,
                              changeObj,
                            );
                            this.setState({
                              errorState: Object.assign(
                                this.state.errorState,
                                { orgTier: false },
                              ),
                              profile: Object.assign(
                                {},
                                this.state.profile,
                                { org },
                              ),
                            });
                          }}
                        />
                        <Modal
                          open={this.state.createOrgTierOpen}
                          closeOnEscape={false}
                          closeOnRootNodeClick={false}
                          onClose={() =>
                            this.setState({ createOrgTierOpen: false })
                          }
                        >
                          <Header
                            icon="add"
                            content={__('Add new org tier to the selected')}
                          />
                          <Modal.Content>
                            <Item.Group>
                              <Item>
                                <Item.Content>
                                  <Item.Header>
                                    <ReactI18nEdit
                                      edit
                                      values={[{
                                        lang: 'en_CA',
                                        value: this.state.newOrgTier.nameEn,
                                        placeholder: __('Name of tier'),
                                      }, {
                                        lang: 'fr_CA',
                                        value: this.state.newOrgTier.nameFr,
                                        placeholder: __('Name of tier'),
                                      }]}
                                      onChange={(data) => {
                                        const l = data.lang.split('_', 1)[0];
                                        const changeObj = {};
                                        changeObj[`name${capitalize(l)}`]
                                          = data.value;
                                        this.setState({
                                          newOrgTier: Object.assign(
                                            {},
                                            this.state.newOrgTier,
                                            changeObj,
                                          ),
                                        });
                                      }}
                                    />
                                  </Item.Header>
                                </Item.Content>
                              </Item>
                            </Item.Group>
                          </Modal.Content>
                          <Modal.Actions>
                            <Button
                              positive
                              onClick={() => {
                                mutateCreateOrgTier({
                                  context: {
                                    headers: {
                                      Authorization:
                                        `Bearer ${this.props.accessToken}`,
                                    },
                                  },
                                  variables: {
                                    ...this.state.newOrgTier,
                                    organizationId: selectedOrg.id,
                                    ownerGcId: myGcID,
                                  },
                                }).then(() => {
                                  orgRefetch();
                                  this.setState({
                                    createOrgTierOpen: false,
                                    newOrgTier: defaultNewOrgTier,
                                  });
                                });
                              }}
                            >
                              <Icon name="save" /> {__('Save')}
                            </Button>
                            <Button
                              negative
                              onClick={() =>
                                this.setState({
                                  createOrgTierOpen: false,
                                  newOrgTier: defaultNewOrgTier,
                                })}
                            >
                              <Icon name="cancel" /> {__('Cancel')}
                            </Button>
                          </Modal.Actions>
                        </Modal>
                        <Popup
                          trigger={
                            <Button
                              disabled={!(selectedOrg.id > 0)}
                              icon="add"
                              onClick={() => {
                                this.setState({ createOrgTierOpen: true });
                              }}
                            />
                          }
                          content={__('Add new org tier to the selected')}
                        />
                      </Fragment>
                    );
                  }}
                </Query>
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
                  <List.Item style={style.list.listItem}>
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
                  <List.Item style={style.list.listItem}>
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
                <List style={style.list}>
                  <List.Item>
                    <List.Icon size="large" name="point" />
                    <List.Content>
                      <List.Header> {__('Address')} </List.Header>
                      <List.Description>
                        <div>
                          <ReactI18nEdit
                            edit={this.state.editMode}
                            values={[{
                            lang: '',
                            value:
                              this.state.profile.address.streetAddress || '',
                            placeholder: __('Address'),
                          }]}
                            showLabel={false}
                            error={this.state.errorState.streetAddress}
                            onChange={data =>
                            this.onAddressChange(data, 'streetAddress')
                          }
                          />
                        </div>
                        <div>
                          <ReactI18nEdit
                            edit={this.state.editMode}
                            values={[{
                            lang: '',
                            value: this.state.profile.address.city || '',
                            placeholder: __('City'),
                          }]}
                            showLabel={false}
                            error={this.state.errorState.city}
                            onChange={
                            data => this.onAddressChange(data, 'city')
                          }
                          />,
                        </div>
                        <div>
                          <ReactI18nEdit
                            edit={this.state.editMode}
                            values={[{
                            lang: '',
                            value: this.state.profile.address.province || '',
                            placeholder: __('Province'),
                          }]}
                            showLabel={false}
                            error={this.state.errorState.province}
                            onChange={data =>
                            this.onAddressChange(data, 'province')
                          }
                          />
                        </div>
                        <div>
                          <ReactI18nEdit
                            edit={this.state.editMode}
                            values={[{
                            lang: '',
                            value: this.state.profile.address.postalCode || '',
                            placeholder: __('Postal Code'),
                          }]}
                            showLabel={false}
                            error={this.state.errorState.postalCode}
                            onChange={data =>
                            this.onAddressChange(data, 'postalCode')
                          }
                          />
                        </div>
                        <div>
                          <ReactI18nEdit
                            edit={this.state.editMode}
                            values={[{
                            lang: '',
                            value: this.state.profile.address.country || '',
                            placeholder: __('Country'),
                          }]}
                            showLabel={false}
                            error={this.state.errorState.country}
                            onChange={data =>
                            this.onAddressChange(data, 'country')
                          }
                          />
                        </div>
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
  accessToken: '',
  myGcID: '',
  modifyProfile: false,
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
  mutateCreateOrgTier: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  accessToken: PropTypes.string,
  myGcID: PropTypes.string,
  modifyProfile: PropTypes.bool,
};

const mapStateToProps = ({ user }) => {
  const props = {};
  if (user) {
    props.accessToken = user.access_token;
    props.myGcID = user.profile.sub;
    props.modifyProfile = user.profile.modify_profile === 'True';
  }
  return props;
};

export default connect(mapStateToProps)(LocalizedComponent(ProfileInfo));
