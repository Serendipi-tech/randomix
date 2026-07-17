import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import { getAuthErrorMessage } from './getAuthErrorMessage';

export function useAuthForms() {
  const { t } = useTranslation('auth');
  const { loginWithCredentials, loginWithGoogle, registerWithCredentials, loading } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState<string | null>(null);

  const submitLogin = async () => {
    setLoginError(null);
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError(t('login.missingFields'));
      return;
    }
    try {
      await loginWithCredentials(loginEmail.trim(), loginPassword);
    } catch (e) {
      setLoginError(getAuthErrorMessage(e, t));
    }
  };

  const submitGoogleLogin = async (idToken: string) => {
    setLoginError(null);
    try {
      await loginWithGoogle(idToken);
    } catch (e) {
      setLoginError(getAuthErrorMessage(e, t));
    }
  };

  const submitRegister = async () => {
    setRegisterError(null);
    if (
      !registerEmail.trim() ||
      !registerUsername.trim() ||
      !registerPassword ||
      !registerConfirmPassword
    ) {
      setRegisterError(t('register.missingFields'));
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError(t('register.passwordMismatch'));
      return;
    }
    if (registerPassword.length < 8) {
      setRegisterError(t('register.passwordTooShort'));
      return;
    }
    if (registerUsername.trim().length < 3) {
      setRegisterError(t('register.usernameTooShort'));
      return;
    }
    try {
      await registerWithCredentials(registerEmail.trim(), registerPassword, registerUsername.trim());
    } catch (e) {
      setRegisterError(getAuthErrorMessage(e, t));
    }
  };

  return {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginError,
    submitLogin,
    submitGoogleLogin,
    registerEmail,
    setRegisterEmail,
    registerUsername,
    setRegisterUsername,
    registerPassword,
    setRegisterPassword,
    registerConfirmPassword,
    setRegisterConfirmPassword,
    registerError,
    submitRegister,
    loading,
  };
}
