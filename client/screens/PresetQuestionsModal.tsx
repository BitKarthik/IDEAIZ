import React from "react";
import { View, StyleSheet, Pressable, SectionList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/lib/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Question {
  id: string;
  text: string;
  icon: string;
}

interface Section {
  title: string;
  icon: string;
  color: string;
  data: Question[];
}

const questionSections: Section[] = [
  {
    title: "Career & Work",
    icon: "briefcase",
    color: "#6B46C1",
    data: [
      { id: "c1", text: "What career path suits me best?", icon: "compass" },
      { id: "c2", text: "When is the best time to start a new job?", icon: "calendar" },
      { id: "c3", text: "Will I get a promotion this year?", icon: "trending-up" },
      { id: "c4", text: "Should I start my own business?", icon: "briefcase" },
    ],
  },
  {
    title: "Love & Relationships",
    icon: "heart",
    color: "#F43F5E",
    data: [
      { id: "l1", text: "When will I find my soulmate?", icon: "heart" },
      { id: "l2", text: "What does my chart say about marriage?", icon: "home" },
      { id: "l3", text: "How can I improve my relationship?", icon: "users" },
      { id: "l4", text: "Is this person compatible with me?", icon: "link" },
    ],
  },
  {
    title: "Health & Wellness",
    icon: "activity",
    color: "#10B981",
    data: [
      { id: "h1", text: "What health aspects should I focus on?", icon: "activity" },
      { id: "h2", text: "How can I improve my mental well-being?", icon: "sun" },
      { id: "h3", text: "What diet suits my constitution?", icon: "coffee" },
      { id: "h4", text: "When is the best time for healing?", icon: "clock" },
    ],
  },
  {
    title: "Finance & Wealth",
    icon: "dollar-sign",
    color: "#F59E0B",
    data: [
      { id: "f1", text: "When will my financial situation improve?", icon: "trending-up" },
      { id: "f2", text: "Is this a good time to invest?", icon: "bar-chart-2" },
      { id: "f3", text: "What blocks my financial growth?", icon: "lock" },
      { id: "f4", text: "Will I inherit wealth?", icon: "gift" },
    ],
  },
  {
    title: "Spirituality",
    icon: "compass",
    color: "#14B8A6",
    data: [
      { id: "s1", text: "What is my life purpose?", icon: "target" },
      { id: "s2", text: "How can I grow spiritually?", icon: "sunrise" },
      { id: "s3", text: "What past life influences affect me?", icon: "rotate-ccw" },
      { id: "s4", text: "What mantras benefit my chart?", icon: "volume-2" },
    ],
  },
];

function QuestionCard({
  question,
  sectionColor,
  onPress,
}: {
  question: Question;
  sectionColor: string;
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
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.questionCard,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={[styles.questionIcon, { backgroundColor: sectionColor + "15" }]}>
        <Feather name={question.icon as any} size={16} color={sectionColor} />
      </View>
      <ThemedText type="body" style={styles.questionText}>
        {question.text}
      </ThemedText>
      <Feather name="chevron-right" size={18} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

export default function PresetQuestionsModal() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { addMessage } = useApp();
  const navigation = useNavigation();

  const handleQuestionPress = (question: Question) => {
    addMessage(question.text, true);
    navigation.goBack();
    setTimeout(() => {
      const responses = [
        "Based on your chart analysis, I can see significant influences affecting this area of your life.",
        "Your planetary positions reveal interesting insights about this question.",
        "The current planetary transit suggests important developments in this area.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, false);
    }, 2000);
  };

  return (
    <SectionList
      sections={questionSections}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: section.color + "15" }]}>
            <Feather name={section.icon as any} size={16} color={section.color} />
          </View>
          <ThemedText type="h4">{section.title}</ThemedText>
        </View>
      )}
      renderItem={({ item, section }) => (
        <QuestionCard
          question={item}
          sectionColor={section.color}
          onPress={() => handleQuestionPress(item)}
        />
      )}
      SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionSeparator: {
    height: Spacing.md,
  },
  questionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  questionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  questionText: {
    flex: 1,
  },
});
