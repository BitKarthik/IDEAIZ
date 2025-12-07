import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/lib/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getScoreColor(score: number, theme: any) {
  if (score >= 80) return theme.accent;
  if (score >= 60) return theme.secondary;
  return "#EF4444";
}

function StatusCard({
  category,
  icon,
  score,
  insight,
}: {
  category: string;
  icon: string;
  score: number;
  insight: string;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const scoreColor = getScoreColor(score, theme);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.statusCard,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={styles.statusHeader}>
        <View style={[styles.statusIcon, { backgroundColor: scoreColor + "20" }]}>
          <Feather name={icon as any} size={18} color={scoreColor} />
        </View>
        <View style={styles.statusTitleRow}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {category}
          </ThemedText>
          <View style={styles.scoreContainer}>
            <ThemedText type="h4" style={{ color: scoreColor }}>
              {score}
            </ThemedText>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              /100
            </ThemedText>
          </View>
        </View>
      </View>
      <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${score}%`, backgroundColor: scoreColor },
          ]}
        />
      </View>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, marginTop: Spacing.sm }}
      >
        {insight}
      </ThemedText>
    </AnimatedPressable>
  );
}

function AuspiciousTimeCard({
  name,
  startTime,
  endTime,
  description,
}: {
  name: string;
  startTime: string;
  endTime: string;
  description: string;
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.auspiciousCard, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.auspiciousHeader}>
        <View style={[styles.auspiciousIcon, { backgroundColor: theme.secondary + "20" }]}>
          <Feather name="clock" size={14} color={theme.secondary} />
        </View>
        <View style={styles.auspiciousInfo}>
          <ThemedText type="small" style={{ fontWeight: "600" }}>
            {name}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {startTime} - {endTime}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="caption" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
        {description}
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
    weekday: "long",
    month: "long",
    day: "numeric",
  });

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
      <View style={styles.dateContainer}>
        <Feather name="calendar" size={16} color={theme.primary} />
        <ThemedText type="small" style={{ marginLeft: Spacing.sm, color: theme.textSecondary }}>
          {dateString}
        </ThemedText>
      </View>

      <Card style={styles.horoscopeCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
            <Feather name="star" size={20} color={theme.primary} />
          </View>
          <ThemedText type="h4">Your Cosmic Whisper</ThemedText>
        </View>
        <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
          {dailyHoroscope}
        </ThemedText>
      </Card>

      <ThemedText type="h4" style={styles.sectionTitle}>
        Today's Status
      </ThemedText>
      <View style={styles.statusContainer}>
        {dailyStatus.map((status) => (
          <StatusCard
            key={status.category}
            category={status.category}
            icon={status.icon}
            score={status.score}
            insight={status.insight}
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
        <Feather name="globe" size={18} color="#FFFFFF" />
        <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: Spacing.sm }}>
          View Planetary Positions
        </ThemedText>
        <Feather name="chevron-right" size={18} color="#FFFFFF" style={{ marginLeft: "auto" }} />
      </Pressable>

      <ThemedText type="h4" style={styles.sectionTitle}>
        Auspicious Times
      </ThemedText>
      <View style={styles.auspiciousContainer}>
        {auspiciousTimes.map((time) => (
          <AuspiciousTimeCard
            key={time.name}
            name={time.name}
            startTime={time.startTime}
            endTime={time.endTime}
            description={time.description}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  horoscopeCard: {
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  statusContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statusCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statusTitleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  auspiciousContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  auspiciousCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  auspiciousHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  auspiciousIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  auspiciousInfo: {
    flex: 1,
  },
});
