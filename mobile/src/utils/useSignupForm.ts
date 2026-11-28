import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import { getAuthErrorMessage } from './getAuthErrorMessage';
import { isPasswordValid } from './passwordStrength';

/** Stato, validazioni e invio del form di registrazione. */
export function useSignupForm() {
  const { t } = useTranslation('auth');
  const { registerWithCredentials, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  /** Ritorna il messaggio del primo vincolo non rispettato, null se i dati sono validi */
  const validate = (): string | null => {
    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      return t('register.missingFields');
    }
    if (password !== confirmPassword) return t('register.passwordMismatch');
    if (!isPasswordValid(password)) return t('register.passwordTooShort');
    if (username.trim().length < 3) return t('register.usernameTooShort');

    return null;
  };

  // Submit disabilitato finche' i vincoli non sono soddisfatti: niente errore da mostrare dopo il tap
  const canSubmit =
    !!email.trim() &&
    username.trim().length >= 3 &&
    isPasswordValid(password) &&
    password === confirmPassword;

  const submit = async () => {
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    try {
      await registerWithCredentials(email.trim(), password, username.trim());
    } catch (e) {
      setError(getAuthErrorMessage(e, t));
    }
  };

  return {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    submit,
    loading,
    canSubmit,
  };
}
