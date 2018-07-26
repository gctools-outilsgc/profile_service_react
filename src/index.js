import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
// import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { createLink } from 'apollo-absinthe-upload-link';

import 'semantic-ui-css/semantic.min.css';

import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import store, { errorAction } from './store';

const link = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    const errors = [];
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => errors.push(message));
    }
    if (networkError) {
      errors.push(networkError.message);
    }
    if (errors.length > 0) {
      store.dispatch(errorAction(errors));
    }
  }),
  createLink({ uri: 'https://graphql.gccollab.ca/graphqlcore' }),
]);

const cache = new InMemoryCache({
  dataIdFromObject: (object) => {
    console.log(object);
    switch (object.__typename) {
      /* case 'ProfileType': return `Profile-${object.gcID}`; */
      case 'OrgTierType': return `OrgTier-${object.nameEn}`;
      case 'ModifyOrgTier': return `OrgTier-${object.nameEn}`;
      default: return defaultDataIdFromObject(object);
    }
  },
});

const apollo = new ApolloClient({
  link,
  cache,
});

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={apollo}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
