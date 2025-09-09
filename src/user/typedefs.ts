// GraphQL type definitions for user authentication
export const userTypeDefs = `#graphql
  # User type
  type User {
    username: String
    firstName: String
    lastName: String
  }

  # Login response
  type AuthResponse {
    success: Boolean!
    message: String!
    user: User
    token: String
  }

  # Logout response
  type LogoutResponse {
    success: Boolean!
    message: String!
  }

  # User-related queries
  type Query {
    me: User
  }

  # User-related mutations
  type Mutation {
    login(username: String!, password: String!): AuthResponse!
    logout: LogoutResponse!
  }
`;
