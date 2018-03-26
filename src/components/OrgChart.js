import React from 'react';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import GCOrgChart from '@gctools-components/react-gc-orgchart';

const OrgChart = (props) => {
  const {
    loading,
    error,
    sup: { supervisor },
    profiles,
    gcID,
    employees,
  } = props;
  if (error) return `Error!: ${error}`;

  const orgStructure = { subordinates: [] };
  if (supervisor && supervisor.gcID && profiles) {
    orgStructure.name = supervisor.name;
    orgStructure.uuid = supervisor.gcID;
    profiles.forEach(p => orgStructure.subordinates.push({
      name: p.name,
      uuid: p.gcID,
    }));
    if (employees && employees.length > 0) {
      for (let x = 0; x < orgStructure.subordinates.length; x += 1) {
        if (orgStructure.subordinates[x].uuid === gcID) {
          orgStructure.subordinates[x].subordinates = [];
          employees.forEach(p =>
            orgStructure.subordinates[x].subordinates.push({
              name: p.name,
              uuid: p.gcID,
            }));
          break;
        }
      }
    }
    console.log(orgStructure);
  } else {
    return null;
  }

  return (
    <Segment>
      <Dimmer active={loading}>
        <Loader content="Loading" />
      </Dimmer>
      <GCOrgChart orgStructure={orgStructure} subject={gcID} />
    </Segment>
  );
};

OrgChart.defaultProps = {
  profiles: [],
  employees: [],
  sup: { supervisor: { org: {}, address: {} } },
  error: undefined,
};

OrgChart.propTypes = {
  gcID: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({}),
  sup: PropTypes.shape({}),
  employees: PropTypes.arrayOf(PropTypes.shape({})),
  profiles: PropTypes.arrayOf(PropTypes.shape({
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
    }),
  })),
};

export default OrgChart;