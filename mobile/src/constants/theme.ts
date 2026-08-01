/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

/**
 * Unica fonte di colore dell'app: ogni superficie/testo/stato deriva da qui, per ruolo semantico
 * (primary, secondary, accent, error...) e mai per nome di tinta. Le superfici composte (card, bottoni,
 * tooltip, input) si costruiscono nei componenti a partire da questi valori con hexToRgba/darkenColor
 * (vedi utils/color.ts), invece di duplicare altre palette qui.
 *
 * Ogni chiave elenca sotto tutti i punti in cui viene letta (file:riga), per poterne valutare l'impatto
 * prima di cambiarne il valore. Le righe si riferiscono allo stato del codice al momento in cui questa
 * lista è stata scritta: se aggiungi/rimuovi un utilizzo, aggiorna la voce corrispondente.
 */
/**
 * FONTE DI VERITÀ: identico a `ShowcaseColors` di colors-showcase.tsx (palette confermata definitiva).
 * Ogni superficie/testo/stato deriva da qui per ruolo semantico (primary, secondary, accent, error, foreground,
 * textColor, disabled, border...). Le chiavi legacy sono state rimosse: i punti d'uso vanno migrati ai nomi qui.
 */
export const Colors = {
  light: {
    background: '#F4F1F8',
    backgroundRadial: '#c7a8d6',
    foreground: '#e0d5e7',
    primary: 'rgb(136, 101, 255)',
    secondary: 'rgb(252, 198, 74)',
    secondaryGradient: '#FF6B6B',
    accent: '#42f5dd',
    error: '#eb3040',
    warning: '#fda129',
    info: '#39c3ff',
    success: '#31db64',
    shadow: '#000000',
    border: '#c2b1cc',
    disabled: '#495d79',
    textColor: '#191024',
    extraColors: {
      one: 'rgb(255, 73, 90)',
      two: 'rgb(241, 228, 85)',
      three: 'rgb(73, 103, 255)',
      four: 'rgb(107, 255, 73)',
      five: 'rgb(255, 155, 73)',
      six: 'rgb(178, 73, 255)',
      seven: 'rgb(73, 255, 181)',
      eight: 'rgb(255, 73, 215)',
      nine: 'rgb(73, 218, 255)',
      ten: 'rgb(231, 255, 73)',
    },
  },
  dark: {
    background: '#191024',
    backgroundRadial: '#7b2a86',
    foreground: '#261b3b',
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
    disabled: '#5c7597',
    textColor: '#fdfcf5',
    extraColors: {
      one: '#e63d4b',
      two: '#e6c73d',
      three: '#3d56e6',
      four: '#59e63d',
      five: '#e6813d',
      six: '#943de6',
      seven: '#3de697',
      eight: '#e63db3',
      nine: '#3db6e6',
      ten: '#c1e63d',
    },
  },
} as const;

/** Sfondo pieno a gradiente multi-tono (mai un wash a un colore solo), riusato su più schermate dell'app.
 *  Pastello in light, stessa famiglia della card in dark. Mai nero/bianco puro.
 *  Usato in: app/(auth)/login.tsx:128; components/app-tabs.tsx:132 (stops[1], come fill card);
 *  components/molecules/card.tsx:21; components/molecules/card.web.tsx:19 (entrambe stops[1]);
 *  components/molecules/gradient-background.tsx:13; components/molecules/tooltip.tsx:27 (stops[1] come fill solido). */
export const GradientBackground = {
  light: { stops: ['#E4D3FF', '#FCD9EC', '#FFE7B8'] },
  dark: { stops: [Colors.dark.background, '#3A1C57', '#4e1e5a'] },
} as const;

/** Macchie di luce colorata sopra il GradientBackground, per dare profondità senza illustrazioni.
 *  Usato in: components/molecules/gradient-background.tsx:14. */
export const GradientGlow = {
  light: [
    { color: Colors.light.primary, top: -60, left: -60 },
    { color: Colors.light.secondaryGradient, bottom: -80, right: -50 },
  ],
  dark: [
    { color: Colors.dark.primary, top: -60, left: -60 },
    { color: Colors.dark.secondaryGradient, bottom: -80, right: -50 },
  ],
} as const;

export type ThemeColor = Exclude<keyof typeof Colors.light & keyof typeof Colors.dark, 'extraColors'>;

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
