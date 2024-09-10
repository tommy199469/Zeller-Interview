import React from "react"
import { render, fireEvent, waitFor, act } from "@testing-library/react-native"
import { CustomerCard, DividerLine, RadioGroup, SearchInput, TabBarIcon, TabBarLabel } from "."
import { ICustomer } from "../models/Customer"
import { HomeIcon } from "../assets"
import { colors } from "app/theme"

describe("CustomerCard", () => {
  it("renders customer card with name and role", async () => {
    const customer: ICustomer = {
      id: "001",
      name: "John Doe",
      role: "Manager",
      email: "test@zeller.com",
    }

    const { getByText } = render(<CustomerCard item={customer} />)

    await waitFor(() => {
      expect(getByText("John Doe")).toBeDefined()
      expect(getByText("Manager")).toBeDefined()
    })
  })

  it("renders first character of the customer name in icon", async () => {
    const customer: ICustomer = {
      id: "001",
      name: "Alice",
      role: "Manager",
      email: "test@zeller.com",
    }

    const { getByText } = render(<CustomerCard item={customer} />)

    await waitFor(() => {
      expect(getByText("A")).toBeDefined()
    })
  })

  test("renders CustomerCard correctly", async () => {
    const customer = { id: "1", name: "John Doe", email: "john@example.com", role: "Manager" }
    const { toJSON } = render(<CustomerCard item={customer} />)

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot()
    })
  })
})

describe("DividerLine", () => {
  it("renders divider line", async () => {
    const { getByTestId } = render(<DividerLine />)

    await waitFor(() => {
      expect(getByTestId("divider-line")).toBeDefined()
    })
  })
})

describe("RadioGroup", () => {
  const options = ["Option 1", "Option 2"]
  const selectedValue = "Option 1"
  const onValueChange = jest.fn()

  it("renders radio group options", async () => {
    const { getByText, queryByText } = render(
      <RadioGroup options={options} selectedValue={selectedValue} onValueChange={onValueChange} />,
    )

    await waitFor(() => {
      expect(getByText("Option 1")).toBeDefined()
      expect(getByText("Option 2")).toBeDefined()
      expect(queryByText("Option 3")).toBeNull()
    })
  })

  it("triggers onValueChange when an option is selected", async () => {
    const { getByText } = render(
      <RadioGroup options={options} selectedValue={selectedValue} onValueChange={onValueChange} />,
    )

    await act(async () => {
      fireEvent.press(getByText("Option 2"))
    })

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("Option 2")
    })
  })
})

describe("SearchInput", () => {
  const onChangeText = jest.fn()

  it("renders search input with placeholder", async () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={onChangeText} placeholder="Search..." />,
    )

    await waitFor(() => {
      expect(getByPlaceholderText("Search...")).toBeDefined()
    })
  })

  it("updates the value when text is entered", async () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={onChangeText} placeholder="Search..." />,
    )

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText("Search..."), "test input")
    })

    await waitFor(() => {
      expect(onChangeText).toHaveBeenCalledWith("test input")
    })
  })
})

describe("TabBarLabel", () => {
  it("renders TabBarLabel with correct text", async () => {
    const { getByText } = render(<TabBarLabel text="Home" focused={true} />)

    await waitFor(() => {
      expect(getByText("Home")).toBeDefined()
    })
  })
})

describe("TabBarIcon", () => {
  const source = HomeIcon

  it("renders TabBarIcon with correct size and tint color", async () => {
    const { getByTestId } = render(<TabBarIcon source={source} focused={true} size={30} />)

    await waitFor(() => {
      const image = getByTestId("icon")
      expect(image.props.style.width).toBe(30)
      expect(image.props.style.height).toBe(30)
      expect(image.props.style.tintColor).toBe(colors.tint)
    })
  })
})
