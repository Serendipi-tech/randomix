import { forwardRef } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { Colors, DisplayFonts } from '@/constants/theme';
import { Title } from '@/components/molecules/title';

// L'immagine e' quadrata e dimensionata sul layout: poco piu' larga della slide (sborda di poco
// ai lati) ma limitata in altezza, cosi' su schermi bassi rimpicciolisce invece di debordare troppo.
const IMAGE_WIDTH_RATIO = 1.06;
const IMAGE_HEIGHT_RATIO = 0.68;
// Ombra dell'illustrazione: segue l'alpha del disegno, non il rettangolo dell'immagine.
// Android usa il filtro dropShadow (richiede Android 12+), iOS le shadow props native,
// che sulle immagini si modellano sui pixel non trasparenti. boxShadow non va bene: disegnerebbe
// l'ombra del riquadro.
const SHADOW_COLOR = '#000000';
const SHADOW_OPACITY = 0.85;
const SHADOW_BLUR = 10;
const SHADOW_OFFSET_Y = 6;

const imageShadowStyle = Platform.select({
  android: {
    filter: [
      {
        dropShadow: {
          offsetX: 0,
          offsetY: SHADOW_OFFSET_Y,
          standardDeviation: SHADOW_BLUR / 2,
          color: `rgba(0, 0, 0, ${SHADOW_OPACITY})`,
        },
      },
    ],
  },
  default: {
    shadowColor: SHADOW_COLOR,
    shadowOpacity: SHADOW_OPACITY,
    shadowRadius: SHADOW_BLUR,
    shadowOffset: { width: 0, height: SHADOW_OFFSET_Y },
  },
});
// Colonna di testo piu' stretta della slide, come nel preview: il body va a capo su 2-3 righe
const TEXT_WIDTH_RATIO = 0.8;

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
  /** Indice della slide a schermo: solo la sua illustrazione riceve l'oscillazione d'apertura */
  activeIndex: number;
  wobbleStyle: AnimatedStyle<ViewStyle>;
  onMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

/** Carosello dell'onboarding: per ogni slide immagine sopra, titolo e testo sotto. Scorrimento orizzontale a pagine. */
export const OnboardingSlides = forwardRef<ScrollView, OnboardingSlidesProps>(
  (
    { colorScheme, slides, slideWidth, slideHeight, activeIndex, wobbleStyle, onMomentumScrollEnd },
    ref
  ) => {
    const colors = Colors[colorScheme];
    const textColor = colors.textColor;
    const imageSize = Math.min(slideWidth * IMAGE_WIDTH_RATIO, slideHeight * IMAGE_HEIGHT_RATIO);

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
        {slides.map((slide, i) => (
          <View key={slide.accent} style={[styles.slide, { width: slideWidth, height: slideHeight }]}>
            <View style={[styles.group, { width: slideWidth }]}>
              <Animated.View style={[styles.imageBox, i === activeIndex && wobbleStyle]}>
                <Image
                  source={slide.image}
                  style={[imageShadowStyle, { width: imageSize, height: imageSize }]}
                  resizeMode="contain"
                />
              </Animated.View>

              <View style={[styles.textZone, { maxWidth: slideWidth * TEXT_WIDTH_RATIO }]}>
                <Title
                  variant="display"
                  colorScheme={colorScheme}
                  lead={slide.lead}
                  accent={slide.accent}
                />
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
  // overflow hidden: la parte d'immagine che sborda viene tagliata al bordo della slide (= bordo
  // schermo) invece di invadere la slide accanto nel carosello.
  slide: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  // Immagine e testi stanno in questo unico container, ed è il container a essere centrato.
  // Larghezza passata in numero: le percentuali qui dentro non avrebbero un riferimento certo.
  group: { alignItems: 'center', overflow: 'visible' },
  // L'ombra sfora il box dell'immagine: nessun contenitore intermedio deve tagliarla
  imageBox: { overflow: 'visible' },
  // Spaziatura simmetrica: i testi restano centrati nella fascia che occupano, fra immagine e pallini
  textZone: {
    paddingTop: 20,
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    opacity: 0.85,
    fontFamily: DisplayFonts.regular,
  },
});
