import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
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

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/lib/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function StatItem({ label, value }: { label: string; value: string | number }) {
  const { theme } = useTheme();
  return (
    <View style={styles.statItem}>
      <ThemedText type="h3" style={{ color: theme.primary }}>
        {value}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        {label}
      </ThemedText>
    </View>
  );
}

function MenuButton({
  icon,
  label,
  onPress,
  color,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
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
        styles.menuButton,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={styles.menuButtonContent}>
        <View style={[styles.menuIcon, { backgroundColor: (color || theme.primary) + "15" }]}>
          <Feather name={icon as any} size={18} color={color || theme.primary} />
        </View>
        <ThemedText type="body">{label}</ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const formatBirthDate = () => {
    if (!user?.birthDetails) return "Not set";
    return user.birthDetails.date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Feather name="user" size={40} color="#FFFFFF" />
        </View>
        <ThemedText type="h2" style={styles.userName}>
          {user?.name || "Seeker"}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {user?.isSubscribed ? "Premium Member" : "Free Trial"}
        </ThemedText>
      </View>

      <View style={styles.statsContainer}>
        <StatItem label="Questions" value={user?.questionsAsked || 0} />
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <StatItem label="Day Streak" value={user?.dailyStreak || 0} />
      </View>

      <Card
        style={styles.birthCard}
        onPress={() => navigation.navigate("BirthChart")}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.secondary + "20" }]}>
            <Feather name="star" size={20} color={theme.secondary} />
          </View>
          <View style={styles.birthInfo}>
            <ThemedText type="h4">Birth Details</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Tap to view your birth chart
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
        <View style={styles.birthDetails}>
          <View style={styles.birthRow}>
            <Feather name="calendar" size={14} color={theme.textSecondary} />
            <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}>
              {formatBirthDate()}
            </ThemedText>
          </View>
          <View style={styles.birthRow}>
            <Feather name="clock" size={14} color={theme.textSecondary} />
            <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}>
              {user?.birthDetails?.time || "Not set"}
            </ThemedText>
          </View>
          <View style={styles.birthRow}>
            <Feather name="map-pin" size={14} color={theme.textSecondary} />
            <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}>
              {user?.birthDetails?.place || "Not set"}
            </ThemedText>
          </View>
        </View>
      </Card>

      <Card
        style={styles.subscriptionCard}
        onPress={() => navigation.navigate("Subscription")}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.accent + "20" }]}>
            <Feather name="award" size={20} color={theme.accent} />
          </View>
          <View style={styles.birthInfo}>
            <ThemedText type="h4">
              {user?.isSubscribed ? "Premium Plan" : "Upgrade to Premium"}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {user?.isSubscribed
                ? "Unlimited readings and features"
                : "Get unlimited access"}
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
      </Card>

      <ThemedText type="h4" style={styles.sectionTitle}>
        Settings
      </ThemedText>

      <View style={styles.menuContainer}>
        <MenuButton
          icon="bell"
          label="Notifications"
          onPress={() => {}}
        />
        <MenuButton
          icon="globe"
          label="Language"
          onPress={() => {}}
        />
        <MenuButton
          icon="shield"
          label="Privacy Policy"
          onPress={() => {}}
        />
        <MenuButton
          icon="file-text"
          label="Terms of Service"
          onPress={() => {}}
        />
        <MenuButton
          icon="help-circle"
          label="Help & Support"
          onPress={() => {}}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          { borderColor: theme.error, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={() => {}}
      >
        <Feather name="log-out" size={18} color={theme.error} />
        <ThemedText type="body" style={{ color: theme.error, marginLeft: Spacing.sm }}>
          Log Out
        </ThemedText>
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  userName: {
    marginBottom: Spacing.xs,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
    gap: Spacing["2xl"],
  },
  statItem: {
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  birthCard: {
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  birthInfo: {
    flex: 1,
  },
  birthDetails: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  birthRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subscriptionCard: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  menuContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  menuButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
});
