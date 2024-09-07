import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, Text, ViewStyle, TextStyle, ActivityIndicator, FlatList } from "react-native"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { Screen, DividerLine, RadioGroup, CustomerCard } from "../components"
import { useQuery } from "@apollo/client"
import { getCustomerQuery } from "../services/api"

interface CustomerScreenProps extends AppStackScreenProps<"Customer"> {}
const userTypes: string[] = ["Admin", "Manager"]

export const CustomerScreen: FC<CustomerScreenProps> = observer(function CustomerScreenScreen() {
  const [selectedUserType, setSelectedUserType] = useState<string>("Admin")
  const [customers, setCustomers] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const { data, loading, error, refetch } = useQuery(getCustomerQuery, {
    variables: { role: selectedUserType }, // Pass the role as a variable here
  })
  useEffect(() => {
    if (data?.listZellerCustomers?.items) {
      setCustomers(
        data?.listZellerCustomers?.items.filter((item) => item.role === selectedUserType),
      )
    }
  }, [data])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await refetch() // Refetch the GraphQL data when pulling to refresh
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Screen preset="fixed" style={$container} safeAreaEdges={["top"]}>
      <View style={$viewContainer}>
        <Text style={$title}>User Types</Text>
        <RadioGroup
          options={userTypes}
          selectedValue={selectedUserType}
          onValueChange={(value) => setSelectedUserType(value)}
        />
      </View>

      {/* divider */}
      <DividerLine />

      <View style={$viewContainer}>
        <Text style={$title}>{selectedUserType} Users</Text>

        {loading && <ActivityIndicator />}

        {!loading && (
          <FlatList
            style={{
              height: "100%",
            }}
            data={customers}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => <CustomerCard item={item} spacing={spacing} />}
            onRefresh={onRefresh}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
          />
        )}
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
