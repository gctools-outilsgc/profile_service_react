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
  CardBody
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

class OrgManager extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab1: '1',
      activeTab2: '1',
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

  render() {
    const {
      gcID,
      // editMode,
    } = this.props;
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
                                  `Bearer ${this.props.accessToken}`,
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
                <Row>
                  <Col sm="12" md="1" className="border-right">
                    <h2 className="h5">Teams</h2>
                  </Col>
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
                            <div className="d-flex">
                              <div className="mr-auto p-2 font-weight-bold">
                                Supervisor
                              </div>
                              <Button>
                                R
                              </Button>
                              <Button>
                                E
                              </Button>
                            </div>
                            Supervisor picker here
                          </Col>
                          <Col>
                            <div className="d-flex">
                              <div className="mr-auto p-2 font-weight-bold">
                                Team picker here
                              </div>
                              <Button>
                                L
                              </Button>
                              <Button>
                                E
                              </Button>
                            </div>

                            <OrgTierChooser
                              gcID={data.profiles[0].gcID}
                            />
                          </Col>
                        </Row>
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
};

OrgManager.propTypes = {
  gcID: PropTypes.string.isRequired,
  accessToken: PropTypes.string.isRequired,
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
