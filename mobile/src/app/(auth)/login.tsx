import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, GradientBackground } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { useLoginForm } from '@/utils/useLoginForm';
import { GradientBackgroundView } from '@/components/molecules/gradient-background';
import { Link } from '@/components/atoms/Link';
import { RandoLogo } from '@/components/molecules/rando-logo';
import { LoginForm } from '@/components/organisms/login-form';

export default function LoginScreen() {
  const { t } = useTranslation('auth');
  const { colorScheme } = useAppTheme();
  const router = useRouter();
  const form = useLoginForm();

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

          <LoginForm
            colorScheme={colorScheme}
            identifier={form.identifier}
            onIdentifierChange={form.setIdentifier}
            password={form.password}
            onPasswordChange={form.setPassword}
            error={form.error}
            loading={form.loading}
            onSubmit={form.submit}
          />

          {/* Stessa riga, estremi opposti: a sinistra testo semplice su textColor (leggibile sul viola),
              a destra il Link accent. La label corta "Sign up" evita che le due voci si tocchino. */}
          <View style={styles.linksRow}>
            {/* paddingVertical uguale a quello dell'atom Link: le due voci hanno la stessa
                area di tocco e restano allineate fra loro e ai bordi dei campi sopra */}
            <Pressable onPress={() => router.push('/(auth)/recover')} style={styles.plainLinkZone}>
              <Text style={[styles.plainLink, { color: Colors[colorScheme].textColor }]}>
                {t('login.forgotPassword')}
              </Text>
            </Pressable>

            <View style={styles.rightLinkZone}>
              <Link label={t('standard.signupCta')} onPress={() => router.replace('/(auth)/signup')} />
            </View>
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
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // In RN flexShrink è 0 di default: senza questi due, se le label crescono la riga sborda a destra
  // invece di stringersi, e il link finisce oltre il bordo dei campi
  plainLinkZone: { paddingVertical: 12, paddingHorizontal: 10, flexShrink: 1 },
  rightLinkZone: { paddingHorizontal: 10, flexShrink: 1, alignItems: 'flex-end' },
  // Stessa scala tipografica dell'atom Link (14/600): le due voci della riga pesano uguale
  plainLink: { fontSize: 14, fontWeight: '600', opacity: 0.75 },
});
