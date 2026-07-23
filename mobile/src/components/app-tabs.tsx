import { useState } from 'react';
import { Tabs, TabList, TabTrigger, TabSlot, type TabTriggerSlotProps, type TabListProps } from 'expo-router/ui';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Bell, Home, LayoutGrid, User, Users } from 'lucide-react-native';
import { BottomTabInset, Colors, GradientBackground } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

// expo-blur applica un wash bianco/nero suo sul web (schiarisce qualunque tinta ci mettessimo sopra):
// su web il "vetro" è backdrop-filter CSS puro, su native è BlurView. Stesso motivo di card.tsx/card.web.tsx.
const webGlassStyle = {
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
} as ViewStyle;

const BAR_HEIGHT = 68;
const CORNER = BAR_HEIGHT / 2;
const NOTCH_HALF_WIDTH = 40;
const NOTCH_DEPTH = 30;
const HOME_SIZE = 52;
// centra HOME_SIZE nella riga (alta BAR_HEIGHT) e lo spinge fino a toccare il bordo superiore:
// resta sempre dentro il perimetro della barra, mai sopra.
const HOME_LIFT = (BAR_HEIGHT - HOME_SIZE) / 2;

const SIDE_TAB_ICONS = {
  profile: User,
  notifications: Bell,
  friends: Users,
  groups: LayoutGrid,
} as const;

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
    `C ${left + 16} 0 ${cx - 30} ${NOTCH_DEPTH} ${cx} ${NOTCH_DEPTH}`,
    `C ${cx + 30} ${NOTCH_DEPTH} ${right - 16} 0 ${right} 0`,
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

/** Tab bar dell'app: pillola flottante in vetro con tacca a onda e pulsante Home sempre sopraelevato al
 *  centro (statico, non dipende dal tab attivo). L'icona esposta resta comunque dentro il perimetro della
 *  barra, non sborda mai sopra il bordo. Un solo file per tutte le piattaforme (vedi webGlassStyle). */
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

/** Icona piena quando attiva, solo contorno quando inattiva — nessuna label (icon-only). */
function SideTabButton({ name, isFocused, ...props }: SideTabButtonProps) {
  const { colorScheme } = useAppTheme();
  const Icon = SIDE_TAB_ICONS[name];
  const mutedColor = Colors[colorScheme].placeholder;
  const activeColor = Colors[colorScheme].titleColor;
  const color = isFocused ? activeColor : mutedColor;

  return (
    <Pressable {...props} style={styles.sideTab} hitSlop={6}>
      <Icon size={24} color={color} fill={isFocused ? color : 'none'} strokeWidth={2} />
    </Pressable>
  );
}

/** Pulsante Home: aspetto sempre identico (non cambia con il tab attivo), sopraelevato nella tacca ma
 *  contenuto entro l'altezza della barra. */
function HomeButton(props: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={styles.homeButton} hitSlop={6}>
      <LinearGradient
        colors={[Colors.light.secondary, Colors.light.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.homeIconStack}>
        <Home size={24} color={Colors.light.border} strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}

function TabBar(props: TabListProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const fill =
    colorScheme === 'light'
      ? hexToRgba(colors.primary, 0.3)
      : hexToRgba(GradientBackground.dark.stops[1], 0.58);
  const border = hexToRgba(colors.border, colorScheme === 'light' ? 0.5 : 0.16);
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: BottomTabInset / 2 }]}>
      <View style={styles.pillWrap} onLayout={onLayout}>
        {width > 0 && (
          <View style={styles.clip}>
            {/* layer di blur dietro a tutto: BlurView su native, backdrop-filter CSS su web (mai sulla view che avvolge il contenuto, altrimenti sfoca anche icone/testo) */}
            {Platform.OS !== 'web' ? (
              <BlurView intensity={60} tint="default" style={StyleSheet.absoluteFill} />
            ) : (
              <View style={[StyleSheet.absoluteFill, webGlassStyle]} />
            )}
            <Svg width={width} height={BAR_HEIGHT} style={StyleSheet.absoluteFill}>
              <Path d={buildWavePath(width)} fill={fill} stroke={border} strokeWidth={1} />
            </Svg>
            <View {...props} style={styles.row}>
              {props.children}
            </View>
          </View>
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
    paddingHorizontal: 16,
  },
  sideTab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
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
