import { type ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type PageHeaderProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  title: string;
  onBack?: () => void;
  subtitle?: string;
};

/** Intestazione di pagina: icona su gradient fisso + titolo, back opzionale a destra e sottotitolo opzionale. */
export function PageHeader({ icon: Icon, title, onBack, subtitle }: PageHeaderProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <View style={styles.content}>
          <LinearGradient
            colors={[colors.secondary, colors.secondaryGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.icon}
          >
            <Icon size={24} color={colors.border} />
          </LinearGradient>
          <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
        </View>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={10}>
            <ChevronLeft size={24} color={colors.textColor} />
          </Pressable>
        )}
      </View>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textColor }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  // Sottotitolo attenuato via opacity sul textColor (come SectionLabel), invece di un grigio hardcoded
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    opacity: 0.6,
  },
});
