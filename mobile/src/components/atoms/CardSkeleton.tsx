import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba, surfaceFillGradient } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';
import { SkeletonLine } from '@/components/atoms/SkeletonLine';

type CardSkeletonProps = {
  /** Riga più corta in cima, al posto del titolo della card. */
  titled?: boolean;
  /** Numero di righe di contenuto. Default 3. */
  rows?: number;
  /** Cerchio a sinistra delle righe (donut, avatar). */
  circleSize?: number;
  /** `gradient`: stesso guscio della card statistiche (bordo sfumato, raggio 20). */
  variant?: 'default' | 'gradient';
};

const ROW_HEIGHT = 12;

/** Placeholder di una card a righe: stesso guscio delle card reali, così la pagina ha subito la
 *  forma definitiva e il contenuto ci si incastra dentro senza spostare nulla. */
export function CardSkeleton({ titled = false, rows = 3, circleSize, variant = 'default' }: CardSkeletonProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const body = (
    <View style={styles.content}>
      {titled && <SkeletonLine width="40%" height={16} />}
      <View style={styles.row}>
        {circleSize !== undefined && (
          <SkeletonLine width={circleSize} height={circleSize} radius={circleSize / 2} />
        )}
        <View style={styles.rows}>
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonLine key={index} width={index % 2 === 0 ? '100%' : '70%'} height={ROW_HEIGHT} />
          ))}
        </View>
      </View>
    </View>
  );

  if (variant === 'gradient') {
    return (
      <CardShell
        variant="gradient"
        gradientBorderWidth={3}
        radius={20}
        padding={12}
        gradientColors={[hexToRgba(colors.border, 0.5), hexToRgba(colors.border, 0.3)]}
        backgroundGradient={surfaceFillGradient(colors.foreground, colors.primary, colors.extraColors.one)}
      >
        {body}
      </CardShell>
    );
  }

  return (
    <CardShell backgroundColor={colors.foreground} borderColor={hexToRgba(colors.border, 0.5)}>
      {body}
    </CardShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rows: {
    flex: 1,
    gap: 8,
  },
});
