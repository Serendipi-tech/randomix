import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { resolveListIcon } from '@/constants/list-icons';
import { hexToRgba } from '@/utils/color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { PageHeader } from '@/components/molecules/PageHeader';
import { CardShell } from '@/components/cards/CardShell';
import { useGroupListManage, useGroupListSharedListIds } from '@/utils/useGroupList';
import { useMyLists } from '@/utils/useLists';

// Draw/merge item di gruppo disabilitati insieme al catalogo Item condiviso (vedi useGroupList.ts):
// resta solo la condivisione delle proprie liste, che non dipende da Item. Gruppi/Challenge sono
// comunque da rifare (SUBROAD) prima di poter reintrodurre il draw.
export default function GroupListScreen() {
  const { t } = useTranslation('groups');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { groupListId, listName } = useLocalSearchParams<{
    groupListId: string;
    listName?: string;
  }>();

  const { lists: myLists } = useMyLists();
  const { sharedIds } = useGroupListSharedListIds(groupListId);
  const { addList, removeList } = useGroupListManage(groupListId);

  const [showManage, setShowManage] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleShare = async (listId: string, shared: boolean) => {
    setTogglingId(listId);
    try {
      if (shared) await removeList(listId);
      else await addList(listId);
    } catch (_) {
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <RadialBackground colorScheme={colorScheme} />
      <LinearGradient
        colors={[hexToRgba(colors.accent, 0.13), colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <PageHeader icon={List} title={listName ?? ''} onBack={() => router.back()} />

      {/* Condivisione delle proprie liste in questa GroupList */}
      <View style={styles.manageBar}>
        <Pressable onPress={() => setShowManage((v) => !v)} style={styles.manageToggle}>
          <Text style={[styles.manageTitle, { color: colors.textColor }]}>
            {t('groupList.myLists')}
          </Text>
          <Text style={[styles.manageChevron, { color: colors.textColor }]}>
            {showManage ? '▾' : '▸'}
          </Text>
        </Pressable>
        {showManage &&
          (myLists.length === 0 ? (
            <Text style={[styles.manageEmpty, { color: colors.textColor }]}>
              {t('groupList.noLists')}
            </Text>
          ) : (
            <ScrollView
              style={styles.manageList}
              contentContainerStyle={styles.manageListContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {myLists.map((l) => {
                const shared = sharedIds.includes(l.id);
                const busy = togglingId === l.id;
                const ListIcon = resolveListIcon(l.icon);
                return (
                  <CardShell
                    key={l.id}
                    onPress={() => {
                      if (busy) return;
                      handleToggleShare(l.id, shared);
                    }}
                  >
                    <View style={styles.manageRow}>
                      <View style={styles.manageRowNameGroup}>
                        <ListIcon size={16} color={colors.textColor} />
                        <Text style={[styles.manageRowName, { color: colors.textColor }]} numberOfLines={1}>
                          {l.name}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.manageRowAction,
                          { color: shared ? colors.secondary : colors.primary },
                        ]}
                      >
                        {busy ? '…' : shared ? t('groupList.removeMyList') : t('groupList.addMyList')}
                      </Text>
                    </View>
                  </CardShell>
                );
              })}
            </ScrollView>
          ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  manageBar: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  manageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  manageTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  manageChevron: {
    fontSize: 16,
    opacity: 0.7,
  },
  manageEmpty: {
    fontSize: 14,
    opacity: 0.7,
  },
  manageList: {
    maxHeight: 220,
  },
  manageListContent: {
    gap: Spacing.two,
  },
  manageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  manageRowNameGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  manageRowName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  manageRowAction: {
    fontSize: 13,
    fontWeight: '700',
  },
});
