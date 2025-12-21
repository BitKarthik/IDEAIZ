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
  const { user, updateProfile } = useApp();
  const navigation = useNavigation();

  const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const [name, setName] = useState(user?.name || "");
  const [birthDateStr, setBirthDateStr] = useState(
    formatDateForDisplay(user?.birthDetails?.date)
  );
  const [birthTime, setBirthTime] = useState(user?.birthDetails?.time || "");
  const [birthPlace, setBirthPlace] = useState(user?.birthDetails?.place || "");
  const [dateError, setDateError] = useState("");

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr.trim()) return null;
    
    const dateParts = dateStr.split("/");
    if (dateParts.length !== 3) return null;
    
    const month = parseInt(dateParts[0], 10) - 1;
    const day = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    
    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
    if (month < 0 || month > 11 || day < 1 || day > 31 || year < 1900 || year > 2100) return null;
    
    return new Date(year, month, day);
  };

  const handleDateChange = (text: string) => {
    setBirthDateStr(text);
    if (text.trim() && !parseDate(text)) {
      setDateError("Please use MM/DD/YYYY format");
    } else {
      setDateError("");
    }
  };

  const handleSave = () => {
    if (!user) return;

    const parsedDate = parseDate(birthDateStr);
    
    updateProfile({
      name: name.trim() || undefined,
      birthDate: parsedDate || undefined,
      birthTime: birthTime.trim() || undefined,
      birthPlace: birthPlace.trim() || undefined,
    });

    navigation.goBack();
  };

  const isFormValid = name.trim().length > 0 && !dateError;

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

        <View>
          <FormInput
            label="Birth Date"
            value={birthDateStr}
            onChangeText={handleDateChange}
            placeholder="MM/DD/YYYY"
            icon="calendar"
          />
          {dateError ? (
            <ThemedText type="caption" style={{ color: theme.error, marginTop: -Spacing.md, marginBottom: Spacing.md }}>
              {dateError}
            </ThemedText>
          ) : null}
        </View>

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
