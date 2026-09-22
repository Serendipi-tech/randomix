import { useEffect, useState } from 'react';
import { usePathname } from 'expo-router';
import { Tabs, TabList, TabTrigger, TabSlot, type TabTriggerSlotProps, type TabListProps } from 'expo-router/ui';
import { BlurView } from 'expo-blur';
import { Platform, Pressable, StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { Bell, Home, LayoutGrid, Users } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { buildFillWavePath } from '@/utils/buildFillWavePath';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const BAR_HEIGHT = 68;
const CORNER = 12;
const HOME_SIZE = 52;
// centra HOME_SIZE nella riga (alta BAR_HEIGHT) e lo spinge fino a toccare il bordo superiore:
// resta sempre dentro il perimetro della barra, mai sopra.
const HOME_LIFT = (BAR_HEIGHT - HOME_SIZE) / 2;
const NOTCH_HALF_WIDTH = 76;
const NOTCH_DEPTH = 64;
const WAVE_AMPLITUDE = 5;
const WAVE_DURATION = 800;

const SIDE_TAB_ICONS = {
  profile: Users,
  notifications: Bell,
  friends: Users,
  groups: LayoutGrid,
} as const;

// La pillola resta visibile ovunque (root + navigazione gerarchica: dettagli lista/amico/gruppo);
// si nasconde solo nei task focalizzati: form di creazione/modifica e flussi immersivi a schermo pieno
const HIDDEN_PATHS = ['/list-form', '/item-form', '/draw', '/randomizer'];

type SideTabName = keyof typeof SIDE_TAB_ICONS;

/** Contorno della pillola con una tacca a onda al centro, dove si annida il pulsante Home:
 *  la tacca scende DENTRO l'altezza della barra, non sporge mai sopra il bordo superiore. */
function buildWavePath(width: number): string {
  const cx = width / 2;
  const left = cx - NOTCH_HALF_WIDTH;
  const right = cx + NOTCH_HALF_WIDTH;

  return [
    `M ${CORNER} 0`,
    `L ${left} 0`,
    `C ${left + 37} 0 ${cx - 40} ${NOTCH_DEPTH} ${cx} ${NOTCH_DEPTH}`,
    `C ${cx + 40} ${NOTCH_DEPTH} ${right - 37} 0 ${right} 0`,
    `L ${width - CORNER} 0`,
    `A ${CORNER} ${CORNER} 0 0 1 ${width} ${CORNER}`,
    `L ${width} ${BAR_HEIGHT - CORNER}`,
    `A ${CORNER} ${CORNER} 0 0 1 ${width - CORNER} ${BAR_HEIGHT}`,
    `L ${CORNER} ${BAR_HEIGHT}`,
    `A ${CORNER} ${CORNER} 0 0 1 0 ${BAR_HEIGHT - CORNER}`,
    `L 0 ${CORNER}`,
    `A ${CORNER} ${CORNER} 0 0 1 ${CORNER} 0`,
    'Z',
  ].join(' ');
}

/** Tab bar dell'app: pillola flottante con tacca a onda, blur ritagliato sulla forma e pulsante Home
 *  sopraelevato al centro. Stile allineato al componente NavBar del design system (colors-showcase). */
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <TabBar>
          <TabTrigger name="profile" href="/profile" asChild>
            <SideTabButton name="profile" />
          </TabTrigger>
          <TabTrigger name="notifications" href="/notifications" asChild>
            <SideTabButton name="notifications" />
          </TabTrigger>
          <TabTrigger name="home" href="/" asChild>
            <HomeButton />
          </TabTrigger>
          <TabTrigger name="friends" href="/friends" asChild>
            <SideTabButton name="friends" />
          </TabTrigger>
          <TabTrigger name="groups" href="/groups" asChild>
            <SideTabButton name="groups" />
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}

type SideTabButtonProps = TabTriggerSlotProps & { name: SideTabName };

/** Icona piena quando attiva, solo contorno quando inattiva — nessuna label (icon-only).
 *  La scala usa uno spring (il rimbalzo dà l'effetto "pop"), il crossfade colore usa withTiming
 *  su un valore separato: uno spring sottosmorzato supera lo zero e rimbalza indietro, e se
 *  guidasse anche l'opacità farebbe "riapparire" per un istante il colore pieno mentre sparisce. */
function SideTabButton({ name, isFocused, ...props }: SideTabButtonProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const Icon = SIDE_TAB_ICONS[name];
  const mutedColor = colors.textColor;
  const activeColor = colors.secondary;

  const scale = useSharedValue(isFocused ? 1.05 : 1);
  const progress = useSharedValue(isFocused ? 1 : 0);
  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.05 : 1, { damping: 14, stiffness: 280 });
    progress.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, scale, progress]);

  const containerStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const mutedStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const activeStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Pressable {...props} style={styles.sideTab} hitSlop={6}>
      <Animated.View style={[styles.iconWrap, containerStyle]}>
        <Animated.View style={mutedStyle}>
          <Icon size={24} color={mutedColor} fill="none" strokeWidth={2} />
        </Animated.View>
        <Animated.View style={[styles.iconOverlay, activeStyle]}>
          <Icon size={24} color={activeColor} fill={activeColor} strokeWidth={2} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

