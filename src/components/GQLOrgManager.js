import React from 'react';
import PropTypes from 'prop-types';
import {
  Segment,
  Dimmer,
  Loader,
  Button,
  Tab
} from 'semantic-ui-react';

import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import InputForm from './InputForm';
import TeamManager from './TeamManager';

const organizationTierQuery = gql`
query organizationTierQuery($gcID: String!) {
  profiles(gcID: $gcID) {
    name
    Employees {
      name
      gcID
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

          return (
            <Segment>
              <h2>Your Teams</h2>
              <Tab
                menu={{
                  fluid: true,
                  vertical: true,
                  pointing: true,
                }}
                menuPosition="right"
                panes={data.profiles[0].OwnerOfOrgTier.map(({
                  id,
                  nameEn,
                  nameFr,
                  OrgMembers,
                }) => {  // eslint-disable-line
                  return {
                    menuItem: nameEn,
                    render: () => (
                      <Tab.Pane>
                        <Dimmer active={loading} inverted>
                          <Loader content={__('Loading')} />
                        </Dimmer>
                        <Dimmer active={!loading && !gcID}>
                          {__('Specified profile does not exist.')}
                        </Dimmer>
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

                        <Segment>
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
                        </Segment>

                        <Segment>
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
                        </Segment>
                      </Tab.Pane>),
                    };
                })}
              />
            </Segment>
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
