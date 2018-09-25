import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import ProfileSearch from './ProfileSearch';

class TeamTransfer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedUserName: '',
      selectedUserId: '',
    };
  }

  render() {
    return (
      <div style={{ overflow: 'auto' }}>

        <Button
          onClick={() => this.setState({
            open: true,
          })}
          floated="right"
          size="small"
        >
          Transfer
        </Button>

        <Modal
          isOpen={this.state.open}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          size="large"
        >
          <ModalHeader>Transfering Ownership</ModalHeader>
          <ModalBody scrolling>
            <div>
              <p>Select the platform user that will receive your team.</p>
              <ProfileSearch
                defaultValue={
                  (this.state.selectedUserName) ?
                    this.state.selectedUserName : ''
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
                    if (results[x].id === this.props.gcID) {
                      results.splice(x, 1);
                      break;
                    }
                  }
                  results.unshift({
                    title: __('No supervisor'),
                    description: 'Description',
                    id: null,
                  });
                }}
                onResultSelect={(data) => {
                  console.log(data);
                  /* const sup = (this.state.profile.supervisor) ?
                    this.state.profile.supervisor.gcID : null; */
                  this.setState({
                    selectedUserName: data.title,
                    selectedUserId: data.id,
                    /* selectedUser: Object.assign(
                      {},
                      this.state.profile,
                      {
                        supervisor: (data.id !== null) ? {
                          name: data.title,
                          gcID: data.id,
                        } : null,
                      },
                      (data.id !== sup) ? { org: null } : {},
                    ) */
                  });
                }}
              />
              <h3>User name:{this.state.selectedUserName}</h3>
              <h3>ID: {this.state.selectedUserId}</h3>
              <ModalFooter style={{ overflow: 'auto' }}>
                <Button
                  floated="right"
                  onClick={() => this.setState({
                    open: false,
                  })}
                >
                  Cancel
                </Button>
                <Button
                  disabled={this.state.selectedUserId === ''}
                  primary
                  floated="right"
                  content="Transfer"
                  onClick={() => {
                    this.props.handleTransfer(this.state.selectedUserId); // eslint-disable-line
                    this.setState({
                      open: false,
                      selectedUserName: '',
                      selectedUserId: '',
                    });
                  }}
                >
                  Transfer
                </Button>
              </ModalFooter>
            </div>
          </ModalBody>
        </Modal>

      </div>
    );
  }
}

TeamTransfer.propTypes = {
  gcID: PropTypes.string.isRequired,
  handleTransfer: PropTypes.func.isRequired,
  /* employees: PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  gcID: PropTypes.string.isRequired,
  org: PropTypes.shape({
    id: PropTypes.number,
  }),
})).isRequired, */
  /* TeamTransfer: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    gcID: PropTypes.string.isRequired,
    org: PropTypes.shape({
      id: PropTypes.number,
    }),
  })).isRequired,
  handleTransfer: PropTypes.func.isRequired,
  orgId: PropTypes.number.isRequired,
  singleSelection: PropTypes.bool, */
};

export default LocalizedComponent(TeamTransfer);
