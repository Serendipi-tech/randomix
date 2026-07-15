import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/utils/useAuth';

export default function RegisterScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { registerWithCredentials, loading, error } = useAuth();

  const handleRegister = async () => {
    setLocalError(null);

    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      setLocalError('Compila tutti i campi.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Le password non coincidono.');
      return;
    }
    if (password.length < 8) {
      setLocalError('La password deve essere di almeno 8 caratteri.');
      return;
    }
    if (username.trim().length < 3) {
      setLocalError('Lo username deve essere di almeno 3 caratteri.');
      return;
    }

    try {
      await registerWithCredentials(email.trim(), password, username.trim());
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
          <Text style={s.title}>Crea account</Text>
          <Text style={s.subtitle}>Entra nel mondo di RandoMIX</Text>
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
            placeholder="Username"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={s.input}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={s.input}
            placeholder="Conferma password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {displayError && <Text style={s.error}>{displayError}</Text>}

          <Pressable
            style={[s.button, s.buttonPrimary, loading && s.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.buttonTextPrimary}>Registrati</Text>
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} style={s.backLink}>
          <Text style={s.backLinkText}>Hai già un account? Accedi</Text>
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
    title: {
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
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonTextPrimary: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    backLink: {
      alignItems: 'center',
    },
    backLinkText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
