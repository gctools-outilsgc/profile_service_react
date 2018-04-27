import React from 'react';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import GCOrgChart from '@gctools-components/react-gc-orgchart';

class OrgChart extends React.Component {
  constructor(props) {
    super(props);
    this.element = false;
    this.elementSafety = 0;
    this.scrollSubjectIntoView = this.scrollSubjectIntoView.bind(this);
  }

  componentDidMount() {
    this.scrollSubjectIntoView();
  }

  componentWillReceiveProps(next) {
    if (next.gcID !== this.props.gcID) {
      this.scrollSubjectIntoView();
    }
  }

  scrollSubjectIntoView() {
    setTimeout(() => {
      if (this.element) {
        this.elementSafety = 0;
        const focused = this.element.element.getElementsByClassName('focused');
        if (focused.length === 1) {
          focused[0].scrollIntoView({ inline: 'center' });
        }
      } else {
        this.elementSafety += 1;
        if (this.elementSafety < 100000) {
          this.scrollSubjectIntoView();
        } else {
          throw Error('Element referencing failed.');
        }
      }
    }, 100);
  }

  render() {
    const {
      loading,
      error,
      sup: { supervisor },
      sup: me,
      profiles,
      gcID,
      employees,
    } = this.props;
    if (error) return `Error!: ${error}`;
    if (!me.gcID) return null;
    const orgStructure = { subordinates: [] };
    const orgTierName = (localizer.lang === 'en_CA') ? 'nameEn' : 'nameFr';
    let subject = false;
    if (supervisor && supervisor.gcID) {
      orgStructure.name = supervisor.name;
      orgStructure.uuid = supervisor.gcID;
      orgStructure.orgTier = (supervisor.org) ?
        supervisor.org[orgTierName] : '';
    } else {
      orgStructure.name = me.name;
      orgStructure.uuid = me.gcID;
      orgStructure.orgTier = (me.org) ? me.org[orgTierName] : '';
      subject = orgStructure;
    }
    if (profiles) {
      profiles.forEach((p) => {
        const i = orgStructure.subordinates.push({
          name: p.name,
          uuid: p.gcID,
          orgTier: (p.org) ? p.org[orgTierName] : '',
        });
        if (p.gcID === gcID) subject = orgStructure.subordinates[i - 1];
      });
    }

    if (subject && employees && employees.length > 0) {
      subject.subordinates = [];
      employees.forEach(p =>
        subject.subordinates.push({
          name: p.name,
          uuid: p.gcID,
          orgTier: (p.org) ? p.org[orgTierName] : '',
        }));
    }

    const navigateToProfile = (uuid) => {
      if (gcID !== uuid) {
        this.context.router.history.push(`/profile/${uuid}`);
      }
    };


    const onClick = (e, obj) => {
      navigateToProfile(obj.uuid);
    };

    const onKeyPress = (e, obj) => {
      if (e.key === 'Enter') {
        navigateToProfile(obj.uuid);
      }
    };

    return (
      <Segment style={{ overflowX: 'scroll' }}>
        <Dimmer active={loading}>
          <Loader content="Loading" />
        </Dimmer>
        <GCOrgChart
          ref={(r) => { this.element = r; }}
          orgStructure={orgStructure}
          subject={gcID}
          onClick={onClick}
          onKeyPress={onKeyPress}
        />
      </Segment>
    );
  }
}

OrgChart.contextTypes = {
  router: PropTypes.object,
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
