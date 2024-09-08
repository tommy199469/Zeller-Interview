import React from "react"
import { View, Text, ViewStyle, TextStyle } from "react-native"
import { ICustomer } from "../models/Customer"
import { spacing } from "../theme"
// Component that accepts item and spacing as props
const CustomerCard = ({ item }: { item: ICustomer }) => {
  return (
    <View style={[$container, { marginTop: spacing.xl }]}>
      {/* Icon with the first char of name */}
      <View style={[$iconContainer, { marginRight: spacing.md }]}>
        <Text style={$iconText}>{item?.name?.charAt(0).toUpperCase()}</Text>
      </View>

      {/* Showing the information of user */}
      <View style={$infoContainer}>
        <Text style={$nameText}>{item.name}</Text>
        <Text style={[$roleText, { marginTop: spacing.sm }]}>{item.role}</Text>
      </View>
    </View>
  )
}

export { CustomerCard }

// Define styles using ViewStyle and TextStyle type annotations
const $container: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $iconContainer: ViewStyle = {
  height: 50,
  width: 50,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#e8f2fb",
}

const $iconText: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
}

const $infoContainer: ViewStyle = {
  flexDirection: "column",
}

const $nameText: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
}

const $roleText: TextStyle = {
  color: "grey",
  fontSize: 14,
}
