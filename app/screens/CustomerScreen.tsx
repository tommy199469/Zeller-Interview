import React, { FC, useEffect, useState, useMemo } from "react"
import { View, Text, ViewStyle, TextStyle, ActivityIndicator, FlatList } from "react-native"
import { TabScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { Screen, DividerLine, RadioGroup, CustomerCard, SearchInput } from "../components"
import { useQuery } from "@apollo/client"
import { getCustomerQuery } from "../services/api"
import { ICustomer } from "../models/Customer"

interface CustomerScreenProps extends TabScreenProps<"Customer"> {}

const userTypes: string[] = ["Admin", "Manager"]

export const CustomerScreen: FC<CustomerScreenProps> = function CustomerScreenScreen() {
  // for the radio selection
  const [selectedUserType, setSelectedUserType] = useState<string>("Admin")

  // the search text
  const [searchText, setSearchText] = useState<string>("")

  // for the pulling to update
  const [refreshing, setRefreshing] = useState(false)

  // GraphQL query to fetch customer data based on role
  const { data, loading, error, refetch } = useQuery(getCustomerQuery, {
    variables: { role: selectedUserType },
  })

  const customers = useMemo(() => {
    if (data?.listZellerCustomers?.items) {
      return data.listZellerCustomers.items.filter(
        (item: ICustomer) => item.role === selectedUserType,
      )
    }
    return []
  }, [data, selectedUserType])

  // Memoize the filtered customer list based on search text
  const filteredCustomers = useMemo(() => {
    if (searchText) {
      return customers.filter((customer: ICustomer) =>
        customer.name.toLowerCase().includes(searchText.toLowerCase()),
      )
    }
    return customers
  }, [customers, searchText])

  const userTypeTitle = useMemo(() => {
    return <Text style={$title}>{selectedUserType} Users</Text>
  }, [selectedUserType])

  // Reset the data when unmounting the component
  useEffect(() => {
    return () => {
      setSearchText("")
    }
  }, [])

  // Handle refreshing the customer list
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
      <View style={$viewContainer}>
        {userTypeTitle}
        {error && <Text>{error?.message || "Cannot fetch data from server"}</Text>}

        {/* Search Input */}
        {customers.length > 0 && (
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search by name"
          />
        )}
        {/* if no customer found from graphql */}
        {customers.length === 0 && !loading && (
          <Text style={[$title, { marginTop: spacing.xl, color: "grey", textAlign: "center" }]}>
            No Customer Found
          </Text>
        )}

        {/* if calling the graphql show the loading icon */}
        {loading && <ActivityIndicator testID="ActivityIndicator" />}

        {/* show the result list */}
        {!loading && (
          <FlatList
            testID="customer-list"
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
}

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
