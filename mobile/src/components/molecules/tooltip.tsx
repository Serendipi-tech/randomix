import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { TooltipSurface } from '@/constants/theme';

type TooltipProps = PropsWithChildren<{
  visible: boolean;
  placement?: 'top' | 'bottom';
}>;

/** Popover flottante generico, ancorato al proprio elemento trigger (renderizzato dal chiamante).
 *  Superficie sempre solida in tinta brand, non il vetro semi-trasparente della card: da leggere anche sopra altro contenuto. */
export function Tooltip({ visible, placement = 'top', children }: TooltipProps) {
  if (!visible) return null;

  return <View style={[styles.tooltip, placement === 'top' ? styles.top : styles.bottom]}>{children}</View>;
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    right: -8,
    width: 220,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: TooltipSurface.border,
    backgroundColor: TooltipSurface.fill,
    padding: 14,
    gap: 8,
    boxShadow: '0px 8px 20px rgba(0,0,0,0.35)',
    zIndex: 20,
    elevation: 8,
  },
  top: { bottom: 22 },
  bottom: { top: 22 },
});
