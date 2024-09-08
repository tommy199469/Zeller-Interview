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
  // for the radio selection
  const [selectedUserType, setSelectedUserType] = useState<string>("Admin")

  // set the initial customer list
  const [customers, setCustomers] = useState<ICustomer[]>([])

  // after searched customer list
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([])

  // the search text
  const [searchText, setSearchText] = useState<string>("")

  // for the pulling to update
  const [refreshing, setRefreshing] = useState(false)

  const { data, loading, error, refetch } = useQuery(getCustomerQuery, {
    variables: { role: selectedUserType },
  })

  useEffect(() => {
    if (data?.listZellerCustomers?.items) {
      setSearchText("")
      const customerList = data?.listZellerCustomers?.items.filter(
        (item: ICustomer) => item.role === selectedUserType,
      )
      setCustomers(customerList)
      setFilteredCustomers(customerList)
    }

    // reset the data when unmount the component
    return () => {
      setCustomers([])
      setFilteredCustomers([])
      setSearchText("")
    }
  }, [data])

  // Filter customers based on the search text
  const filterCustomers = (text: string) => {
    setSearchText(text)
    if (text) {
      const filteredList = customers.filter((customer) =>
        customer.name.toLowerCase().includes(text.toLowerCase()),
      )
      setFilteredCustomers(filteredList)
    } else {
      setFilteredCustomers(customers)
    }
  }

  // pull to update in the flat list
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
      {/* the radio selection */}
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

      {/* customer result list */}
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
            data={filteredCustomers}
            keyExtractor={(item: ICustomer) => item.id.toString()}
            renderItem={({ item }) => <CustomerCard item={item} />}
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
