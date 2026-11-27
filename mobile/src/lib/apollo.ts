import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { tokenStorage } from '@/utils/tokenStorage';

const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_URL ?? 'http://localhost:3000/api/graphql',
});

// La cache in memoria del token può essere ancora vuota alla prima query: su web un refresh rimonta
// l'albero e le schermate partono mentre tokenStorage.init() è ancora in volo, e senza header le
// query tornano UNAUTHENTICATED. Qui il link attende lo storage invece di partire senza token.
const authLink = setContext(async (_operation, { headers = {} }: { headers?: Record<string, string> }) => {
  const token = tokenStorage.getAccessTokenSync() ?? (await tokenStorage.init());
  return {
    headers: {
      ...headers,
      'x-api-key': process.env.EXPO_PUBLIC_CLIENT_API_KEY ?? '',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
