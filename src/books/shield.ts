import { allow, deny } from 'graphql-shield';
import { isAuthenticated, isAdmin } from '../rules.js';

// Export book-related permission rules (rule tree)
export const bookPermissions = {
  Query: {
    books: allow,
    protectedBooks: isAuthenticated,
    adminBooks: isAdmin,
  },
  Mutation: {
    addBook: isAuthenticated,
    deleteBook: isAdmin,
  },
};
