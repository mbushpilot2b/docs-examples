// GraphQL type definitions for books
export const bookTypeDefs = `#graphql
  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # Book-related queries
  type Query {
    books: [Book]
    protectedBooks: [Book]
    adminBooks: [Book]
  }

  # Book-related mutations
  type Mutation {
    addBook(title: String!, author: String!): Book
    deleteBook(title: String!): Boolean
  }
`;
