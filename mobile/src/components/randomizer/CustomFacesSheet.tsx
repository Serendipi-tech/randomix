import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Button } from '@/components/atoms/Button';
import { Stepper } from '@/components/atoms/Stepper';

type CustomFacesSheetProps = {
  visible: boolean;
  initialValue: number;
  title: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: (faces: number) => void;
};

const MIN_FACES = 2;
const MAX_FACES = 120;

/** Sheet per impostare un numero di facce custom (2-120), al posto di un prompt nativo. */
export function CustomFacesSheet({ visible, initialValue, title, confirmLabel, onClose, onConfirm }: CustomFacesSheetProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [draft, setDraft] = useState(initialValue);
  // Riallinea il draft all'apertura, senza useEffect: aggiustamento di stato durante il render
  // (pattern React ufficiale), non una sincronizzazione con un sistema esterno.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setDraft(initialValue);
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
        <View style={styles.stepperWrap}>
          <Stepper value={draft} min={MIN_FACES} max={MAX_FACES} onChange={setDraft} />
        </View>
        <Button label={confirmLabel} onPress={() => onConfirm(draft)} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  stepperWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
});
