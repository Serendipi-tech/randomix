import { useState } from 'react';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, ScrollView, StyleSheet, Text, View, Pressable, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Circle, Path } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { Bell, ChevronLeft, Home, LayoutGrid, Moon, Sun, Users, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { styles } from './colors-showcase.styles';

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

function ShowColorPalette({
  title,
  items,
  colors,
  gradient,
}: {
  title: string;
  items: Array<{ name: string; color: string }>;
  colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark;
  gradient?: { colors: [string, string]; name: string };
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textColor }]}>{title}</Text>
      <View style={[styles.swatchGrid, { width: '100%' }]}>
        {items.map((item) => (
          <View key={item.name} style={styles.swatchItem}>
            <View style={[styles.swatchBox, { backgroundColor: item.color }]}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.border }}>
                {item.name.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
        {gradient && (
          <View style={styles.swatchItem}>
            <LinearGradient
              colors={gradient.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.gradientBox, { width: '100%' }]}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.border }}>
                {gradient.name.toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>
    </View>
  );
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

function PageHeader({
  icon,
  title,
  subtitle,
  colors,
  onBack,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  colors: typeof ShowcaseColors.light | typeof ShowcaseColors.dark;
  onBack?: () => void;
}) {
  return (
    <View style={styles.pageHeaderWrapper}>
      <View style={styles.pageHeaderTopRow}>
        <View style={styles.pageHeaderContent}>
          <LinearGradient
            colors={[colors.secondary, colors.secondaryGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pageHeaderIcon}
          >
            {icon}
          </LinearGradient>
          <Text style={styles.pageHeaderTitle}>{title}</Text>
        </View>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={8}>
            <ChevronLeft size={24} color="#ffffff" />
          </Pressable>
        )}
      </View>
      {subtitle && <Text style={styles.pageHeaderSubtitle}>{subtitle}</Text>}
    </View>
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
  const [chipState, setChipState] = useState<Record<string, boolean>>({ Active: true, Inactive: false, Disabled: false });
  const [checkboxState, setCheckboxState] = useState<Record<string, boolean>>({ Unchecked: false, Checked: true, Indeterminate: false });
  const [radioState, setRadioState] = useState('Option A');
  const [toggleState, setToggleState] = useState<Record<string, boolean>>({ 'true': true, 'false': false });
  const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>({ Design: false, Development: false, 'UI/UX': false, Mobile: false, Web: false });
  const [currentPage, setCurrentPage] = useState(3);
  const [rating, setRating] = useState(4);
  const [currentTabIdx, setCurrentTabIdx] = useState(0);

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
        <PageHeader
          icon={<Zap size={24} color="#ffffff" />}
          title="Design System"
          colors={colors}
          onBack={() => {}}
        />

        {/* Color Swatches */}
        <ShowColorPalette
          title="Primary Colors"
          items={[
            { name: 'Primary', color: colors.primary },
            { name: 'Secondary', color: colors.secondary },
            { name: 'Accent', color: colors.accent },
            { name: 'Foreground', color: colors.foreground },
          ]}
          colors={colors}
          gradient={{
            colors: [colors.secondary, colors.secondaryGradient || colors.secondary],
            name: 'Gradient',
          }}
        />

        {/* Semantic Colors */}
        <ShowColorPalette
          title="Semantic Colors"
          items={[
            { name: 'Success', color: colors.success },
            { name: 'Warning', color: colors.warning },
            { name: 'Error', color: colors.error },
            { name: 'Info', color: colors.info },
            { name: 'Text', color: colors.textColor },
            { name: 'Border', color: colors.border },
          ]}
          colors={colors}
        />

        {/* Extra Colors */}
        <ShowColorPalette
          title="Extra Palette"
          items={Object.entries(colors.extraColors).map(([key, color]) => ({
            name: key,
            color,
          }))}
          colors={colors}
        />

{/* Button Examples */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Buttons</Text>
          <View style={styles.buttonStack}>
            <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => {}} android_ripple={{ color: colors.foreground, radius: 8 }}>
              <Text style={[styles.buttonText, { color: colors.foreground }]}>Primary</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
              ]}
              onPress={() => {}}
              android_ripple={{ color: colors.primary, radius: 8 }}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>Secondary</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: colors.error }]} onPress={() => {}} android_ripple={{ color: colors.foreground, radius: 8 }}>
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
            {['Active', 'Inactive', 'Disabled'].map((chip) => {
              const isActive = chipState[chip];
              return (
                <Pressable
                  key={chip}
                  disabled={chip === 'Disabled'}
                  onPress={() => setChipState({ ...chipState, [chip]: !isActive })}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? colors.primary : colors.foreground,
                      borderColor: colors.border,
                      opacity: chip === 'Disabled' ? 0.5 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isActive ? colors.foreground : colors.textColor,
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                  >
                    {chip}
                  </Text>
                </Pressable>
              );
            })}
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
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            {[
              { label: 'Online', color: colors.success },
              { label: 'Away', color: colors.warning },
              { label: 'Offline', color: colors.border },
            ].map((status) => (
              <View key={status.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
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
            <Pressable style={[styles.accentButton, { backgroundColor: colors.accent }]} onPress={() => {}} android_ripple={{ color: colors.foreground, radius: 8 }}>
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

        {/* Checkboxes & Radio Buttons */}
        <View style={[styles.section, { flexDirection: 'row', gap: 32 }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Checkboxes</Text>
            <View style={styles.checkboxStack}>
              {['Unchecked', 'Checked', 'Indeterminate'].map((state) => {
                const isChecked = checkboxState[state];
                return (
                  <Pressable
                    key={state}
                    onPress={() => setCheckboxState({ ...checkboxState, [state]: !isChecked })}
                    style={styles.checkboxItem}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: isChecked ? colors.primary : colors.foreground,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      {isChecked && (
                        <Text style={{ color: colors.foreground, fontWeight: 'bold' }}>✓</Text>
                      )}
                    </View>
                    <Text style={{ color: colors.textColor, fontSize: 14 }}>{state}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Radio Buttons</Text>
            <View style={styles.radioStack}>
              {['Option A', 'Option B', 'Option C'].map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setRadioState(option)}
                  style={styles.radioItem}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: colors.primary },
                    ]}
                  >
                    {radioState === option && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <Text style={{ color: colors.textColor, fontSize: 14 }}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Toggles/Switches */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Switches</Text>
          <View style={styles.toggleStack}>
            {['true', 'false'].map((key) => {
              const isActive = toggleState[key];
              return (
                <Pressable
                  key={key}
                  onPress={() => setToggleState({ ...toggleState, [key]: !isActive })}
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: isActive ? colors.primary : colors.foreground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      { left: isActive ? 20 : 2, backgroundColor: colors.foreground },
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Tags</Text>
          <View style={styles.tagStack}>
            {['Design', 'Development', 'UI/UX', 'Mobile', 'Web'].map((tag) => {
              const isSelected = selectedTags[tag];
              return (
                <Pressable
                  key={tag}
                  onPress={() => setSelectedTags({ ...selectedTags, [tag]: !isSelected })}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: isSelected ? colors.primary : hexToRgba(colors.primary, 0.2),
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <Text style={{ color: isSelected ? colors.foreground : colors.primary, fontSize: 13, fontWeight: '500' }}>#{tag}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Links</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Pressable onPress={() => {}}>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '500', textDecorationLine: 'underline', opacity: 1 }}>
                Primary Link
              </Text>
            </Pressable>
            <Pressable onPress={() => {}}>
              <Text style={{ color: colors.secondary, fontSize: 14, fontWeight: '500', textDecorationLine: 'underline', opacity: 1 }}>
                Secondary Link
              </Text>
            </Pressable>
            <Pressable onPress={() => {}}>
              <Text style={{ color: colors.accent, fontSize: 14, fontWeight: '500', textDecorationLine: 'underline', opacity: 1 }}>
                Accent Link
              </Text>
            </Pressable>
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

        {/* Tabs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Tabs</Text>
          <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
            {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, idx) => (
              <Pressable
                key={tab}
                onPress={() => setCurrentTabIdx(idx)}
                style={[
                  styles.tabItem,
                  {
                    borderBottomColor: currentTabIdx === idx ? colors.primary : 'transparent',
                    borderBottomWidth: 2,
                  },
                ]}
              >
                <Text
                  style={{
                    color: currentTabIdx === idx ? colors.primary : colors.border,
                    fontSize: 14,
                    fontWeight: '500',
                  }}
                >
                  {tab}
                </Text>
              </Pressable>
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
              <Pressable
                key={page}
                onPress={() => setCurrentPage(page)}
                style={[
                  styles.paginationItem,
                  {
                    backgroundColor: currentPage === page ? colors.primary : colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={{ color: currentPage === page ? colors.foreground : colors.textColor, fontWeight: '600' }}>
                  {page}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Rating/Stars */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Rating</Text>
          <View style={styles.ratingStack}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Text style={{ color: star <= rating ? colors.warning : colors.border, fontSize: 20 }}>
                  ★
                </Text>
              </Pressable>
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
