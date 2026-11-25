import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Input } from '@/components/molecules/Input';
import { Tag } from '@/components/atoms/Tag';

type ParticipantsSheetProps = {
  visible: boolean;
  names: string[];
  /** Ogni aggiunta/rimozione arriva subito al chiamante, come negli altri picker dell'app. */
  onChange: (names: string[]) => void;
  onClose: () => void;
  namePlaceholder: string;
  emptyLabel: string;
};

// Oltre i dieci le pillole sulla ruota diventano illeggibili
const MAX_NAMES = 10;

/** Bottomsheet dei partecipanti alla bottiglia: campo + "＋" per aggiungere, elenco a chip con ✕
 *  per rimuovere. Stessa struttura di TagPickerSheet (riga d'azione in alto, lista sotto). */
export function ParticipantsSheet({
  visible,
  names,
  onChange,
  onClose,
  namePlaceholder,
  emptyLabel,
}: ParticipantsSheetProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [draft, setDraft] = useState('');

  const trimmed = draft.trim();
  const canAdd = trimmed.length > 0 && names.length < MAX_NAMES;

  const addName = () => {
    if (!canAdd) return;
    onChange([...names, trimmed]);
    setDraft('');
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.addRow}>
        <Input
          variant="text"
          value={draft}
          onChangeText={setDraft}
          placeholder={namePlaceholder}
          autoCapitalize="words"
          onSubmitEditing={addName}
          style={styles.addInput}
        />
        <Pressable
          onPress={addName}
          disabled={!canAdd}
          style={[styles.addButton, { backgroundColor: colors.foreground, opacity: canAdd ? 1 : 0.5 }]}
        >
          <Plus size={22} color={colors.primary} strokeWidth={2.5} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {names.length === 0 ? (
          <Text style={[styles.empty, { color: colors.disabled }]}>{emptyLabel}</Text>
        ) : (
          <View style={styles.grid}>
            {names.map((name, i) => (
              <Tag
                key={`${name}-${i}`}
                name={name}
                color={colors.primary}
                onRemove={() => onChange(names.filter((_, index) => index !== i))}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  addInput: {
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  empty: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
