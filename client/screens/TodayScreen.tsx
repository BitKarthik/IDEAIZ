import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/lib/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

function getScoreColor(score: number, theme: any) {
  if (score >= 80) return theme.accent;
  if (score >= 60) return theme.secondary;
  return "#EF4444";
}

function CompactStatusCard({
  category,
  icon,
  score,
}: {
  category: string;
  icon: string;
  score: number;
}) {
  const { theme } = useTheme();
  const scoreColor = getScoreColor(score, theme);

  return (
    <View style={[styles.compactCard, { backgroundColor: theme.backgroundDefault }]}>
      <View style={[styles.compactIcon, { backgroundColor: scoreColor + "20" }]}>
        <Feather name={icon as any} size={14} color={scoreColor} />
      </View>
      <ThemedText type="caption" style={{ fontWeight: "600" }} numberOfLines={1}>
        {category}
      </ThemedText>
      <ThemedText type="small" style={{ color: scoreColor, fontWeight: "700" }}>
        {score}
      </ThemedText>
    </View>
  );
}

function AuspiciousTimeCard({
  name,
  startTime,
  endTime,
}: {
  name: string;
  startTime: string;
  endTime: string;
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.auspiciousCard, { backgroundColor: theme.backgroundDefault }]}>
      <Feather name="clock" size={12} color={theme.secondary} />
      <ThemedText type="caption" style={{ fontWeight: "600", marginLeft: Spacing.xs }}>
        {name}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary, marginLeft: "auto" }}>
        {startTime} - {endTime}
      </ThemedText>
    </View>
  );
}

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { dailyHoroscope, dailyStatus, auspiciousTimes } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.md,
        paddingBottom: tabBarHeight + Spacing.lg,
        paddingHorizontal: Spacing.md,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.dateRow}>
        <Feather name="calendar" size={14} color={theme.primary} />
        <ThemedText type="caption" style={{ marginLeft: Spacing.xs, color: theme.textSecondary }}>
          {dateString}
        </ThemedText>
      </View>

      <Card style={styles.horoscopeCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
            <Feather name="star" size={16} color={theme.primary} />
          </View>
          <ThemedText type="body" style={{ fontWeight: "600" }}>Your Cosmic Whisper</ThemedText>
        </View>
        <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
          {dailyHoroscope}
        </ThemedText>
      </Card>

      <ThemedText type="body" style={[styles.sectionTitle, { fontWeight: "600" }]}>
        Today's Status
      </ThemedText>
      <View style={styles.statusGrid}>
        {dailyStatus.map((status) => (
          <CompactStatusCard
            key={status.category}
            category={status.category}
            icon={status.icon}
            score={status.score}
          />
        ))}
      </View>

      <Pressable
        onPress={() => navigation.navigate("BirthChart")}
        style={({ pressed }) => [
          styles.ctaButton,
          { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <Feather name="globe" size={16} color="#FFFFFF" />
        <ThemedText type="small" style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: Spacing.sm }}>
          View Planetary Positions
        </ThemedText>
        <Feather name="chevron-right" size={16} color="#FFFFFF" style={{ marginLeft: "auto" }} />
      </Pressable>

      <ThemedText type="body" style={[styles.sectionTitle, { fontWeight: "600" }]}>
        Auspicious Times
      </ThemedText>
      <View style={styles.auspiciousContainer}>
        {auspiciousTimes.map((time) => (
          <AuspiciousTimeCard
            key={time.name}
            name={time.name}
            startTime={time.startTime}
            endTime={time.endTime}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  horoscopeCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  compactCard: {
    width: "31%",
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    gap: 4,
  },
  compactIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  auspiciousContainer: {
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  auspiciousCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
});
