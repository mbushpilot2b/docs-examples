// Sample data
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// Book resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
// Note: Authentication/authorization is now handled by GraphQL Shield
export const bookResolvers = {
  Query: {
    books: () => books,
    protectedBooks: () => books, // Shield will block unauthorized access
    adminBooks: () => books, // Shield will block non-admin access
  },
  Mutation: {
    addBook: (_: any, { title, author }: { title: string; author: string }) => {
      const newBook = { title, author };
      books.push(newBook);
      return newBook;
    },
    deleteBook: (_: any, { title }: { title: string }) => {
      const index = books.findIndex(book => book.title === title);
      if (index === -1) {
        return false;
      }

      books.splice(index, 1);
      return true;
    },
  },
};
