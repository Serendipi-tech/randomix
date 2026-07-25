import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

const BAR_HEIGHT = 68;
const CORNER = 12;
const HOME_SIZE = 52;
const HOME_LIFT = (BAR_HEIGHT - HOME_SIZE) / 2;

export const styles = StyleSheet.create({
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
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, fontFamily: 'Inter' },
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
  swatchItem: { alignItems: 'center', flex: 1, minWidth: '30%' },
  swatchBox: { width: '100%', height: 24, borderRadius: 8, marginBottom: 0, justifyContent: 'center', alignItems: 'center' },
  swatchLabel: { fontSize: 13, fontWeight: '500' },
  gradientBox: { flex: 1, minWidth: '30%', height: 24, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

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

  // PageHeader
  pageHeaderWrapper: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
    gap: 8,
  },
  pageHeaderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  pageHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pageHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  pageHeaderSubtitle: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'Inter',
  },
  pageHeaderBackButton: {
    fontSize: 24,
    color: '#ffffff',
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
