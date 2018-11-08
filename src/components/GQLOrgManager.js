import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';

import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import InputForm from './InputForm';
import TeamManager from './TeamManager';
import TeamTransfer from './TeamTransfer';
import OrgTierChooser from './OrgTierChooser';
import ProfileSearch from './ProfileSearch';

const organizationTierQuery = gql`
query organizationTierQuery($gcID: String!) {
  profiles(gcID: $gcID) {
    name
    gcID
    Employees {
      name
      gcID
    }
    supervisor {
      gcID
      name
    }
    org {
      id
      nameEn
      nameFr
      organization {
        id
        nameEn
        nameFr
        acronymEn
        acronymFr
      }
    }
    OwnerOfOrgTier {
      id
      nameEn
      nameFr
      OrgMembers {
        name
        gcID
      }
    }
  }
}`;

const deleteGQL = gql`
    mutation ($orgTierId : Int){
      deleteOrgTier(orgTierId: $orgTierId) {
        successfulDelete
  }
}
  `;
const mutateTeamName = gql`
  mutation ($orgId: Int, $ModifyOrgTierInput: ModifyOrgTierInput!){
    modifyOrgTier(orgId: $orgId, dataToModify: $ModifyOrgTierInput) {
      orgTierid
      nameEn
      nameFr
   }
  }
`;
const transferOwnership = gql`
  mutation ($orgId: Int, $ModifyOrgTierInput: ModifyOrgTierInput!){
    modifyOrgTier(orgId: $orgId, dataToModify: $ModifyOrgTierInput) {
      orgTierid
      nameEn
      nameFr
   }
  }
`;
const mutateTeamMember = gql`
mutation (
  $employeeGcId: String!,
  $profileInfo: ModifyEmployeeProfileInput!,
  $gcId: String!) {
  modifyEmployeeProfile(
    employeeGcId: $employeeGcId,
    profileInfo: $profileInfo,
    gcId: $gcId
    ) {
    name
  }
}
`;
const modifyProfileMutation = gql`
mutation changeTeam($gcID: String!, $profileInfo: ModifyProfileInput!) {
  modifyProfile(gcId: $gcID, profileInfo: $profileInfo) {
    gcID
  }
}
`;

