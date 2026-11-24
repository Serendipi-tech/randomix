import { forwardRef } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

export type OnboardingSlide = {
  image: ImageSourcePropType;
  lead: string;
  accent: string;
  body: string;
};

type OnboardingSlidesProps = {
  colorScheme: 'light' | 'dark';
  slides: OnboardingSlide[];
  slideWidth: number;
  slideHeight: number;
  onMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

/** Carosello dell'onboarding: per ogni slide immagine sopra, titolo e testo sotto. Scorrimento orizzontale a pagine. */
export const OnboardingSlides = forwardRef<ScrollView, OnboardingSlidesProps>(
  ({ colorScheme, slides, slideWidth, slideHeight, onMomentumScrollEnd }, ref) => {
    const colors = Colors[colorScheme];
    const textColor = colors.textColor;

    return (
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {slides.map((slide) => (
          <View key={slide.accent} style={[styles.slide, { width: slideWidth, height: slideHeight }]}>
            <View style={[styles.group, { width: slideWidth }]}>
              <Image
                source={slide.image}
                style={{ width: slideWidth * 0.62, height: slideWidth * 0.62 }}
                resizeMode="contain"
              />

              <View style={styles.textZone}>
                <Text style={styles.title}>
                  <Text style={{ color: textColor }}>{slide.lead}</Text>
                  {'\n'}
                  <Text style={{ color: colors.secondary }}>{slide.accent}</Text>
                </Text>
                <Text style={[styles.body, { color: textColor }]}>{slide.body}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }
);

OnboardingSlides.displayName = 'OnboardingSlides';

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  // Senza flexGrow il content container si dimensiona sul contenuto e la slide resta alta
  // quanto immagine + testi: non ci sarebbe spazio libero su cui centrare nulla.
  scrollContent: { flexGrow: 1 },
  slide: { alignItems: 'center', justifyContent: 'center' },
  // Immagine e testi stanno in questo unico container, ed è il container a essere centrato.
  // Larghezza passata in numero: le percentuali qui dentro non avrebbero un riferimento certo.
  group: { alignItems: 'center' },
  // Spaziatura simmetrica: i testi restano centrati nella fascia che occupano, fra immagine e pallini
  textZone: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    lineHeight: 37,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    fontFamily: Fonts?.rounded,
  },
  body: { fontSize: 15, lineHeight: 21, textAlign: 'center', opacity: 0.8 },
});
