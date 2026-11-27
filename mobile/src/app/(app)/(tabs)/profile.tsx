import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LogOut, MessageSquare, Settings } from 'lucide-react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { hexToRgba } from '@/utils/color';
import { AVATAR_PRESETS, resolveAvatarUri } from '@/constants/avatar-presets';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RadialBackground } from '@/components/molecules/radial-background';
import { ConfirmSheet } from '@/components/molecules/confirm-sheet';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { FormError } from '@/components/molecules/form-error';
import { CardShell } from '@/components/cards/CardShell';
import { ProfileHeader } from '@/components/molecules/profile-header';
import { DevErrorNotice } from '@/components/atoms/DevErrorNotice';
import { CardSkeleton } from '@/components/atoms/CardSkeleton';
import { SkeletonLine } from '@/components/atoms/SkeletonLine';
import { ProfileStatsPanel } from '@/components/molecules/profile-stats-panel';
import { ProfileCategoryStats } from '@/components/molecules/profile-category-stats';
import { ProfileCompletionDonut } from '@/components/molecules/profile-completion-donut';
import { useAuth } from '@/utils/useAuth';
import { useProfile } from '@/utils/useProfile';
import { useMyFriends } from '@/utils/useFriends';
import { useProfileStats } from '@/utils/useProfileStats';
import { useMembershipPlans } from '@/utils/useMembershipPlans';
import { PremiumBanner, PREMIUM_BANNER_HEIGHT } from '@/components/molecules/premium-banner';

