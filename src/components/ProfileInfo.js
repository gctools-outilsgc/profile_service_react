import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import ReactI18nEdit from '@gctools-components/react-i18n-edit';

import ProfileSearch from './ProfileSearch';
import OrgTierChooser from './OrgTierChooser';
import OrgTierCreate from './OrgTierCreate';
import LoadingOverlay from './LoadingOverlay';
import { orgChartSupervisorQuery, orgChartEmpQuery } from './GQLOrgChart';

const style = {
  imageExample: {
    textAlign: 'center',
    height: '80px',
    width: '80px',
    margin: '0 auto',
  },
  list: {
    listItem: {
      marginBottom: '10px',
    },
    left: {
      marginTop: '0px',
      marginRight: '20px',
      float: 'left',
    },
    right: {
      marginTop: '0px',
      marginRight: '5px',
      float: 'left',
    },
    mobile: {
      paddingLeft: '0.66em',
    },
    address: {
      paddingLeft: '1em',
    },
  },
  form: {
    organization: {
      marginBottom: '50px',
    },
  },
};

const defaultNewOrgTier = { nameEn: '', nameFr: '' };

const initialState = {
  editMode: false,
  saving: false,
  createOrgTierOpen: false,
  newOrgTier: defaultNewOrgTier,
  avatarLoading: 0,
  errorState: {},
};

