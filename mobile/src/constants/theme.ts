/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

/** Colori accent giocosi: usati su elementi decorativi (logo, blob, glow), non su testo/superfici standard. */
export const Accent = {
  primary: '#208AEF',
  coral: '#FF6B6B',
  yellow: '#FFD166',
  mint: '#06D6A0',
  violet: '#7C5CFC',
} as const;

/** Sfondo pieno delle schermate di autenticazione: gradiente multi-tono (mai un wash a un colore solo). Pastello in light, stessa famiglia della card in dark. Mai nero/bianco puro. */
export const AuthBackground = {
  light: { stops: ['#E4D3FF', '#FCD9EC', '#FFE7B8'] },
  dark: { stops: ['#120A26', '#3A1C57', '#5A1E4E'] },
} as const;

/** Macchie di luce colorata sopra AuthBackground, per dare profondità senza illustrazioni. */
export const AuthGlow = {
  light: [
    { color: Accent.violet, top: -60, left: -60 },
    { color: Accent.coral, bottom: -80, right: -50 },
  ],
  dark: [
    { color: Accent.violet, top: -60, left: -60 },
    { color: Accent.coral, bottom: -80, right: -50 },
  ],
} as const;

/** Superficie glass della card di autenticazione: tinta semi-trasparente sopra il blur, bordo sottile per il bordo "vetro". */
export const AuthCardSurface = {
  light: { fill: 'rgba(124,92,252,0.30)', border: 'rgba(255,255,255,0.5)', text: '#241A3D' },
  dark: { fill: 'rgba(58,28,87,0.58)', border: 'rgba(255,255,255,0.16)', text: '#F3ECFF' },
} as const;

/** Bottone primario: pillola piena a colore unico. Il secondario è un outline sullo stesso colore, non un altro blocco pieno. */
export const AuthButtonPrimary = {
  fill: Accent.violet,
  text: '#FFFFFF',
} as const;

export const AuthButtonSecondary = {
  light: { border: '#241A3D', text: '#241A3D' },
  dark: { border: '#F3ECFF', text: '#F3ECFF' },
} as const;

/** Badge icona colorato nelle tile della faccia standard: un solo tocco di colore per tile, non l'intera superficie. */
export const AuthTileSurface = {
  light: { fill: 'rgba(31,27,46,0.05)' },
  dark: { fill: 'rgba(255,255,255,0.07)' },
} as const;

/** Campo di input sopra la AuthCard: tinta neutra derivata dal colore testo della card. */
export const AuthInputSurface = {
  light: { fill: 'rgba(31,27,46,0.06)', placeholder: '#8A8398' },
  dark: { fill: 'rgba(255,255,255,0.08)', placeholder: '#B9AEDC' },
} as const;

/** Testo che poggia direttamente su AuthBackground (titolo, tagline, link) fuori dalla card. */
export const AuthOnBackgroundText = {
  light: { primary: '#241A3D', secondary: 'rgba(36,26,61,0.7)' },
  dark: { primary: '#F3ECFF', secondary: 'rgba(243,236,255,0.72)' },
} as const;

/** Shading pseudo-3D del dado: bordo chiaro in alto, ombra scura in basso, per dare volume senza asset illustrati. */
export const DiceShading = {
  face: '#FFFBF6',
  highlight: '#FFFFFF',
  shadowEdge: '#D8CDEB',
  border: '#E4D6F5',
  pip: '#5B3FD6',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
