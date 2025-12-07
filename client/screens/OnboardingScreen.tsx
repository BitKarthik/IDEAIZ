import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/lib/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const { width } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const onboardingSteps = [
  {
    icon: "star",
    title: "Welcome to MyOrca",
    description:
      "Discover the ancient wisdom of Vedic astrology. Get personalized insights about your life, career, relationships, and spiritual path.",
  },
  {
    icon: "sun",
    title: "Daily Guidance",
    description:
      "Receive daily horoscope predictions based on your unique birth chart. Start each day with cosmic wisdom tailored just for you.",
  },
  {
    icon: "message-circle",
    title: "Ask Anything",
    description:
      "Have questions about your life? Our AI astrologer analyzes your chart to provide meaningful answers based on Vedic principles.",
  },
];

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const { theme } = useTheme();

  return (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            {
              backgroundColor: index <= currentStep ? theme.primary : theme.border,
              width: index === currentStep ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

function WelcomeStep({
  step,
  onNext,
}: {
  step: (typeof onboardingSteps)[0];
  onNext: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepContent}>
      <View style={[styles.iconContainer, { backgroundColor: theme.primary + "15" }]}>
        <Feather name={step.icon as any} size={48} color={theme.primary} />
      </View>
      <ThemedText type="h1" style={styles.stepTitle}>
        {step.title}
      </ThemedText>
      <ThemedText type="body" style={[styles.stepDescription, { color: theme.textSecondary }]}>
        {step.description}
      </ThemedText>
      <Button onPress={onNext} style={styles.nextButton}>
        Continue
      </Button>
    </Animated.View>
  );
}

function BirthDetailsStep({ onNext }: { onNext: () => void }) {
  const { theme } = useTheme();
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const isValid = birthDate.length > 0 && birthTime.length > 0 && birthPlace.length > 0;

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepContent}>
      <View style={[styles.iconContainer, { backgroundColor: theme.secondary + "15" }]}>
        <Feather name="calendar" size={48} color={theme.secondary} />
      </View>
      <ThemedText type="h2" style={styles.stepTitle}>
        Your Birth Details
      </ThemedText>
      <ThemedText type="body" style={[styles.stepDescription, { color: theme.textSecondary }]}>
        We need your birth information to generate your personalized Vedic birth chart.
      </ThemedText>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}>
            Birth Date
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={theme.textSecondary}
            value={birthDate}
            onChangeText={setBirthDate}
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}>
            Birth Time
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="10:30 AM"
            placeholderTextColor={theme.textSecondary}
            value={birthTime}
            onChangeText={setBirthTime}
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText type="caption" style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}>
            Birth Place
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="City, Country"
            placeholderTextColor={theme.textSecondary}
            value={birthPlace}
            onChangeText={setBirthPlace}
          />
        </View>
      </View>

      <Button onPress={onNext} style={styles.nextButton} disabled={!isValid}>
        Generate My Chart
      </Button>
    </Animated.View>
  );
}

function TrialStep({ onComplete }: { onComplete: () => void }) {
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const scale = useSharedValue(1);

  const features = [
    "Unlimited AI astrology questions",
    "Daily personalized horoscopes",
    "Complete birth chart analysis",
    "Push notification predictions",
  ];

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepContent}>
      <View style={[styles.iconContainer, { backgroundColor: theme.accent + "15" }]}>
        <Feather name="award" size={48} color={theme.accent} />
      </View>
      <ThemedText type="h2" style={styles.stepTitle}>
        Start Your Journey
      </ThemedText>
      <ThemedText type="body" style={[styles.stepDescription, { color: theme.textSecondary }]}>
        Try MyOrca Premium free for 7 days. Cancel anytime.
      </ThemedText>

      <View style={styles.featuresListSmall}>
        {features.map((feature) => (
          <View key={feature} style={styles.featureRowSmall}>
            <View style={[styles.checkIcon, { backgroundColor: theme.success + "15" }]}>
              <Feather name="check" size={14} color={theme.success} />
            </View>
            <ThemedText type="small">{feature}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.plansRow}>
        <AnimatedPressable
          onPress={() => setSelectedPlan("monthly")}
          style={[
            styles.planOption,
            {
              backgroundColor: selectedPlan === "monthly" ? theme.primary + "10" : theme.backgroundDefault,
              borderColor: selectedPlan === "monthly" ? theme.primary : theme.border,
            },
          ]}
        >
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            Monthly
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            $9.99/mo
          </ThemedText>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => setSelectedPlan("yearly")}
          style={[
            styles.planOption,
            {
              backgroundColor: selectedPlan === "yearly" ? theme.primary + "10" : theme.backgroundDefault,
              borderColor: selectedPlan === "yearly" ? theme.primary : theme.border,
            },
          ]}
        >
          <View style={[styles.saveBadge, { backgroundColor: theme.success }]}>
            <ThemedText type="caption" style={{ color: "#FFFFFF", fontWeight: "600" }}>
              Save 33%
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            Yearly
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            $79.99/yr
          </ThemedText>
        </AnimatedPressable>
      </View>

      <Button onPress={onComplete} style={styles.nextButton}>
        Start Free Trial
      </Button>

      <Pressable
        style={({ pressed }) => [styles.skipButton, { opacity: pressed ? 0.6 : 1 }]}
        onPress={onComplete}
      >
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Maybe later
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { setOnboarded } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = onboardingSteps.length + 2;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setOnboarded(true);
    navigation.goBack();
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing["2xl"],
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        {currentStep < onboardingSteps.length ? (
          <WelcomeStep step={onboardingSteps[currentStep]} onNext={handleNext} />
        ) : null}

        {currentStep === onboardingSteps.length ? (
          <BirthDetailsStep onNext={handleNext} />
        ) : null}

        {currentStep === onboardingSteps.length + 1 ? (
          <TrialStep onComplete={handleComplete} />
        ) : null}
      </KeyboardAwareScrollViewCompat>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing["3xl"],
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
  },
  stepContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  stepTitle: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  stepDescription: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
  },
  nextButton: {
    width: "100%",
    marginTop: Spacing.lg,
  },
  formContainer: {
    width: "100%",
    gap: Spacing.lg,
  },
  inputGroup: {
    width: "100%",
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  featuresListSmall: {
    width: "100%",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featureRowSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  plansRow: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  planOption: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: "center",
  },
  saveBadge: {
    position: "absolute",
    top: -10,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  skipButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
});
