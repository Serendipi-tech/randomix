import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { AuthBackground } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { useAuthIntroReplay } from '@/utils/useAuthIntroReplay';
import { useAuthForms } from '@/utils/useAuthForms';
import { usePasswordRecoveryForm, type RecoveryStep } from '@/utils/usePasswordRecoveryForm';
import { useAuthIntro } from '@/utils/useAuthIntro';
import { useCardFlip, type AuthCardFace } from '@/utils/useCardFlip';
import { AuthBackgroundView } from '@/components/molecules/auth-background';
import { DiceLogo } from '@/components/molecules/dice-logo';
import { FlippableAuthCard } from '@/components/molecules/flippable-auth-card';
import { AuthStandardFace } from '@/components/organisms/auth-standard-face';
import { AuthLoginFace } from '@/components/organisms/auth-login-face';
import { AuthRegisterFace } from '@/components/organisms/auth-register-face';
import { AuthRecoverFace } from '@/components/organisms/auth-recover-face';

// Altezza fissa della card: deve bastare per la faccia più alta (register, 4 campi) anche con testi tradotti più lunghi.
const AUTH_CARD_MIN_HEIGHT = 480;

export default function AuthScreen() {
  const { colorScheme } = useAppTheme();
  const { diceStyle, blockStyle, onDiceLayout, onBlockLayout, replay } = useAuthIntro();
  const { face, flipTo, flipStyle } = useCardFlip();
  const introReplay = useAuthIntroReplay();

  const forms = useAuthForms();
  const recovery = usePasswordRecoveryForm();

  const [_request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) forms.submitGoogleLogin(idToken);
    }
  }, [response]);

  useEffect(() => {
    // Registra il replay dell'animazione d'ingresso nel bottone globale (root layout).
    introReplay.register(replay);
    return () => introReplay.register(null);
  }, [replay]);

  const goToStandard = () => {
    recovery.reset();
    flipTo('standard');
  };

  const handleConfirmReset = async () => {
    const success = await recovery.submitConfirm();
    if (success) {
      recovery.reset();
      flipTo('login');
    }
  };

  const renderFace = (targetFace: AuthCardFace, recoverStep?: RecoveryStep) => {
    switch (targetFace) {
      case 'standard':
        return <AuthStandardFace colorScheme={colorScheme} onSignIn={() => flipTo('login')} />;
      case 'login':
        return (
          <AuthLoginFace
            colorScheme={colorScheme}
            identifier={forms.loginIdentifier}
            onIdentifierChange={forms.setLoginIdentifier}
            password={forms.loginPassword}
            onPasswordChange={forms.setLoginPassword}
            error={forms.loginError}
            loading={forms.loading}
            onSubmit={forms.submitLogin}
            onGoogle={() => promptAsync()}
            onGoToRegister={() => flipTo('register')}
            onGoToRecover={() => flipTo('recover')}
            onBack={goToStandard}
          />
        );
      case 'register':
        return (
          <AuthRegisterFace
            colorScheme={colorScheme}
            email={forms.registerEmail}
            onEmailChange={forms.setRegisterEmail}
            username={forms.registerUsername}
            onUsernameChange={forms.setRegisterUsername}
            password={forms.registerPassword}
            onPasswordChange={forms.setRegisterPassword}
            confirmPassword={forms.registerConfirmPassword}
            onConfirmPasswordChange={forms.setRegisterConfirmPassword}
            error={forms.registerError}
            loading={forms.loading}
            onSubmit={forms.submitRegister}
            onGoToLogin={() => flipTo('login')}
            onBack={goToStandard}
          />
        );
      case 'recover':
        return (
          <AuthRecoverFace
            colorScheme={colorScheme}
            step={recoverStep ?? recovery.step}
            email={recovery.email}
            onEmailChange={recovery.setEmail}
            otp={recovery.otp}
            onOtpChange={recovery.setOtp}
            newPassword={recovery.newPassword}
            onNewPasswordChange={recovery.setNewPassword}
            confirmPassword={recovery.confirmPassword}
            onConfirmPasswordChange={recovery.setConfirmPassword}
            error={recovery.error}
            loading={recovery.loading}
            onSubmitRequest={recovery.submitRequest}
            onSubmitConfirm={handleConfirmReset}
            onBack={goToStandard}
          />
        );
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: AuthBackground[colorScheme].stops[0] }]}>
      <AuthBackgroundView colorScheme={colorScheme} />

      <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.diceZone}>
          <View onLayout={onDiceLayout}>
            <Animated.View style={diceStyle}>
              <DiceLogo />
            </Animated.View>
          </View>
        </View>

        <View style={styles.block} onLayout={onBlockLayout}>
          <Animated.View style={blockStyle}>
            <FlippableAuthCard colorScheme={colorScheme} style={flipStyle} minHeight={AUTH_CARD_MIN_HEIGHT}>
              {renderFace(face)}
            </FlippableAuthCard>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1 },
  diceZone: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  block: { position: 'absolute', left: 24, right: 24, bottom: 28 },
});
