import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap';
import PropTypes from 'prop-types';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import ReactI18nEdit from '@gctools-components/react-i18n-edit';

import OrgTierCreate from './OrgTierCreate';
import LoadingOverlay from './LoadingOverlay';
import { orgChartSupervisorQuery, orgChartEmpQuery } from './GQLOrgChart';

const defaultNewOrgTier = { nameEn: '', nameFr: '' };

const initialState = {
  editMode: false,
  editOpen: false,
  saving: false,
  createOrgTierOpen: false,
  newOrgTier: defaultNewOrgTier,
  avatarLoading: 0,
  errorState: {},
};

const style = {
  card: {
    width: '100%',
  },
};

class ProfileInfo extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, initialState, {
      profile: Object.assign({}, props.profile),
    });
    this.onSave = this.onSave.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
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

  toggleEdit() {
    this.setState({
      editOpen: !this.state.editOpen,
    });
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
        size="sm"
        disabled={!canEdit}
        color="primary"
        onClick={this.toggleEdit}
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
          <Modal
            isOpen={this.state.editOpen}
            toggle={this.toggleEdit}
            style={{ maxWidth: '960px' }}
          >
            <ModalBody>
              <ModalHeader>Basic Info</ModalHeader>
              <Row>
                <div className="w-50 mx-auto basic-form-holder">
                  <div>
                    <ReactI18nEdit
                      edit
                      values={[{
                    lang: '',
                    value: this.state.profile.name || '',
                    placeholder: 'Name',
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
                    <ReactI18nEdit
                      edit
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
                    <ReactI18nEdit
                      edit
                      values={[{
                            lang: '',
                            value: this.state.profile.email || '',
                            placeholder: __('Email'),
                          }]}
                      showLabel={false}
                      type="email"
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
                  </div>
                  <Row className="mt-3 border-top pt-2">
                    <Col sm="6">
                      <ReactI18nEdit
                        edit
                        values={[{
                            lang: '',
                            value: this.state.profile.officePhone || '',
                            placeholder: __('Phone number'),
                          }]}
                        showLabel={false}
                        type="tel"
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
                    </Col>
                    <Col sm="6">
                      <ReactI18nEdit
                        edit
                        values={[{
                            lang: '',
                            value: this.state.profile.mobilePhone || '',
                            placeholder: __('Mobile phone number'),
                          }]}
                        showLabel={false}
                        type="tel"
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
                    </Col>

                    <Col sm="12" className="mt-3 border-top">
                      <Row className="list-desc-ph pt-2">
                        <Col sm="6">
                          <ReactI18nEdit
                            edit
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
                        </Col>
                        <Col sm="6">
                          <ReactI18nEdit
                            edit
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
                        </Col>
                        <Col sm="6">
                          <ReactI18nEdit
                            edit
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
                        </Col>
                        <Col sm="6">
                          <ReactI18nEdit
                            edit
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
                        </Col>
                        <Col sm="6">
                          <ReactI18nEdit
                            edit
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
                        </Col>
                      </Row>
                    </Col>
                  </Row>
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
                editOpen: false,
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
              </Row>
            </ModalBody>
          </Modal>
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
        width={120}
        height={120}
        src={
          ((typeof avatarUrl !== 'undefined') || (!loading && !gcID)) ?
            avatarUrl || 'b'
          : undefined
        }
        alt={(this.state.avatarLoading === 0) ? '' : 'avatar'}
        onLoad={() => { this.setState({ avatarLoading: 1 }); }}
        onError={() => { this.setState({ avatarLoading: 2 }); }}
        className="mx-auto d-block rounded-circle"
      />
    ) : (
      <div className="placeholder-avatar">
        <span>{__('This person has no avatar image.')}</span>
      </div>
    );

    return (
      <Card style={style.card}>
        <LoadingOverlay
          active={loading || this.state.saving}
          message={__('Loading')}
        />
        <LoadingOverlay
          active={!loading && !gcID}
          message={__('Specified profile does not exist.')}
        />
        <CardBody>
          <div>
            <span className="float-right">
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
            </span>
          </div>
          <Row className="ml-3 mr-3 border-bottom">
            <h1 className="h5">My Profile</h1>
          </Row>
          <Row className="m-3">
            <Col xs="2">
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
            </Col>
            <Col xs="10">
              <div className="text-primary h2 mb-0">
                <ReactI18nEdit
                  edit={this.state.editMode}
                  values={[{
                    lang: '',
                    value: this.state.profile.name || '',
                    placeholder: 'name',
                  }]}
                  showLabel={false}
                />
              </div>
              <div className="item-meta-ph h5 mb-0">
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
                />
              </div>
              <div className="item-meta-ph h5">
                {(() => {
                    if (organization) {
                      return organization[
                        `name${capitalize(localizer.lang.split('_', 1)[0])}`
                      ];
                    }
                    return __('Unknown department');
                    })()}
              </div>
              <ul className="list-unstyled mt-3">
                <li className="mb-2">
                  <div>
                    <div className="font-weight-bold">{__('Email')} </div>
                    <span className="list-desc-ph">
                      <ReactI18nEdit
                        edit={this.state.editMode}
                        values={[{
                            lang: '',
                            value: this.state.profile.email || '',
                            placeholder: __('Email'),
                          }]}
                        showLabel={false}
                      />
                    </span>
                  </div>
                </li>
                <li className="float-left mr-4">
                  <div>
                    <div className="font-weight-bold">{__('Work')}</div>
                    <span className="list-desc-ph">
                      <ReactI18nEdit
                        edit={this.state.editMode}
                        values={[{
                            lang: '',
                            value: this.state.profile.officePhone || '',
                            placeholder: __('Phone number'),
                          }]}
                        showLabel={false}
                      />
                    </span>
                  </div>
                </li>
                <li className="float-left mr-4">
                  <div>
                    <div className="font-weight-bold">{__('Mobile')}</div>
                    <span className="list-desc-ph">
                      <ReactI18nEdit
                        edit={this.state.editMode}
                        values={[{
                            lang: '',
                            value: this.state.profile.mobilePhone || '',
                            placeholder: __('Mobile phone number'),
                          }]}
                      />
                    </span>
                  </div>
                </li>
                <li className="float-left">
                  <div>
                    <div className="font-weight-bold">{__('Address')}</div>
                    <span className="list-desc-ph">
                      <span className="mr-1">
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            lang: '',
                            value:
                              this.state.profile.address.streetAddress || '',
                            placeholder: __('Address'),
                          }]}
                          error={this.state.errorState.streetAddress}
                        />
                      </span>
                      <span className="mr-1">
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            lang: '',
                            value: this.state.profile.address.city || '',
                            placeholder: __('City'),
                          }]}
                          error={this.state.errorState.city}
                        />
                      </span>
                      <span className="mr-1">
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            lang: '',
                            value: this.state.profile.address.province || '',
                            placeholder: __('Province'),
                          }]}
                          error={this.state.errorState.province}
                        />
                      </span>
                      <span className="mr-1">
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            lang: '',
                            value: this.state.profile.address.postalCode || '',
                            placeholder: __('Postal Code'),
                          }]}
                          error={this.state.errorState.postalCode}
                        />
                      </span>
                      <span className="mr-1">
                        <ReactI18nEdit
                          edit={this.state.editMode}
                          values={[{
                            lang: '',
                            value: this.state.profile.address.country || '',
                            placeholder: __('Country'),
                          }]}
                          error={this.state.errorState.country}
                        />
                      </span>
                    </span>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
          <Row className="border-top ml-3 mr-3">
            <div className="ml-auto pt-2">{editButtons}</div>
          </Row>
        </CardBody>
      </Card>
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