class OrgManager extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.state = {
      activeTab1: '1',
      activeTab2: '1',
      editOpen: false,
    };
  }

  toggle(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
      });
    }
  }

  toggle2(tab) {
    if (this.state.activeTab2 !== tab) {
      this.setState({
        activeTab2: tab,
      });
    }
  }

  toggleEdit() {
    this.setState({
      editOpen: !this.state.editOpen,
    });
  }

  render() {
    const {
      gcID,
      accessToken,
      myGcID,
      // editMode,
    } = this.props;
    const canEdit = (accessToken !== '') && (gcID === myGcID);
    return (
      <Query
        variables={{ gcID: (String(gcID)) }}
        skip={!gcID}
        query={organizationTierQuery}
      >
        {({
          error,
          data,
          loading,
        }) => {
          if (error) return `Error...${error.message}`;
          if (loading) return 'loading...';
          const supTest = data.profiles[0].supervisor;
          const orgTest = data.profiles[0].org;
          const teamList = data.profiles[0].OwnerOfOrgTier.map(({
            id,
            nameEn,
            nameFr,
          }) => (
            <NavItem>
              <NavLink
                href="#!"
                onClick={() => { this.toggle(id); }}
              >
                {nameEn} / {nameFr}
              </NavLink>
            </NavItem>));
          const tabPanel = data.profiles[0].OwnerOfOrgTier.map(({
            id,
            nameEn,
            nameFr,
            OrgMembers,
          }) => (
            <TabPane tabId={id}>
              <Mutation
                mutation={transferOwnership}
                refetchQueries={[{
                            query: organizationTierQuery,
                            variables: { gcID: String(gcID) },
                          }]}
              >
                {transferMutation => (
                  <TeamTransfer
                    gcID={(String(gcID))}
                    handleTransfer={(value) => {
                                transferMutation({
                                  variables: {
                                    orgId: id,
                                    ModifyOrgTierInput: {
                                      ownerGcId: value,
                                    },
                                  },
                                });
                              }
                              }
                  />
                          )}
              </Mutation>
              <Mutation
                mutation={deleteGQL}
                refetchQueries={[{
                            query: organizationTierQuery,
                            variables: { gcID: String(gcID) },
                          }]}
              >
                {deleteOrgTier => (
                  <Button
                    floated="right"
                    size="small"
                    negative
                    onClick={() => {
                                deleteOrgTier({
                                  variables: {
                                    orgTierId: id,
                                  },
                                });
                              }
                              }
                  >
                              Disband Team
                  </Button>
                          )}
              </Mutation>
              <h3>id: {id}</h3>
              <h3>nameEn: {nameEn}</h3>
              <h3>nameFr: {nameFr}</h3>

              <div>
                <Mutation
                  mutation={mutateTeamName}
                >
                  {modifyOrgTier => (
                    <div>
                      <InputForm
                        handleSubmit={(value) => {
                                    modifyOrgTier({
                                      variables: {
                                        orgId: id,
                                        ModifyOrgTierInput: {
                                          nameEn: value,
                                        },
                                      },
                                    });
                                  }}
                        id={id}
                        value={nameEn}
                        placeholder="english name"
                        name="NameEn"
                      />
                      <InputForm
                        handleSubmit={(value) => {
                                    modifyOrgTier({
                                      variables: {
                                        orgId: id,
                                        ModifyOrgTierInput: {
                                          nameFr: value,
                                        },
                                      },
                                    });
                                  }}
                        id={id}
                        value={nameFr}
                        placeholder="french name"
                        name="NameFr"
                      />
                    </div>
                            )}
                </Mutation>
              </div>

              <div>
                <h3>Team Members:</h3>
                <Mutation
                  mutation={mutateTeamMember}
                  refetchQueries={[{
                              query: organizationTierQuery,
                              variables: { gcID: String(gcID) },
                            }]}
                  context={{
                              headers: {
                                Authorization:
                                  `Bearer ${accessToken}`,
                              },
                            }
                            }
                >
                  {mutateTeam => (
                    <TeamManager
                      orgId={id}
                      employees={data.profiles[0].Employees}
                      teamMembers={OrgMembers}
                      handleSave={(employeeId, add) => {
                                  mutateTeam({
                                    variables: {
                                      gcId: String(gcID),
                                      employeeGcId: employeeId,
                                      profileInfo: {
                                        org: {
                                          orgTierId: add,
                                        },
                                      },
                                    },
                                  });
                                }
                                }
                    />
                            )}
                </Mutation>
              </div>
            </TabPane>));
          return (
            <Card style={{ width: '100%' }}>
              <CardBody>
                <h2 className="h5">Teams</h2>
                <Row>
                  <Col>
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          href="#!"
                          onClick={() => { this.toggle2('1'); }}
                        >
                          My Team
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          href="#!"
                          onClick={() => { this.toggle2('2'); }}
                        >
                          Teams I Supervise
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab2}>
                      <TabPane tabId="1">
                        <Row>
                          <Col>
                            <div>
                              <div className="font-weight-bold">
                                Supervisor
                              </div>
                              {supTest ? supTest.name : 'None'}
                            </div>
                          </Col>
                          <Col>
                            <div>
                              <div className="font-weight-bold">
                                Team picker here
                              </div>
                              {orgTest ? orgTest.nameEn : 'None'}
                            </div>
                          </Col>
                        </Row>
                        <Button
                          onClick={this.toggleEdit}
                          disabled={!canEdit}
                        >
                          Edit
                        </Button>
                        <Modal
                          isOpen={this.state.editOpen}
                          toggle={this.toggleEdit}
                          style={{ maxWidth: '960px' }}
                        >
                          <ModalHeader>
                            Modify Team
                          </ModalHeader>
                          <ModalBody>
                            <Mutation
                              mutation={modifyProfileMutation}
                              refetchQueries={[{
                                        query: organizationTierQuery,
                                        variables: { gcID: String(gcID) },
                                      }]}
                              context={{
                                        headers: {
                                          Authorization:
                                            `Bearer ${accessToken}`,
                                        },
                                      }
                                      }
                            >
                              {modifyProfile => (
                                <ProfileSearch
                                  onResultSelect={(s) => {
                                  console.log(s.id);
                                  modifyProfile({
                                    variables: {
                                      gcID: String(gcID),
                                      profileInfo: {
                                        supervisor: {
                                          gcId: s.id,
                                        },
                                      },
                                    },
                                  });
                                }}
                                />
                            )}
                            </Mutation>
                            <br />
                            <Mutation
                              mutation={modifyProfileMutation}
                              refetchQueries={[{
                                        query: organizationTierQuery,
                                        variables: { gcID: String(gcID) },
                                      }]}
                              context={{
                                        headers: {
                                          Authorization:
                                            `Bearer ${accessToken}`,
                                        },
                                      }
                                      }
                            >
                              {modifyProfile => (
                                <OrgTierChooser
                                  editMode
                                  selectedOrgTier={orgTest}
                                  supervisor={supTest}
                                  gcID={gcID}
                                  onTeamChange={(t) => {
                                    console.log(t);
                                    modifyProfile({
                                        variables: {
                                          gcID: String(gcID),
                                          profileInfo: {
                                            org: {
                                              orgTierId: t,
                                            },
                                          },
                                        },
                                      });
                                    }}
                                />
                                )}
                            </Mutation>
                          </ModalBody>
                        </Modal>
                      </TabPane>
                      <TabPane tabId="2">
                        <Row>
                          <Col xs="3">
                            <Nav vertical>{teamList}</Nav>
                          </Col>
                          <Col xs="9">
                            <TabContent activeTab={this.state.activeTab1}>
                              {tabPanel}
                            </TabContent>
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          );
        }}
      </Query>
    );
  }
}


OrgManager.defaultProps = {
  // editMode: false,
  myGcID: '',
};

OrgManager.propTypes = {
  gcID: PropTypes.string.isRequired,
  accessToken: PropTypes.string.isRequired,
  myGcID: PropTypes.string,
};

// Creating an HOC with the connect function from redux. Passing access token
const mapStateToProps = ({ user }) => {
  const props = {};
  if (user) {
    props.accessToken = user.access_token;
    props.myGcID = user.profile.sub;
    props.modifyProfile = user.profile.modify_profile === 'True';
  }
  return props;
};

export default connect(mapStateToProps)(LocalizedComponent(OrgManager));
