import { gql } from "@apollo/client"

const getCustomerQuery = gql`
  query ListZellerCustomers($role: String!) {
    listZellerCustomers(filter: { role: { eq: $role } }) {
      items {
        id
        name
        email
        role
      }
      nextToken
    }
  }
`

export { getCustomerQuery }
