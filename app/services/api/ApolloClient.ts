import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import Config from "../../config"

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev"

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages()
  loadErrorMessages()
}

// set up the graphql link here
const httpLink = createHttpLink({
  uri: Config.graphqlEndpoint,
})

// handle the api key
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-api-key": Config.graphqlApiKey,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export { client }
