import React from 'react';
import PropTypes from 'prop-types';
import { Search } from 'semantic-ui-react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';


class ProfileSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || '',
      isDefault: true,
    };
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.searchDelay = false;
  }

  componentWillReceiveProps(next) {
    const { isDefault } = this.state;
    if (isDefault && (next.defaultValue !== this.state.value)) {
      this.setState({ value: next.defaultValue });
    }
  }

  handleResultSelect(e, { result }) {
    this.setState({
      value: this.props.defaultValue || '',
      skip: true,
      isDefault: true,
    });
    setTimeout(() => this.props.onResultSelect(result), 0);
  }

  handleSearchChange(e, { value }) {
    this.setState({ value, skip: true, isDefault: false });
    if (this.searchDelay) {
      clearTimeout(this.searchDelay);
    }
    this.searchDelay = setTimeout(() => {
      this.setState({ skip: false });
      this.searchDelay = false;
    }, 200);
  }

  render() {
    const capitalize = function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const title = `title${capitalize(localizer.lang.split('_', 1)[0])}`;
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
          loading,
          data,
        }) => {
          const { value, isDefault } = this.state;
          const results = (data.profiles) ? data.profiles.map(a =>
            ({
              title: a.name,
              description: a[title],
              image: a.avatar,
              id: a.gcID,
            })) : [];
          this.props.resultPreProcessor(results);

          return (
            <Search
              placeholder="search"
              icon="search"
              loading={loading && !isDefault && value !== ''}
              onResultSelect={this.handleResultSelect}
              onSearchChange={this.handleSearchChange}
              onBlur={e => this.props.onBlur(e, this)}
              results={results}
              value={value}
              noResultsMessage={__('No results found.')}
            />
          );
        }}
      </Query>
    );
  }
}

ProfileSearch.defaultProps = {
  onResultSelect: () => {},
  defaultValue: undefined,
  onBlur: () => {},
  resultPreProcessor: () => {},
};

ProfileSearch.propTypes = {
  onResultSelect: PropTypes.func,
  defaultValue: PropTypes.string,
  onBlur: PropTypes.func,
  resultPreProcessor: PropTypes.func,
};

export default LocalizedComponent(ProfileSearch);
