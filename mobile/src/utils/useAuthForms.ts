import { useLoginForm } from './useLoginForm';
import { useSignupForm } from './useSignupForm';

/** Adattatore legacy: espone i due form con i nomi usati dalla vecchia schermata unica
 *  (app/(auth)/_old). La logica vive in useLoginForm/useSignupForm, qui non è duplicata. */
export function useAuthForms() {
  const login = useLoginForm();
  const register = useSignupForm();

  return {
    loginIdentifier: login.identifier,
    setLoginIdentifier: login.setIdentifier,
    loginPassword: login.password,
    setLoginPassword: login.setPassword,
    loginError: login.error,
    submitLogin: login.submit,
    submitGoogleLogin: login.submitWithGoogle,
    registerEmail: register.email,
    setRegisterEmail: register.setEmail,
    registerUsername: register.username,
    setRegisterUsername: register.setUsername,
    registerPassword: register.password,
    setRegisterPassword: register.setPassword,
    registerConfirmPassword: register.confirmPassword,
    setRegisterConfirmPassword: register.setConfirmPassword,
    registerError: register.error,
    submitRegister: register.submit,
    loading: login.loading || register.loading,
  };
}
