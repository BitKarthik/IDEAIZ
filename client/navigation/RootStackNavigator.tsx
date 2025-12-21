import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import PresetQuestionsModal from "@/screens/PresetQuestionsModal";
import BirthChartModal from "@/screens/BirthChartModal";
import SubscriptionModal from "@/screens/SubscriptionModal";
import OnboardingScreen from "@/screens/OnboardingScreen";
import EditProfileModal from "@/screens/EditProfileModal";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  Onboarding: undefined;
  PresetQuestions: undefined;
  BirthChart: undefined;
  Subscription: undefined;
  EditProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="PresetQuestions"
        component={PresetQuestionsModal}
        options={{
          presentation: "modal",
          headerTitle: "Ask About",
        }}
      />
      <Stack.Screen
        name="BirthChart"
        component={BirthChartModal}
        options={{
          presentation: "modal",
          headerTitle: "Your Birth Chart",
        }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionModal}
        options={{
          presentation: "modal",
          headerTitle: "Subscription",
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileModal}
        options={{
          presentation: "modal",
          headerTitle: "Edit Profile",
        }}
      />
    </Stack.Navigator>
  );
}
