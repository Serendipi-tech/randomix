import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { tokenStorage } from '@/utils/tokenStorage';

export default function ConsentScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const handleAccept = async () => {
    await tokenStorage.setEmailConsent(true);
    router.replace('/(app)');
  };

  const handleDecline = async () => {
    await tokenStorage.setEmailConsent(false);
    router.replace('/(app)');
  };

  const s = styles(colors);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.inner}>
        <View style={s.content}>
          <Text style={s.title}>Rimani aggiornato</Text>
          <Text style={s.description}>
            Vuoi ricevere aggiornamenti su nuove funzionalità, consigli e novità di RandoMIX
            via email?
          </Text>
          <Text style={s.note}>
            Puoi cambiare idea in qualsiasi momento dalle impostazioni del profilo.
          </Text>
        </View>

        <View style={s.actions}>
          <Pressable style={[s.button, s.buttonPrimary]} onPress={handleAccept}>
            <Text style={s.buttonTextPrimary}>Sì, tienimi aggiornato</Text>
          </Pressable>

          <Pressable style={[s.button, s.buttonSecondary]} onPress={handleDecline}>
            <Text style={s.buttonTextSecondary}>No grazie</Text>
          </Pressable>
        </View>
      </View>
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
      paddingVertical: 32,
      justifyContent: 'space-between',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      gap: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
    },
    description: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    note: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    actions: {
      gap: 12,
    },
    button: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonPrimary: {
      backgroundColor: '#208AEF',
    },
    buttonSecondary: {
      backgroundColor: colors.backgroundElement,
    },
    buttonTextPrimary: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonTextSecondary: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
  });
