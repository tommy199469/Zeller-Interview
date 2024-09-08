import React from "react"
import { render, waitFor, fireEvent } from "@testing-library/react-native"
import { CustomerScreen } from "./CustomerScreen"
import { MockedProvider } from "@apollo/client/testing"
import { getCustomerQuery } from "../services/api"
import { CompositeNavigationProp } from "@react-navigation/native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { TabParamList, AppStackParamList } from "../navigators"
import { RouteProp } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { act } from "@testing-library/react-native"

// Define mock data for different query responses
const mocks = [
  {
    request: {
      query: getCustomerQuery,
      variables: { role: "Admin" },
    },
    result: {
      data: {
        listZellerCustomers: {
          items: [
            {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              role: "Admin",
            },
            {
              id: "2",
              name: "Jane Smith",
              email: "jane@example.com",
              role: "Manager",
            },
          ],
        },
      },
    },
  },
]

const mockedNavigate = jest.fn()

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockedNavigate }),
}))

const mockNavigation: CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Customer">,
  NativeStackNavigationProp<AppStackParamList, "Default">
> = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
} as any

// Define the mock route
const mockRoute: RouteProp<TabParamList, "Customer"> = {
  key: "Customer",
  name: "Customer",
}

describe("CustomerScreen", () => {
  // Test rendering the CustomerScreen
  it("renders the Customer Screen correctly", async () => {
    const wrapper = render(
      <SafeAreaProvider initialSafeAreaInsets={{ top: 1, left: 2, right: 3, bottom: 4 }}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomerScreen navigation={mockNavigation} route={mockRoute} />
        </MockedProvider>
      </SafeAreaProvider>,
    )

    // Use waitFor to wait for async data to load
    await waitFor(() => expect(wrapper.queryByText("Admin Users")).toBeDefined())

    // console.log("check the admin users", wrapper.queryByText("Admin Users"))
  })

  //   // Test filtering customers based on search text
  //   it("filters customers based on search text", async () => {
  //     const { queryByTestId, queryByText } = render(
  //       <SafeAreaProvider>
  //         <MockedProvider mocks={mocks} addTypename={false}>
  //           <CustomerScreen navigation={mockNavigation} route={mockRoute} />
  //         </MockedProvider>
  //       </SafeAreaProvider>,
  //     )

  //     await waitFor(() => [
  //       expect(queryByText("John Doe")).toBeDefined(),
  //       expect(queryByText("Jane Smith")).toBeDefined(),
  //     ])

  //     // Check if the search input is rendered
  //     const searchInput = queryByTestId("search-input")
  //     expect(searchInput).toBeDefined()

  //     console.log("searchInput", searchInput)

  //     // Simulate typing "Jane" into the search input
  //     fireEvent.changeText(searchInput, "Jane")

  //     // Verify that "Jane Smith" is shown and "John Doe" is not displayed
  //     expect(queryByText("John Doe")).toBeNull()
  //     expect(queryByText("Jane Smith")).toBeDefined()
  //   })

  //   // Test changing user type and refetching data
  //   it("changes the user type and refetches data correctly", async () => {
  //     const { getByText, queryByText } = render(
  //       <SafeAreaProvider>
  //         <MockedProvider mocks={mocks} addTypename={false}>
  //           <CustomerScreen navigation={mockNavigation} route={mockRoute} />
  //         </MockedProvider>
  //       </SafeAreaProvider>,
  //     )

  //     // Wait for the "Admin" users to be loaded
  //     await waitFor(() => expect(queryByText("John Doe")).toBeDefined())
  //     await waitFor(() => expect(queryByText("Jane Smith")).toBeDefined())

  //     // Change the user type to "Manager"
  //     fireEvent.press(getByText("Manager"))

  //     // After changing the user type, "Jane Smith" should be the only user visible
  //     await waitFor(() => expect(queryByText("John Doe")).toBeNull())
  //     await waitFor(() => expect(queryByText("Jane Smith")).toBeDefined())
  //   })

  //   // Test pulling to refresh the list of customers
  //   it("refreshes the customer list when pulled down", async () => {
  //     const { getByTestId, queryByText } = render(
  //       <SafeAreaProvider>
  //         <MockedProvider mocks={mocks} addTypename={false}>
  //           <CustomerScreen navigation={mockNavigation} route={mockRoute} />
  //         </MockedProvider>
  //       </SafeAreaProvider>,
  //     )

  //     // Wait for the initial data to load
  //     await waitFor(() => expect(queryByText("John Doe")).toBeDefined())

  //     // Simulate pulling down to refresh
  //     const flatList = getByTestId("customer-list")
  //     fireEvent(flatList, "refresh")

  //     // After refresh, ensure that the same data is still visible
  //     await waitFor(() => expect(queryByText("John Doe")).toBeDefined())
  //   })
})
