import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import { getAuthErrorMessage } from './getAuthErrorMessage';

/** Stato e invio del form di accesso: credenziali o token Google. */
export function useLoginForm() {
  const { t } = useTranslation('auth');
  const { loginWithCredentials, loginWithGoogle, loading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!identifier.trim() || !password) {
      setError(t('login.missingFields'));
      return;
    }
    try {
      await loginWithCredentials(identifier.trim(), password);
    } catch (e) {
      setError(getAuthErrorMessage(e, t));
    }
  };

  const submitWithGoogle = async (idToken: string) => {
    setError(null);
    try {
      await loginWithGoogle(idToken);
    } catch (e) {
      setError(getAuthErrorMessage(e, t));
    }
  };

  return { identifier, setIdentifier, password, setPassword, error, submit, submitWithGoogle, loading };
}
