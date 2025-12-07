import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import TodayScreen from "@/screens/TodayScreen";
import AskScreen from "@/screens/AskScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import { useTheme } from "@/hooks/useTheme";
import { HeaderTitle } from "@/components/HeaderTitle";
import { Spacing } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export type MainTabParamList = {
  TodayTab: undefined;
  AskTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Tab.Navigator
      initialRouteName="TodayTab"
      screenOptions={{
        headerTitleAlign: "center",
        headerTransparent: true,
        headerTintColor: theme.text,
        headerStyle: {
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
            web: theme.backgroundRoot,
          }),
        },
        headerBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tab.Screen
        name="TodayTab"
        component={TodayScreen}
        options={{
          title: "Today",
          headerTitle: () => <HeaderTitle title="MyOrca" />,
          tabBarIcon: ({ color, size }) => (
            <Feather name="sun" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AskTab"
        component={AskScreen}
        options={{
          title: "Ask",
          headerTitle: "Ask",
          headerRight: () => (
            <HeaderButton
              onPress={() => navigation.navigate("PresetQuestions")}
              pressColor={theme.primary + "20"}
            >
              <Feather name="list" size={22} color={theme.text} />
            </HeaderButton>
          ),
          tabBarIcon: ({ color, size }) => (
            <View
              style={[
                styles.centerTabIcon,
                { backgroundColor: theme.primary },
              ]}
            >
              <Feather name="message-circle" size={20} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerTitle: "Profile",
          headerRight: () => (
            <HeaderButton
              onPress={() => {}}
              pressColor={theme.primary + "20"}
            >
              <Feather name="settings" size={22} color={theme.text} />
            </HeaderButton>
          ),
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centerTabIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
});
