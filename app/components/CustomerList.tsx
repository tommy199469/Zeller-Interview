import React, { useState, useMemo } from "react"
import { View, Text, ActivityIndicator, FlatList } from "react-native"
import { spacing } from "../theme"
import { CustomerCard, SearchInput } from "./"
import { useQuery } from "@apollo/client"
import { getCustomerQuery } from "../services/api"
import { ICustomer } from "../models/Customer"
import { $title, $viewContainer } from "../styles"

const CustomerList = ({
  selectedUserType,
  searchText,
  setSearchText,
}: {
  selectedUserType: string
  searchText: string
  setSearchText: (text: string) => void
}) => {
  // for the pulling to update
  const [refreshing, setRefreshing] = useState(false)

  // GraphQL query to fetch customer data based on role
  const { data, loading, error, refetch } = useQuery(getCustomerQuery, {
    variables: { role: selectedUserType.toUpperCase() },
  })

  const customers = useMemo(() => {
    if (data?.listZellerCustomers?.items) {
      // it needs to do the filtering for the mock server in local
      // return data.listZellerCustomers.items.filter(
      //   (item: ICustomer) => item.role.toLocaleUpperCase() === selectedUserType.toLocaleUpperCase(),
      // )

      // if you calling the production one, it does not need to do the filtering
      return data.listZellerCustomers.items
    }
    return []
  }, [data])

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
    <View style={$viewContainer}>
      {userTypeTitle}
      {error && <Text>{error?.message || "Cannot fetch data from server"}</Text>}

      {/* Search Input */}
      {customers.length > 0 && (
        <SearchInput value={searchText} onChangeText={setSearchText} placeholder="Search by name" />
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
  )
}

export { CustomerList }
