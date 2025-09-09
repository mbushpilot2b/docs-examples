import { authenticateUser, generateToken, AuthContext } from './auth.js';

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

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
// Note: Authentication/authorization is now handled by GraphQL Shield
export const resolvers = {
  Query: {
    books: () => books,
    me: (_: any, __: any, context: AuthContext) => context.user,
    protectedBooks: () => books, // Shield will block unauthorized access
    adminBooks: () => books, // Shield will block non-admin access
  },
  Mutation: {
    login: async (_: any, { username, password }: { username: string; password: string }) => {
      const user = await authenticateUser(username, password);
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
          user: null,
          token: null,
        };
      }

      const token = generateToken(user);
      return {
        success: true,
        message: 'Login successful',
        user,
        token,
      };
    },
    logout: () => {
      return {
        success: true,
        message: 'Logout successful',
      };
    },
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
