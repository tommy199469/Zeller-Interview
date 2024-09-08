import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { View, Text, ViewStyle, TextStyle } from "react-native"
import { TabScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { Screen } from "../components"

interface HomeScreenProps extends TabScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreenScreen() {
  return (
    <Screen preset="fixed" style={$container} safeAreaEdges={["top"]}>
      <View style={$viewContainer}>
        <Text style={$title}>Home Screen</Text>
      </View>
    </Screen>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  marginTop: "10%",
}

const $viewContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  fontWeight: "600",
  fontSize: 24,
}
