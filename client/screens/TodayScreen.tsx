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

function AdviceItem({ text }: { text: string }) {
  const { theme } = useTheme();

  return (
    <View style={styles.adviceItem}>
      <ThemedText type="body" style={[styles.adviceText, { color: theme.text }]} numberOfLines={2}>
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
          TODAY'S SUMMARY
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

      <View style={styles.adviceSection}>
        <View style={styles.adviceColumns}>
          <View style={styles.adviceColumn}>
            <ThemedText type="body" style={[styles.adviceHeaderText, { color: theme.text }]}>
              Embrace
            </ThemedText>
            {dailyAdvice.dos.map((item, index) => (
              <AdviceItem key={index} text={item} />
            ))}
          </View>

          <View style={styles.adviceColumn}>
            <ThemedText type="body" style={[styles.adviceHeaderText, { color: theme.text }]}>
              Avoid
            </ThemedText>
            {dailyAdvice.donts.map((item, index) => (
              <AdviceItem key={index} text={item} />
            ))}
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate("BirthChart")}
        style={({ pressed }) => [
          styles.ctaButton,
          { backgroundColor: theme.backgroundSecondary, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={[styles.ctaIconContainer, { backgroundColor: theme.ctaText + "20" }]}>
          <Feather name="globe" size={16} color={theme.ctaText} />
        </View>
        <ThemedText type="small" style={{ color: theme.ctaText, fontWeight: "600" }}>
          View Planetary Positions
        </ThemedText>
        <Feather name="chevron-right" size={16} color={theme.ctaText} style={{ marginLeft: "auto" }} />
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
    marginBottom: Spacing["3xl"],
    alignItems: "center",
  },
  dateLabel: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "400",
    fontSize: 13,
  },
  cosmicSection: {
    marginBottom: Spacing["4xl"],
    alignItems: "center",
  },
  sectionLabel: {
    marginBottom: Spacing.lg,
    fontWeight: "400",
    textAlign: "center",
  },
  horoscopeText: {
    lineHeight: 28,
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  minimalLabel: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "400",
    fontSize: 11,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  statusSection: {
    marginBottom: Spacing["4xl"],
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.md,
  },
  circleCardContainer: {
    alignItems: "center",
    width: 80,
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
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing["3xl"],
  },
  ctaIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  timesSection: {
    marginBottom: Spacing["3xl"],
  },
  timesCard: {
    padding: Spacing.lg,
  },
  timeRow: {
    paddingVertical: Spacing.md,
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adviceSection: {
    marginBottom: Spacing["4xl"],
    alignItems: "flex-start",
  },
  adviceColumns: {
    flexDirection: "row",
    width: "100%",
  },
  adviceColumn: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: Spacing.sm,
  },
  adviceHeaderText: {
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: Spacing.lg,
    textAlign: "left",
    textTransform: "uppercase",
    fontSize: 12,
  },
  adviceItem: {
    marginBottom: Spacing.md,
    alignItems: "flex-start",
  },
  adviceText: {
    lineHeight: 22,
    textAlign: "left",
    letterSpacing: 0.3,
  },
});
