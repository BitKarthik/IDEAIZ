import React from "react";
import { View, StyleSheet, ScrollView, Pressable, useWindowDimensions } from "react-native";
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

function CircleStatusCard({
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
    <View style={styles.circleCardContainer}>
      <View style={[styles.circleCard, { backgroundColor: theme.backgroundDefault, borderColor: scoreColor + "40" }]}>
        <View style={[styles.circleIcon, { backgroundColor: scoreColor + "20" }]}>
          <Feather name={icon as any} size={16} color={scoreColor} />
        </View>
        <ThemedText type="small" style={{ color: scoreColor, fontWeight: "700" }}>
          {score}
        </ThemedText>
      </View>
      <ThemedText type="caption" style={[styles.circleLabel, { fontWeight: "600" }]} numberOfLines={1}>
        {category}
      </ThemedText>
    </View>
  );
}

function AdviceItem({ text, type }: { text: string; type: "do" | "dont" }) {
  const { theme } = useTheme();
  const iconColor = type === "do" ? theme.accent : theme.error;
  const iconName = type === "do" ? "check-circle" : "x-circle";

  return (
    <View style={styles.adviceItem}>
      <Feather name={iconName} size={14} color={iconColor} style={styles.adviceIcon} />
      <ThemedText type="caption" style={styles.adviceText} numberOfLines={2}>
        {text}
      </ThemedText>
    </View>
  );
}

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { height: screenHeight } = useWindowDimensions();
  const { theme } = useTheme();
  const { dailyHoroscope, dailyStatus, auspiciousTimes, dailyAdvice } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const adviceSectionMinHeight = screenHeight * 0.3;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSection}>
        <ThemedText type="caption" style={[styles.dateLabel, { color: theme.textSecondary }]}>
          {dateString}
        </ThemedText>
      </View>

      <View style={styles.cosmicSection}>
        <ThemedText type="h3" style={[styles.sectionLabel, { color: theme.primary }]}>
          Your Cosmic Whisper
        </ThemedText>
        <ThemedText type="body" style={[styles.horoscopeText, { color: theme.text }]}>
          {dailyHoroscope}
        </ThemedText>
      </View>

      <View style={styles.statusSection}>
        <ThemedText type="small" style={[styles.minimalLabel, { color: theme.textSecondary }]}>
          TODAY'S ENERGY
        </ThemedText>
        <View style={styles.statusGrid}>
          {dailyStatus.map((status) => (
            <CircleStatusCard
              key={status.category}
              category={status.category}
              icon={status.icon}
              score={status.score}
            />
          ))}
        </View>
      </View>

      <View style={[styles.adviceSection, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText type="small" style={[styles.minimalLabel, { color: theme.textSecondary, marginBottom: Spacing.md }]}>
          COSMIC WISDOM
        </ThemedText>
        
        <View style={styles.adviceColumns}>
          <View style={styles.adviceColumn}>
            <View style={styles.adviceHeader}>
              <Feather name="check" size={12} color={theme.accent} />
              <ThemedText type="caption" style={[styles.adviceHeaderText, { color: theme.accent }]}>
                EMBRACE
              </ThemedText>
            </View>
            {dailyAdvice.dos.map((item, index) => (
              <AdviceItem key={index} text={item} type="do" />
            ))}
          </View>

          <View style={[styles.columnDivider, { backgroundColor: theme.border }]} />

          <View style={styles.adviceColumn}>
            <View style={styles.adviceHeader}>
              <Feather name="x" size={12} color={theme.error} />
              <ThemedText type="caption" style={[styles.adviceHeaderText, { color: theme.error }]}>
                AVOID
              </ThemedText>
            </View>
            {dailyAdvice.donts.map((item, index) => (
              <AdviceItem key={index} text={item} type="dont" />
            ))}
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate("BirthChart")}
        style={({ pressed }) => [
          styles.ctaButton,
          { backgroundColor: theme.primary + "15", opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={[styles.ctaIconContainer, { backgroundColor: theme.primary + "20" }]}>
          <Feather name="globe" size={16} color={theme.primary} />
        </View>
        <ThemedText type="small" style={{ color: theme.primary, fontWeight: "600" }}>
          View Planetary Positions
        </ThemedText>
        <Feather name="chevron-right" size={16} color={theme.primary} style={{ marginLeft: "auto" }} />
      </Pressable>

      <View style={[styles.timesSection, { minHeight: adviceSectionMinHeight }]}>
        <ThemedText type="small" style={[styles.minimalLabel, { color: theme.textSecondary }]}>
          AUSPICIOUS WINDOWS
        </ThemedText>
        <Card style={styles.timesCard}>
          {auspiciousTimes.map((time, index) => (
            <View 
              key={time.name} 
              style={[
                styles.timeRow, 
                index < auspiciousTimes.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
              ]}
            >
              <View style={styles.timeInfo}>
                <ThemedText type="small" style={{ fontWeight: "600" }}>
                  {time.name}
                </ThemedText>
                <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                  {time.startTime} - {time.endTime}
                </ThemedText>
              </View>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: Spacing.lg,
  },
  dateLabel: {
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "500",
  },
  cosmicSection: {
    marginBottom: Spacing["2xl"],
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  horoscopeText: {
    lineHeight: 24,
    fontWeight: "400",
  },
  minimalLabel: {
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "600",
    fontSize: 10,
    marginBottom: Spacing.sm,
  },
  statusSection: {
    marginBottom: Spacing.xl,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  circleCardContainer: {
    alignItems: "center",
    width: "30%",
  },
  circleCard: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    gap: 2,
  },
  circleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  circleLabel: {
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xl,
  },
  ctaIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  timesSection: {
    marginBottom: Spacing.xl,
  },
  timesCard: {
    padding: Spacing.md,
  },
  timeRow: {
    paddingVertical: Spacing.sm,
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adviceSection: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  adviceColumns: {
    flexDirection: "row",
  },
  adviceColumn: {
    flex: 1,
  },
  columnDivider: {
    width: 1,
    marginHorizontal: Spacing.md,
  },
  adviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  adviceHeaderText: {
    fontWeight: "700",
    letterSpacing: 1,
  },
  adviceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  adviceIcon: {
    marginTop: 2,
    marginRight: Spacing.xs,
  },
  adviceText: {
    flex: 1,
    lineHeight: 18,
  },
});
