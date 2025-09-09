import { and } from 'graphql-shield';
import { isAuthenticated, canReadBooks, canAddBooks, canDeleteBooks } from '../rules.js';

// Export book-related permission rules (rule tree)
export const bookPermissions = {
  Query: {
    books: and(isAuthenticated, canReadBooks), // All authenticated users can read books
    protectedBooks: and(isAuthenticated, canReadBooks), // Protected books require read permission
    adminBooks: and(isAuthenticated, canReadBooks), // Admin books also require read permission (admin has it)
  },
  Mutation: {
    addBook: and(isAuthenticated, canAddBooks), // Only users with add permission can add books
    deleteBook: and(isAuthenticated, canDeleteBooks), // Only users with delete permission can delete books
  },
};
