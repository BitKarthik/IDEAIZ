import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PlanetCard({
  planet,
  sign,
  degree,
  house,
}: {
  planet: string;
  sign: string;
  degree: number;
  house: number;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.planetCard,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={[styles.planetIcon, { backgroundColor: theme.primary + "20" }]}>
        <Feather name="circle" size={16} color={theme.primary} />
      </View>
      <ThemedText type="small" style={styles.planetName}>
        {planet}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        {sign} {degree}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        House {house}
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
  const { dailyHoroscope, planetaryPositions, auspiciousTimes, user } = useApp();

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
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
          <ThemedText type="h4">Daily Horoscope</ThemedText>
        </View>
        <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
          {dailyHoroscope}
        </ThemedText>
      </Card>

      <ThemedText type="h4" style={styles.sectionTitle}>
        Planetary Positions
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.planetsContainer}
      >
        {planetaryPositions.map((pos) => (
          <PlanetCard
            key={pos.planet}
            planet={pos.planet}
            sign={pos.sign}
            degree={pos.degree}
            house={pos.house}
          />
        ))}
      </ScrollView>

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

      <Card style={styles.insightCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.accent + "20" }]}>
            <Feather name="zap" size={20} color={theme.accent} />
          </View>
          <ThemedText type="h4">Today's Insight</ThemedText>
        </View>
        <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
          The Moon in Pisces enhances your intuitive abilities today. Trust your inner guidance, especially in matters of the heart. This is an excellent day for creative pursuits and spiritual practices.
        </ThemedText>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  horoscopeCard: {
    marginBottom: Spacing.xl,
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
  },
  planetsContainer: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  planetCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    minWidth: 90,
  },
  planetIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  planetName: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
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
  insightCard: {
    marginBottom: Spacing.xl,
  },
});
