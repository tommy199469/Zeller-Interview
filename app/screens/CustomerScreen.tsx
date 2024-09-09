import React, { FC, useEffect, useState } from "react"
import { View, Text } from "react-native"
import { TabScreenProps } from "../navigators"
import { Screen, DividerLine, RadioGroup, CustomerList } from "../components"
import { $container, $title, $viewContainer } from "../styles"

interface CustomerScreenProps extends TabScreenProps<"Customer"> {}

const userTypes: string[] = ["Admin", "Manager"]

export const CustomerScreen: FC<CustomerScreenProps> = function CustomerScreenScreen() {
  // for the radio selection
  const [selectedUserType, setSelectedUserType] = useState<string>("Admin")

  // the search text
  const [searchText, setSearchText] = useState<string>("")

  // Reset the data when unmounting the component
  useEffect(() => {
    return () => {
      setSearchText("")
    }
  }, [])

  return (
    <Screen preset="fixed" style={$container} safeAreaEdges={["top"]}>
      {/* the radio selection */}
      <View style={$viewContainer} testID="container">
        <Text style={$title}>User Types</Text>
        <RadioGroup
          options={userTypes}
          selectedValue={selectedUserType}
          onValueChange={(value) => setSelectedUserType(value)}
        />
      </View>

      {/* divider */}
      <DividerLine />

      {/* customer result list */}
      <CustomerList
        selectedUserType={selectedUserType}
        searchText={searchText}
        setSearchText={setSearchText}
      />
    </Screen>
  )
}