class ProfileInfo extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, initialState, {
      profile: Object.assign({}, props.profile),
    });
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    document.title = 'Profile Page';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile && JSON.stringify(nextProps.profile) !==
      JSON.stringify(this.props.profile)) {
      this.setState(Object.assign({}, initialState, {
        profile: nextProps.profile,
      }, (this.props.profile.avatar === nextProps.profile.avatar) ? {
        avatarLoading: 1,
      } : {}));
    }
    if (!nextProps.modifyProfile && this.state.editMode) {
      this.setState(Object.assign({}, initialState, {
        profile: nextProps.profile,
      }));
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
      mySupervisor,
      myGcID,
    } = this.props;
    const oldProfile = Object.assign(
      {},
      this.props.profile,
      // { org: { orgId: this.props.profile.org.id } },
    );
    const newProfile = Object.assign(
      {},
      this.state.profile,
      // { org: { orgId: this.state.profile.org.id } },
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
        if (JSON.stringify(oldProfile.org) !==
          JSON.stringify(newProfile.org)) {
          profileChanged = true;
          break;
        }
      } else if (fields[i] === 'supervisor') {
        if (JSON.stringify(oldProfile.supervisor) !==
          JSON.stringify(newProfile.supervisor)) {
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

      // errorState.orgTier = !newProfile.org.orgId;

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

        if (variables.profileInfo.supervisor) {
          variables.profileInfo.supervisor = {
            gcId: variables.profileInfo.supervisor.gcID,
          };
        } else {
          variables.profileInfo.supervisor = {};
        }

        if (variables.profileInfo.org) {
          variables.profileInfo.org = {
            orgTierId: variables.profileInfo.org.id,
          };
        } else {
          variables.profileInfo.org = {};
        }

        const refetchQueries = [];
        if (variables.profileInfo.supervisor &&
          variables.profileInfo.supervisor.gcId) {
          refetchQueries.push({
            query: orgChartSupervisorQuery,
            variables: {
              gcID: variables.profileInfo.supervisor.gcId,
            },
          });
        }
        refetchQueries.push({
          query: orgChartSupervisorQuery,
          variables: {
            gcID: myGcID,
          },
        });
        if (mySupervisor) {
          refetchQueries.push({
            query: orgChartEmpQuery,
            variables: {
              gcID: mySupervisor,
            },
          });
        }
        operations.push(mutateProfile({
          refetchQueries,
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
      mySupervisor,
    } = this.props;
    if (error) return 'Error';
    const capitalize = function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const organization = (this.state.profile.org) ?
      this.state.profile.org.organization : undefined;

    const canEdit = (accessToken !== '') && modifyProfile && (gcID === myGcID);

    let editButtons = (
      <Button
        floated="right"
        size="small"
        disabled={!canEdit}
        basic
        onClick={() => this.setState({ editMode: true })}
      >
        {__('Edit')}
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
            {__('Save')}
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
            {__('Cancel')}
          </Button>
        </div>
      );
    } else if (canEdit) {
      editButtons = (
        <div>
          {editButtons}
          <OrgTierCreate
            gcID={myGcID}
            accessToken={accessToken}
          >
            {(onClick => (
              <Button
                size="small"
                floated="right"
                basic
                onClick={onClick}
              >
                {__('Team')}
              </Button>
            ))}
          </OrgTierCreate>
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
        alt={(this.state.avatarLoading === 0) ? '' : 'avatar'}
        onLoad={() => { this.setState({ avatarLoading: 1 }); }}
        onError={() => { this.setState({ avatarLoading: 2 }); }}
      />
    ) : (
      <div className="placeholder-avatar">
        <span>{__('This person has no avatar image.')}</span>
      </div>
    );
    const noSupervisorDesc =
      __('Select this if you cannot find your supervisor');

    return (
      <div>
        <LoadingOverlay
          active={loading || this.state.saving}
          message={__('Loading')}
        />
        <LoadingOverlay
          active={!loading && !gcID}
          message={__('Specified profile does not exist.')}
        />
        {editButtons}
        {(() => {
          if ((gcID !== myGcID) &&
            (gcID !== mySupervisor) &&
            (accessToken !== '')) {
            const { mutateProfile } = this.props;
            const refetchQueries = [];
            refetchQueries.push({
              query: orgChartSupervisorQuery,
              variables: {
                gcID,
              },
            });
            refetchQueries.push({
              query: orgChartSupervisorQuery,
              variables: {
                gcID: myGcID,
              },
            });
            if (mySupervisor) {
              refetchQueries.push({
                query: orgChartEmpQuery,
                variables: {
                  gcID: mySupervisor,
                },
              });
            }

            return (
              <Button
                floated="left"
                size="small"
                basic
                onClick={() => {
                  mutateProfile({
                    refetchQueries,
                    context: {
                      headers: {
                        Authorization: `Bearer ${this.props.accessToken}`,
                      },
                    },
                    variables: {
                      gcID: myGcID,
                      profileInfo: {
                        supervisor: {
                          gcId: gcID,
                        },
                        org: {},
                      },
                    },
                  });
                }}
              >
                {__('This is my supervisor')}
              </Button>
            );
          }
          return null;
        })()}
        <div className={avClass}>
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
        <Row>
          <div>
            <div>
              <Col>
                <div className="item-header-ph">
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
                  <div>{this.state.profile.name}</div>
                </div>
                <div className="item-meta-ph">
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
                </div>
                <div className="item-meta-ph">
                  {(() => {
                    if (organization) {
                      return organization[
                        `name${capitalize(localizer.lang.split('_', 1)[0])}`
                      ];
                    }
                    return __('Unknown department');
                    })()}
                </div>
              </Col>
              <div style={{ marginTop: '20px' }}>
                <ul style={style.list.left}>
                  <li style={style.list.listItem}>
                    <div>
                      <span className="list-header-ph">
                        {__('Supervisor')}
                      </span>
                      {(() => {
                        const { supervisor } = this.state.profile;
                        if (this.state.editMode) {
                          return (
                            <ProfileSearch
                              defaultValue={
                                (supervisor) ? supervisor.name : ''
                              }
                              onBlur={(e, obj) => {
                                obj.setState({
                                  value: obj.props.defaultValue || '',
                                  skip: true,
                                  isDefault: true,
                                });
                              }}
                              resultPreProcessor={(results) => {
                                for (let x = 0; x < results.length; x += 1) {
                                  if (results[x].id === myGcID) {
                                    results.splice(x, 1);
                                    break;
                                  }
                                }
                                results.unshift({
                                  title: __('No supervisor'),
                                  description: noSupervisorDesc,
                                  id: null,
                                });
                              }}
                              onResultSelect={(data) => {
                                const sup = (this.state.profile.supervisor) ?
                                  this.state.profile.supervisor.gcID : null;
                                this.setState({
                                  profile: Object.assign(
                                    {},
                                    this.state.profile,
                                    {
                                      supervisor: (data.id !== null) ? {
                                        name: data.title,
                                        gcID: data.id,
                                      } : null,
                                    },
                                    (data.id !== sup) ? { org: null } : {},
                                  ),
                                });
                              }}
                            />
                          );
                        }
                        if (supervisor && supervisor.name) {
                          return supervisor.name;
                        }
                        return __('Not identified');
                      })()}
                    </div>
                  </li>
                  <li style={style.list.listItem}>
                    <div>
                      <span className="list-header-ph"> {__('Work')} </span>
                      <span className="list-desc-ph">
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
                      </span>
                    </div>
                  </li>
                  <li style={style.list.listItem}>
                    <div style={style.list.mobile}>
                      <span className="list-header-ph"> {__('Mobile')} </span>
                      <span className="list-desc-ph">
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
                      </span>
                    </div>
                  </li>
                  <li style={style.list.listItem}>
                    <div>
                      <span className="list-header-ph">{__('Email')} </span>
                      <span className="list-desc-ph">
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
                      </span>
                    </div>
                  </li>
                </ul>
                <ul style={style.list.right}>
                  <li style={style.list.listItem}>
                    <div>
                      <span className="list-header-ph">{__('Team')} </span>
                      <OrgTierChooser
                        selectedOrgTier={this.state.profile.org}
                        supervisor={this.state.profile.supervisor}
                        editMode={this.state.editMode}
                        accessToken={this.props.accessToken}
                        gcID={myGcID}
                        onTeamChange={(org) => {
                          this.setState({
                            profile: Object.assign(
                              {},
                              this.state.profile,
                              { org },
                            ),
                          });
                        }}
                      />
                    </div>
                  </li>
                  <li style={style.list.listItem}>
                    <div style={style.list.address}>
                      <span className="list-header-ph"> {__('Address')} </span>
                      <span className="list-desc-ph">
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
                          />
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
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Row>
      </div>
    );
  }
}

ProfileInfo.defaultProps = {
  profile: { address: {} },
  error: undefined,
  accessToken: '',
  myGcID: '',
  modifyProfile: false,
  mySupervisor: undefined,
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
    supervisor: PropTypes.shape({
      name: PropTypes.string,
      gcID: PropTypes.string,
    }),
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
  refetch: PropTypes.func.isRequired,
  accessToken: PropTypes.string,
  myGcID: PropTypes.string,
  modifyProfile: PropTypes.bool,
  mySupervisor: PropTypes.string,
};

export default LocalizedComponent(ProfileInfo);