/** Pulsante Home: sfondo primary di base, il colore secondary→secondaryGradient sale come
 *  un'onda (cresta singola, vedi buildFillWavePath) fino a riempire il cerchio, fermandosi
 *  appena sotto il bordo per lasciare sempre un filo d'onda visibile. La cresta scorre in x
 *  in contemporanea alla risalita: stesso timing (durata + easing) di progress, nessuna
 *  sequenza né oscillazione dopo il riempimento. Scala separata dal resto: lo spring può
 *  rimbalzare, l'onda no. */
function HomeButton({ isFocused, ...props }: TabTriggerSlotProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const crestXLeft = HOME_SIZE * 0.15;
  const crestXRight = HOME_SIZE * 0.55;

  const scale = useSharedValue(isFocused ? 1.05 : 1);
  const progress = useSharedValue(isFocused ? 1 : 0);
  const crestX = useSharedValue(isFocused ? crestXRight : crestXLeft);
  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.05 : 1, { damping: 12, stiffness: 300 });
    progress.value = withTiming(isFocused ? 1 : 0, { duration: WAVE_DURATION, easing: Easing.out(Easing.cubic) });
    crestX.value = withTiming(isFocused ? crestXRight : crestXLeft, {
      duration: WAVE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [isFocused, scale, progress, crestX, crestXLeft, crestXRight]);

  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const waveProps = useAnimatedProps(() => {
    const waveY = interpolate(progress.value, [0, 1], [HOME_SIZE + WAVE_AMPLITUDE, WAVE_AMPLITUDE], Extrapolation.CLAMP);
    return { d: buildFillWavePath(HOME_SIZE, HOME_SIZE, waveY, WAVE_AMPLITUDE, crestX.value) };
  });

  return (
    <Pressable {...props} style={[styles.homeButton, { backgroundColor: colors.primary }]} hitSlop={6}>
      <Svg width={HOME_SIZE} height={HOME_SIZE} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgLinearGradient id="homeWaveGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.secondary} />
            <Stop offset="1" stopColor={colors.secondaryGradient} />
          </SvgLinearGradient>
        </Defs>
        <AnimatedPath animatedProps={waveProps} fill="url(#homeWaveGradient)" />
      </Svg>
      <Animated.View style={[styles.homeIconStack, scaleStyle]}>
        <Home size={24} color={colors.textColor} strokeWidth={2.5} />
      </Animated.View>
    </Pressable>
  );
}

function TabBar(props: TabListProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const pathname = usePathname();
  // Nasconde la pillola (senza smontare le tab) solo nei task focalizzati: display none mantiene i trigger montati
  const barVisible = !HIDDEN_PATHS.includes(pathname);
  const fill = hexToRgba(colors.primary, 0.2);
  const [width, setWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const onWrapLayout = (e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width);
  // margine laterale reale della pillola (screen width - pillWrap width) / 2: il bottom deve essere identico
  const sideGap = containerWidth > 0 && width > 0 ? (containerWidth - width) / 2 : 12;

  // Blur ritagliato a forma navbar: su web clip-path CSS (MaskedView rompe il backdrop-filter),
  // su nativo MaskedView + BlurView.
  const wavePath = buildWavePath(width);
  const blurLayer =
    Platform.OS === 'web' ? (
      <View
        pointerEvents="none"
        style={[
          styles.clip,
          { width, height: BAR_HEIGHT, backgroundColor: hexToRgba(colors.foreground, 0.15) },
          {
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            clipPath: `path('${wavePath}')`,
            WebkitClipPath: `path('${wavePath}')`,
          } as unknown as ViewStyle,
        ]}
      />
    ) : (
      <MaskedView
        style={[styles.clip, { width, height: BAR_HEIGHT }]}
        pointerEvents="none"
        maskElement={
          <Svg width={width} height={BAR_HEIGHT}>
            <Path d={wavePath} fill="#fff" />
          </Svg>
        }
      >
        <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark" />
      </MaskedView>
    );

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: sideGap, display: barVisible ? 'flex' : 'none' }]} onLayout={onWrapLayout}>
      <View style={styles.pillWrap} onLayout={onLayout}>
        {width > 0 && (
          <>
            {blurLayer}
            <View style={styles.clip} pointerEvents="box-none">
              <Svg width={width} height={BAR_HEIGHT} style={StyleSheet.absoluteFill}>
                <Path d={buildWavePath(width)} fill={fill} />
              </Svg>
              <View {...props} style={styles.row}>
                {props.children}
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  pillWrap: {
    width: '92%',
    maxWidth: 420,
    height: BAR_HEIGHT,
  },
  clip: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: CORNER,
    overflow: 'hidden',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  sideTab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  iconWrap: {
    position: 'relative',
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  homeButton: {
    width: HOME_SIZE,
    height: HOME_SIZE,
    borderRadius: HOME_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: -HOME_LIFT,
    boxShadow: `0px 6px 14px ${hexToRgba(Colors.light.primary, 0.45)}`,
  },
  homeIconStack: {
    position: 'relative',
    zIndex: 1,
  },
});
