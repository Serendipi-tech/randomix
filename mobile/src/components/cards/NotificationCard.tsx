import type { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Clock, Trash2, X } from 'lucide-react-native';
import { Colors, DisplayFonts } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { CardShell } from '@/components/cards/CardShell';
import { UserAvatar } from '@/components/atoms/user-avatar';
import { Button } from '@/components/atoms/Button';

export type NotificationStatusKind = 'pending' | 'accepted' | 'declined';

export type NotificationCardActions = {
  acceptLabel: string;
  rejectLabel: string;
  onAccept: () => void;
  onReject: () => void;
  disabled?: boolean;
};

type NotificationCardProps = {
  title: string;
  body?: string | null;
  /** Distanza temporale già formattata, in alto a destra. */
  timeLabel: string;
  /** Colore della barra a sinistra e della tinta dell'icona. */
  accentColor: string;
  unread?: boolean;
  /** Icona nel riquadro a sinistra; ignorata se arriva `avatar`. */
  icon?: ComponentType<{ size?: number; color?: string }>;
  /** Avatar al posto del riquadro icona (notifiche legate a una persona). */
  avatar?: { username: string; avatarUrl: string | null };
  /** Esito della riga, a destra del corpo: orologio in attesa, spunta se accettata, croce se
   *  rifiutata. Icona sola, non premibile; l'etichetta serve all'accessibilità. */
  status?: { kind: NotificationStatusKind; label: string };
  /** Coppia di azioni accetta/rifiuta sotto il corpo. */
  actions?: NotificationCardActions;
  /** Ritiro o rimozione della riga: cestino tondo a destra del corpo, senza etichetta (la label
   *  serve all'accessibilità). */
  cancelAction?: { label: string; onPress: () => void; disabled?: boolean };
  /** Tap sull'intera card (es. segnare come letta); le azioni interne restano prioritarie. */
  onPress?: () => void;
};

const MEDIA_SIZE = 40;
const ICON_SIZE = 20;
const STATUS_ICON_SIZE = 12;
const CARD_RADIUS = 16;
// Spessore del bordo d'accento a sinistra: col raggio della card si chiude a punta sulle curve
const ACCENT_EDGE_WIDTH = 3;
const BODY_MAX_LINES = 1;

const STATUS_ICONS = { pending: Clock, accepted: Check, declined: X } as const;

/** Card di una riga del feed notifiche: barra d'accento a sinistra, avatar o icona, titolo con
 *  orario, corpo e, opzionali, azioni o pill di stato. Componente dumb: testi e handler da props. */
export function NotificationCard({
  title,
  body,
  timeLabel,
  accentColor,
  unread = false,
  icon: Icon,
  avatar,
  status,
  actions,
  cancelAction,
  onPress,
}: NotificationCardProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const StatusIcon = STATUS_ICONS[status?.kind ?? 'pending'];

  return (
    <CardShell
      backgroundColor={colors.foreground}
      borderColor={hexToRgba(accentColor, unread ? 0.45 : 0.22)}
      radius={CARD_RADIUS}
      padding={0}
      accentEdgeColor={hexToRgba(accentColor, unread ? 1 : 0.5)}
      accentEdgeWidth={ACCENT_EDGE_WIDTH}
      onPress={onPress}
    >
      <View style={styles.inner}>
        {avatar ? (
          <UserAvatar username={avatar.username} avatarUrl={avatar.avatarUrl} size={MEDIA_SIZE} />
        ) : (
          <View style={[styles.iconTile, { backgroundColor: hexToRgba(accentColor, 0.18) }]}>
            {Icon && <Icon size={ICON_SIZE} color={accentColor} />}
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.textColor }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.time, { color: colors.textColor }]}>{timeLabel}</Text>
          </View>

          {(body || status) && (
            <View style={styles.bodyRow}>
              {body && (
                <Text style={[styles.body, { color: colors.textColor }]} numberOfLines={BODY_MAX_LINES}>
                  {body}
                </Text>
              )}
              {status && (
                <StatusIcon
                  size={STATUS_ICON_SIZE + 4}
                  color={
                    status.kind === 'accepted'
                      ? colors.success
                      : status.kind === 'declined'
                        ? colors.error
                        : colors.warning
                  }
                  strokeWidth={2.4}
                  accessibilityLabel={status.label}
                />
              )}
              {cancelAction && (
                <Pressable
                  onPress={cancelAction.onPress}
                  disabled={cancelAction.disabled}
                  hitSlop={8}
                  accessibilityLabel={cancelAction.label}
                  style={({ pressed }) => [
                    styles.cancel,
                    { backgroundColor: hexToRgba(colors.error, 0.15), opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Trash2 size={STATUS_ICON_SIZE + 2} color={colors.error} strokeWidth={2.2} />
                </Pressable>
              )}
            </View>
          )}

          {actions && (
            <View style={styles.actions}>
              <Button
                variant="confirm"
                size="compact"
                icon={Check}
                label={actions.acceptLabel}
                onPress={actions.onAccept}
                disabled={actions.disabled}
              />
              <Button
                variant="destructive"
                size="compact"
                icon={X}
                label={actions.rejectLabel}
                onPress={actions.onReject}
                disabled={actions.disabled}
              />
            </View>
          )}
        </View>
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    flexDirection: 'row',
    // Avatar/icona centrati sull'altezza del blocco di testo, qualunque sia il numero di righe
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  iconTile: {
    width: MEDIA_SIZE,
    height: MEDIA_SIZE,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    // Con il titolo su due righe l'orario resta allineato alla prima, non al centro del blocco
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    lineHeight: 19,
    fontFamily: DisplayFonts.semiBold,
  },
  time: {
    fontSize: 12,
    // Stessa altezza di riga del titolo: le due baseline partono dallo stesso punto
    lineHeight: 19,
    opacity: 0.45,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  body: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.75,
  },
  // Azione di ritiro o rimozione: un tondo piccolo in fondo alla riga, non un bottone a tutta larghezza
  cancel: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 8,
    marginTop: 7,
  },
});
