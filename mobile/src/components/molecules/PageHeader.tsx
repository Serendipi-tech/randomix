import { type ComponentType } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/utils/useAppTheme';
import { RandoLogo } from '@/components/molecules/rando-logo';

type PageHeaderAction = {
  icon: ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
};

type PageHeaderProps = {
  /** Ritorno indietro: senza questo la cella di sinistra resta vuota. */
  onBack?: () => void;
  /** Azione specifica della pagina (aggiungi, modifica…), a destra. */
  action?: PageHeaderAction;
};

// Logo ridotto: stessa immagine usata fuori dall'app, qui alla misura di una riga d'intestazione
const LOGO_SIZE = 44;
const ICON_SIZE = 24;

/** Intestazione di pagina a tre celle: indietro a sinistra, logo dell'app al centro, azione della
 *  pagina a destra. Nessun titolo: il nome della pagina non compare mai. Le celle laterali hanno
 *  lo stesso peso, così il logo resta centrato anche quando una delle due è vuota. */
export function PageHeader({ onBack, action }: PageHeaderProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.row}>
      <View style={[styles.side, styles.left]}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={10}>
            <ChevronLeft size={ICON_SIZE} color={colors.textColor} />
          </Pressable>
        )}
      </View>

      <RandoLogo size={LOGO_SIZE} />

      <View style={[styles.side, styles.right]}>
        {action && (
          <Pressable onPress={action.onPress} hitSlop={10}>
            <action.icon size={ICON_SIZE} color={colors.textColor} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    // 10px in meno sopra e sotto rispetto ai passi del tema (16 e 24), piu' 5px di respiro in alto
    paddingTop: Spacing.three - 10 + 5,
    paddingBottom: Spacing.four - 10,
    gap: 12,
  },
  // Stesso peso a destra e a sinistra: il logo sta al centro della riga, non del contenuto
  side: {
    flex: 1,
    justifyContent: 'center',
    minHeight: ICON_SIZE,
  },
  left: {
    alignItems: 'flex-start',
  },
  right: {
    alignItems: 'flex-end',
  },
});
