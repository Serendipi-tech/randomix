import type { ComponentType } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle2, List as ListIcon, Users } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/theme";
import { darkenColor } from "@/utils/color";
import { useAppTheme } from "@/utils/useAppTheme";
import { CardShell } from "@/components/cards/CardShell";
import { Divider } from "@/components/atoms/Divider";

type ThemeColors = typeof Colors.light | typeof Colors.dark;

type ProfileStatsPanelProps = {
  listsCount: number;
  totalItemsCount: number;
  completedItemsCount: number;
  friendsCount: number;
};

/** Pannello statistiche profilo: righe raggruppate per relazione (liste + elementi + media,
 *  completati/totale, amici) su un unico guscio, invece di tile ripetute con lo stesso numero
 *  isolato — i dati correlati stanno nella stessa riga. */
export function ProfileStatsPanel({
  listsCount,
  totalItemsCount,
  completedItemsCount,
  friendsCount,
}: ProfileStatsPanelProps) {
  const { t } = useTranslation("profile");
  const { colorScheme } = useAppTheme();
  const colors = Colors[colorScheme];

  const averagePerList =
    listsCount > 0 ? (totalItemsCount / listsCount).toFixed(1) : "0";

  return (
    <CardShell variant="gradient" gradientBorderWidth={2}>
      <StatRow
        icon={ListIcon}
        label={t("stats.lists")}
        value={String(listsCount)}
        detail={t("stats.itemsDetail", {
          count: totalItemsCount,
          avg: averagePerList,
        })}
        colors={colors}
        accentColor={colors.primary}
      />
      <Divider />
      <StatRow
        icon={CheckCircle2}
        label={t("stats.completedItems")}
        value={`${completedItemsCount}/${totalItemsCount}`}
        colors={colors}
        accentColor={colors.success}
      />
      <Divider />
      <StatRow
        icon={Users}
        label={t("stats.friends")}
        value={String(friendsCount)}
        colors={colors}
        accentColor={colors.accent}
      />
    </CardShell>
  );
}

type StatRowProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  detail?: string;
  colors: ThemeColors;
  accentColor: string;
};

function StatRow({
  icon: Icon,
  label,
  value,
  detail,
  colors,
  accentColor,
}: StatRowProps) {
  return (
    <View style={styles.row}>
      <LinearGradient
        colors={[accentColor, darkenColor(accentColor, 0.25)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconWrap}
      >
        <Icon size={20} color={colors.textColor} />
      </LinearGradient>
      <View style={styles.texts}>
        <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text>
        {detail && (
          <Text
            style={[styles.detail, { color: colors.disabled }]}
            numberOfLines={1}
          >
            {detail}
          </Text>
        )}
      </View>
      <Text style={[styles.value, { color: colors.textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 56,
    paddingVertical: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  detail: {
    fontSize: 13,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
  },
});
