import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Label,
  List
} from 'semantic-ui-react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

class TeamManager extends Component {
  constructor(props) {
    super(props);

    this.state = { cSelected: [] };
    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  onAdd() {
    this.state.cSelected.forEach((id) => {
      console.log(id);
      this.props.handleSave(id, this.props.orgId);
    });
  }
  onRemove() {
    this.state.cSelected.forEach((id) => {
      console.log(id);
      this.props.handleSave(id, null);
    });
  }

  onCheckboxBtnClick(selected) {
    const index = this.state.cSelected.indexOf(selected);
    if (index < 0) {
      this.state.cSelected.push(selected);
    } else {
      this.state.cSelected.splice(index, 1);
    }
    this.setState({ cSelected: [...this.state.cSelected] });
  }

  render() {
    return (
      <div>
        <List>
          {this.props.employees.map((employee) => {
            let color = 'grey';
            for (let i = 0; i < this.props.teamMembers.length; i += 1) {
              if (employee.gcID === this.props.teamMembers[i].gcID) {
                color = 'blue';
              }
            }
            return (
              <List.Item key={`employee-${employee.gcID}`}>
                <Label as="a" color={color}>
                  {employee.name}
                  <Label.Detail> {employee.gcID}</Label.Detail>
                </Label>
                <Button.Group size="tiny" compact floated="right">
                  <Button
                    primary
                    onClick={() => this.onCheckboxBtnClick(employee.gcID)}
                    active={this.state.cSelected.includes(employee.gcID)}
                    content="Select"
                  />
                </Button.Group>
              </List.Item>
            );
          })}
          <p>Selected: {JSON.stringify(this.state.cSelected)}</p>
        </List>

        <Button
          positive
          onClick={() => this.onAdd()}
          content="Add"
          floated="right"
        />
        <Button
          negative
          onClick={() => this.onRemove()}
          content="Remove"
        />

      </div>
    );
  }
}

TeamManager.defaultProps = {
};

TeamManager.propTypes = {
  employees: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    gcID: PropTypes.string.isRequired,
    org: PropTypes.shape({
      id: PropTypes.number,
    }),
  })).isRequired,
  teamMembers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    gcID: PropTypes.string.isRequired,
    org: PropTypes.shape({
      id: PropTypes.number,
    }),
  })).isRequired,
  handleSave: PropTypes.func.isRequired,
  orgId: PropTypes.number.isRequired,
  /* placeholder: PropTypes.string,
  name: PropTypes.string, */
};

export default LocalizedComponent(TeamManager);
