import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from '@apollo/client'

import { ApolloProvider } from "@apollo/client/react";

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('library-user-token')
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }))
  return forward(operation)
})

const httpLink = new HttpLink({ 
  uri: 'http://localhost:4000/',
  fetchOptions: {
    headers: {
      'content-type': 'application/json'
    }
  }
 })

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
