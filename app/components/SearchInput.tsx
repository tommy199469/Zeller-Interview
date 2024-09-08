import React from "react"
import { TextInput, View, ViewStyle, TextStyle } from "react-native"
import { spacing, colors } from "../theme"

interface SearchInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChangeText, placeholder }) => {
  return (
    <View style={$searchContainer}>
      <TextInput
        style={$searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Search..."}
      />
    </View>
  )
}

const $searchContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
  marginTop: spacing.xl,
}

const $searchInput: TextStyle = {
  borderWidth: 1,
  borderColor: colors.text,
  borderRadius: 8,
  padding: spacing.sm,
  backgroundColor: colors.background,
}
