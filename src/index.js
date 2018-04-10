import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
// import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createLink } from 'apollo-absinthe-upload-link';

import 'semantic-ui-css/semantic.min.css';

import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import store, { errorAction } from './store';

const link = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    let errors = [];
    if (graphQLErrors) {
      errors = graphQLErrors.map(({ message }) => message);
    } else if (networkError) errors.push(networkError);
    console.log(errors);
    if (errors.length > 0) {
      store.dispatch(errorAction(errors));
    }
  }),
  createLink({ uri: 'https://graphql.gccollab.ca/graphqlcore' }),
  // new HttpLink({ uri: 'https://graphql.gccollab.ca/graphqlcore' }),
]);

const apollo = new ApolloClient({
  link,
  cache: new InMemoryCache(),
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
