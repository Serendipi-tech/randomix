import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: '/api/graphql',
  // stessa origine del pannello admin: il browser allega da solo il cookie admin_session (httpOnly)
  credentials: 'include',
});

const apiKeyLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
    headers: {
      ...headers,
      'x-api-key': process.env.NEXT_PUBLIC_CLIENT_API_KEY ?? '',
    },
  }));
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: apiKeyLink.concat(httpLink),
  cache: new InMemoryCache(),
});
