import { useState } from 'react';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { Bell, Home, LayoutGrid, Moon, Sun, Users } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

// Colori del tema risolti (light|dark), per tipizzare gli helper privati senza esporli come prop.
type ThemeColors = (typeof Colors)[keyof typeof Colors];

const BAR_HEIGHT = 68;
const CORNER = 12;
const HOME_SIZE = 52;
const HOME_LIFT = (BAR_HEIGHT - HOME_SIZE) / 2;
const NOTCH_HALF_WIDTH = 76;
const NOTCH_DEPTH = 64;

const SIDE_TAB_ICONS = {
  profile: Users,
  notifications: Bell,
  friends: Users,
  groups: LayoutGrid,
} as const;

type SideTabName = keyof typeof SIDE_TAB_ICONS;

/** Traccia il path SVG della barra: angoli arrotondati + notch centrale che accoglie il pulsante Home. */
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

function SideTabButton({ name, isActive, onPress, mutedColor, activeColor }: { name: SideTabName; isActive: boolean; onPress: () => void; mutedColor: string; activeColor: string }) {
  const Icon = SIDE_TAB_ICONS[name];
  const color = isActive ? activeColor : mutedColor;
  return (
    <Pressable style={styles.sideTab} hitSlop={6} onPress={onPress}>
      <Icon size={24} color={color} fill={isActive ? color : 'none'} strokeWidth={2} />
    </Pressable>
  );
}

function HomeButtonComp({ colors, isActive, onPress }: { colors: ThemeColors; isActive: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.homeButton, { backgroundColor: isActive ? undefined : colors.primary }]} hitSlop={6} onPress={onPress}>
      {isActive && (
        <LinearGradient
          colors={[colors.secondary, colors.secondaryGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.homeIconStack}>
        <Home size={24} color={colors.textColor} strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}

type NavBarProps = {
  activeTab: 'profile' | 'notifications' | 'friends' | null;
  toggleTab: (tab: 'profile' | 'notifications' | 'friends') => void;
  onHomePress: () => void;
  blurDisabled?: boolean;
};

/** Navbar flottante: side-tab, pulsante Home in rilievo, forma SVG con notch, blur layer e toggle tema. */
export function NavBar({ activeTab, toggleTab, onHomePress, blurDisabled }: NavBarProps) {
  const { colorScheme, toggleColorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const fill = hexToRgba(colors.primary, 0.2);
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const mutedColor = colors.textColor;
  const activeColor = colors.secondary;

  // Blur ritagliato a forma navbar: su web clip-path CSS (MaskedView rompe il backdrop-filter),
  // su nativo MaskedView + BlurView.
  const wavePath = buildWavePath(width);
  const blurLayer = blurDisabled ? (
    // backdrop-filter (web) sfoca anche i contenuti sovrapposti come le bottomsheet: disattivato quando una è aperta
    <View pointerEvents="none" style={[styles.clip, { width, height: BAR_HEIGHT, backgroundColor: hexToRgba(colors.foreground, 0.85) }]} />
  ) : Platform.OS === 'web' ? (
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
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: 12 }]}>
      <View style={styles.pillWrap} onLayout={onLayout}>
        {width > 0 && (
          <>
            {blurLayer}
            <View style={styles.clip} pointerEvents="box-none">
              <Svg width={width} height={BAR_HEIGHT} style={StyleSheet.absoluteFill}>
                <Path d={buildWavePath(width)} fill={fill} />
              </Svg>
              <View style={styles.row}>
                <SideTabButton name="profile" isActive={activeTab === 'profile'} onPress={() => toggleTab('profile')} mutedColor={mutedColor} activeColor={activeColor} />
                <SideTabButton name="notifications" isActive={activeTab === 'notifications'} onPress={() => toggleTab('notifications')} mutedColor={mutedColor} activeColor={activeColor} />
                <HomeButtonComp colors={colors} isActive={activeTab === null} onPress={onHomePress} />
                <SideTabButton name="friends" isActive={activeTab === 'friends'} onPress={() => toggleTab('friends')} mutedColor={mutedColor} activeColor={activeColor} />
                <View style={styles.themeToggle}>
                  <Pressable hitSlop={10} onPress={toggleColorScheme}>
                    {isDark ? <Sun size={24} color={activeColor} /> : <Moon size={24} color={activeColor} />}
                  </Pressable>
                </View>
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
    width: '96%',
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
  themeToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
});
