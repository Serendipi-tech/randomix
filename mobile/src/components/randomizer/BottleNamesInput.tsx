import { Plus, X } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { Input } from '@/components/molecules/Input';
import { Link } from '@/components/atoms/Link';

type BottleNamesInputProps = {
  names: string[];
  onChange: (names: string[]) => void;
  addLabel: string;
  namePlaceholder: string;
};

/** Elenco di nomi modificabile (aggiungi/rimuovi/modifica riga), controllato dal chiamante.
 *  Usa il campo `Input` standard dell'app, così focus e stili restano quelli delle altre form. */
export function BottleNamesInput({
  names,
  onChange,
  addLabel,
  namePlaceholder,
}: BottleNamesInputProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const updateName = (index: number, value: string) => {
    onChange(names.map((n, i) => (i === index ? value : n)));
  };

  const removeName = (index: number) => {
    onChange(names.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.wrap}>
      {names.map((name, i) => (
        <View key={i} style={styles.row}>
          <Input
            value={name}
            onChangeText={(v) => updateName(i, v)}
            placeholder={namePlaceholder}
            autoCapitalize="words"
            style={styles.field}
          />
          <Pressable onPress={() => removeName(i)} hitSlop={10}>
            <X size={18} color={colors.disabled} />
          </Pressable>
        </View>
      ))}
      <Link label={addLabel} icon={Plus} onPress={() => onChange([...names, ''])} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    width: '100%',
  },
  field: {
    flex: 1,
  },
});
