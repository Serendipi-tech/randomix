import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

type OnboardingDotsProps = {
  colorScheme: 'light' | 'dark';
  count: number;
  activeIndex: number;
};

/** Indicatore di scorrimento del carosello: un pallino per slide, quello attivo in evidenza. */
export function OnboardingDots({ colorScheme, count, activeIndex }: OnboardingDotsProps) {
  const colors = Colors[colorScheme];

  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor:
                i === activeIndex ? colors.secondary : hexToRgba(colors.textColor, 0.25),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
