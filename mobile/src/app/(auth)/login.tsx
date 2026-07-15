import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/utils/useAuth';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { loginWithCredentials, loginWithGoogle, loading, error } = useAuth();

  const [_request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        loginWithGoogle(idToken).catch((e: Error) => setLocalError(e.message));
      } else {
        setLocalError('Impossibile ottenere il token Google.');
      }
    }
  }, [response]);

  const handleCredentialsLogin = async () => {
    setLocalError(null);
    if (!email.trim() || !password) {
      setLocalError('Inserisci email e password.');
      return;
    }
    try {
      await loginWithCredentials(email.trim(), password);
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const displayError = localError ?? error?.message ?? null;

  const s = styles(colors);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.header}>
          <Text style={s.appName}>RandoMIX</Text>
          <Text style={s.subtitle}>Accedi al tuo account</Text>
        </View>

        <View style={s.form}>
          <TextInput
            style={s.input}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={s.input}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {displayError && <Text style={s.error}>{displayError}</Text>}

          <Pressable
            style={[s.button, s.buttonPrimary, loading && s.buttonDisabled]}
            onPress={handleCredentialsLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.buttonTextPrimary}>Accedi</Text>
            )}
          </Pressable>

          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>oppure</Text>
            <View style={s.dividerLine} />
          </View>

          <Pressable
            style={[s.button, s.buttonGoogle, loading && s.buttonDisabled]}
            onPress={() => promptAsync()}
            disabled={loading}
          >
            <Text style={s.buttonTextGoogle}>Continua con Google</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/(auth)/register')} style={s.registerLink}>
          <Text style={s.registerLinkText}>Non hai un account? Registrati</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inner: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
      gap: 32,
    },
    header: {
      alignItems: 'center',
      gap: 8,
    },
    appName: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    form: {
      gap: 12,
    },
    input: {
      backgroundColor: colors.backgroundElement,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
    },
    error: {
      fontSize: 14,
      color: '#E53E3E',
      textAlign: 'center',
    },
    button: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonPrimary: {
      backgroundColor: '#208AEF',
    },
    buttonGoogle: {
      backgroundColor: colors.backgroundElement,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonTextPrimary: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonTextGoogle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginVertical: 4,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.backgroundSelected,
    },
    dividerText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    registerLink: {
      alignItems: 'center',
    },
    registerLinkText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
