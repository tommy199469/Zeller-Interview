import React, { FC, useMemo } from "react"
import { View, ViewStyle, Text, TextStyle, TouchableOpacity } from "react-native"
import { RadioButton } from "react-native-paper"
import { spacing } from "../theme"

interface RadioGroupProps {
  options: string[]
  selectedValue: string
  onValueChange: (value: string) => void
}

export const RadioGroup: FC<RadioGroupProps> = ({ options, selectedValue, onValueChange }) => {
  // reduce the rendering
  const renderedOptions = useMemo(() => {
    return options.map((option) => (
      <TouchableOpacity key={option} onPress={() => onValueChange(option)} style={$radioContainer}>
        <RadioButton.Android
          value={option}
          status={selectedValue === option ? "checked" : "unchecked"}
          onPress={() => onValueChange(option)}
          color="#0171ce"
        />
        <Text style={$radioText}>{option}</Text>
      </TouchableOpacity>
    ))
  }, [options, selectedValue, onValueChange])

  return <View style={$radioGroupContainer}>{renderedOptions}</View>
}

const $radioGroupContainer: ViewStyle = {
  marginTop: spacing.lg,
}

const $radioContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: spacing.md,
  padding: spacing.xs,
  backgroundColor: "#e8f2fb",
  borderRadius: spacing.xs,
}

const $radioText: TextStyle = {
  marginLeft: spacing.sm,
  textTransform: "capitalize",
}
