import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useMutation } from "@tanstack/react-query";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/lib/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { apiRequest } from "@/lib/query-client";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: string;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  error?: string;
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry = false,
  error,
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
            borderColor: error ? theme.error : isFocused ? theme.primary : theme.border,
          },
        ]}
      >
        <Feather name={icon as any} size={18} color={error ? theme.error : theme.textSecondary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          style={[styles.input, { color: theme.text }]}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {error ? (
        <ThemedText type="caption" style={{ color: theme.error, marginTop: Spacing.xs }}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.primaryButton,
        {
          backgroundColor: disabled || loading ? theme.textTertiary : theme.primary,
          opacity: disabled || loading ? 0.5 : 1,
        },
        animatedStyle,
      ]}
    >
      <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
        {loading ? "Creating Account..." : label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { setUser, setOnboarded } = useApp();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDateStr, setBirthDateStr] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (birthDateStr.trim() && !parseDate(birthDateStr)) {
      newErrors.birthDate = "Please use MM/DD/YYYY format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerMutation = useMutation({
    mutationFn: async (data: {
      username: string;
      email: string;
      password: string;
      name: string;
      birthDate?: string;
      birthTime?: string;
      birthPlace?: string;
    }) => {
      const response = await apiRequest("POST", "/api/users", data);
      return response.json();
    },
    onSuccess: (data) => {
      setUser({
        id: data.id.toString(),
        name: data.name || name,
        birthDetails: data.birthDate ? {
          date: new Date(data.birthDate),
          time: data.birthTime || "",
          place: data.birthPlace || "",
          latitude: data.birthLatitude || 0,
          longitude: data.birthLongitude || 0,
        } : null,
        isSubscribed: false,
        trialEndsAt: null,
        questionsAsked: 0,
        dailyStreak: 0,
      });
      setOnboarded(true);
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" as never }],
      });
    },
    onError: (error: Error) => {
      Alert.alert("Registration Failed", error.message || "Please try again later");
    },
  });

  const handleRegister = () => {
    if (!validateForm()) return;

    const parsedDate = parseDate(birthDateStr);
    
    registerMutation.mutate({
      username: email.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      birthDate: parsedDate ? parsedDate.toISOString() : undefined,
      birthTime: birthTime.trim() || undefined,
      birthPlace: birthPlace.trim() || undefined,
    });
  };

  const handleDateChange = (text: string) => {
    setBirthDateStr(text);
    if (text.trim() && !parseDate(text)) {
      setErrors(prev => ({ ...prev, birthDate: "Please use MM/DD/YYYY format" }));
    } else {
      setErrors(prev => {
        const { birthDate, ...rest } = prev;
        return rest;
      });
    }
  };

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
      <View style={styles.headerSection}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
          <Feather name="user-plus" size={32} color="#FFFFFF" />
        </View>
        <ThemedText type="h2" style={{ textAlign: "center", marginTop: Spacing.md }}>
          Create Account
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.sm }}>
          Join MyOrca to receive personalized cosmic guidance
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={{ marginBottom: Spacing.md }}>
          Account Details
        </ThemedText>

        <FormInput
          label="Full Name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors(prev => { const { name, ...rest } = prev; return rest; });
          }}
          placeholder="Enter your full name"
          icon="user"
          autoCapitalize="words"
          error={errors.name}
        />

        <FormInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors(prev => { const { email, ...rest } = prev; return rest; });
          }}
          placeholder="your@email.com"
          icon="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <FormInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors(prev => { const { password, ...rest } = prev; return rest; });
          }}
          placeholder="Create a password"
          icon="lock"
          secureTextEntry
          autoCapitalize="none"
          error={errors.password}
        />

        <FormInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) setErrors(prev => { const { confirmPassword, ...rest } = prev; return rest; });
          }}
          placeholder="Confirm your password"
          icon="lock"
          secureTextEntry
          autoCapitalize="none"
          error={errors.confirmPassword}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={{ marginBottom: Spacing.md }}>
          Birth Details (Optional)
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary, marginBottom: Spacing.lg }}>
          Your birth details help us provide accurate astrological readings
        </ThemedText>

        <FormInput
          label="Birth Date"
          value={birthDateStr}
          onChangeText={handleDateChange}
          placeholder="MM/DD/YYYY"
          icon="calendar"
          error={errors.birthDate}
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
          label="Create Account"
          onPress={handleRegister}
          disabled={!name.trim() || !email.trim() || !password}
          loading={registerMutation.isPending}
        />
      </View>

      <Pressable
        style={styles.loginLink}
        onPress={() => navigation.goBack()}
      >
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          Already have an account?{" "}
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>
          Sign In
        </ThemedText>
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
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
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
});
