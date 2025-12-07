import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/lib/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const features = [
  { icon: "message-circle", text: "Unlimited questions to the AI astrologer" },
  { icon: "sun", text: "Personalized daily horoscopes" },
  { icon: "bell", text: "Daily notification predictions" },
  { icon: "star", text: "Detailed birth chart analysis" },
  { icon: "clock", text: "Dasha period interpretations" },
  { icon: "zap", text: "Auspicious timing recommendations" },
];

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$9.99",
    period: "month",
    savings: null,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$79.99",
    period: "year",
    savings: "Save 33%",
  },
];

function PlanCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: (typeof plans)[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onSelect}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.planCard,
        {
          backgroundColor: isSelected ? theme.primary + "10" : theme.backgroundDefault,
          borderColor: isSelected ? theme.primary : theme.border,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.planHeader}>
        <View
          style={[
            styles.radioOuter,
            { borderColor: isSelected ? theme.primary : theme.textSecondary },
          ]}
        >
          {isSelected ? (
            <View style={[styles.radioInner, { backgroundColor: theme.primary }]} />
          ) : null}
        </View>
        <View style={styles.planInfo}>
          <ThemedText type="h4">{plan.name}</ThemedText>
          {plan.savings ? (
            <View style={[styles.savingsBadge, { backgroundColor: theme.success + "20" }]}>
              <ThemedText type="caption" style={{ color: theme.success }}>
                {plan.savings}
              </ThemedText>
            </View>
          ) : null}
        </View>
        <View style={styles.priceContainer}>
          <ThemedText type="h3" style={{ color: theme.primary }}>
            {plan.price}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            /{plan.period}
          </ThemedText>
        </View>
      </View>
    </AnimatedPressable>
  );
}

function FeatureRow({ icon, text }: { icon: string; text: string }) {
  const { theme } = useTheme();

  return (
    <View style={styles.featureRow}>
      <View style={[styles.featureIcon, { backgroundColor: theme.success + "15" }]}>
        <Feather name={icon as any} size={16} color={theme.success} />
      </View>
      <ThemedText type="body" style={{ flex: 1 }}>
        {text}
      </ThemedText>
    </View>
  );
}

export default function SubscriptionModal() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, setSubscribed } = useApp();
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const handleSubscribe = () => {
    setSubscribed(true);
    navigation.goBack();
  };

  const handleRestore = () => {
    setSubscribed(true);
    navigation.goBack();
  };

  const handleCancel = () => {
    setSubscribed(false);
    navigation.goBack();
  };

  if (user?.isSubscribed) {
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
        <View style={[styles.statusCard, { backgroundColor: theme.success + "15" }]}>
          <View style={[styles.statusIcon, { backgroundColor: theme.success }]}>
            <Feather name="check" size={24} color="#FFFFFF" />
          </View>
          <ThemedText type="h3" style={{ marginTop: Spacing.md }}>
            Premium Active
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
            You have unlimited access to all features
          </ThemedText>
        </View>

        <View style={[styles.billingCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.billingRow}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Current Plan
            </ThemedText>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              Yearly
            </ThemedText>
          </View>
          <View style={styles.billingRow}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Next Billing
            </ThemedText>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              Dec 7, 2026
            </ThemedText>
          </View>
          <View style={styles.billingRow}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Amount
            </ThemedText>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              $79.99/year
            </ThemedText>
          </View>
        </View>

        <ThemedText type="h4" style={styles.sectionTitle}>
          Included Features
        </ThemedText>
        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <FeatureRow key={feature.text} icon={feature.icon} text={feature.text} />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            { borderColor: theme.error, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleCancel}
        >
          <ThemedText type="body" style={{ color: theme.error }}>
            Cancel Subscription
          </ThemedText>
        </Pressable>
      </ScrollView>
    );
  }

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
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: theme.primary + "15" }]}>
          <Feather name="award" size={40} color={theme.primary} />
        </View>
        <ThemedText type="h2" style={styles.headerTitle}>
          Unlock Premium
        </ThemedText>
        <ThemedText type="body" style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Get unlimited access to AI-powered Vedic astrology readings
        </ThemedText>
      </View>

      <ThemedText type="h4" style={styles.sectionTitle}>
        What's Included
      </ThemedText>
      <View style={styles.featuresContainer}>
        {features.map((feature) => (
          <FeatureRow key={feature.text} icon={feature.icon} text={feature.text} />
        ))}
      </View>

      <ThemedText type="h4" style={styles.sectionTitle}>
        Choose Your Plan
      </ThemedText>
      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
          />
        ))}
      </View>

      <Button onPress={handleSubscribe} style={styles.subscribeButton}>
        Start 7-Day Free Trial
      </Button>

      <ThemedText type="caption" style={[styles.trialNote, { color: theme.textSecondary }]}>
        Free for 7 days, then{" "}
        {selectedPlan === "yearly" ? "$79.99/year" : "$9.99/month"}. Cancel anytime.
      </ThemedText>

      <Pressable
        style={({ pressed }) => [styles.restoreButton, { opacity: pressed ? 0.6 : 1 }]}
        onPress={handleRestore}
      >
        <ThemedText type="link">Restore Purchases</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    textAlign: "center",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  featuresContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  plansContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  planCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  planInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  savingsBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  subscribeButton: {
    marginBottom: Spacing.md,
  },
  trialNote: {
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  statusCard: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  billingCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  billingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.lg,
  },
});
