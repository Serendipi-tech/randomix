import { useState } from 'react';
import { BlurView } from 'expo-blur';
import { Platform, ScrollView, StyleSheet, Text, View, Pressable, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Circle, Path } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { Bell, Home, LayoutGrid, Moon, Sun, Users, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';

const ShowcaseColors = {
  light: {
    background: '#FAFAFA',
    backgroundRadial: '#3A1C57',
    foreground: '#F5F5F5',
    primary: '#6366F1',
    secondary: '#EC4899',
    accent: '#06B6D4',
    error: '#DC2626',
    warning: '#EA580C',
    info: '#0284C7',
    success: '#16A34A',
    shadow: '#000000',
    border: '#E5E7EB',
    titleColor: '#1F2937',
    extraColors: {
      one: '#FEF3C7',
      two: '#DDD6FE',
      three: '#FCE7F3',
      four: '#E0F2FE',
      five: '#DCFCE7',
    },
  },
  dark: {
    background: '#161024',
    backgroundRadial: '#5a2a86',
    foreground: '#1E293B',

    primary: '#818CF8',
    secondary: '#F472B6',

    accent: '#22D3EE',

    error: '#FCA5A5',
    warning: '#FB923C',
    info: '#38BDF8',
    success: '#86EFAC',

    shadow: '#000000',

    border: '#334155',

    titleColor: '#F1F5F9',

    extraColors: {
      one: '#7C2D12',
      two: '#3730A3',
      three: '#831843',
      four: '#082F49',
      five: '#14532D',
    },
  },
} as const;

// Navbar constants copied from app-tabs
const BAR_HEIGHT = 68;
const CORNER = 12;
const NOTCH_HALF_WIDTH = 76;
const NOTCH_DEPTH = 64;
const HOME_SIZE = 52;
const HOME_LIFT = (BAR_HEIGHT - HOME_SIZE) / 2;

const SIDE_TAB_ICONS = {
  profile: Users,
  notifications: Bell,
  friends: Users,
  groups: LayoutGrid,
} as const;

type SideTabName = keyof typeof SIDE_TAB_ICONS;

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

function HomeButtonComp() {
  return (
    <Pressable style={[styles.homeButton, { backgroundColor: Colors.light.primary }]} hitSlop={6}>
      <View style={styles.homeIconStack}>
        <Home size={24} color={Colors.light.border} strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}

function NavBar({ colorScheme, isDark, setIsDark, activeTab, toggleTab }: { colorScheme: 'light' | 'dark'; isDark: boolean; setIsDark: (val: boolean) => void; activeTab: 'profile' | 'notifications' | 'friends' | null; toggleTab: (tab: 'profile' | 'notifications' | 'friends') => void }) {
  const colors = ShowcaseColors[colorScheme];
  const fill =
    colorScheme === 'light'
      ? hexToRgba(colors.primary, 0.2)
      : hexToRgba(colors.primary, 0.2);
  const borderColor = hexToRgba(colors.border, colorScheme === 'light' ? 0.5 : 0.16);
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const mutedColor = colors.primary;
  const activeColor = colors.secondary;

  // Blur ritagliato a forma navbar: su web clip-path CSS (MaskedView rompe il backdrop-filter),
  // su nativo MaskedView + BlurView
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
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: 12 }]}>
      <View style={styles.pillWrap} onLayout={onLayout}>
        {width > 0 && (
          <>
            {blurLayer}
            <View style={styles.clip} pointerEvents="box-none">
              <Svg width={width} height={BAR_HEIGHT} style={StyleSheet.absoluteFill}>
                <Path d={buildWavePath(width)} fill={fill} stroke={borderColor} strokeWidth={1} />
              </Svg>
              <View style={styles.row}>
                <SideTabButton name="profile" isActive={activeTab === 'profile'} onPress={() => toggleTab('profile')} mutedColor={mutedColor} activeColor={activeColor} />
                <SideTabButton name="notifications" isActive={activeTab === 'notifications'} onPress={() => toggleTab('notifications')} mutedColor={mutedColor} activeColor={activeColor} />
                <HomeButtonComp />
                <SideTabButton name="friends" isActive={activeTab === 'friends'} onPress={() => toggleTab('friends')} mutedColor={mutedColor} activeColor={activeColor} />
                <View style={styles.themeToggle}>
                  <Pressable hitSlop={8} onPress={() => setIsDark(!isDark)}>
                    {isDark ? (
                      <Sun size={24} color={activeColor} />
                    ) : (
                      <Moon size={24} color={activeColor} />
                    )}
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

export default function ColorsShowcase() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'friends' | null>(null);
  const colorScheme = isDark ? 'dark' : 'light';
  const colors = ShowcaseColors[colorScheme];

  const toggleTab = (tab: 'profile' | 'notifications' | 'friends') => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Svg
        width="100%"
        height={400}
        viewBox="0 0 400 400"
        style={styles.radialGradientSvg}
      >
        <Defs>
          <RadialGradient id="radialGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.backgroundRadial} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={colors.backgroundRadial} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="200" cy="200" r="200" fill="url(#radialGlow)" />
      </Svg>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.titleColor }]}>Design System</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.border }]}>
            Complete showcase of available colors and components
          </Text>
        </View>

        {/* Hero Card */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: colors.primary, borderColor: colors.border, borderWidth: 1 },
          ]}
        >
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>Welcome</Text>
          <Text style={[styles.heroSubtitle, { color: colors.foreground, opacity: 0.8 }]}>
            Explore every color in the system
          </Text>
        </View>

        {/* Color Swatches */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.titleColor }]}>Primary Colors</Text>
          <View style={styles.swatchGrid}>
            {[
              { name: 'Primary', color: colors.primary },
              { name: 'Secondary', color: colors.secondary },
              { name: 'Accent', color: colors.accent },
              { name: 'Foreground', color: colors.foreground },
            ].map((swatch) => (
              <View key={swatch.name} style={styles.swatchItem}>
                <View style={[styles.swatchBox, { backgroundColor: swatch.color }]} />
                <Text style={[styles.swatchLabel, { color: colors.titleColor }]}>{swatch.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Semantic Colors */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.titleColor }]}>Semantic Colors</Text>
          <View style={styles.semanticList}>
            {[
              { name: 'Success', color: colors.success, icon: '✓' },
              { name: 'Warning', color: colors.warning, icon: '!' },
              { name: 'Error', color: colors.error, icon: '✕' },
              { name: 'Info', color: colors.info, icon: 'ℹ' },
            ].map((item) => (
              <View key={item.name} style={[styles.semanticItem, { backgroundColor: colors.foreground }]}>
                <View
                  style={[
                    styles.semanticDot,
                    { backgroundColor: item.color, borderColor: item.color },
                  ]}
                >
                  <Text style={[styles.semanticIcon, { color: colors.foreground }]}>{item.icon}</Text>
                </View>
                <Text style={[styles.semanticName, { color: colors.titleColor }]}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bento Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.titleColor }]}>Components</Text>
          <View style={styles.bentoGrid}>
            {/* Large Featured Card */}
            <View
              style={[
                styles.bentoCard,
                styles.bentoLarge,
                { backgroundColor: colors.secondary, borderColor: colors.border },
              ]}
            >
              <Zap size={32} color={colors.foreground} />
              <Text style={[styles.bentoCardTitle, { color: colors.foreground }]}>Featured</Text>
              <Text style={[styles.bentoCardSubtitle, { color: colors.foreground, opacity: 0.8 }]}>
                Large card
              </Text>
            </View>

            {/* Small Cards */}
            <View
              style={[
                styles.bentoCard,
                { backgroundColor: colors.accent, borderColor: colors.border },
              ]}
            >
              <Users size={24} color={colors.foreground} />
              <Text style={[styles.bentoCardSmallTitle, { color: colors.foreground }]}>Users</Text>
            </View>

            <View
              style={[
                styles.bentoCard,
                { backgroundColor: colors.primary, borderColor: colors.border },
              ]}
            >
              <Bell size={24} color={colors.foreground} />
              <Text style={[styles.bentoCardSmallTitle, { color: colors.foreground }]}>Alerts</Text>
            </View>

            <View
              style={[
                styles.bentoCard,
                { backgroundColor: colors.success, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.bentoCardSmallTitle, { color: colors.foreground }]}>Done</Text>
            </View>
          </View>
        </View>

        {/* Extra Colors */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.titleColor }]}>Extra Palette</Text>
          <View style={styles.extraGrid}>
            {Object.entries(colors.extraColors).map(([key, color]) => (
              <View key={key} style={styles.extraItem}>
                <View style={[styles.extraBox, { backgroundColor: color }]} />
                <Text style={[styles.extraLabel, { color: colors.titleColor }]}>Color {key}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Button Examples */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.titleColor }]}>Buttons</Text>
          <View style={styles.buttonStack}>
            <Pressable style={[styles.button, { backgroundColor: colors.primary }]}>
              <Text style={[styles.buttonText, { color: colors.foreground }]}>Primary</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>Secondary</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: colors.error }]}>
              <Text style={[styles.buttonText, { color: colors.foreground }]}>Destructive</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.foreground, borderTopColor: colors.border },
          ]}
        >
          <Text style={[styles.footerText, { color: colors.titleColor }]}>Colors Showcase</Text>
          <Text style={[styles.footerSubtext, { color: colors.border }]}>Self-contained design system</Text>
        </View>
      </ScrollView>

      {/* Bottom Navbar */}
      <NavBar colorScheme={colorScheme} isDark={isDark} setIsDark={setIsDark} activeTab={activeTab} toggleTab={toggleTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 8, paddingTop: 16, paddingBottom: 40 },

  // Navbar
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navTitle: { fontSize: 20, fontWeight: '700' },
  navActions: { flexDirection: 'row', gap: 16 },

  // Sections
  section: { paddingHorizontal: 16, marginBottom: 32 },
  sectionTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  sectionSubtitle: { fontSize: 14, marginBottom: 16 },

  // Hero Card
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 24,
    borderRadius: 16,
    justifyContent: 'center',
  },
  heroTitle: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  heroSubtitle: { fontSize: 16 },

  // Swatches
  swatchGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  swatchItem: { alignItems: 'center', flex: 1, minWidth: '45%' },
  swatchBox: { width: '100%', height: 80, borderRadius: 12, marginBottom: 8 },
  swatchLabel: { fontSize: 13, fontWeight: '500' },

  // Semantic List
  semanticList: { gap: 10 },
  semanticItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  semanticDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  semanticIcon: { fontSize: 18, fontWeight: '600' },
  semanticName: { fontSize: 15, fontWeight: '500' },

  // Bento
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bentoCard: {
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    minWidth: '45%',
    minHeight: 100,
  },
  bentoLarge: { minWidth: '100%', minHeight: 140 },
  bentoCardTitle: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  bentoCardSubtitle: { fontSize: 12 },
  bentoCardSmallTitle: { fontSize: 14, fontWeight: '600', marginTop: 8 },

  // Extra Colors Grid
  extraGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  extraItem: { alignItems: 'center', flex: 1, minWidth: '22%' },
  extraBox: { width: '100%', height: 60, borderRadius: 8, marginBottom: 6 },
  extraLabel: { fontSize: 12, fontWeight: '500' },

  // Buttons
  buttonStack: { gap: 10 },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 14, fontWeight: '600' },

  // Footer
  footer: {
    marginTop: 32,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  footerSubtext: { fontSize: 12 },

  // Radial Gradient
  radialGradientSvg: {
    position: 'absolute',
    top: -200,
    left: 0,
    right: 0,
    pointerEvents: 'none',
  },

  // App Tabs Navbar
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
  glassBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BAR_HEIGHT + 12,
  },
});
