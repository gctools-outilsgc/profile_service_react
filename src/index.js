import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const apollo = new ApolloClient({
    link: new HttpLink({ uri:'http://gcrec.lpss.me/graphql'}),
    cache: new InMemoryCache(),
});


ReactDOM.render(

<ApolloProvider client={apollo}>
    <App /> 
</ApolloProvider>,

document.getElementById('root'));
registerServiceWorker();
