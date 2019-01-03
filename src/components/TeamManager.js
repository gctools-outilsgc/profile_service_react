import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

class TeamManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cSelected: [],
      open: false,
      removing: false,
      adding: false,
      singleSelection: props.singleSelection,
    };

    this.onSelectClick = this.onSelectClick.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.Cancel = this.Cancel.bind(this);
    this.Open = this.Open.bind(this);
  }

  onAdd() {
    if (this.state.singleSelection !== true) {
      this.state.cSelected.forEach((id) => {
        this.props.handleSave(id, this.props.orgId);
      });
    } else {
      this.props.handleSave(this.state.rSelected, this.props.orgId);
    }
    this.Cancel();
  }
  onRemove() {
    if (this.state.singleSelection !== true) {
      this.state.cSelected.forEach((id) => {
        this.props.handleSave(id, null);
      });
    } else {
      this.props.handleSave(this.state.rSelected, null);
    }
    this.Cancel();
  }

  onSelectClick(selected) {
    if (this.state.singleSelection) {
      this.setState({ rSelected: selected });
    } else {
      const index = this.state.cSelected.indexOf(selected);
      if (index < 0) {
        this.state.cSelected.push(selected);
      } else {
        this.state.cSelected.splice(index, 1);
      }
      this.setState({ cSelected: [...this.state.cSelected] });
    }
  }

  Open(removing, adding) {
    this.setState({
      removing,
      adding,
      open: true,
      cSelected: [],
      rSelected: null,
    });
  }
  Cancel() {
    this.setState({
      open: false,
      cSelected: [],
      rSelected: null,
    });
  }
  render() {
    let modalButton;
    let modalTitle;
    let modalText;

    if (this.state.adding === true && this.state.removing === false) {
      modalButton = (
        <Button
          floated="right"
          primary
          onClick={() => this.onAdd()}
        >
          Add Selected
        </Button>
      );
      modalTitle = 'Add new members to your team';
      modalText = 'sample add text';
    } else if (this.state.adding === false && this.state.removing === true) {
      modalButton = (
        <Button
          floated="right"
          primary
          onClick={() => this.onRemove()}
        >
          Remove Selected
        </Button>
      );
      modalTitle = 'Remove members from your team';
      modalText = 'sample remove text';
    }

    return (

      <div style={{ overflow: 'auto' }}>
        <ul>
          {this.props.teamMembers.map(member => (
            <li key={`team-${member.gcID}`}>
              <div>
                {member.name}
                <span> {member.gcID}</span>
              </div>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => this.Open(true, false)}
          floated="right"
        >
          Remove
        </Button>
        <Button
          onClick={() => this.Open(false, true)}
          floated="right"
        >
          Add
        </Button>

        <Modal
          isOpen={this.state.open}
          closeOnEscape={false}
          closeOnDimmerClick={false}
        >
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalBody scrolling>
            <div>
              <p>{modalText}</p>
              <ul>
                {this.props.employees.map((employee) => {
                  let color = 'grey';
                  let display = false;
                  const match = this.props.teamMembers.some(member =>
                    employee.gcID === member.gcID);

                  if (match && this.state.removing) {
                    color = 'red';
                    display = true;
                  }
                  if (!match && this.state.adding) {
                    color = 'green';
                    display = true;
                  }
                  if (this.props.teamMembers.length === 0
                    && this.state.adding) {
                    display = true;
                  }
                  if (display === true) {
                    return (
                      <li key={`employee-${employee.gcID}`}>
                        <div as="a" color={color}>
                          {employee.name}
                          <span> {employee.gcID}</span>
                        </div>
                        <Button
                          floated="right"
                          toggle
                          size="tiny"
                          onClick={() =>
                            this.onSelectClick(employee.gcID)}
                          active={(this.state.singleSelection) ?
                            this.state.rSelected === employee.gcID :
                            this.state.cSelected.includes(employee.gcID)
                          }
                          content="Select"
                        />
                      </li>
                    );
                  }
                  return <li />;
                })}
                <p>Selected: {JSON.stringify(this.state.rSelected)}</p>
                <p>Selected: {JSON.stringify(this.state.cSelected)}</p>
              </ul>
              <ModalFooter style={{ overflow: 'auto' }}>
                <Button
                  floated="right"
                  onClick={() => this.Cancel()}
                >
                  Cancel
                </Button>
                {modalButton}
              </ModalFooter>
            </div>
          </ModalBody>
        </Modal>

      </div>
    );
  }
}

TeamManager.defaultProps = {
  singleSelection: true,
};

TeamManager.propTypes = {
  employees: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    gcID: PropTypes.string.isRequired,
    org: PropTypes.shape({
      id: PropTypes.string,
    }),
  })).isRequired,
  teamMembers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    gcID: PropTypes.string.isRequired,
    org: PropTypes.shape({
      id: PropTypes.string,
    }),
  })).isRequired,
  handleSave: PropTypes.func.isRequired,
  orgId: PropTypes.string.isRequired,
  singleSelection: PropTypes.bool,
  /* placeholder: PropTypes.string,
  name: PropTypes.string, */
};

export default LocalizedComponent(TeamManager);
