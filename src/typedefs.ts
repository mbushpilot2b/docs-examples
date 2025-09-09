// GraphQL type definitions
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

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

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    me: User
    protectedBooks: [Book]
    adminBooks: [Book]
  }

  # Mutations
  type Mutation {
    login(username: String!, password: String!): AuthResponse!
    logout: LogoutResponse!
    addBook(title: String!, author: String!): Book
    deleteBook(title: String!): Boolean
  }
`;
