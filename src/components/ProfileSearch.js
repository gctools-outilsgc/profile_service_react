import React from 'react';
import Autosuggest from 'react-autosuggest';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';


function getSuggestionValue(suggestion) {
  return suggestion.title;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.id} - {suggestion.title}</span>
  );
}

class ProfileSearch extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested =
    this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested =
    this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue,
    });
  }

  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: value,
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  onSuggestionSelected(event, { suggestion }) {
    this.setState({
      value: this.props.defaultValue || '',
      skip: true,
    });
    setTimeout(() => this.props.onSuggestionSelected(suggestion), 0);

    return suggestion;
  }

  render() {
    const capitalize = function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const title = `title${capitalize(localizer.lang.split('_', 1)[0])}`;
    const { suggestions, value } = this.state;
    let noSuggestions = '';

    return (
      <Query
        query={gql`
        query profileSearchQuery($name: String!) {
          profiles(name: $name) {
            gcID
            name
            avatar
            ${title}
          }
        }`}
        skip={this.state.skip || !this.state.value}
        variables={{ name: this.state.value }}
      >
        {({
        data,
      }) => {
        const results = (data.profiles) ? data.profiles.map(a =>
          ({
            title: a.name,
            description: a[title],
            image: a.avatar,
            id: a.gcID,
          })) : [];

          const resultsToRender = results.filter(result => result.id);
          const numRows = resultsToRender.length;
          if (numRows === 0 && value !== '') {
            noSuggestions = 'No suggestions';
          } else {
            noSuggestions = '';
          }

        this.props.resultPreProcessor(suggestions);

        const inputProps = {
          placeholder: 'Search...',
          value,
          onChange: this.onChange,
        };

        return (
          <div>
            <Autosuggest
              onSuggestionSelected={this.onSuggestionSelected}
              suggestions={results}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />
            { noSuggestions }
          </div>
        );
    }}
      </Query>
    );
  }
}

ProfileSearch.defaultProps = {
  onSuggestionSelected: 34,
  defaultValue: undefined,
  resultPreProcessor: () => {},
};

ProfileSearch.propTypes = {
  onSuggestionSelected: PropTypes.func,
  defaultValue: PropTypes.string,
  resultPreProcessor: PropTypes.func,
};

export default ProfileSearch;
