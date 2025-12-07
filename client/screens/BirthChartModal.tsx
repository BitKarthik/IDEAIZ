import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

const { width } = Dimensions.get("window");
const CHART_SIZE = width - Spacing.lg * 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const houses = [
  { number: 1, name: "Ascendant", description: "Self, personality, physical body" },
  { number: 2, name: "Wealth", description: "Money, possessions, values" },
  { number: 3, name: "Communication", description: "Siblings, short journeys, learning" },
  { number: 4, name: "Home", description: "Mother, home, emotions" },
  { number: 5, name: "Creativity", description: "Children, romance, speculation" },
  { number: 6, name: "Health", description: "Service, health, daily routine" },
  { number: 7, name: "Partnership", description: "Marriage, business partners" },
  { number: 8, name: "Transformation", description: "Death, rebirth, inheritance" },
  { number: 9, name: "Fortune", description: "Higher learning, travel, philosophy" },
  { number: 10, name: "Career", description: "Father, career, public image" },
  { number: 11, name: "Gains", description: "Friends, hopes, income" },
  { number: 12, name: "Liberation", description: "Spirituality, losses, isolation" },
];

const dashas = [
  { planet: "Saturn", period: "2020 - 2039", status: "current", years: 19 },
  { planet: "Mercury", period: "2039 - 2056", status: "upcoming", years: 17 },
  { planet: "Ketu", period: "2056 - 2063", status: "upcoming", years: 7 },
  { planet: "Venus", period: "2063 - 2083", status: "upcoming", years: 20 },
];

function TabButton({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.tabButton,
        {
          backgroundColor: isActive ? theme.primary : "transparent",
          borderColor: isActive ? theme.primary : theme.border,
        },
        animatedStyle,
      ]}
    >
      <ThemedText
        type="small"
        style={{ color: isActive ? "#FFFFFF" : theme.text, fontWeight: "600" }}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

function HouseCard({ house }: { house: (typeof houses)[0] }) {
  const { theme } = useTheme();
  const { planetaryPositions } = useApp();
  const planetsInHouse = planetaryPositions.filter((p) => p.house === house.number);

  return (
    <View style={[styles.houseCard, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.houseHeader}>
        <View style={[styles.houseNumber, { backgroundColor: theme.primary + "15" }]}>
          <ThemedText type="small" style={{ color: theme.primary, fontWeight: "700" }}>
            {house.number}
          </ThemedText>
        </View>
        <View style={styles.houseInfo}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {house.name}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {house.description}
          </ThemedText>
        </View>
      </View>
      {planetsInHouse.length > 0 ? (
        <View style={styles.planetsRow}>
          {planetsInHouse.map((planet) => (
            <View
              key={planet.planet}
              style={[styles.planetBadge, { backgroundColor: theme.secondary + "20" }]}
            >
              <ThemedText type="caption" style={{ color: theme.secondary }}>
                {planet.planet}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function DashaCard({ dasha }: { dasha: (typeof dashas)[0] }) {
  const { theme } = useTheme();
  const isCurrent = dasha.status === "current";

  return (
    <View
      style={[
        styles.dashaCard,
        {
          backgroundColor: isCurrent ? theme.primary + "10" : theme.backgroundDefault,
          borderColor: isCurrent ? theme.primary : "transparent",
          borderWidth: isCurrent ? 1 : 0,
        },
      ]}
    >
      <View style={styles.dashaHeader}>
        <View style={[styles.dashaIcon, { backgroundColor: isCurrent ? theme.primary : theme.textSecondary }]}>
          <Feather name="circle" size={8} color="#FFFFFF" />
        </View>
        <View style={styles.dashaInfo}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {dasha.planet} Mahadasha
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {dasha.period}
          </ThemedText>
        </View>
        <View style={[styles.yearsBadge, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText type="caption">{dasha.years} years</ThemedText>
        </View>
      </View>
      {isCurrent ? (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}>
            <View style={[styles.progressFill, { backgroundColor: theme.primary, width: "25%" }]} />
          </View>
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
            5 years completed, 14 remaining
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

export default function BirthChartModal() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, planetaryPositions } = useApp();
  const [activeTab, setActiveTab] = useState<"chart" | "houses" | "dasha">("chart");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.tabContainer}>
        <TabButton
          label="Chart"
          isActive={activeTab === "chart"}
          onPress={() => setActiveTab("chart")}
        />
        <TabButton
          label="Houses"
          isActive={activeTab === "houses"}
          onPress={() => setActiveTab("houses")}
        />
        <TabButton
          label="Dasha"
          isActive={activeTab === "dasha"}
          onPress={() => setActiveTab("dasha")}
        />
      </View>

      {activeTab === "chart" ? (
        <>
          <View style={[styles.chartContainer, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.chartOuter, { borderColor: theme.primary }]}>
              <View style={[styles.chartInner, { borderColor: theme.primary }]}>
                <View style={styles.chartCenter}>
                  <ThemedText type="h4" style={{ color: theme.primary }}>
                    Birth Chart
                  </ThemedText>
                  <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                    North Indian
                  </ThemedText>
                </View>
              </View>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.chartLine,
                    {
                      backgroundColor: theme.primary,
                      transform: [{ rotate: `${45 + i * 90}deg` }],
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          <ThemedText type="h4" style={styles.sectionTitle}>
            Planetary Positions
          </ThemedText>
          {planetaryPositions.map((planet) => (
            <View
              key={planet.planet}
              style={[styles.planetRow, { borderBottomColor: theme.border }]}
            >
              <View style={styles.planetInfo}>
                <View style={[styles.planetDot, { backgroundColor: theme.primary }]} />
                <ThemedText type="body" style={{ fontWeight: "500" }}>
                  {planet.planet}
                </ThemedText>
              </View>
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {planet.sign} {planet.degree}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                House {planet.house}
              </ThemedText>
            </View>
          ))}
        </>
      ) : null}

      {activeTab === "houses" ? (
        <View style={styles.housesContainer}>
          {houses.map((house) => (
            <HouseCard key={house.number} house={house} />
          ))}
        </View>
      ) : null}

      {activeTab === "dasha" ? (
        <>
          <Card style={styles.dashaInfoCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
                <Feather name="clock" size={20} color={theme.primary} />
              </View>
              <ThemedText type="h4">Vimshottari Dasha</ThemedText>
            </View>
            <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.md }}>
              The Vimshottari Dasha system divides your life into planetary periods, each ruled by a specific planet that influences your experiences during that time.
            </ThemedText>
          </Card>
          <View style={styles.dashaContainer}>
            {dashas.map((dasha) => (
              <DashaCard key={dasha.planet} dasha={dasha} />
            ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    borderWidth: 1,
  },
  chartContainer: {
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  chartOuter: {
    width: "90%",
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    transform: [{ rotate: "45deg" }],
  },
  chartInner: {
    width: "50%",
    aspectRatio: 1,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenter: {
    transform: [{ rotate: "-45deg" }],
    alignItems: "center",
  },
  chartLine: {
    position: "absolute",
    width: 1,
    height: "100%",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  planetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  planetInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  planetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  housesContainer: {
    gap: Spacing.md,
  },
  houseCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  houseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  houseNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  houseInfo: {
    flex: 1,
  },
  planetsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
  planetBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  dashaInfoCard: {
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
  dashaContainer: {
    gap: Spacing.md,
  },
  dashaCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  dashaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  dashaIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dashaInfo: {
    flex: 1,
  },
  yearsBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  progressContainer: {
    marginTop: Spacing.md,
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
});
