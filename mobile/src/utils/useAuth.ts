import { useMutation } from '@apollo/client';
import { useRouter } from 'expo-router';
import { UserMutations } from '@randomix/graphql-schema';
import { tokenStorage } from './tokenStorage';

const { LOGIN_WITH_CREDENTIALS, LOGIN_WITH_GOOGLE, LOGOUT, REGISTER_WITH_CREDENTIALS } =
  UserMutations;

interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  language: string | null;
  role: 'USER' | 'ADMIN';
}

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

interface LoginWithCredentialsMutation {
  loginWithCredentials: AuthPayload;
}

interface LoginWithGoogleMutation {
  loginWithGoogle: AuthPayload;
}

interface RegisterWithCredentialsMutation {
  registerWithCredentials: AuthPayload;
}

export function useAuth() {
  const router = useRouter();

  const [loginCredentialsMutation, { loading: loadingLogin, error: errorLogin }] =
    useMutation<LoginWithCredentialsMutation>(LOGIN_WITH_CREDENTIALS);

  const [loginGoogleMutation, { loading: loadingGoogle, error: errorGoogle }] =
    useMutation<LoginWithGoogleMutation>(LOGIN_WITH_GOOGLE);

  const [registerMutation, { loading: loadingRegister, error: errorRegister }] =
    useMutation<RegisterWithCredentialsMutation>(REGISTER_WITH_CREDENTIALS);

  const [logoutMutation] = useMutation(LOGOUT);

  const afterAuth = async (accessToken: string, refreshToken: string) => {
    await tokenStorage.saveTokens(accessToken, refreshToken);
    const hasConsent = await tokenStorage.hasEmailConsent();
    router.replace(hasConsent ? '/(app)' : '/(onboarding)/consent');
  };

  const loginWithCredentials = async (email: string, password: string) => {
    const { data } = await loginCredentialsMutation({ variables: { email, password } });
    if (!data?.loginWithCredentials) return;
    await afterAuth(data.loginWithCredentials.accessToken, data.loginWithCredentials.refreshToken);
  };

  const loginWithGoogle = async (idToken: string) => {
    const { data } = await loginGoogleMutation({ variables: { idToken } });
    if (!data?.loginWithGoogle) return;
    await afterAuth(data.loginWithGoogle.accessToken, data.loginWithGoogle.refreshToken);
  };

  const registerWithCredentials = async (email: string, password: string, username: string) => {
    const { data } = await registerMutation({ variables: { email, password, username } });
    if (!data?.registerWithCredentials) return;
    await afterAuth(
      data.registerWithCredentials.accessToken,
      data.registerWithCredentials.refreshToken,
    );
  };

  const logout = async () => {
    try {
      await logoutMutation();
    } catch {
      // il token viene rimosso localmente in ogni caso
    }
    await tokenStorage.clearTokens();
    router.replace('/(auth)/login');
  };

  return {
    loginWithCredentials,
    loginWithGoogle,
    registerWithCredentials,
    logout,
    loading: loadingLogin || loadingGoogle || loadingRegister,
    error: errorLogin ?? errorGoogle ?? errorRegister ?? null,
  };
}
