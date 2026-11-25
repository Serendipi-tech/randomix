import { useRouter } from 'expo-router';
import { useState } from 'react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Coins,
  Dices,
  Hand,
  HandFist,
  Hash,
  Palette,
  Scissors,
  Shuffle,
  Sparkles,
  Type,
  Users,
  Wine,
} from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { Button } from '@/components/atoms/Button';
import { Chip } from '@/components/atoms/Chip';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { Stepper } from '@/components/atoms/Stepper';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ModeGrid, type ModeGridItem } from '@/components/randomizer/ModeGrid';
import { CustomFacesChip } from '@/components/randomizer/CustomFacesChip';
import { NumberResults } from '@/components/randomizer/NumberResults';
import { LetterResults } from '@/components/randomizer/LetterResults';
import { ColorResults } from '@/components/randomizer/ColorResults';
import { DiceResults } from '@/components/randomizer/DiceResults';
import { CustomFacesSheet } from '@/components/randomizer/CustomFacesSheet';
import { ParticipantsSheet } from '@/components/randomizer/ParticipantsSheet';
import { BottleSpinner, BOTTLE_SPIN_DURATION } from '@/components/randomizer/BottleSpinner';
import { CoinResults, type CoinSide } from '@/components/randomizer/CoinResults';
import { Switch } from '@/components/atoms/Switch';
import { useRandomizer } from '@/utils/useRandomizer';
import type { RockPaperScissorsChoice } from '@/utils/random';

type Mode = 'numbers' | 'letters' | 'colors' | 'dice' | 'bottle' | 'coin' | 'rps';

const COMMON_FACES = [4, 6, 8, 10, 12, 20];
const DEFAULT_CUSTOM_FACES = 7;

// Icona rappresentativa per ogni esito di "Carta Forbice Pietra"
const RPS_ICONS: Record<RockPaperScissorsChoice, ComponentType<{ size?: number; color?: string }>> = {
  rock: HandFist,
  paper: Hand,
  scissors: Scissors,
};

