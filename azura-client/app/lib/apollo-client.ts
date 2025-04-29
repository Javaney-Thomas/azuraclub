import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { setContext } from "@apollo/client/link/context";
import { getCookie } from "cookies-next";


console.log("Apollo GraphQL URL being used:", process.env.NEXT_PUBLIC_GRAPHQL_URL);
// Create the upload-enabled HTTP link
const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:5000/graphql",
});

// Setup auth headers
const authLink = setContext((_, { headers }) => {
  const token = getCookie("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create the Apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
