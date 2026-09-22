import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { ColorPickerSheet } from '@/components/organisms/ColorPickerSheet';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import type { Tag as TagData } from '@/utils/useTags';

type TagCreateSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Se presente: modalità modifica, precompila nome/colore e chiama onUpdate invece di onCreate. */
  editingTag?: TagData | null;
  onCreate: (name: string, color: string) => Promise<void>;
  onUpdate: (id: string, name: string, color: string) => Promise<void>;
  saving: boolean;
  createTitle: string;
  editTitle: string;
  namePlaceholder: string;
  addLabel: string;
  saveLabel: string;
};

/** Bottomsheet dedicata a creazione/modifica di un tag: nome + colore (scelto dall'utente tra
 *  `extraColors`, stesso ColorPickerSheet usato per le liste). Si appoggia alla shell BottomSheet
 *  condivisa, che segue la tastiera (vedi useAnimatedKeyboard lì) così i campi restano sempre visibili. */
export function TagCreateSheet({
  visible,
  onClose,
  editingTag,
  onCreate,
  onUpdate,
  saving,
  createTitle,
  editTitle,
  namePlaceholder,
  addLabel,
  saveLabel,
}: TagCreateSheetProps) {
  const { t } = useTranslation('lists');
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const palette = Object.values(colors.extraColors);

  const [name, setName] = useState('');
  const [color, setColor] = useState(palette[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Precompila i campi quando si apre in modifica; li azzera quando si apre in creazione
  useEffect(() => {
    if (!visible) return;
    setName(editingTag?.name ?? '');
    setColor(editingTag?.color ?? palette[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editingTag]);

  const trimmed = name.trim();

  const handleSubmit = async () => {
    if (!trimmed) return;
    if (editingTag) {
      await onUpdate(editingTag.id, trimmed, color);
    } else {
      await onCreate(trimmed, color);
      setName('');
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textColor }]}>{editingTag ? editTitle : createTitle}</Text>

        <View style={styles.nameRow}>
          <Input
            value={name}
            onChangeText={setName}
            placeholder={namePlaceholder}
            autoFocus
            style={styles.nameInput}
          />
          <Button variant="soft" swatchColor={color} label={t('form.color')} onPress={() => setShowColorPicker(true)} />
        </View>

        <View style={styles.actions}>
          <View style={styles.action}>
            <Button variant="secondary" label={t('itemForm.cancel')} onPress={onClose} />
          </View>
          <View style={styles.action}>
            <Button
              variant="primary"
              label={editingTag ? saveLabel : addLabel}
              onPress={handleSubmit}
              loading={saving}
              disabled={!trimmed}
            />
          </View>
        </View>
      </View>

      <ColorPickerSheet
        visible={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        colors={palette}
        selected={color}
        onSelect={setColor}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  nameInput: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  action: {
    flex: 1,
  },
});
