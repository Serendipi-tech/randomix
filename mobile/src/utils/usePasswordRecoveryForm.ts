import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePasswordReset } from './usePasswordReset';
import { getAuthErrorMessage } from './getAuthErrorMessage';

export type RecoveryStep = 'request' | 'confirm';

export function usePasswordRecoveryForm() {
  const { t } = useTranslation('auth');
  const { requestReset, confirmReset, loading } = usePasswordReset();

  const [step, setStep] = useState<RecoveryStep>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitRequest = async () => {
    setError(null);
    if (!email.trim()) {
      setError(t('forgotPassword.missingEmail'));
      return;
    }
    try {
      await requestReset(email.trim());
      setStep('confirm');
    } catch (e) {
      setError(getAuthErrorMessage(e, t));
    }
  };

  const submitConfirm = async (): Promise<boolean> => {
    setError(null);
    if (!otp.trim() || !newPassword || !confirmPassword) {
      setError(t('resetPassword.missingFields'));
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError(t('resetPassword.passwordMismatch'));
      return false;
    }
    if (newPassword.length < 8) {
      setError(t('resetPassword.passwordTooShort'));
      return false;
    }
    try {
      await confirmReset(email, otp.trim(), newPassword);
      return true;
    } catch (e) {
      setError(getAuthErrorMessage(e, t));
      return false;
    }
  };

  const reset = () => {
    setStep('request');
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
  };

  return {
    step,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    loading,
    submitRequest,
    submitConfirm,
    reset,
  };
}
