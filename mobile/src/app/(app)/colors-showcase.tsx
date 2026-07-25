import { useState } from 'react';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
    background: '#fdfcf5',
    backgroundRadial: '#fff396',
    foreground: '#F5F5F5',
    primary: '#7154e7',
    secondary: '#f7c041',
    secondaryGradient: '#FF6B6B',
    accent: '#1df1d5',
    error: '#DC2626',
    warning: '#EA580C',
    info: '#0284C7',
    success: '#16A34A',
    shadow: '#000000',
    border: '#E5E7EB',
    textColor: '#374151',
    extraColors: {
      one: '#FEF3C7',
      two: '#DDD6FE',
      three: '#FCE7F3',
      four: '#E0F2FE',
      five: '#DCFCE7',
      six: "#fff",
      seven: "#fff",
      eight: "#fff",
      nine: "#fff",
      ten: "#fff",
    },
  },
  dark: {
    background: '#191024',
    backgroundRadial: '#7b2a86',
    foreground: '#261b3b', // vecchio, più freddo: "#1f1b3b";

    primary: '#7154e7',
    secondary: '#f7c041',
    secondaryGradient: '#FF6B6B',

    accent: '#1dffe1',

    error: '#eb3040',
    warning: '#fda129',
    info: '#39c3ff',
    success: '#40fd79',

    shadow: '#000000',

    border: '#334155',

    textColor: '#fdfcf5',

    extraColors: {
      one: '#e63d4b',
      two: '#e6c73d',
      three: '#3d56e6',
      four: '#59e63d',
      five: '#e6813d',
      six: "#943de6",
      seven: "#3de697",
      eight: "#e63db3",
      nine: "#3db6e6",
      ten: "#c1e63d",
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
        height={450}
        viewBox="0 0 400 400"
        style={styles.radialGradientSvg}
      >
        <Defs>
          <RadialGradient id="radialGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.backgroundRadial} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.backgroundRadial} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="200" cy="200" r="200" fill="url(#radialGlow)" />
      </Svg>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Design System</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textColor }]}>
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
          <Text style={[styles.heroTitle, { color: colors.textColor }]}>Welcome</Text>
          <Text style={[styles.heroSubtitle, { color: colors.textColor }]}>
            Explore every color in the system
          </Text>
        </View>

        {/* Color Swatches */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Primary Colors</Text>
          <View style={styles.swatchGrid}>
            {[
              { name: 'Primary', color: colors.primary },
              { name: 'Secondary', color: colors.secondary },
              { name: 'Accent', color: colors.accent },
              { name: 'Foreground', color: colors.foreground },
            ].map((swatch) => (
              <View key={swatch.name} style={styles.swatchItem}>
                <View style={[styles.swatchBox, { backgroundColor: swatch.color }]} />
                <Text style={[styles.swatchLabel, { color: colors.textColor }]}>{swatch.name}</Text>
              </View>
            ))}
          </View>
          <LinearGradient
            colors={[colors.secondary, colors.secondaryGradient || colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBox}
          />
        </View>

        {/* Semantic Colors */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Semantic Colors</Text>
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
                <Text style={[styles.semanticName, { color: colors.textColor }]}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bento Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Components</Text>
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
              <Text style={[styles.bentoCardSubtitle, { color: colors.textColor }]}>
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
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Extra Palette</Text>
          <View style={styles.extraGrid}>
            {Object.entries(colors.extraColors).map(([key, color]) => (
              <View key={key} style={styles.extraItem}>
                <View style={[styles.extraBox, { backgroundColor: color }]} />
                <Text style={[styles.extraLabel, { color: colors.textColor }]}>Color {key}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Button Examples */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Buttons</Text>
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

        {/* Input Fields */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Inputs</Text>
          <View style={styles.inputStack}>
            <View style={[styles.input, { backgroundColor: colors.foreground, borderColor: colors.border }]}>
              <Text style={{ color: colors.textColor }}>Text input</Text>
            </View>
            <View style={[styles.input, { backgroundColor: colors.foreground, borderColor: colors.primary }]}>
              <Text style={{ color: colors.textColor }}>Focused input</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Badges</Text>
          <View style={styles.badgeStack}>
            {[
              { label: 'Default', bg: colors.foreground, fg: colors.textColor },
              { label: 'Primary', bg: colors.primary, fg: colors.foreground },
              { label: 'Success', bg: colors.success, fg: colors.foreground },
              { label: 'Warning', bg: colors.warning, fg: colors.foreground },
              { label: 'Error', bg: colors.error, fg: colors.foreground },
            ].map((badge) => (
              <View key={badge.label} style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={{ color: badge.fg, fontSize: 12, fontWeight: '600' }}>{badge.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Toggle & Chips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Chips</Text>
          <View style={styles.chipStack}>
            {['Active', 'Inactive', 'Disabled'].map((chip) => (
              <View
                key={chip}
                style={[
                  styles.chip,
                  {
                    backgroundColor: chip === 'Active' ? colors.primary : colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: chip === 'Active' ? colors.foreground : colors.textColor,
                    fontSize: 14,
                    fontWeight: '500',
                  }}
                >
                  {chip}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Progress Indicators */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Progress</Text>
          <View style={styles.progressStack}>
            {[30, 60, 100].map((value) => (
              <View key={value} style={{ gap: 8 }}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors.foreground, borderColor: colors.border },
                  ]}
                >
                  <View
                    style={{
                      height: '100%',
                      width: `${value}%`,
                      backgroundColor: value < 50 ? colors.warning : colors.success,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text style={{ color: colors.textColor, fontSize: 12 }}>{value}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Status Indicators */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Status</Text>
          <View style={styles.statusStack}>
            {[
              { label: 'Online', color: colors.success },
              { label: 'Away', color: colors.warning },
              { label: 'Offline', color: colors.border },
            ].map((status) => (
              <View key={status.label} style={styles.statusItem}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: status.color, borderColor: status.color },
                  ]}
                />
                <Text style={{ color: colors.textColor, fontSize: 14, fontWeight: '500' }}>
                  {status.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Card Variants */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Cards</Text>
          <View style={styles.cardStack}>
            <View
              style={[
                styles.card,
                { backgroundColor: colors.foreground, borderColor: colors.border },
              ]}
            >
              <Text style={{ color: colors.textColor, fontWeight: '600', marginBottom: 4 }}>
                Outlined
              </Text>
              <Text style={{ color: colors.textColor, fontSize: 13 }}>With border</Text>
            </View>
            <View
              style={[
                styles.card,
                { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 4 }}>
                Filled
              </Text>
              <Text style={{ color: colors.textColor, fontSize: 13 }}>
                Solid background
              </Text>
            </View>
          </View>
        </View>

        {/* Accent Examples */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Accent</Text>
          <View style={styles.accentStack}>
            <Pressable style={[styles.accentButton, { backgroundColor: colors.accent }]}>
              <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 14 }}>Tertiary Action</Text>
            </Pressable>
            <View style={[styles.accentBadge, { backgroundColor: hexToRgba(colors.accent, 0.15), borderColor: colors.accent }]}>
              <Text style={{ color: colors.accent, fontWeight: '500', fontSize: 13 }}>Featured</Text>
            </View>
            <View style={[styles.accentLine, { backgroundColor: colors.accent }]} />
          </View>
        </View>

        {/* Alert Messages */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Alerts</Text>
          <View style={styles.alertStack}>
            {[
              { type: 'Success', color: colors.success, bg: hexToRgba(colors.success, 0.1) },
              { type: 'Warning', color: colors.warning, bg: hexToRgba(colors.warning, 0.1) },
              { type: 'Error', color: colors.error, bg: hexToRgba(colors.error, 0.1) },
              { type: 'Info', color: colors.info, bg: hexToRgba(colors.info, 0.1) },
            ].map((alert) => (
              <View key={alert.type} style={[styles.alert, { backgroundColor: alert.bg, borderColor: alert.color }]}>
                <Text style={{ color: alert.color, fontWeight: '600', fontSize: 13 }}>
                  {alert.type}
                </Text>
                <Text style={{ color: alert.color, fontSize: 12, opacity: 0.8 }}>Alert message here</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Checkboxes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Checkboxes</Text>
          <View style={styles.checkboxStack}>
            {['Unchecked', 'Checked', 'Indeterminate'].map((state) => (
              <View key={state} style={styles.checkboxItem}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        state === 'Unchecked' ? colors.foreground : colors.primary,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {state !== 'Unchecked' && (
                    <Text style={{ color: colors.foreground, fontWeight: 'bold' }}>✓</Text>
                  )}
                </View>
                <Text style={{ color: colors.textColor, fontSize: 14 }}>{state}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Radio Buttons */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Radio Buttons</Text>
          <View style={styles.radioStack}>
            {['Option A', 'Option B', 'Option C'].map((option) => (
              <View key={option} style={styles.radioItem}>
                <View
                  style={[
                    styles.radioOuter,
                    { borderColor: colors.primary },
                  ]}
                >
                  {option === 'Option A' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                  )}
                </View>
                <Text style={{ color: colors.textColor, fontSize: 14 }}>{option}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Toggles/Switches */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Switches</Text>
          <View style={styles.toggleStack}>
            {[true, false].map((active) => (
              <View
                key={String(active)}
                style={[
                  styles.toggle,
                  {
                    backgroundColor: active ? colors.primary : colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    { left: active ? 20 : 2, backgroundColor: colors.foreground },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Tags</Text>
          <View style={styles.tagStack}>
            {['Design', 'Development', 'UI/UX', 'Mobile', 'Web'].map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: hexToRgba(colors.primary, 0.2), borderColor: colors.primary }]}>
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '500' }}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Links</Text>
          <View style={styles.linkStack}>
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' }}>
              Primary Link
            </Text>
            <Text style={{ color: colors.secondary, fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' }}>
              Secondary Link
            </Text>
            <Text style={{ color: colors.accent, fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' }}>
              Accent Link
            </Text>
          </View>
        </View>

        {/* Spinners/Loaders */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Loaders</Text>
          <View style={styles.loaderStack}>
            {[colors.primary, colors.secondary, colors.success].map((color) => (
              <View key={color} style={[styles.spinner, { borderColor: hexToRgba(color, 0.2), borderTopColor: color }]} />
            ))}
          </View>
        </View>

        {/* Avatars */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Avatars</Text>
          <View style={styles.avatarStack}>
            {[colors.primary, colors.secondary, colors.accent, colors.warning].map((color) => (
              <View key={color} style={[styles.avatar, { backgroundColor: color }]}>
                <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 14 }}>A</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Dividers */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Dividers</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={{ color: colors.border, textAlign: 'center', marginVertical: 12 }}>Or</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        {/* Breadcrumbs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Breadcrumbs</Text>
          <View style={styles.breadcrumbStack}>
            {['Home', 'Products', 'Electronics', 'Phone'].map((item, idx) => (
              <View key={item} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: colors.textColor, fontSize: 13 }}>{item}</Text>
                {idx < 3 && <Text style={{ color: colors.textColor, marginHorizontal: 6 }}>/</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Tabs</Text>
          <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
            {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, idx) => (
              <View
                key={tab}
                style={[
                  styles.tabItem,
                  {
                    borderBottomColor: idx === 0 ? colors.primary : 'transparent',
                    borderBottomWidth: 2,
                  },
                ]}
              >
                <Text
                  style={{
                    color: idx === 0 ? colors.primary : colors.border,
                    fontSize: 14,
                    fontWeight: '500',
                  }}
                >
                  {tab}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tooltip Placeholder */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Tooltips</Text>
          <View style={[styles.tooltip, { backgroundColor: colors.textColor }]}>
            <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '500' }}>
              Helpful tooltip text
            </Text>
          </View>
        </View>

        {/* Pagination */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Pagination</Text>
          <View style={styles.paginationStack}>
            {[1, 2, 3, 4, 5].map((page) => (
              <View
                key={page}
                style={[
                  styles.paginationItem,
                  {
                    backgroundColor: page === 3 ? colors.primary : colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={{ color: page === 3 ? colors.foreground : colors.textColor, fontWeight: '600' }}>
                  {page}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rating/Stars */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Rating</Text>
          <View style={styles.ratingStack}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text key={star} style={{ color: colors.warning, fontSize: 20 }}>
                ★
              </Text>
            ))}
          </View>
        </View>

        {/* Empty State */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Empty State</Text>
          <View style={[styles.emptyState, { borderColor: colors.border }]}>
            <Text style={{ color: colors.border, fontSize: 14, marginBottom: 8 }}>📭</Text>
            <Text style={{ color: colors.textColor, fontWeight: '600', marginBottom: 4 }}>Nothing here</Text>
            <Text style={{ color: colors.border, fontSize: 12 }}>No items to display</Text>
          </View>
        </View>

        {/* Skeleton Loaders */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Skeleton</Text>
          <View style={styles.skeletonStack}>
            <View style={[styles.skeletonLine, { backgroundColor: hexToRgba(colors.border, 0.5) }]} />
            <View style={[styles.skeletonLine, { backgroundColor: hexToRgba(colors.border, 0.5), width: '80%' }]} />
            <View style={[styles.skeletonLine, { backgroundColor: hexToRgba(colors.border, 0.5), width: '60%' }]} />
          </View>
        </View>

        {/* Dropdown Menu Placeholder */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Dropdown</Text>
          <View style={[styles.dropdown, { backgroundColor: colors.foreground, borderColor: colors.border }]}>
            <Text style={{ color: colors.textColor, fontSize: 14 }}>Select option...</Text>
          </View>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.foreground, borderTopColor: colors.border },
          ]}
        >
          <Text style={[styles.footerText, { color: colors.textColor }]}>Colors Showcase</Text>
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
  sectionTitle: { fontSize: 24, fontWeight: '600', marginBottom: 8, fontFamily: 'Inter' },
  sectionSubtitle: { fontSize: 14, marginBottom: 16, fontFamily: 'Inter' },

  // Hero Card
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 24,
    borderRadius: 16,
    justifyContent: 'center',
  },
  heroTitle: { fontSize: 28, fontWeight: '700', marginBottom: 8, fontFamily: 'Inter' },
  heroSubtitle: { fontSize: 16, fontFamily: 'Inter' },

  // Swatches
  swatchGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  swatchItem: { alignItems: 'center', flex: 1, minWidth: '45%' },
  swatchBox: { width: '100%', height: 80, borderRadius: 12, marginBottom: 8 },
  swatchLabel: { fontSize: 13, fontWeight: '500' },
  gradientBox: { width: '100%', height: 120, borderRadius: 12, marginTop: 12 },

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
  buttonText: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter' },

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

  // Inputs
  inputStack: { gap: 10 },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
  },

  // Badges
  badgeStack: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  // Chips
  chipStack: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },

  // Progress
  progressStack: { gap: 20 },
  progressBar: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },

  // Status
  statusStack: { gap: 12 },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },

  // Cards
  cardStack: { gap: 12 },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },

  // Alerts
  alertStack: { gap: 10 },
  alert: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
  },

  // Checkboxes
  checkboxStack: { gap: 12 },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Radio Buttons
  radioStack: { gap: 12 },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Toggles
  toggleStack: { flexDirection: 'row', gap: 12 },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    top: 2,
  },

  // Tags
  tagStack: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },

  // Links
  linkStack: { gap: 8 },

  // Loaders
  loaderStack: { flexDirection: 'row', gap: 24, justifyContent: 'center' },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
  },

  // Avatars
  avatarStack: { flexDirection: 'row', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Dividers
  divider: {
    height: 1,
    width: '100%',
  },

  // Breadcrumbs
  breadcrumbStack: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    gap: 0,
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },

  // Tooltip
  tooltip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  // Pagination
  paginationStack: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  paginationItem: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Rating
  ratingStack: { flexDirection: 'row', gap: 4 },

  // Empty State
  emptyState: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },

  // Skeleton
  skeletonStack: { gap: 8 },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
  },

  // Dropdown
  dropdown: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },

  // Accent
  accentStack: { gap: 12, alignItems: 'center' },
  accentButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  accentBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  accentLine: {
    height: 2,
    width: 60,
    borderRadius: 1,
  },

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
