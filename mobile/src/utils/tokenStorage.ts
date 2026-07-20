import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  ACCESS_TOKEN: 'randomix_access_token',
  REFRESH_TOKEN: 'randomix_refresh_token',
} as const;

const isWeb = Platform.OS === 'web';

const store = {
  get: (key: string): Promise<string | null> =>
    isWeb
      ? Promise.resolve(localStorage.getItem(key))
      : SecureStore.getItemAsync(key),
  set: (key: string, value: string): Promise<void> =>
    isWeb
      ? Promise.resolve(localStorage.setItem(key, value))
      : SecureStore.setItemAsync(key, value),
  delete: (key: string): Promise<void> =>
    isWeb
      ? Promise.resolve(localStorage.removeItem(key))
      : SecureStore.deleteItemAsync(key),
};

// Cache in memoria per accesso sincrono dall'Apollo link
let _cachedToken: string | null = null;

export const tokenStorage = {
  // Da chiamare al boot prima di montare Apollo
  init: async (): Promise<string | null> => {
    _cachedToken = await store.get(KEYS.ACCESS_TOKEN);
    return _cachedToken;
  },

  getAccessTokenSync: () => _cachedToken,

  saveTokens: async (access: string, refresh: string) => {
    _cachedToken = access;
    await Promise.all([store.set(KEYS.ACCESS_TOKEN, access), store.set(KEYS.REFRESH_TOKEN, refresh)]);
  },

  getAccessToken: () => store.get(KEYS.ACCESS_TOKEN),
  getRefreshToken: () => store.get(KEYS.REFRESH_TOKEN),

  clearTokens: async () => {
    _cachedToken = null;
    await Promise.all([store.delete(KEYS.ACCESS_TOKEN), store.delete(KEYS.REFRESH_TOKEN)]);
  },
};
