// global style
import { ViewStyle, TextStyle } from "react-native"
import { spacing, colors } from "../theme"
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
  textTransform: "capitalize",
}

export { $container, $title, $viewContainer }
