import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dices, Hash, Palette, Shuffle, Sparkles, Type } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { Button } from '@/components/atoms/Button';
import { Chip } from '@/components/atoms/Chip';
import { Stepper } from '@/components/atoms/Stepper';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ModeGrid, type ModeGridItem } from '@/components/randomizer/ModeGrid';
import { NumberResults } from '@/components/randomizer/NumberResults';
import { LetterResults } from '@/components/randomizer/LetterResults';
import { ColorResults } from '@/components/randomizer/ColorResults';
import { DiceResults } from '@/components/randomizer/DiceResults';
import { CustomFacesSheet } from '@/components/randomizer/CustomFacesSheet';
import { useRandomizer } from '@/utils/useRandomizer';

type Mode = 'numbers' | 'letters' | 'colors' | 'dice';

const COMMON_FACES = [4, 6, 8, 10, 12, 20];
const DEFAULT_CUSTOM_FACES = 7;

export default function RandomizerScreen() {
  const { t } = useTranslation('randomizer');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { generateNumbers, generateLetters, generateColors, generateDice, loading, error } =
    useRandomizer();

  const [mode, setMode] = useState<Mode | null>(null);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [faces, setFaces] = useState(6);
  const [diceCount, setDiceCount] = useState(2);
  const [results, setResults] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [facesSheetOpen, setFacesSheetOpen] = useState(false);

  const numberMaxCount = Math.min(100, Math.max(1, max - min + 1));

  const openMode = (next: string) => {
    setMode(next as Mode);
    setResults([]);
    setLocalError(null);
  };

  const goBack = () => {
    if (mode) {
      setMode(null);
      setResults([]);
      setLocalError(null);
    } else {
      router.back();
    }
  };

  const generate = async () => {
    setLocalError(null);
    try {
      if (mode === 'numbers') {
        if (min > max) {
          setLocalError(t('invalidInput'));
          return;
        }
        setResults((await generateNumbers(min, max, count)).map(String));
      } else if (mode === 'letters') {
        setResults(await generateLetters(count));
      } else if (mode === 'colors') {
        setResults(await generateColors(count));
      } else if (mode === 'dice') {
        setResults((await generateDice(diceCount, faces)).map(String));
      }
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const displayError = localError ?? error?.message ?? null;

  const modeItems: ModeGridItem[] = [
    { key: 'numbers', icon: Hash, label: t('modes.numbers'), hint: t('hints.numbers'), tint: colors.extraColors.three },
    { key: 'letters', icon: Type, label: t('modes.letters'), hint: t('hints.letters'), tint: colors.extraColors.six },
    { key: 'colors', icon: Palette, label: t('modes.colors'), hint: t('hints.colors'), tint: colors.extraColors.eight },
    { key: 'dice', icon: Dices, label: t('modes.dice'), hint: t('hints.dice'), tint: colors.secondary },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader icon={Shuffle} title={mode ? t(`modes.${mode}`) : t('title')} onBack={goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!mode && <ModeGrid items={modeItems} onSelect={openMode} />}

        {mode === 'numbers' && (
          <>
            <View style={styles.panel}>
              <Text style={[styles.fieldLabel, { color: colors.textColor }]}>{t('fields.range')}</Text>
              <View style={styles.rangeRow}>
                <View style={styles.rangeItem}>
                  <Stepper value={min} min={-999} max={max - 1} onChange={setMin} />
                </View>
                <View style={styles.rangeItem}>
                  <Stepper value={max} min={min + 1} max={999} onChange={setMax} />
                </View>
              </View>
            </View>
            <View style={styles.panel}>
              <Text style={[styles.fieldLabel, { color: colors.textColor }]}>{t('fields.count')}</Text>
              <Stepper value={count} min={1} max={numberMaxCount} onChange={setCount} />
            </View>
          </>
        )}

        {mode === 'letters' && (
          <View style={styles.panel}>
            <Text style={[styles.fieldLabel, { color: colors.textColor }]}>{t('fields.count')}</Text>
            <Stepper value={count} min={1} max={26} onChange={setCount} />
          </View>
        )}

        {mode === 'colors' && (
          <View style={styles.panel}>
            <Text style={[styles.fieldLabel, { color: colors.textColor }]}>{t('fields.count')}</Text>
            <Stepper value={count} min={1} max={100} onChange={setCount} />
          </View>
        )}

        {mode === 'dice' && (
          <>
            <View style={styles.panel}>
              <Text style={[styles.fieldLabel, { color: colors.textColor }]}>{t('fields.diceType')}</Text>
              <View style={styles.chipRow}>
                {COMMON_FACES.map((f) => (
                  <Chip key={f} label={`d${f}`} selected={faces === f} onPress={() => setFaces(f)} />
                ))}
                <Chip
                  label={COMMON_FACES.includes(faces) ? t('fields.other') : `d${faces}`}
                  selected={!COMMON_FACES.includes(faces)}
                  onPress={() => setFacesSheetOpen(true)}
                />
              </View>
            </View>
            <View style={styles.panel}>
              <Text style={[styles.fieldLabel, { color: colors.textColor }]}>{t('fields.diceCount')}</Text>
              <Stepper value={diceCount} min={1} max={20} onChange={setDiceCount} />
            </View>
          </>
        )}

        {mode && displayError && <Text style={[styles.error, { color: colors.error }]}>{displayError}</Text>}

        {mode && <Button label={t('generate')} onPress={generate} loading={loading} icon={Sparkles} />}

        {mode && results.length > 0 && (
          <View style={styles.resultArea}>
            {mode === 'numbers' && <NumberResults values={results} />}
            {mode === 'letters' && <LetterResults values={results} />}
            {mode === 'colors' && <ColorResults values={results} />}
            {mode === 'dice' && <DiceResults values={results} faces={faces} totalLabel={t('total')} />}
          </View>
        )}
      </ScrollView>

      <CustomFacesSheet
        visible={facesSheetOpen}
        initialValue={COMMON_FACES.includes(faces) ? DEFAULT_CUSTOM_FACES : faces}
        title={t('fields.customFacesTitle')}
        confirmLabel={t('fields.confirm')}
        onClose={() => setFacesSheetOpen(false)}
        onConfirm={(value) => {
          setFaces(value);
          setFacesSheetOpen(false);
        }}
      />
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
  panel: {
    gap: Spacing.two,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  rangeItem: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
  },
  resultArea: {
    alignItems: 'center',
  },
});
