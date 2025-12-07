import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
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
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/lib/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const presetChips = [
  { icon: "briefcase", label: "Career" },
  { icon: "heart", label: "Love" },
  { icon: "activity", label: "Health" },
  { icon: "dollar-sign", label: "Finance" },
  { icon: "compass", label: "Life Path" },
];

const aiResponses = [
  "Based on your birth chart, the current planetary alignment suggests a period of growth and transformation. Jupiter's influence on your 10th house indicates favorable conditions for career advancement.",
  "The Moon's transit through your 7th house brings emotional clarity to relationships. This is an excellent time to strengthen bonds with loved ones and address any unresolved matters.",
  "Your natal Saturn is receiving beneficial aspects this month. While challenges may arise, they serve as opportunities for personal growth and building lasting foundations.",
  "The placement of Venus in your chart suggests creative energy is flowing strongly. Consider exploring artistic pursuits or activities that bring you joy.",
  "Mercury's current position enhances your communication abilities. This is an ideal time for important conversations, negotiations, or sharing your ideas with others.",
];

function MessageBubble({ content, isUser }: { content: string; isUser: boolean }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.messageBubble,
        isUser
          ? { backgroundColor: theme.primary, alignSelf: "flex-end" }
          : { backgroundColor: theme.backgroundDefault, alignSelf: "flex-start" },
      ]}
    >
      <ThemedText
        type="body"
        style={{ color: isUser ? "#FFFFFF" : theme.text }}
      >
        {content}
      </ThemedText>
    </View>
  );
}

function TypingIndicator() {
  const { theme } = useTheme();
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const duration = 400;
    dot1.value = withRepeat(
      withSequence(
        withTiming(-5, { duration, easing: Easing.ease }),
        withTiming(0, { duration, easing: Easing.ease })
      ),
      -1
    );
    setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(-5, { duration, easing: Easing.ease }),
          withTiming(0, { duration, easing: Easing.ease })
        ),
        -1
      );
    }, 150);
    setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(-5, { duration, easing: Easing.ease }),
          withTiming(0, { duration, easing: Easing.ease })
        ),
        -1
      );
    }, 300);
  }, []);

  const style1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
  const style2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
  const style3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

  return (
    <View style={[styles.messageBubble, styles.typingBubble, { backgroundColor: theme.backgroundDefault }]}>
      <Animated.View style={[styles.typingDot, { backgroundColor: theme.textSecondary }, style1]} />
      <Animated.View style={[styles.typingDot, { backgroundColor: theme.textSecondary }, style2]} />
      <Animated.View style={[styles.typingDot, { backgroundColor: theme.textSecondary }, style3]} />
    </View>
  );
}

function PresetChip({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
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
        styles.presetChip,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        animatedStyle,
      ]}
    >
      <Feather name={icon as any} size={14} color={theme.primary} />
      <ThemedText type="small" style={{ marginLeft: Spacing.xs }}>
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export default function AskScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { messages, addMessage } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      addMessage(inputText.trim(), true);
      setInputText("");
      simulateResponse();
    }
  };

  const handlePresetPress = (label: string) => {
    const questions: Record<string, string> = {
      Career: "What does my birth chart reveal about my career path?",
      Love: "What insights can you share about my love life?",
      Health: "What should I know about my health according to my chart?",
      Finance: "What financial insights does my chart show?",
      "Life Path": "What is my life purpose according to Vedic astrology?",
    };
    const question = questions[label] || `Tell me about ${label}`;
    addMessage(question, true);
    simulateResponse();
  };

  const simulateResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      addMessage(randomResponse, false);
    }, 2000);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: theme.primary + "15" }]}>
        <Feather name="message-circle" size={48} color={theme.primary} />
      </View>
      <ThemedText type="h3" style={styles.emptyTitle}>
        Ask the Stars
      </ThemedText>
      <ThemedText
        type="body"
        style={[styles.emptyDescription, { color: theme.textSecondary }]}
      >
        Ask about your career, relationships, health, or life path. Your personalized reading awaits.
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={headerHeight}
      >
        {messages.length === 0 && !isTyping ? (
          <View style={{ flex: 1, paddingTop: headerHeight + Spacing.xl }}>
            {renderEmptyState()}
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingTop: headerHeight + Spacing.xl,
              paddingHorizontal: Spacing.lg,
              paddingBottom: Spacing.lg,
            }}
            renderItem={({ item }) => (
              <MessageBubble content={item.content} isUser={item.isUser} />
            )}
            ListFooterComponent={isTyping ? <TypingIndicator /> : null}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.backgroundRoot,
              paddingBottom: tabBarHeight + Spacing.sm,
              borderTopColor: theme.border,
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {presetChips.map((chip) => (
              <PresetChip
                key={chip.label}
                icon={chip.icon}
                label={chip.label}
                onPress={() => handlePresetPress(chip.label)}
              />
            ))}
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.backgroundDefault,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Ask a question..."
              placeholderTextColor={theme.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [
                styles.sendButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="send" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  emptyDescription: {
    textAlign: "center",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  typingBubble: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
  },
  chipsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    minHeight: Spacing.inputHeight,
    maxHeight: 120,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    fontSize: 16,
  },
  sendButton: {
    width: Spacing.inputHeight,
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});
