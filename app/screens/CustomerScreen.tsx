import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, Text, ViewStyle, TextStyle, ActivityIndicator, FlatList } from "react-native"
import { TabScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { Screen, DividerLine, RadioGroup, CustomerCard, SearchInput } from "../components"
import { useQuery } from "@apollo/client"
import { getCustomerQuery } from "../services/api"
import { ICustomer } from "../models/Customer"

interface CustomerScreenProps extends TabScreenProps<"Customer"> {}

const userTypes: string[] = ["Admin", "Manager"]

export const CustomerScreen: FC<CustomerScreenProps> = observer(function CustomerScreenScreen() {
  const [selectedUserType, setSelectedUserType] = useState<string>("Admin")
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]) // Adjusting type for filtered search results
  const [searchText, setSearchText] = useState<string>("") // Search text state
  const [refreshing, setRefreshing] = useState(false)

  const { data, loading, error, refetch } = useQuery(getCustomerQuery, {
    variables: { role: selectedUserType }, // Pass the role as a variable here
  })

  useEffect(() => {
    if (data?.listZellerCustomers?.items) {
      setSearchText("")
      const customerList = data?.listZellerCustomers?.items.filter(
        (item: ICustomer) => item.role === selectedUserType,
      )
      setCustomers(customerList)
      setFilteredCustomers(customerList) // Initialize with full list
    }
  }, [data])

  // Filter customers based on the search text
  const filterCustomers = (text: string) => {
    setSearchText(text) // Update the search text
    if (text) {
      const filteredList = customers.filter((customer) =>
        customer.name.toLowerCase().includes(text.toLowerCase()),
      )
      setFilteredCustomers(filteredList)
    } else {
      setFilteredCustomers(customers)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await refetch()
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

        {error && <Text>{error?.message || "Cannot fetch data from server"}</Text>}

        {/* Search Input */}
        {customers.length > 0 && (
          <SearchInput
            value={searchText}
            onChangeText={filterCustomers}
            placeholder="Search by name"
          />
        )}
        {/* if no customer found from graphql */}
        {customers.length === 0 && (
          <Text style={[$title, { marginTop: spacing.xl, color: "grey", textAlign: "center" }]}>
            No Customer Found
          </Text>
        )}

        {/* if calling the graphql show the loading icon */}
        {loading && <ActivityIndicator />}

        {/* show the result list */}
        {!loading && (
          <FlatList
            style={{
              height: "100%",
            }}
            data={filteredCustomers} // Use filteredCustomers instead of customers
            keyExtractor={(item: ICustomer) => item.id.toString()} // Ensuring correct type
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
