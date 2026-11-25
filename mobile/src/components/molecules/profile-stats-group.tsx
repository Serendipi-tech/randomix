import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/constants/theme';
import type { CategoryStat, CompletionBreakdown } from '@/utils/useProfileStats';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { ProfileCategoryStats } from '@/components/molecules/profile-category-stats';
import { ProfileCompletionDonut } from '@/components/molecules/profile-completion-donut';

type ProfileStatsGroupProps = {
  label: string;
  categoryStats: CategoryStat[];
  completionBreakdown: CompletionBreakdown | null;
};

/** Raggruppa le card statistiche del profilo personale sotto un'etichetta ("Tu" / nome amico):
 *  riuso diretto dei componenti già usati in profile.tsx, nessuna logica propria. */
export function ProfileStatsGroup({ label, categoryStats, completionBreakdown }: ProfileStatsGroupProps) {
  return (
    <View style={styles.group}>
      <SectionLabel>{label}</SectionLabel>
      <ProfileCategoryStats categoryStats={categoryStats} />
      {completionBreakdown && <ProfileCompletionDonut breakdown={completionBreakdown} />}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: Spacing.two + Spacing.one,
  },
});
