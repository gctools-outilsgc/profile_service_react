
import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'reactstrap';

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div>
        <div>{this.props.name} :</div>
        <Input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
        />
        <Button
          primary
          onClick={() =>
            this.props.handleSubmit(this.state.value)}
        >
          Submit
        </Button>
      </div>
    );
  }
}

InputForm.defaultProps = {
  placeholder: '...',
  name: '...',
};

InputForm.propTypes = {
  value: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string,
};
export default InputForm;
