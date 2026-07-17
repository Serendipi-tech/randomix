import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accent, Colors, DiceShading, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthButton } from '@/components/atoms/auth-button';
import { AuthInput } from '@/components/atoms/auth-input';
import { SelectableChip } from '@/components/atoms/selectable-chip';
import { useRandomizer } from '@/utils/useRandomizer';

const MODES = ['numbers', 'letters', 'colors', 'dice'] as const;
type Mode = (typeof MODES)[number];

// rotazione dei colori accent per i risultati
const ACCENT_CYCLE = [Accent.primary, Accent.coral, Accent.yellow, Accent.mint, Accent.violet];

export default function RandomizerScreen() {
  const { t } = useTranslation('randomizer');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { generateNumbers, generateLetters, generateColors, generateDice, loading, error } =
    useRandomizer();

  const [mode, setMode] = useState<Mode>('numbers');
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [faces, setFaces] = useState('6');
  const [results, setResults] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const switchMode = (next: Mode) => {
    setMode(next);
    setResults([]);
    setLocalError(null);
  };

  const generate = async () => {
    setLocalError(null);
    const n = parseInt(count, 10);
    if (Number.isNaN(n)) {
      setLocalError(t('invalidInput'));
      return;
    }
    try {
      if (mode === 'numbers') {
        const lo = parseInt(min, 10);
        const hi = parseInt(max, 10);
        if (Number.isNaN(lo) || Number.isNaN(hi)) {
          setLocalError(t('invalidInput'));
          return;
        }
        setResults((await generateNumbers(lo, hi, n)).map(String));
      } else if (mode === 'letters') {
        setResults(await generateLetters(n));
      } else if (mode === 'colors') {
        setResults(await generateColors(n));
      } else {
        const f = parseInt(faces, 10);
        if (Number.isNaN(f)) {
          setLocalError(t('invalidInput'));
          return;
        }
        setResults((await generateDice(n, f)).map(String));
      }
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const displayError = localError ?? error?.message ?? null;
  const diceTotal = results.reduce((sum, value) => sum + Number(value), 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={[styles.back, { color: colors.textSecondary }]}>{t('back')}</Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>
        </View>

        <View style={styles.chipWrap}>
          {MODES.map((m) => (
            <SelectableChip
              key={m}
              label={t(`modes.${m}`)}
              selected={mode === m}
              onPress={() => switchMode(m)}
              colorScheme={colorScheme}
            />
          ))}
        </View>

        <View style={styles.inputRow}>
          {mode === 'numbers' && (
            <>
              <AuthInput
                colorScheme={colorScheme}
                placeholder={t('minPlaceholder')}
                keyboardType="number-pad"
                value={min}
                onChangeText={setMin}
                style={styles.inputFlex}
              />
              <AuthInput
                colorScheme={colorScheme}
                placeholder={t('maxPlaceholder')}
                keyboardType="number-pad"
                value={max}
                onChangeText={setMax}
                style={styles.inputFlex}
              />
            </>
          )}
          {mode === 'dice' && (
            <AuthInput
              colorScheme={colorScheme}
              placeholder={t('facesPlaceholder')}
              keyboardType="number-pad"
              value={faces}
              onChangeText={setFaces}
              style={styles.inputFlex}
            />
          )}
          <AuthInput
            colorScheme={colorScheme}
            placeholder={t('countPlaceholder')}
            keyboardType="number-pad"
            value={count}
            onChangeText={setCount}
            style={styles.inputFlex}
          />
        </View>

        {displayError && <Text style={styles.error}>{displayError}</Text>}

        <AuthButton
          colorScheme={colorScheme}
          label={t('generate')}
          onPress={generate}
          loading={loading}
        />

        {results.length > 0 && (
          <View style={styles.resultWrap}>
            {results.map((value, i) => {
              if (mode === 'colors') {
                return (
                  <View key={`${value}-${i}`} style={styles.colorResult}>
                    <View style={[styles.colorSwatch, { backgroundColor: value }]} />
                    <Text style={[styles.colorHex, { color: colors.textSecondary }]}>{value}</Text>
                  </View>
                );
              }
              if (mode === 'dice') {
                return (
                  <View key={`${value}-${i}`} style={styles.diceFace}>
                    <Text style={styles.diceText}>{value}</Text>
                  </View>
                );
              }
              return (
                <View
                  key={`${value}-${i}`}
                  style={[
                    styles.resultChip,
                    { backgroundColor: ACCENT_CYCLE[i % ACCENT_CYCLE.length] },
                  ]}>
                  <Text style={styles.resultText}>{value}</Text>
                </View>
              );
            })}
          </View>
        )}

        {mode === 'dice' && results.length > 1 && (
          <Text style={[styles.total, { color: colors.textSecondary }]}>
            {t('total')}: {diceTotal}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  topBar: {
    gap: Spacing.two,
  },
  back: {
    fontSize: 15,
    fontFamily: 'Nunito_500Medium',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Fredoka_700Bold',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  inputFlex: {
    flex: 1,
    // senza minWidth gli input non si restringono e sfondano la riga
    minWidth: 0,
  },
  error: {
    fontSize: 14,
    color: '#E53E3E',
    textAlign: 'center',
    fontFamily: 'Nunito_500Medium',
  },
  resultWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  resultChip: {
    minWidth: 56,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  resultText: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Fredoka_700Bold',
  },
  // faccia di dado: stessi token pseudo-3D del logo
  diceFace: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: DiceShading.face,
    borderWidth: 2,
    borderColor: DiceShading.border,
    shadowColor: DiceShading.shadowEdge,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  diceText: {
    fontSize: 24,
    color: DiceShading.pip,
    fontFamily: 'Fredoka_700Bold',
  },
  colorResult: {
    alignItems: 'center',
    gap: 4,
  },
  colorSwatch: {
    width: 64,
    height: 64,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  colorHex: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
  total: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Nunito_700Bold',
  },
});
