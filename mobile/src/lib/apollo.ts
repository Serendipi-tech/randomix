import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { tokenStorage } from '@/utils/tokenStorage';

const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3000/api/graphql',
});

// Accesso sincrono al token — tokenStorage.init() lo popola al boot prima del primo render
const authLink = new ApolloLink((operation, forward) => {
  const token = tokenStorage.getAccessTokenSync();
  operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
    headers: {
      ...headers,
      'x-api-key': process.env.EXPO_PUBLIC_CLIENT_API_KEY ?? '',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }));
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
