import React from "react"
import { render, fireEvent, waitFor, act } from "@testing-library/react-native"
import { MockedProvider } from "@apollo/client/testing"
import { CustomerScreen } from "../screens/CustomerScreen"
import { getCustomerQuery } from "../services/api" // The GraphQL query
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"

// Mock Data for the GraphQL query
const mockCustomers = [
  {
    id: 1,
    name: "Alice",
    role: "Admin",
    email: "alice@zeller.com",
  },
  {
    id: 2,
    name: "Bob",
    role: "Manager",
    email: "bob@zeller.com",
  },
  {
    id: 3,
    name: "Thomas",
    role: "Manager",
    email: "thomas@zeller.com",
  },
]

// Mock the query result for `getCustomerQuery`
const mocks = [
  {
    request: {
      query: getCustomerQuery,
      variables: { role: "Admin" },
    },
    result: {
      data: {
        listZellerCustomers: {
          items: mockCustomers,
          nextToken: null,
        },
      },
    },
  },
  {
    request: {
      query: getCustomerQuery,
      variables: { role: "Manager" },
    },
    result: {
      data: {
        listZellerCustomers: {
          items: mockCustomers,
          nextToken: null,
        },
      },
    },
  },
]

// Mock navigation and route props
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
}

const mockRoute = {
  key: "CustomerScreen",
  name: "Customer",
}

// mock the SafeAreaProvider
jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
)

describe("CustomerScreen with Mocked GraphQL", () => {
  // Render the screen inside an ApolloProvider, SafeAreaProvider, and NavigationContainer
  const setup = () =>
    render(
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <NavigationContainer>
            <CustomerScreen navigation={mockNavigation as any} route={mockRoute as any} />
          </NavigationContainer>
        </MockedProvider>
      </SafeAreaProvider>,
    )

  test("renders the CustomerScreen and shows 'Admin' users", async () => {
    const { getByText, queryByText } = setup()

    // Test RadioGroup with Admin and Manager options
    expect(getByText("Admin")).toBeDefined()
    expect(getByText("Manager")).toBeDefined()

    // By default, "Admin" should be selected, and "Alice" should appear
    await waitFor(() => {
      expect(getByText("Alice")).toBeDefined()
    })

    // "Bob" should not appear for "Admin"
    expect(queryByText("Bob")).toBeNull()
  })

  test("changes user type to Manager and shows 'Bob'", async () => {
    const { getByText, queryByText } = setup()

    // By default, "Admin" should be selected, and "Alice" should appear
    await waitFor(() => {
      expect(getByText("Alice")).toBeDefined()
    })

    // "Bob" should not appear for "Admin"
    expect(queryByText("Bob")).toBeNull()

    // Change user type to "Manager"
    fireEvent.press(getByText("Manager"))

    // Wait for the list to update
    await waitFor(() => {
      expect(getByText("Bob")).toBeDefined()
    })

    // "Alice" should no longer be shown when "Manager" is selected
    expect(queryByText("Alice")).toBeNull()
  })

  test("changes user type to Manager and input 'Thomas' in the search input", async () => {
    const { getByText, queryByText, getByTestId } = setup()

    // By default, "Admin" should be selected, and "Alice" should appear
    await waitFor(() => {
      expect(getByText("Alice")).toBeDefined()
    })

    // "Bob" should not appear for "Admin"
    expect(queryByText("Bob")).toBeNull()

    // Change user type to "Manager"
    fireEvent.press(getByText("Manager"))

    // Wait for the list to update
    await waitFor(() => {
      expect(getByText("Bob")).toBeDefined(), expect(getByText("Thomas")).toBeDefined()
    })

    // "Alice" should no longer be shown when "Manager" is selected
    expect(queryByText("Alice")).toBeNull()

    // check the input is exist first
    await waitFor(() => {
      expect(getByTestId("search_input")).toBeDefined()
    })

    // input Thomas
    await act(async () => {
      fireEvent.changeText(getByTestId("search_input"), "Thomas")
    })

    // "Bob" should not appear after input the search and only show Thomas
    expect(queryByText("Bob")).toBeNull()
    expect(getByText("Thomas")).toBeDefined()
  })
})
