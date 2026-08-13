import { useRouter } from 'expo-router';
import { Home, List, Plus, Shuffle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { resolveListIcon } from '@/constants/list-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ListCardSkeleton } from '@/components/atoms/list-card-skeleton';
import { ListCard } from '@/components/cards/ListCard';
import { ContentCard } from '@/components/cards/ContentCard';
import { useMyLists } from '@/utils/useLists';

const SKELETON_COUNT = 6;
// altezza della pillola navbar (app-tabs.tsx, BAR_HEIGHT): duplicato qui per non toccare quel componente
const NAVBAR_HEIGHT = 68;

export default function HomeScreen() {
  const { t } = useTranslation('home');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const router = useRouter();

  const { lists, loading, error, loadMore } = useMyLists();
  const insets = useSafeAreaInsets();
  // spazio riservato in fondo alla lista pari all'altezza reale della navbar + inset di sistema, così l'ultimo elemento non resta nascosto dietro la pillola
  const listBottomPadding = NAVBAR_HEIGHT + insets.bottom + Spacing.three;

  // skeleton solo al primo caricamento, quando non c'è ancora nulla in cache
  const showSkeleton = loading && lists.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <PageHeader
        icon={Home}
        title={t('title')}
        action={{ icon: Plus, onPress: () => router.push('/list-form') }}
      />

      <View style={styles.randomizerWrap}>
        <ContentCard
          variant="outlined"
          icon={Shuffle}
          title={t('randomizer')}
          description={t('randomizerSubtitle')}
          onPress={() => router.push('/randomizer')}
        />
      </View>

      {showSkeleton ? (
        <View style={styles.listContent}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ListCardSkeleton key={i} colorScheme={colorScheme} />
          ))}
        </View>
      ) : (
        <FlatList
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={lists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: listBottomPadding },
            lists.length === 0 && styles.listContentEmpty,
          ]}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <ListCard
              title={item.name}
              category={item.categories[0]?.name}
              icon={resolveListIcon(item.icon)}
              color={item.color}
              itemsCount={item.itemCount}
              isHidden={item.isHidden}
              onPress={() => router.push({ pathname: '/list/[id]', params: { id: item.id } })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <EmptyState
                icon={List}
                title={error ? t('error') : t('empty.title')}
                subtitle={error ? undefined : t('empty.subtitle')}
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  randomizerWrap: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.two + Spacing.one,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
});

