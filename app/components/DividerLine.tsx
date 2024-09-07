import React from "react"
import { View } from "react-native"
import { spacing } from "../theme"

const DividerLine = () => {
  return (
    <View
      style={{
        width: "80%",
        height: 1,
        backgroundColor: "#A0A0A0",
        marginVertical: spacing.xl,
        alignSelf: "center",
      }}
    />
  )
}

export { DividerLine }
