import { Platform } from "react-native";

const darkBrown = "#3D2914";
const darkBrownLight = "#5C3D1E";
const mildGold = "#C9A962";
const mildGoldLight = "#D4BC7D";
const brightGold = "#E8D5A3";
const tealAccent = "#14B8A6";

export const Colors = {
  light: {
    text: "#3D2914",
    textSecondary: "#5C4A38",
    textTertiary: "#7A6652",
    buttonText: "#FFFFFF",
    tabIconDefault: "#5C4A38",
    tabIconSelected: mildGold,
    link: mildGold,
    primary: mildGold,
    primaryLight: mildGoldLight,
    secondary: darkBrown,
    secondaryLight: darkBrownLight,
    accent: tealAccent,
    backgroundRoot: "#F5F0E8",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#EDE6DB",
    backgroundTertiary: "#E0D6C8",
    success: "#10B981",
    warning: "#C9A962",
    error: "#F43F5E",
    info: "#0EA5E9",
    border: "#D4C9B8",
    cardShadow: "rgba(61, 41, 20, 0.08)",
    ctaText: "#3D2914",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#FFFFFF",
    textTertiary: "#FFFFFF",
    buttonText: "#FFFFFF",
    tabIconDefault: "#FFFFFF",
    tabIconSelected: "#FFFFFF",
    link: "#FFFFFF",
    primary: "#FFFFFF",
    primaryLight: "#FFFFFF",
    secondary: "#F59E0B",
    secondaryLight: "#FBBF24",
    accent: "#2DD4BF",
    backgroundRoot: "#1A120B",
    backgroundDefault: "#2A1E14",
    backgroundSecondary: "#3D2914",
    backgroundTertiary: "#4A3520",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#FB7185",
    info: "#38BDF8",
    border: "#5C3D1E",
    cardShadow: "rgba(0, 0, 0, 0.4)",
    ctaText: "#8B6914",
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
    sans: "System",
    serif: "Georgia",
    ancient: "Georgia",
    rounded: "System",
    mono: "Menlo",
  },
  android: {
    sans: "Roboto",
    serif: "serif",
    ancient: "serif",
    rounded: "Roboto",
    mono: "monospace",
  },
  default: {
    sans: "System",
    serif: "serif",
    ancient: "serif",
    rounded: "System",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    ancient: "Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