// =============================================================================
// MOCKUP SPERIMENTALE (home giocosa) — messo da parte su richiesta: commentato,
// non attivo. Per riattivarlo: scommenta questa sezione e rimuovi loriginale sopra.
// =============================================================================
// import { type ComponentType, type ReactNode, useEffect } from 'react';
// import {
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   useWindowDimensions,
//   View,
//   type ViewStyle,
// } from 'react-native';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur';
// import MaskedView from '@react-native-masked-view/masked-view';
// import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
// import Animated, {
//   Easing,
//   FadeIn,
//   FadeInDown,
//   FadeInUp,
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withRepeat,
//   withSequence,
//   withSpring,
//   withTiming,
// } from 'react-native-reanimated';
// import {
//   Book,
//   ChevronRight,
//   Dices,
//   Film,
//   Gamepad2,
//   Music,
//   Plane,
//   Plus,
//   Sparkles,
//   UtensilsCrossed,
// } from 'lucide-react-native';
// import { Colors, Spacing } from '@/constants/theme';
// import { RadialBackground } from '@/components/molecules/radial-background';
// import { useAppTheme } from '@/utils/useAppTheme';
//
// const NAVBAR_HEIGHT = 68;
//
// // Union dei due schemi: Colors[scheme] non è restringibile a un solo scheme (literal `as const`)
// type ThemeColors = typeof Colors.light | typeof Colors.dark;
// type ExtraColorKey = keyof typeof Colors.dark.extraColors;
// type IconType = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
//
// // Liste finte: colori presi SOLO dalla palette extra del tema (colors.extraColors)
// type MockList = { id: string; name: string; category: string; icon: IconType; colorKey: ExtraColorKey; count: number };
// const MOCK_LISTS: MockList[] = [
//   { id: '1', name: 'Film Cult', category: 'Cinema', icon: Film, colorKey: 'one', count: 42 },
//   { id: '2', name: 'Serata Giochi', category: 'Gaming', icon: Gamepad2, colorKey: 'three', count: 18 },
//   { id: '3', name: 'Da Provare', category: 'Food', icon: UtensilsCrossed, colorKey: 'five', count: 27 },
//   { id: '4', name: 'Viaggi 2026', category: 'Travel', icon: Plane, colorKey: 'seven', count: 9 },
//   { id: '5', name: 'Da Leggere', category: 'Lettura', icon: Book, colorKey: 'six', count: 55 },
//   { id: '6', name: 'Estate Mix', category: 'Musica', icon: Music, colorKey: 'eight', count: 33 },
// ];
//
// /** rgba robusto: accetta sia hex (#rrggbb) sia stringhe rgb()/rgba() dei token del tema. */
// function toRgba(color: string, alpha: number): string {
//   if (color.startsWith('rgb')) {
//     const [r, g, b] = color.replace(/rgba?\(|\)/g, '').split(',').map((s) => s.trim());
//     return `rgba(${r},${g},${b},${alpha})`;
//   }
//   const num = parseInt(color.replace('#', ''), 16);
//   return `rgba(${(num >> 16) & 0xff},${(num >> 8) & 0xff},${num & 0xff},${alpha})`;
// }
//
// /** Blob di luce morbido (radial gradient) che fluttua sullo sfondo scuro: dà profondità "spaziale". */
// function GlowOrb({ id, color, size, top, left, drift }: { id: string; color: string; size: number; top: number; left: number; drift: number }) {
//   const t = useSharedValue(0);
//   useEffect(() => {
//     t.value = withRepeat(withTiming(1, { duration: drift, easing: Easing.inOut(Easing.sin) }), -1, true);
//   }, [t, drift]);
//   const style = useAnimatedStyle(() => ({
//     transform: [
//       { translateY: interpolate(t.value, [0, 1], [-24, 22]) },
//       { translateX: interpolate(t.value, [0, 1], [-16, 18]) },
//       { scale: interpolate(t.value, [0, 1], [0.9, 1.2]) },
//     ],
//   }));
//   return (
//     <Animated.View pointerEvents="none" style={[{ position: 'absolute', top, left, width: size, height: size }, style]}>
//       <Svg width={size} height={size}>
//         <Defs>
//           <RadialGradient id={id} cx="50%" cy="50%" r="50%">
//             <Stop offset="0" stopColor={color} stopOpacity={0.55} />
//             <Stop offset="1" stopColor={color} stopOpacity={0} />
//           </RadialGradient>
//         </Defs>
//         <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
//       </Svg>
//     </Animated.View>
//   );
// }
//
// /** Stellina che pulsa: opacità + scala + micro-rotazione in loop. */
// function Twinkle({ top, left, size = 14, color, delay = 0 }: { top: number; left: number; size?: number; color: string; delay?: number }) {
//   const t = useSharedValue(0);
//   useEffect(() => {
//     t.value = withRepeat(withSequence(withTiming(1, { duration: 900 + delay }), withTiming(0, { duration: 900 })), -1, false);
//   }, [t, delay]);
//   const style = useAnimatedStyle(() => ({
//     opacity: interpolate(t.value, [0, 1], [0.15, 1]),
//     transform: [{ scale: interpolate(t.value, [0, 1], [0.6, 1.15]) }, { rotate: `${interpolate(t.value, [0, 1], [0, 90])}deg` }],
//   }));
//   return (
//     <Animated.View pointerEvents="none" style={[{ position: 'absolute', top, left }, style]}>
//       <Sparkles size={size} color={color} />
//     </Animated.View>
//   );
// }
//
// /** Testo con riempimento a gradiente (MaskedView + LinearGradient). */
// function GradientText({ text, colors, style }: { text: string; colors: readonly [string, string, ...string[]]; style: object }) {
//   return (
//     <MaskedView maskElement={<Text style={style}>{text}</Text>}>
//       <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//         <Text style={[style, { opacity: 0 }]}>{text}</Text>
//       </LinearGradient>
//     </MaskedView>
//   );
// }
//
// /** Wrapper premibile con rimbalzo (scale spring su pressIn/out). */
// function Bouncy({ children, onPress, style }: { children: ReactNode; onPress?: () => void; style?: ViewStyle }) {
//   const scale = useSharedValue(1);
//   const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
//   return (
//     <Pressable
//       onPress={onPress}
//       onPressIn={() => (scale.value = withSpring(0.95, { damping: 12, stiffness: 320 }))}
//       onPressOut={() => (scale.value = withSpring(1, { damping: 10, stiffness: 260 }))}
//     >
//       <Animated.View style={[style, animated]}>{children}</Animated.View>
//     </Pressable>
//   );
// }
//
// /** HERO: dado gigante che ondeggia dentro un anello di luce pulsante, con stelline in orbita. */
// function HeroDice({ colors }: { colors: ThemeColors }) {
//   const pulse = useSharedValue(0);
//   const wobble = useSharedValue(0);
//   const orbit = useSharedValue(0);
//   useEffect(() => {
//     pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) }), -1, false);
//     wobble.value = withRepeat(withSequence(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.sin) }), withTiming(-1, { duration: 1300, easing: Easing.inOut(Easing.sin) })), -1, true);
//     orbit.value = withRepeat(withTiming(1, { duration: 9000, easing: Easing.linear }), -1, false);
//   }, [pulse, wobble, orbit]);
//
//   const ringStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(pulse.value, [0, 1], [0.5, 0]),
//     transform: [{ scale: interpolate(pulse.value, [0, 1], [0.85, 1.5]) }],
//   }));
//   const diceStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: interpolate(wobble.value, [-1, 1], [-6, 6]) }, { rotate: `${interpolate(wobble.value, [-1, 1], [-10, 10])}deg` }],
//   }));
//   const orbitStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${interpolate(orbit.value, [0, 1], [0, 360])}deg` }] }));
//
//   return (
//     <View style={styles.heroDiceWrap}>
//       <Animated.View style={[styles.heroRing, { borderColor: colors.secondary }, ringStyle]} />
//       <Animated.View style={[styles.heroOrbit, orbitStyle]}>
//         <Twinkle top={0} left={54} size={16} color={colors.accent} />
//         <Twinkle top={54} left={0} size={12} color={colors.secondary} delay={300} />
//         <Twinkle top={100} left={100} size={14} color={colors.textColor} delay={600} />
//       </Animated.View>
//       <Animated.View style={diceStyle}>
//         <Dices size={68} color={colors.textColor} strokeWidth={2} />
//       </Animated.View>
//     </View>
//   );
// }
//
// /** Card lista orizzontale in stile "gioco": bordo a gradiente, badge icona luminoso, contatore a moneta.
//  *  Riga a larghezza piena, altezza uniforme, testo a una riga. */
// function LuckyCard({ list, index, colors }: { list: MockList; index: number; colors: ThemeColors }) {
//   const Icon = list.icon;
//   const color = colors.extraColors[list.colorKey];
//   return (
//     <Animated.View entering={FadeInDown.delay(200 + index * 70).springify().damping(14)}>
//       <Bouncy>
//         <LinearGradient
//           colors={[toRgba(color, 0.9), toRgba(color, 0.12)]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.rowBorder}
//         >
//           <View style={[styles.rowInner, { backgroundColor: colors.foreground }]}>
//             <View style={[styles.cardIconBadge, { shadowColor: color }]}>
//               <LinearGradient colors={[color, toRgba(color, 0.65)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIconFill}>
//                 <Icon size={22} color={colors.textColor} strokeWidth={2.2} />
//               </LinearGradient>
//             </View>
//             <View style={styles.rowText}>
//               <Text style={[styles.cardName, { color: colors.textColor }]} numberOfLines={1}>
//                 {list.name}
//               </Text>
//               <Text style={[styles.cardCategory, { color: toRgba(colors.textColor, 0.55) }]} numberOfLines={1}>
//                 {list.category}
//               </Text>
//             </View>
//             <View style={[styles.coin, { backgroundColor: toRgba(color, 0.18), borderColor: toRgba(color, 0.5) }]}>
//               <Text style={[styles.coinText, { color }]}>{list.count}</Text>
//             </View>
//             <ChevronRight size={18} color={toRgba(colors.textColor, 0.4)} />
//           </View>
//         </LinearGradient>
//       </Bouncy>
//     </Animated.View>
//   );
// }
//
// export default function HomeScreen() {
//   const { colorScheme } = useAppTheme();
//   const colors = Colors[colorScheme];
//   const insets = useSafeAreaInsets();
//   const { width: screenWidth } = useWindowDimensions();
//
//   const listGap = Spacing.two + Spacing.half;
//   const bottomPad = NAVBAR_HEIGHT + insets.bottom + Spacing.five;
//
//   return (
//     <View style={[styles.root, { backgroundColor: colors.background }]}>
//       {/* Sfondo full-screen dietro tutto (anche la safe area): niente più bianco in overscroll */}
//       <RadialBackground colorScheme={colorScheme} />
//       <GlowOrb id="orb1" color={colors.primary} size={280} top={-40} left={-60} drift={7000} />
//       <GlowOrb id="orb2" color={colors.secondaryGradient} size={240} top={220} left={screenWidth - 160} drift={8500} />
//       <GlowOrb id="orb3" color={colors.accent} size={200} top={520} left={-40} drift={9500} />
//       <Twinkle top={120} left={screenWidth - 60} size={18} color={colors.secondary} />
//       <Twinkle top={80} left={40} size={12} color={colors.accent} delay={500} />
//
//       <SafeAreaView style={styles.safe} edges={['top']}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}>
//         {/* Titolo */}
//         <Animated.View entering={FadeInDown.springify().damping(16)} style={styles.greetRow}>
//           <View style={styles.greetText}>
//             <Text style={[styles.bigTitle, { color: colors.textColor }]}>Cosa facciamo </Text>
//             <GradientText text="oggi?" colors={[colors.secondary, colors.secondaryGradient]} style={styles.bigTitle} />
//           </View>
//           <Bouncy style={styles.avatar}>
//             <LinearGradient colors={[colors.primary, colors.secondaryGradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatarRing}>
//               <View style={[styles.avatarInner, { backgroundColor: colors.background }]}>
//                 <Text style={styles.avatarEmoji}>🎲</Text>
//               </View>
//             </LinearGradient>
//           </Bouncy>
//         </Animated.View>
//
//         {/* HERO randomizer: il cuore giocoso della pagina (rimanda a /randomizer, feature reale) */}
//         <Animated.View entering={FadeIn.delay(180).duration(500)}>
//           <Bouncy style={styles.heroCard}>
//             <LinearGradient colors={[colors.primary, colors.secondaryGradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroGradient}>
//               <BlurView intensity={20} tint="light" style={styles.heroBlur} pointerEvents="none" />
//               <View style={styles.heroContent}>
//                 <View style={styles.heroLeft}>
//                   <Text style={[styles.heroKicker, { color: toRgba(colors.textColor, 0.8) }]}>NON SAI COSA SCEGLIERE?</Text>
//                   <Text style={[styles.heroTitle, { color: colors.textColor }]}>Tira il dado</Text>
//                   <View style={[styles.heroCta, { backgroundColor: colors.textColor }]}>
//                     <Text style={[styles.heroCtaText, { color: colors.background }]}>SORTEGGIA ORA</Text>
//                     <ChevronRight size={16} color={colors.background} strokeWidth={3} />
//                   </View>
//                 </View>
//                 <HeroDice colors={colors} />
//               </View>
//             </LinearGradient>
//           </Bouncy>
//         </Animated.View>
//
//         {/* Sezione liste */}
//         <Animated.View entering={FadeIn.delay(240)} style={styles.sectionHeader}>
//           <Text style={[styles.sectionTitle, { color: colors.textColor }]}>Le tue liste</Text>
//         </Animated.View>
//
//         <View style={{ gap: listGap }}>
//           {MOCK_LISTS.map((list, i) => (
//             <LuckyCard key={list.id} list={list} index={i} colors={colors} />
//           ))}
//         </View>
//       </ScrollView>
//       </SafeAreaView>
//
//       {/* FAB "+" luminoso (crea lista, feature reale) */}
//       <Animated.View entering={FadeInUp.delay(400).springify()} style={[styles.fab, { bottom: NAVBAR_HEIGHT + insets.bottom + Spacing.three }]}>
//         <Bouncy>
//           <LinearGradient colors={[colors.secondary, colors.secondaryGradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.fabInner, { shadowColor: colors.secondaryGradient }]}>
//             <Plus size={28} color={colors.background} strokeWidth={3} />
//           </LinearGradient>
//         </Bouncy>
//       </Animated.View>
//     </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   root: { flex: 1 },
//   safe: { flex: 1 },
//   scroll: { paddingHorizontal: Spacing.four, paddingTop: Spacing.two },
//
//   greetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.two },
//   greetText: { flex: 1 },
//   bigTitle: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5, lineHeight: 38 },
//
//   avatar: { width: 60, height: 60 },
//   avatarRing: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
//   avatarInner: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
//   avatarEmoji: { fontSize: 26 },
//
//   heroCard: { marginTop: Spacing.four, borderRadius: 28, overflow: 'hidden' },
//   heroGradient: { borderRadius: 28, padding: Spacing.four, overflow: 'hidden' },
//   heroBlur: { ...StyleSheet.absoluteFillObject, opacity: 0.25 },
//   heroContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   heroLeft: { flex: 1 },
//   heroKicker: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
//   heroTitle: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5, marginTop: Spacing.one, marginBottom: Spacing.three },
//   heroCta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, alignSelf: 'flex-start', paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: 999 },
//   heroCtaText: { fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
//
//   heroDiceWrap: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
//   heroRing: { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 3 },
//   heroOrbit: { position: 'absolute', width: 120, height: 120 },
//
//   sectionHeader: { marginTop: Spacing.five, marginBottom: Spacing.three },
//   sectionTitle: { fontSize: 20, fontWeight: '800' },
//
//   rowBorder: { borderRadius: 18, padding: 1.5 },
//   rowInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, borderRadius: 17, paddingVertical: Spacing.two + Spacing.half, paddingHorizontal: Spacing.three },
//   rowText: { flex: 1 },
//   cardIconBadge: { borderRadius: 12, shadowOpacity: 0.6, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 5 },
//   cardIconFill: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
//   cardName: { fontSize: 15, fontWeight: '800' },
//   cardCategory: { fontSize: 12, fontWeight: '600', marginTop: 2 },
//   coin: { minWidth: 30, paddingHorizontal: Spacing.two, height: 24, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
//   coinText: { fontSize: 13, fontWeight: '900' },
//
//   fab: { position: 'absolute', right: Spacing.four },
//   fabInner: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
// });