export default function RandomizerScreen() {
  const { t } = useTranslation('randomizer');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const {
    generateNumbers,
    generateLetters,
    generateColors,
    generateDice,
    drawWinnerIndex,
    generateRockPaperScissors,
    loading,
    error,
  } = useRandomizer();

  const [mode, setMode] = useState<Mode | null>(null);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [faces, setFaces] = useState(6);
  const [diceCount, setDiceCount] = useState(2);
  const [results, setResults] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [facesSheetOpen, setFacesSheetOpen] = useState(false);

  const [names, setNames] = useState<string[]>([]);
  const [participantsSheetOpen, setParticipantsSheetOpen] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  // Cambia a ogni giro per far ripartire l'animazione della bottiglia e della moneta
  const [spinKey, setSpinKey] = useState(0);
  // Tiene il bottone occupato per tutta la durata del giro, non solo della query
  const [spinBusy, setSpinBusy] = useState(false);

  // Nessun selettore di modalità: senza partecipanti il giro è solo visivo, con due o più si estrae
  const withNames = names.length > 0;

  // Senza ripetizioni non si possono estrarre più numeri di quanti ne contiene il range
  const numberMaxCount = allowRepeats ? 100 : Math.min(100, Math.max(1, max - min + 1));

  // Spegnendo le ripetizioni il conteggio può superare il nuovo tetto: lo riporto dentro
  const onAllowRepeatsChange = (next: boolean) => {
    setAllowRepeats(next);
    if (!next) setCount((c) => Math.min(c, Math.min(100, Math.max(1, max - min + 1))));
  };

  const resetBottle = () => {
    setWinnerIndex(null);
    setSpinKey(0);
    setSpinBusy(false);
  };

  const openMode = (next: string) => {
    setMode(next as Mode);
    setResults([]);
    setLocalError(null);
    resetBottle();
  };

  const goBack = () => {
    if (mode) {
      setMode(null);
      setResults([]);
      setLocalError(null);
      resetBottle();
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
        setResults((await generateNumbers(min, max, count, allowRepeats)).map(String));
      } else if (mode === 'letters') {
        setResults(await generateLetters(count));
      } else if (mode === 'colors') {
        setResults(await generateColors(count));
      } else if (mode === 'dice') {
        setResults((await generateDice(diceCount, faces)).map(String));
      } else if (mode === 'bottle') {
        await spinBottle();
      } else if (mode === 'coin') {
        // Una sola estrazione 0/1: 0 = testa, 1 = croce
        const [drawn] = await generateNumbers(0, 1, 1);
        const side: CoinSide = drawn === 0 ? 'heads' : 'tails';
        setResults([side]);
        setSpinKey((k) => k + 1);
      } else if (mode === 'rps') {
        setResults([await generateRockPaperScissors()]);
      }
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  /** Con i partecipanti estrae prima il vincitore e poi fa fermare lì la bottiglia; senza nomi
   *  il giro è puramente visivo. */
  const spinBottle = async () => {
    if (withNames) {
      if (names.length < 2) {
        setLocalError(t('bottle.minNames'));
        return;
      }
      setWinnerIndex(await drawWinnerIndex(names.length));
    } else {
      setWinnerIndex(null);
    }

    setSpinKey((k) => k + 1);
    setSpinBusy(true);
    setTimeout(() => setSpinBusy(false), BOTTLE_SPIN_DURATION);
  };

  const displayError = localError ?? error?.message ?? null;

  // Esito corrente della modalità "Carta Forbice Pietra", estratto da `results`
  const rpsChoice = mode === 'rps' ? (results[0] as RockPaperScissorsChoice | undefined) : undefined;

  const modeItems: ModeGridItem[] = [
    { key: 'numbers', icon: Hash, label: t('modes.numbers'), tint: colors.extraColors.nine },
    { key: 'letters', icon: Type, label: t('modes.letters'), tint: colors.extraColors.six },
    { key: 'colors', icon: Palette, label: t('modes.colors'), tint: colors.extraColors.eight },
    { key: 'dice', icon: Dices, label: t('modes.dice'), tint: colors.extraColors.four },
    { key: 'bottle', icon: Wine, label: t('modes.bottle'), tint: colors.extraColors.five },
    { key: 'coin', icon: Coins, label: t('modes.coin'), tint: colors.extraColors.two },
    { key: 'rps', icon: Scissors, label: t('modes.rps'), tint: colors.extraColors.seven },
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
              <SectionLabel>{t('fields.range')}</SectionLabel>
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
              <SectionLabel>{t('fields.count')}</SectionLabel>
              {/* Stepper e toggle sulla stessa riga: il toggle cambia il significato del conteggio */}
              <View style={styles.countRow}>
                <View style={styles.countItem}>
                  <Stepper value={count} min={1} max={numberMaxCount} onChange={setCount} />
                </View>
                <View style={[styles.countItem, styles.toggleControl]}>
                  <Text style={[styles.toggleLabel, { color: colors.textColor }]}>
                    {t('fields.allowRepeats')}
                  </Text>
                  <Switch value={allowRepeats} onChange={onAllowRepeatsChange} />
                </View>
              </View>
            </View>
          </>
        )}

        {mode === 'letters' && (
          <View style={styles.panel}>
            <SectionLabel>{t('fields.count')}</SectionLabel>
            <Stepper value={count} min={1} max={26} onChange={setCount} />
          </View>
        )}

        {mode === 'colors' && (
          <View style={styles.panel}>
            <SectionLabel>{t('fields.count')}</SectionLabel>
            <Stepper value={count} min={1} max={100} onChange={setCount} />
          </View>
        )}

        {mode === 'dice' && (
          <>
            <View style={styles.panel}>
              <SectionLabel>{t('fields.diceType')}</SectionLabel>
              {/* Celle di uguale larghezza, quattro per riga: i chip a contenuto andavano a capo
                  in modo irregolare perché "other" è molto più largo di "d4" */}
              <View style={styles.chipGrid}>
                {COMMON_FACES.map((f) => (
                  <View key={f} style={styles.chipCell}>
                    <Chip label={`d${f}`} selected={faces === f} onPress={() => setFaces(f)} />
                  </View>
                ))}
                <View style={styles.chipCellWide}>
                  <CustomFacesChip
                    label={COMMON_FACES.includes(faces) ? t('fields.other') : `d${faces}`}
                    selected={!COMMON_FACES.includes(faces)}
                    onPress={() => setFacesSheetOpen(true)}
                  />
                </View>
              </View>
            </View>
            <View style={styles.panel}>
              <SectionLabel>{t('fields.diceCount')}</SectionLabel>
              <Stepper value={diceCount} min={1} max={20} onChange={setDiceCount} />
            </View>
          </>
        )}

        {mode === 'bottle' && (
          <View style={styles.panel}>
            <Button
              variant="secondary"
              icon={Users}
              label={withNames ? t('bottle.participantsCount', { count: names.length }) : t('bottle.participants')}
              onPress={() => setParticipantsSheetOpen(true)}
            />
            {!withNames && (
              <Text style={[styles.hint, { color: colors.textColor }]}>{t('bottle.spinOnlyHint')}</Text>
            )}
          </View>
        )}

        {mode && displayError && <Text style={[styles.error, { color: colors.error }]}>{displayError}</Text>}

        {mode && (
          <Button
            label={
              mode === 'bottle' ? t('bottle.spin') : mode === 'coin' ? t('coin.flip') : t('generate')
            }
            onPress={generate}
            loading={mode === 'bottle' ? spinBusy || loading : loading}
            icon={Sparkles}
          />
        )}

        {mode === 'coin' && (
          <View style={styles.resultArea}>
            {/* la moneta è a schermo anche prima del primo lancio: flipKey 0 = ferma su testa */}
            <CoinResults side={(results[0] as CoinSide) ?? 'heads'} flipKey={spinKey} />
          </View>
        )}

        {mode === 'bottle' && (
          <View style={styles.resultArea}>
            {/* key: ogni lancio rimonta la ruota, che riparte da ferma senza stato da azzerare */}
            <BottleSpinner
              key={spinKey}
              names={names}
              winnerIndex={winnerIndex}
              spinning={spinKey > 0}
            />
          </View>
        )}

        {mode && results.length > 0 && (
          <View style={styles.resultArea}>
            {mode === 'numbers' && <NumberResults values={results} />}
            {mode === 'letters' && <LetterResults values={results} />}
            {mode === 'colors' && <ColorResults values={results} />}
            {mode === 'dice' && <DiceResults values={results} faces={faces} totalLabel={t('total')} />}
            {mode === 'rps' && rpsChoice && (
              <View style={styles.rpsResult}>
                {(() => {
                  const RpsIcon = RPS_ICONS[rpsChoice];
                  return <RpsIcon size={96} color={colors.textColor} />;
                })()}
                <Text style={[styles.rpsLabel, { color: colors.textColor }]}>
                  {t(`rps.${rpsChoice}`)}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <ParticipantsSheet
        visible={participantsSheetOpen}
        names={names}
        namePlaceholder={t('bottle.namePlaceholder')}
        emptyLabel={t('bottle.noParticipants')}
        onClose={() => setParticipantsSheetOpen(false)}
        onChange={(next) => {
          setNames(next);
          // cambiare i partecipanti invalida il giro precedente
          resetBottle();
        }}
      />

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
  // Niente padding in alto: lo stacco dall'header lo dà già il suo paddingBottom.
  // flexGrow: il contenuto occupa almeno tutta l'altezza, così l'area risultati può prendersi
  // lo spazio avanzato e centrarci dentro le celle.
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  panel: {
    gap: Spacing.two,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  // Stesse metà del range qui sopra: stepper e toggle occupano la stessa larghezza
  countItem: {
    flex: 1,
  },
  toggleControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  rangeItem: {
    flex: 1,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  // Quattro per riga: 4 celle al 23% + 3 gap da 8px stanno dentro la larghezza disponibile
  chipCell: {
    width: '23%',
  },
  // "Other" occupa due celle: 23% + 23% più il gap che le separa
  chipCellWide: {
    width: '48%',
  },
  hint: {
    fontSize: 14,
    opacity: 0.6,
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
  },
  resultArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpsResult: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  rpsLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
});
