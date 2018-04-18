import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Item,
  Icon,
  Button,
  Popup,
  Header,
  Dropdown
} from 'semantic-ui-react';

import ReactI18nEdit from '@gctools-components/react-i18n-edit';

import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const capitalize = function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const defaultNewOrgTier = { nameEn: '', nameFr: '', organization: null };

class OrgTierCreateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createOrgTierOpen: false,
      newOrgTier: defaultNewOrgTier,
    };
  }

  render() {
    const { accessToken } = this.props;
    const lang = capitalize(localizer.lang.split('_', 1)[0]);
    return (
      <Fragment>
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
            content={__('Create new team')}
          />
          <Modal.Content>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Item.Header>
                    <Query
                      query={gql`
                        query organizationQuery {
                          organizations {
                            id
                            nameEn
                            nameFr
                          }
                        }
                      `}
                    >
                      {({
                        loading: orgLoading,
                        error: orgError,
                        data: orgData,
                      }) => {
                        const orgOptions =
                          (orgData && orgData.organizations) ?
                            orgData.organizations.map(org => ({
                              key: `org-${org.id}`,
                              text: org[`name${lang}`],
                              value: org.id,
                              data: org,
                            })) : [];

                        if (
                          !orgLoading
                          && orgData.organizations
                          && orgData.organizations.length > 0
                          && !this.state.newOrgTier.organization) {
                            const oo = orgData.organizations[0];
                            // @todo: consider refactoring
                            setTimeout(() => {
                              this.setState({
                                newOrgTier: Object.assign(
                                  {},
                                  this.state.newOrgTier,
                                  { organization: oo },
                                ),
                              });
                            }, 0);
                        }

                        const orgId =
                          (this.state.newOrgTier.organization) ?
                          this.state.newOrgTier.organization.id : null;

                        return (
                          <Dropdown
                            error={!(!orgError)}
                            options={orgOptions}
                            wrapSelection
                            value={orgId}
                            closeOnBlur
                            selection
                            loading={orgLoading}
                            onChange={(e, data1) => {
                              const oo = orgOptions;
                              for (let x = 0; x < oo.length; x += 1) {
                                if (oo[x].value === data1.value) {
                                  this.setState({
                                    newOrgTier: Object.assign(
                                      {},
                                      this.state.newOrgTier,
                                      { organization: oo[x].data },
                                    ),
                                  });
                                  break;
                                }
                              }
                            }}
                          />
                        );
                      }}
                    </Query>
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
                      onChange={(data2) => {
                        const l = data2.lang.split('_', 1)[0];
                        const changeObj = {};
                        changeObj[`name${capitalize(l)}`]
                          = data2.value;
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
            <Mutation
              mutation={gql`
                mutation createOrgTier(
                  $nameEn: String!,
                  $nameFr: String!,
                  $organizationId: Int!,
                  $ownerGcId: String!
                ) {
                  createOrgTier(
                    nameEn: $nameEn,
                    nameFr: $nameFr,
                    organizationId: $organizationId,
                    ownerGcId: $ownerGcId
                  ) {
                    nameEn
                  }
                }`
              }
            >
              {createOrgTier => (
                <Button
                  positive
                  onClick={() => {
                    createOrgTier({
                      context: {
                        headers: {
                          Authorization:
                            `Bearer ${accessToken}`,
                        },
                      },
                      variables: {
                        ...this.state.newOrgTier,
                        organization: null,
                        organizationId:
                          this.state.newOrgTier.organization.id,
                        ownerGcId: this.props.gcID,
                      },
                    }).then(() => {
                      this.setState({
                        createOrgTierOpen: false,
                        newOrgTier: defaultNewOrgTier,
                      });
                    });
                  }}
                >
                  <Icon name="save" /> {__('Save')}
                </Button>
              )}
            </Mutation>
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
              icon="add"
              onClick={() => {
                this.setState({ createOrgTierOpen: true });
              }}
            />
          }
          content={__('Add new org tier')}
        />
      </Fragment>
    );
  }
}

OrgTierCreateButton.defaultProps = {
  accessToken: undefined,
};

OrgTierCreateButton.propTypes = {
  /** Logged in user's ID (to create new org tiers) */
  gcID: PropTypes.string.isRequired,
  /** Access token of logged in user (to create new org tiers) */
  accessToken: PropTypes.string,
  /** Triggered when the team is changed */
};

export default OrgTierCreateButton;
