import { Platform } from "react-native";

const primaryPurple = "#6B46C1";
const primaryPurpleLight = "#8B5CF6";
const goldenAmber = "#F59E0B";
const goldenLight = "#FBBF24";
const tealAccent = "#14B8A6";

export const Colors = {
  light: {
    text: "#1F2937",
    textSecondary: "#6B7280",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B7280",
    tabIconSelected: primaryPurple,
    link: primaryPurple,
    primary: primaryPurple,
    primaryLight: primaryPurpleLight,
    secondary: goldenAmber,
    secondaryLight: goldenLight,
    accent: tealAccent,
    backgroundRoot: "#FAFAF9",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F5F4",
    backgroundTertiary: "#E7E5E4",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#F43F5E",
    info: "#0EA5E9",
    border: "#E5E7EB",
    cardShadow: "rgba(0, 0, 0, 0.05)",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryPurpleLight,
    link: primaryPurpleLight,
    primary: primaryPurple,
    primaryLight: primaryPurpleLight,
    secondary: goldenAmber,
    secondaryLight: goldenLight,
    accent: tealAccent,
    backgroundRoot: "#1C1917",
    backgroundDefault: "#292524",
    backgroundSecondary: "#3D3B39",
    backgroundTertiary: "#52504E",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#F43F5E",
    info: "#0EA5E9",
    border: "#404040",
    cardShadow: "rgba(0, 0, 0, 0.3)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  floating: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
