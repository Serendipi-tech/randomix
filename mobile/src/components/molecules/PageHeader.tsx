import { type ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';

type PageHeaderAction = {
  icon: ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
};

type PageHeaderProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  title: string;
  onBack?: () => void;
  subtitle?: string;
  action?: PageHeaderAction;
};

/** Intestazione di pagina: icona su gradient fisso + titolo, back e/o azione extra opzionali (icona e onPress passati dal chiamante) a destra, sottotitolo opzionale. */
export function PageHeader({ icon: Icon, title, onBack, subtitle, action }: PageHeaderProps) {
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
            <Icon size={24} color={colors.textColor} />
          </LinearGradient>
          <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
        </View>
        {(action || onBack) && (
          <View style={styles.actions}>
            {action && (
              <Pressable onPress={action.onPress} hitSlop={10}>
                <action.icon size={24} color={colors.textColor} />
              </Pressable>
            )}
            {onBack && (
              <Pressable onPress={onBack} hitSlop={10}>
                <ChevronLeft size={24} color={colors.textColor} />
              </Pressable>
            )}
          </View>
        )}
      </View>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textColor }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: 30,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  actions: {
    flexDirection: 'row',
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
