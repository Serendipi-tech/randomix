import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, GradientBackground } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { usePasswordRecoveryForm } from '@/utils/usePasswordRecoveryForm';
import { GradientBackgroundView } from '@/components/molecules/gradient-background';
import { RandoLogo } from '@/components/molecules/rando-logo';
import { AuthRecoverFace } from '@/components/organisms/auth-recover-face';

export default function RecoverScreen() {
  const { colorScheme } = useAppTheme();
  const router = useRouter();
  const form = usePasswordRecoveryForm();

  // A password cambiata si torna al login: la nuova password si usa subito li'
  const onSubmitConfirm = async () => {
    const done = await form.submitConfirm();
    if (done) router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: GradientBackground[colorScheme].stops[0] }]}>
      <GradientBackgroundView colorScheme={colorScheme} />

      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <ChevronLeft size={24} color={Colors[colorScheme].textColor} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoZone}>
            <RandoLogo />
          </View>

          <AuthRecoverFace
            colorScheme={colorScheme}
            step={form.step}
            email={form.email}
            onEmailChange={form.setEmail}
            otp={form.otp}
            onOtpChange={form.setOtp}
            newPassword={form.newPassword}
            onNewPasswordChange={form.setNewPassword}
            confirmPassword={form.confirmPassword}
            onConfirmPasswordChange={form.setConfirmPassword}
            error={form.error}
            loading={form.loading}
            onSubmitRequest={form.submitRequest}
            onSubmitConfirm={onSubmitConfirm}
            onBack={() => router.back()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1 },
  // Stesso valore del padding laterale: il chevron resta equidistante da alto e sinistra
  header: { paddingHorizontal: 24, paddingTop: 24, alignItems: 'flex-start' },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 },
  logoZone: { alignItems: 'center', paddingBottom: 8 },
});
