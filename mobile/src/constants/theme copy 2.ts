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
export const Colors = {
  light: {
    // app/(app)/draw.tsx:57; app/(app)/randomizer.tsx:85; app/(app)/list-form.tsx:100;
    // app/(app)/group-list/[groupListId].tsx:89; app/(app)/friend/[id].tsx:26; app/(app)/group/[id].tsx:155;
    // app/(app)/list/[id].tsx:54; app/(app)/item-form.tsx:122; components/molecules/confirm-sheet.tsx:31
    background: '#ffffff',
    // components/group/group-member-row.tsx:24; components/group/group-list-card.tsx:32;
    // components/group/group-card.tsx:31; components/group/group-invite-row.tsx:30;
    // components/molecules/confirm-sheet.tsx:40; components/atoms/list-card-skeleton.tsx:13;
    // components/atoms/selectable-chip.tsx:21; components/molecules/friend-row.tsx:31;
    // components/molecules/friend-request-row.tsx:30; components/molecules/list-card.tsx:22;
    // components/molecules/item-row.tsx:57; components/molecules/profile-header.tsx:27;
    // components/molecules/user-search-row.tsx:29; app/(app)/group-list/[groupListId].tsx:104,194,230;
    // app/(app)/(tabs)/groups.tsx:94; app/(app)/(tabs)/profile.tsx:69;
    // app/(app)/group/[id].tsx:212,256,284,305,337,345
    backgroundElement: '#F0F0F3',
    // components/group/group-invite-row.tsx:52; components/atoms/list-card-skeleton.tsx:14,16,17;
    // components/molecules/friend-request-row.tsx:48; components/molecules/item-row.tsx:88,101;
    // components/molecules/friend-row.tsx:43
    backgroundSelected: '#E0E1E6',
    // Usatissimo come testo principale su sfondo piatto (non su card/glass, per quello vedi titleColor).
    // app/(app)/(tabs)/groups.tsx:91,140,169; app/(app)/randomizer.tsx:91;
    // app/(app)/group-list/[groupListId].tsx:96,108,172,195,231; app/(app)/(tabs)/friends.tsx:64,68,85,110,120;
    // app/(app)/(tabs)/profile.tsx:55; app/(app)/list-form.tsx:106,131,141,159; app/(app)/draw.tsx:62,70;
    // app/(app)/(tabs)/index.tsx:31,81; app/(app)/(tabs)/notifications.tsx:16;
    // app/(app)/item-form.tsx:128,134,146,180,195,209; app/(app)/group/[id].tsx:170,174,182,257,266,285,307;
    // app/(app)/list/[id].tsx:61,74,99,108,133; app/(app)/friend/[id].tsx:41,67,71,78;
    // components/themed-text.tsx:17 (default di useTheme/ThemedText); components/group/group-member-row.tsx:26;
    // components/group/group-list-card.tsx:39; components/group/group-card.tsx:35;
    // components/group/group-invite-row.tsx:32; components/molecules/confirm-sheet.tsx:32,41;
    // components/molecules/friend-request-row.tsx:32; components/molecules/list-card.tsx:29;
    // components/molecules/profile-header.tsx:30; components/molecules/friend-row.tsx:35;
    // components/molecules/item-row.tsx:61; components/molecules/user-search-row.tsx:31
    text: '#000000',
    // components/group/group-invite-row.tsx:35,41,54; components/group/group-card.tsx:38,41,45;
    // components/group/group-member-row.tsx:29; components/group/group-list-card.tsx:43,47;
    // app/(app)/draw.tsx:60; components/molecules/confirm-sheet.tsx:33; app/(app)/friend/[id].tsx:29;
    // app/(app)/group/[id].tsx:158,176,184,226,292,311,316; app/(app)/(tabs)/groups.tsx:173;
    // app/(app)/group-list/[groupListId].tsx:94,105,110,155,175,181,220,233;
    // app/(app)/(tabs)/friends.tsx:107,124; app/(app)/(tabs)/notifications.tsx:17;
    // app/(app)/randomizer.tsx:89,163,189; app/(app)/item-form.tsx:126; components/molecules/friend-row.tsx:44,47;
    // app/(app)/list-form.tsx:104; app/(app)/(tabs)/index.tsx:85; app/(app)/list/[id].tsx:57,103,136;
    // components/atoms/star-rating.tsx:14; components/molecules/friend-request-row.tsx:49;
    // components/atoms/selectable-chip.tsx:24; components/molecules/item-row.tsx:65,71,89,102;
    // components/molecules/list-card.tsx:33,38; components/molecules/user-search-row.tsx:35;
    // components/molecules/profile-header.tsx:33
    textSecondary: '#60646C',
    // testo/titoli sopra superfici colorate (card glass, bottone outline, sfondo gradiente, tab bar)
    // components/app-tabs.tsx:98; components/atoms/button.tsx:37; components/atoms/divider.tsx:13;
    // components/atoms/input.tsx:15,23; components/atoms/theme-toggle-button.tsx:23;
    // components/atoms/refresh-button.tsx:23; components/molecules/feature-row.tsx:18;
    // components/organisms/auth-login-face.tsx:43; components/organisms/auth-register-face.tsx:45;
    // components/organisms/auth-recover-face.tsx:48; components/molecules/title.tsx:11
    titleColor: '#241A3D',
    // components/organisms/auth-login-face.tsx:44; components/organisms/auth-register-face.tsx:46
    linkColor: '#6A46E0',
    // components/app-tabs.tsx:97; components/atoms/input.tsx:28; components/atoms/password-input.tsx:17;
    // components/atoms/divider.tsx:18
    placeholder: '#8A8398',
    // components/app-tabs.tsx:114,131,205; components/atoms/button.tsx:67,88; app/(app)/draw.tsx:54,75,174;
    // app/(app)/randomizer.tsx:22 (ACCENT_CYCLE); app/(app)/(tabs)/index.tsx:44,116,130;
    // app/(app)/list-form.tsx:22 (LIST_COLORS); app/(app)/item-form.tsx:23,296 (TAG_COLORS);
    // app/(app)/group/[id].tsx:26 (LIST_COLORS); components/atoms/selectable-chip.tsx:21,24,40;
    // components/molecules/card.tsx:20; components/molecules/card.web.tsx:18;
    // components/atoms/user-avatar.tsx:33; components/molecules/dice-logo.tsx:23;
    // components/molecules/profile-header.tsx:66,70; theme.ts (GradientGlow, sotto)
    primary: '#7C5CFC',
    // app/(app)/randomizer.tsx:19 (ACCENT_CYCLE); app/(app)/group-list/[groupListId].tsx:201;
    // components/app-tabs.tsx:114; app/(app)/list-form.tsx:19 (LIST_COLORS); components/atoms/button.tsx:67;
    // app/(app)/item-form.tsx:20 (TAG_COLORS); app/(app)/group/[id].tsx:23 (LIST_COLORS);
    // components/organisms/auth-standard-face.tsx:19; components/molecules/title.tsx:45;
    // theme.ts (GradientGlow, sotto)
    secondary: '#FF6B6B',
    // app/(app)/item-form.tsx:19 (TAG_COLORS); app/(app)/randomizer.tsx:18 (ACCENT_CYCLE);
    // app/(app)/group/[id].tsx:22 (LIST_COLORS); app/(app)/group-list/[groupListId].tsx:89,201;
    // app/(app)/list-form.tsx:18 (LIST_COLORS); app/(app)/(tabs)/index.tsx:44;
    // components/organisms/auth-standard-face.tsx:21; components/molecules/user-search-row.tsx:68;
    // components/themed-text.tsx:66 (stile "linkPrimary"); components/animated-icon.tsx:143 (overlay splash)
    accent: '#208AEF',
    // app/(app)/randomizer.tsx:231; app/(app)/group/[id].tsx:436,486; app/(app)/group-list/[groupListId].tsx:380;
    // app/(app)/item-form.tsx:307; app/(app)/list-form.tsx:232; app/(app)/(tabs)/groups.tsx:212;
    // app/(app)/(tabs)/friends.tsx:165; app/(app)/(tabs)/profile.tsx:115;
    // components/molecules/confirm-sheet.tsx:74; components/molecules/form-error.tsx:17;
    // components/molecules/password-strength.tsx:15; components/group/group-member-row.tsx:64,69
    error: '#E53E3E',
    // app/(app)/draw.tsx:66; components/atoms/star-rating.tsx:24; app/(app)/randomizer.tsx:20 (ACCENT_CYCLE);
    // app/(app)/list-form.tsx:20 (LIST_COLORS); app/(app)/group/[id].tsx:24 (LIST_COLORS);
    // app/(app)/item-form.tsx:21 (TAG_COLORS); components/organisms/auth-standard-face.tsx:20;
    // components/molecules/item-row.tsx:30,75; components/molecules/password-strength.tsx:16
    warning: '#FFD166',
    // app/(app)/draw.tsx:67; app/(app)/list-form.tsx:21 (LIST_COLORS); app/(app)/item-form.tsx:22 (TAG_COLORS);
    // app/(app)/randomizer.tsx:21 (ACCENT_CYCLE); app/(app)/group/[id].tsx:25 (LIST_COLORS);
    // components/molecules/friend-request-row.tsx:40; components/organisms/auth-standard-face.tsx:22;
    // components/molecules/item-row.tsx:31; components/molecules/password-strength.tsx:17;
    // components/group/group-invite-row.tsx:96
    success: '#06D6A0',
    // nessun utilizzo diretto al momento: stesso valore di accent, riservato per un ruolo "informativo"
    // (banner/badge) che oggi non esiste ancora come componente separato.
    info: '#208AEF',
    // components/atoms/sticker-shape.tsx:97; components/molecules/confirm-sheet.tsx:52;
    // components/molecules/dice-logo.tsx:89,118; app/(app)/randomizer.tsx:246,284;
    // components/molecules/card.web.tsx:42; components/molecules/feature-row.tsx:52;
    // components/molecules/card.tsx:42; components/molecules/item-row.tsx:115;
    // components/molecules/list-card.tsx:51; components/molecules/tooltip.tsx:30
    shadow: '#000000',
    // bianco puro, riusato per testo/bordi su superfici piene o vetro (bottoni, tab bar, card, tooltip...)
    // components/app-tabs.tsx:120,133; components/atoms/button.tsx:73,75; components/atoms/input.tsx:15;
    // components/atoms/divider.tsx:13; components/molecules/confirm-sheet.tsx:78;
    // components/atoms/user-avatar.tsx:38; components/molecules/card.web.tsx:20; components/molecules/card.tsx:22;
    // components/molecules/dice-logo.tsx:31; app/(app)/randomizer.tsx:254;
    // components/molecules/friend-request-row.tsx:76; app/(app)/draw.tsx:184,189,193,198,214,218;
    // components/molecules/feature-row.tsx:30; components/molecules/item-row.tsx:162;
    // app/(app)/item-form.tsx:300; components/molecules/password-strength.tsx:55,57;
    // components/molecules/tooltip.tsx:26; components/molecules/user-search-row.tsx:75;
    // app/(app)/(tabs)/index.tsx:120,146,150,154; components/atoms/sticker-shape.tsx:103,106,109;
    // components/atoms/theme-toggle-button.tsx:19,23 (variante dark); components/atoms/refresh-button.tsx:19,23 (variante dark);
    // app/(app)/list/[id].tsx:208; components/group/group-invite-row.tsx:99
    border: '#FFFFFF',
    // colori decorativi senza ruolo semantico (dado): nessun altro posto dove starebbero
    extraColors: {
      // app/(app)/randomizer.tsx:263 (diceFace); components/molecules/dice-logo.tsx:84 (body)
      one: '#FFFBF6',
      // app/(app)/randomizer.tsx:266 (diceFace shadowColor); components/molecules/dice-logo.tsx:37,88 (bevelShadow)
      two: '#D8CDEB',
      // app/(app)/randomizer.tsx:265 (diceFace border); components/molecules/dice-logo.tsx:86 (body border)
      three: '#E4D6F5',
      // app/(app)/randomizer.tsx:274 (diceText); components/molecules/dice-logo.tsx:114 (pip)
      four: '#5B3FD6',
    },
  },
  dark: {
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    text: '#ffffff',
    textSecondary: '#B0B4BA',
    titleColor: '#F3ECFF',
    linkColor: '#C9B8FF',
    placeholder: '#B9AEDC',
    primary: '#7C5CFC',
    secondary: '#FF6B6B',
    accent: '#208AEF',
    error: '#E53E3E',
    warning: '#FFD166',
    success: '#06D6A0',
    info: '#208AEF',
    shadow: '#000000',
    border: '#FFFFFF',
    extraColors: {
      one: '#FFFBF6',
      two: '#D8CDEB',
      three: '#E4D6F5',
      four: '#5B3FD6',
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
  dark: { stops: ['#120A26', '#3A1C57', '#5A1E4E'] },
} as const;

/** Macchie di luce colorata sopra il GradientBackground, per dare profondità senza illustrazioni.
 *  Riusa Colors.primary/secondary invece di tinte proprie. Usato in: components/molecules/gradient-background.tsx:14. */
export const GradientGlow = {
  light: [
    { color: Colors.light.primary, top: -60, left: -60 },
    { color: Colors.light.secondary, bottom: -80, right: -50 },
  ],
  dark: [
    { color: Colors.dark.primary, top: -60, left: -60 },
    { color: Colors.dark.secondary, bottom: -80, right: -50 },
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
