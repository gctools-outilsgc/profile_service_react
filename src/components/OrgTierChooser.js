import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

const capitalize = function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

class OrgTierChooser extends React.Component {
  render() {
    const {
      supervisor,
      selectedOrgTier,
      editMode,
    } = this.props;
    return (
      <Query
        variables={{
          gcID: (supervisor) ? supervisor.gcID : null,
        }}
        skip={!supervisor}
        query={gql`
          query organizationQuery($gcID: String!) {
            profiles(gcID: $gcID) {
              org {
                id
                nameEn
                nameFr
              }
              OwnerOfOrgTier {
                id
                nameEn
                nameFr
                organization {
                  id
                  nameEn
                  nameFr
                }
              }
            }
          }`}
      >
        {({
          loading,
          error,
          data,
        }) => {
          if (error) return `Error...${error.message}`;
          const lang = capitalize(localizer.lang.split('_', 1)[0]);

          if (!editMode) {
            if (selectedOrgTier && selectedOrgTier[`name${lang}`]) {
              return selectedOrgTier[`name${lang}`];
            }
            return __('Team has not been identified.');
          }

          const OwnerOfOrgTier =
            (data.profiles && data.profiles.length === 1) ?
              data.profiles[0].OwnerOfOrgTier.slice(0) : [];

          if (data.profiles && data.profiles.length === 1
            && data.profiles[0].org) {
              OwnerOfOrgTier.unshift({
                ...data.profiles[0].org,
              });
          }

          const tierOptions = [];
          tierOptions.push({
            key: 'orgtier-undefined',
            text: '',
            value: null,
            data: null,
          });
          OwnerOfOrgTier
            .forEach(tier =>
              tierOptions.push({
                key: `orgtier-${tier.id}`,
                text: tier[`name${lang}`],
                value: tier.id,
                data: tier,
              }));

          return (
            <Dropdown
              style={{ minWidth: '150px', width: '150px' }}
              disabled={!supervisor}
              value={(selectedOrgTier) ? selectedOrgTier.id : null}
              options={tierOptions}
              closeOnBlur
              selection
              loading={loading && !(!supervisor)}
              onChange={(e, data1) => {
                for (let x = 0; x < tierOptions.length; x += 1) {
                  if (tierOptions[x].value === data1.value) {
                    this.props.onTeamChange(tierOptions[x].data);
                    break;
                  }
                }
              }}
            />
          );
        }}
      </Query>
    );
  }
}


OrgTierChooser.defaultProps = {
  supervisor: undefined,
  selectedOrgTier: undefined,
  editMode: false,
  onTeamChange: () => {},
};

OrgTierChooser.propTypes = {
  /** Supervisor object, to filter org tiers */
  supervisor: PropTypes.shape({
    gcID: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  /** ID of selected org tier */
  selectedOrgTier: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nameEn: PropTypes.string,
    nameFr: PropTypes.string,
  }),
  /** Whether or not the component is in edit mode */
  editMode: PropTypes.bool,
  /** Triggered when the team is changed */
  onTeamChange: PropTypes.func,
};

export default LocalizedComponent(OrgTierChooser);
