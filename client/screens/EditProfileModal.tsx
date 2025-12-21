import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/lib/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: string;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: FormInputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <ThemedText type="caption" style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}>
        {label}
      </ThemedText>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.backgroundDefault,
            borderColor: isFocused ? theme.primary : theme.border,
          },
        ]}
      >
        <Feather name={icon as any} size={18} color={theme.textSecondary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          style={[styles.input, { color: theme.text }]}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.primaryButton,
        {
          backgroundColor: disabled ? theme.textTertiary : theme.primary,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
      ]}
    >
      <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export default function EditProfileModal() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, setUser } = useApp();
  const navigation = useNavigation();

  const [name, setName] = useState(user?.name || "");
  const [birthDate, setBirthDate] = useState(
    user?.birthDetails?.date
      ? `${user.birthDetails.date.getMonth() + 1}/${user.birthDetails.date.getDate()}/${user.birthDetails.date.getFullYear()}`
      : ""
  );
  const [birthTime, setBirthTime] = useState(user?.birthDetails?.time || "");
  const [birthPlace, setBirthPlace] = useState(user?.birthDetails?.place || "");

  const handleSave = () => {
    if (!user) return;

    const dateParts = birthDate.split("/");
    let parsedDate: Date | null = null;
    if (dateParts.length === 3) {
      const month = parseInt(dateParts[0], 10) - 1;
      const day = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        parsedDate = new Date(year, month, day);
      }
    }

    setUser({
      ...user,
      name: name.trim() || user.name,
      birthDetails: parsedDate
        ? {
            date: parsedDate,
            time: birthTime || user.birthDetails?.time || "",
            place: birthPlace || user.birthDetails?.place || "",
            latitude: user.birthDetails?.latitude || 0,
            longitude: user.birthDetails?.longitude || 0,
          }
        : user.birthDetails,
    });

    navigation.goBack();
  };

  const isFormValid = name.trim().length > 0;

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Feather name="user" size={40} color="#FFFFFF" />
        </View>
        <Pressable
          style={[styles.changeAvatarButton, { borderColor: theme.border }]}
          onPress={() => {}}
        >
          <ThemedText type="small" style={{ color: theme.primary }}>
            Change Photo
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={{ marginBottom: Spacing.md }}>
          Personal Information
        </ThemedText>

        <FormInput
          label="Display Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          icon="user"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={{ marginBottom: Spacing.md }}>
          Birth Details
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary, marginBottom: Spacing.lg }}>
          Your birth details are used to generate accurate astrological readings
        </ThemedText>

        <FormInput
          label="Birth Date"
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="MM/DD/YYYY"
          icon="calendar"
        />

        <FormInput
          label="Birth Time"
          value={birthTime}
          onChangeText={setBirthTime}
          placeholder="e.g., 10:30 AM"
          icon="clock"
        />

        <FormInput
          label="Birth Place"
          value={birthPlace}
          onChangeText={setBirthPlace}
          placeholder="City, Country"
          icon="map-pin"
        />
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          label="Save Changes"
          onPress={handleSave}
          disabled={!isFormValid}
        />
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  changeAvatarButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? Spacing.md : Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "Palatino, Georgia, serif",
    }),
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
  primaryButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
});
