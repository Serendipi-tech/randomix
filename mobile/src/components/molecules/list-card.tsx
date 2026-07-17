import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface ListCardProps {
  name: string;
  icon: string;
  color: string;
  description: string | null;
  colorScheme: 'light' | 'dark';
  onPress?: () => void;
}

/** Card di una lista personale: chip colorato con icona, nome e descrizione opzionale. */
export function ListCard({ name, icon, color, description, colorScheme, onPress }: ListCardProps) {
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.backgroundElement }]}>
      <View style={[styles.iconChip, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textZone}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        {description ? (
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 20,
    padding: 16,
  },
  iconChip: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  textZone: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Fredoka_700Bold',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Nunito_500Medium',
  },
});
