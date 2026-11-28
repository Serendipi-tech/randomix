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
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, GradientBackground } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { useSignupForm } from '@/utils/useSignupForm';
import { GradientBackgroundView } from '@/components/molecules/gradient-background';
import { Link } from '@/components/atoms/Link';
import { RandoLogo } from '@/components/molecules/rando-logo';
import { SignupForm } from '@/components/organisms/signup-form';

export default function SignupScreen() {
  const { t } = useTranslation('auth');
  const { colorScheme } = useAppTheme();
  const router = useRouter();
  const form = useSignupForm();

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

          <SignupForm
            colorScheme={colorScheme}
            email={form.email}
            onEmailChange={form.setEmail}
            username={form.username}
            onUsernameChange={form.setUsername}
            password={form.password}
            onPasswordChange={form.setPassword}
            confirmPassword={form.confirmPassword}
            onConfirmPasswordChange={form.setConfirmPassword}
            error={form.error}
            loading={form.loading}
            canSubmit={form.canSubmit}
            onSubmit={form.submit}
          />

          <View style={styles.switchRow}>
            <Link label={t('register.haveAccount')} onPress={() => router.replace('/(auth)/login')} />
          </View>
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
  switchRow: { alignItems: 'center', paddingTop: 8 },
});
