import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';
import { useAppTheme } from '@/utils/useAppTheme';
import type { Friend } from '@/utils/useFriends';
import type { Participant } from '@/utils/participants';
import { BottomSheet } from '@/components/organisms/BottomSheet';
import { Input } from '@/components/molecules/Input';
import { Avatar } from '@/components/atoms/Avatar';
import { Tag } from '@/components/atoms/Tag';

type ParticipantsSheetProps = {
  visible: boolean;
  participants: Participant[];
  /** Amici selezionabili come partecipanti, con avatar e nome. */
  friends: Friend[];
  /** Ogni aggiunta/rimozione arriva subito al chiamante, come negli altri picker dell'app. */
  onChange: (participants: Participant[]) => void;
  onClose: () => void;
  namePlaceholder: string;
  emptyLabel: string;
  friendsLabel: string;
  noFriendsLabel: string;
};

const AVATAR_SIZE = 40;

/** Bottomsheet dei partecipanti alla bottiglia: campo + "＋" per i nomi a mano, elenco degli amici
 *  selezionabili sotto, e in alto le chip di chi e' in gioco con ✕ per togliere.
 *  Stessa struttura di TagPickerSheet (riga d'azione in alto, lista sotto). */
export function ParticipantsSheet({
  visible,
  participants,
  friends,
  onChange,
  onClose,
  namePlaceholder,
  emptyLabel,
  friendsLabel,
  noFriendsLabel,
}: ParticipantsSheetProps) {
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];
  const [draft, setDraft] = useState('');

  const trimmed = draft.trim();

  const addName = () => {
    if (!trimmed) return;
    onChange([...participants, { name: trimmed, avatarUrl: null }]);
    setDraft('');
  };

  // Un amico e' in gioco se compare col suo id: un omonimo scritto a mano non lo seleziona
  const isPicked = (friend: Friend) => participants.some((p) => p.friendId === friend.id);

  const toggleFriend = (friend: Friend) => {
    if (isPicked(friend)) {
      onChange(participants.filter((p) => p.friendId !== friend.id));
      return;
    }
    onChange([
      ...participants,
      { friendId: friend.id, name: friend.username, avatarUrl: friend.avatarUrl },
    ]);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.addRow}>
        <Input
          variant="text"
          value={draft}
          onChangeText={setDraft}
          placeholder={namePlaceholder}
          autoCapitalize="words"
          onSubmitEditing={addName}
          style={styles.addInput}
        />
        <Pressable
          onPress={addName}
          disabled={!trimmed}
          style={[
            styles.addButton,
            { backgroundColor: colors.foreground, opacity: trimmed ? 1 : 0.5 },
          ]}
        >
          <Plus size={22} color={colors.primary} strokeWidth={2.5} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {participants.length === 0 ? (
          <Text style={[styles.empty, { color: colors.disabled }]}>{emptyLabel}</Text>
        ) : (
          <View style={styles.grid}>
            {participants.map((participant, i) => (
              <Tag
                key={`${participant.friendId ?? participant.name}-${i}`}
                name={participant.name}
                color={colors.primary}
                onRemove={() => onChange(participants.filter((_, index) => index !== i))}
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.disabled }]}>{friendsLabel}</Text>
          {friends.length === 0 ? (
            <Text style={[styles.empty, { color: colors.disabled }]}>{noFriendsLabel}</Text>
          ) : (
            friends.map((friend) => {
              const picked = isPicked(friend);
              return (
                <Pressable
                  key={friend.id}
                  onPress={() => toggleFriend(friend)}
                  style={[
                    styles.friendRow,
                    picked && { backgroundColor: hexToRgba(colors.primary, 0.12) },
                  ]}
                >
                  <Avatar
                    uri={friend.avatarUrl ?? undefined}
                    fallbackColor={colors.primary}
                    ring={false}
                    size={AVATAR_SIZE}
                  />
                  <Text style={[styles.friendName, { color: colors.textColor }]} numberOfLines={1}>
                    {friend.username}
                  </Text>
                  {picked && <Check size={18} color={colors.primary} />}
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  addInput: {
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Stesse metriche di OptionRow, con l'avatar al posto del riquadro dell'icona
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  friendName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
