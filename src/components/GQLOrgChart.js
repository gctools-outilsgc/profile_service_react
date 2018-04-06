import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import OrgChart from './OrgChart';

const orgChartSupervisorQuery = gql`
query orgChartSupervisorQuery($gcID: String!) {
  profiles(gcID: $gcID) {
    gcID
    name
    avatar
    titleEn
    titleFr
    org {
      id
      nameEn
      nameFr
    }
    Employees {
      gcID
      name
      avatar
      titleEn
      titleFr
      org {
        id
        nameEn
        nameFr
      }
    }
    supervisor {
      gcID
      name
      avatar
      titleEn
      titleFr
      org {
        id
        nameEn
        nameFr
      }
    }
  }
}`;

const orgChartEmpQuery = gql`
query orgChartEmpQuery($gcID: String!) {
  profiles(gcID: $gcID) {
    Employees {
      gcID
      name
      avatar
      titleEn
      titleFr
      org {
        id
        nameEn
        nameFr
      }
    }
  }
}`;

export default compose(
  graphql(orgChartSupervisorQuery, {
    props: p => ({
      error: p.data.error,
      loading: p.data.loading,
      employees: (p.data.profiles && p.data.profiles.length === 1) ?
        p.data.profiles[0].Employees : [],
      sup: (p.data.profiles && p.data.profiles.length === 1) ?
        p.data.profiles[0] : { org: {} },
    }),
    options: ({ gcID }) => ({
      variables: {
        gcID,
      },
    }),
  }),
  graphql(orgChartEmpQuery, {
    skip: props => (!(props.sup && props.sup.supervisor)),
    props: p => ({
      error: p.data.error,
      loading: p.data.loading,
      profiles: (p.data.profiles && p.data.profiles.length === 1) ?
        p.data.profiles[0].Employees : [],
    }),
    options: ({ sup: { supervisor } }) => ({
      variables: {
        gcID: supervisor.gcID,
      },
    }),
  }),
)(OrgChart);