const USERNAME_MIN_LENGTH = 3;
// Deve combaciare con RING_SIZE/2 di ProfileHeader: spazio per l'avatar che sfonda il blocco.
const HERO_TOP_SPACE = 55;
// Deve combaciare con BAR_HEIGHT di components/app-tabs.tsx: spazio per non finire sotto la tab bar.
const NAVBAR_HEIGHT = 68;
// Stesso diametro dell'avatar dell'hero (ring compresi), così il blocco non cambia altezza al caricamento
const AVATAR_SKELETON_SIZE = 110;

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');
  const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();

  const { profile, loading: loadingProfile, updateProfile, saving, saveError } = useProfile();
  const { friends } = useMyFriends();
  const { categoryStats, completionBreakdown, loading: loadingStats, error: statsError } = useProfileStats();
  const { isFreePlan, planKnown, hasPaidPlan } = useMembershipPlans();

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const startEditing = () => {
    setUsername(profile?.username ?? '');
    setAvatarUrl(profile?.avatarUrl ?? '');
    setLocalError(null);
    setEditing(true);
  };

  const saveProfile = async () => {
    setLocalError(null);
    if (username.trim().length < USERNAME_MIN_LENGTH) {
      setLocalError(t('usernameTooShort'));
      return;
    }
    try {
      await updateProfile({ username: username.trim(), avatarUrl });
      setEditing(false);
    } catch (e) {
      setLocalError((e as Error).message);
    }
  };

  const editError = localError ?? saveError?.message ?? null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <RadialBackground colorScheme={colorScheme} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: NAVBAR_HEIGHT + insets.bottom + Spacing.five }]}
        showsVerticalScrollIndicator={false}
      >
        {loadingProfile && !profile ? (
          <View style={styles.statsGap}>
            <View style={styles.heroSkeleton}>
              <SkeletonLine width={AVATAR_SKELETON_SIZE} height={AVATAR_SKELETON_SIZE} radius={AVATAR_SKELETON_SIZE / 2} />
              <SkeletonLine width={140} height={16} />
              <SkeletonLine width={180} height={12} />
            </View>
            <CardSkeleton variant="gradient" rows={2} />
            <CardSkeleton titled circleSize={70} rows={3} />
            <CardSkeleton titled rows={4} />
          </View>
        ) : profile && !editing ? (
          <>
            <View style={styles.heroSpace}>
              <ProfileHeader
                username={profile.username}
                email={profile.email}
                avatarUrl={profile.avatarUrl}
                colorScheme={colorScheme}
                editLabel={t('edit')}
                onEditPress={startEditing}
                showCrown={hasPaidPlan}
                memberSinceLabel={t('memberSince', {
                  date: new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                })}
              />
            </View>
            {/* Barra azioni senza titolo: la pagina si identifica già dalla tab attiva */}
            <View style={styles.actionBar}>
              <LinearGradient
                colors={['transparent', colors.secondaryGradient]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.actionRule}
              />
              {[
                { icon: MessageSquare, onPress: () => router.push('/feedback') },
                { icon: Settings, onPress: () => router.push('/settings') },
                { icon: LogOut, onPress: () => setConfirmingLogout(true) },
              ].map(({ icon: ActionIcon, onPress }, index) => (
                <Pressable
                  key={index}
                  onPress={onPress}
                  hitSlop={6}
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: hexToRgba(colors.primary, 0.25), opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <ActionIcon size={20} color={colors.textColor} />
                </Pressable>
              ))}
              <LinearGradient
                colors={[colors.secondaryGradient, 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.actionRule}
              />
            </View>

            <View style={styles.statsGap}>
              <ProfileStatsPanel
                listsCount={profile.listsCount}
                totalItemsCount={profile.totalItemsCount}
                completedItemsCount={profile.completedItemsCount}
                friendsCount={friends.length}
              />
              {/* Spazio riservato finché il piano non è noto: vedi la home, stesso ragionamento */}
              {planKnown ? (
                isFreePlan && (
                  <Animated.View entering={FadeIn.duration(Motion.contentFade)}>
                    <PremiumBanner onPress={() => router.push('/plans')} />
                  </Animated.View>
                )
              ) : (
                <SkeletonLine height={PREMIUM_BANNER_HEIGHT} radius={12} />
              )}
              <DevErrorNotice error={statsError} source="profileStats" />
              {/* Skeleton per blocco: le statistiche arrivano da una query a parte, senza
                  placeholder le due card comparirebbero di colpo a pagina già disegnata */}
              {completionBreakdown ? (
                <Animated.View entering={FadeIn.duration(Motion.contentFade)}>
                  <ProfileCompletionDonut breakdown={completionBreakdown} />
                </Animated.View>
              ) : (
                loadingStats && <CardSkeleton titled circleSize={70} rows={3} />
              )}
              {loadingStats && categoryStats.length === 0 ? (
                <CardSkeleton titled rows={4} />
              ) : (
                <Animated.View entering={FadeIn.duration(Motion.contentFade)}>
                  <ProfileCategoryStats categoryStats={categoryStats} />
                </Animated.View>
              )}
            </View>
          </>
        ) : profile ? (
          <View>
            <CardShell backgroundColor={colors.foreground} borderColor={colors.border}>
              <View style={styles.editSection}>
                <Input
                  placeholder={t('usernamePlaceholder')}
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                />
                <Text style={[styles.avatarLabel, { color: colors.textColor }]}>{t('avatarLabel')}</Text>
                <View style={styles.avatarRow}>
                  {AVATAR_PRESETS.map((preset) => {
                    const selected = avatarUrl === preset.path;
                    return (
                      <Pressable
                        key={preset.key}
                        onPress={() => setAvatarUrl(preset.path)}
                        style={[styles.avatarOption, { borderColor: selected ? colors.primary : 'transparent' }]}
                      >
                        <Image source={{ uri: resolveAvatarUri(preset.path) }} style={styles.avatarImg} />
                      </Pressable>
                    );
                  })}
                </View>
                {editError && <FormError message={editError} />}
                <Button label={t('save')} onPress={saveProfile} loading={saving} />
                <Button
                  variant="secondary"
                  label={t('cancel')}
                  onPress={() => setEditing(false)}
                  disabled={saving}
                />
              </View>
            </CardShell>
          </View>
        ) : null}
      </ScrollView>

      <ConfirmSheet
        visible={confirmingLogout}
        title={t('logoutConfirm.title')}
        message={t('logoutConfirm.message')}
        confirmLabel={t('logoutConfirm.confirm')}
        cancelLabel={t('cancel')}
        colorScheme={colorScheme}
        onConfirm={logout}
        onCancel={() => setConfirmingLogout(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // position:absolute (non flex:1) perché su web il container di TabSlot (expo-router) ha
  // flexShrink:0: con contenuto più alto dello schermo si rifiuta di restringersi e trabocca
  // invece di lasciare scrollare il figlio. Assoluto = dimensionato dai bordi, ignora quel flex a monte.
  safe: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two + Spacing.one,
  },
  // Riga decorativa ai lati dei bottoni: sfuma verso l'esterno
  actionRule: {
    flex: 1,
    height: 1,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.two + Spacing.one,
  },
  heroSpace: {
    marginTop: HERO_TOP_SPACE,
  },
  heroSkeleton: {
    marginTop: HERO_TOP_SPACE,
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.three,
  },
  statsGap: {
    gap: Spacing.two + Spacing.one,
  },
  editSection: {
    gap: 12,
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarOption: {
    borderWidth: 2,
    borderRadius: 34,
    padding: 3,
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});
