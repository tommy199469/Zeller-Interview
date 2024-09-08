import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { ImageStyle, Text, TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import * as Screens from "../screens"
import { HomeIcon, CustomerIcon } from "../assets"
import { TabBarIcon, TabBarLabel } from "../components"
export type TabParamList = {
  Home: undefined
  Customer: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<TabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `TabNavigator`.
 */
export function TabNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Screens.HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} text="Home" />,
          tabBarIcon: ({ focused }) => <TabBarIcon source={HomeIcon} focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Customer"
        component={Screens.CustomerScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} text="Customer" />,
          tabBarIcon: ({ focused }) => <TabBarIcon source={CustomerIcon} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}

const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}
