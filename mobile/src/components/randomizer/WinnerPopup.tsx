import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, Spacing } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import { participantInitials, type Participant } from '@/utils/participants';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';

type WinnerPopupProps = {
  visible: boolean;
  /** Estratto da mostrare; null quando non c'e' ancora un esito. */
  winner: Participant | null;
  title: string;
  closeLabel: string;
  onClose: () => void;
};

const AVATAR_SIZE = 96;
const APPEAR_DURATION = 240;

/** Popup centrale con l'estratto della bottiglia: avatar (o iniziali) e nome, su backdrop.
 *  Puro render da props. */
export function WinnerPopup({ visible, winner, title, closeLabel, onClose }: WinnerPopupProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const appear = useSharedValue(0);

  useEffect(() => {
    appear.value = withTiming(visible ? 1 : 0, {
      duration: APPEAR_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [visible, appear]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: appear.value,
    transform: [{ scale: 0.9 + appear.value * 0.1 }],
  }));

  if (!winner) return null;

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: hexToRgba(colors.shadow, 0.6) }]}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: colors.foreground, borderColor: colors.border },
            cardStyle,
          ]}
        >
          <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>

          {winner.avatarUrl ? (
            <Avatar uri={winner.avatarUrl} fallbackColor={colors.primary} size={AVATAR_SIZE} />
          ) : (
            <View
              style={[
                styles.initialsCircle,
                { backgroundColor: hexToRgba(colors.secondary, 0.2), borderColor: colors.secondary },
              ]}
            >
              <Text style={[styles.initials, { color: colors.secondary }]}>
                {participantInitials(winner.name)}
              </Text>
            </View>
          )}

          <Text style={[styles.name, { color: colors.textColor }]} numberOfLines={2}>
            {winner.name}
          </Text>

          <Button label={closeLabel} onPress={onClose} />
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  initialsCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 34,
    fontWeight: '800',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
});
