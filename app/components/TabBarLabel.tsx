import { colors } from "app/theme"
import React from "react"
import { Text, Image, TouchableOpacity } from "react-native"

// to align the color for label and icon
const getColor = (focused: boolean) => {
  return focused ? colors.tint : colors.text
}

// for the label
const TabBarLabel = ({ text, focused }: { text: string; focused: boolean }) => {
  return (
    <Text
      style={{
        color: getColor(focused),
      }}
    >
      {text}
    </Text>
  )
}

// for the icon
const TabBarIcon = ({
  source,
  focused,
  size = 25,
}: {
  source: any
  focused: boolean
  size?: number
}) => {
  return (
    <TouchableOpacity>
      <Image style={{ tintColor: getColor(focused), width: size, height: size }} source={source} />
    </TouchableOpacity>
  )
}

export { TabBarLabel, TabBarIcon }
