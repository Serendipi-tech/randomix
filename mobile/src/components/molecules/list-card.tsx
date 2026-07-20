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

/** Card di una lista personale: barra accent del colore lista, chip icona e testi. */
export function ListCard({ name, icon, color, description, colorScheme, onPress }: ListCardProps) {
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.backgroundElement, borderLeftColor: color },
        pressed && styles.pressed,
      ]}>
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
      <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 22,
    borderLeftWidth: 5,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconChip: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  textZone: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 17,
  },
  description: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 24,
  },
});
