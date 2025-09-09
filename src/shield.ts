import { shield, allow, deny, and, or } from 'graphql-shield';
import { isAuthenticated, isAdmin } from './rules.js';



// Apply shield to GraphQL operations
export const permissions = shield({
  // Query permissions
  Query: {
    books: allow,
    me: isAuthenticated,
    protectedBooks: isAuthenticated,
    adminBooks: isAdmin,
  },
  Mutation: {
    login: allow,
    logout: allow,
    addBook: isAuthenticated,
    deleteBook: isAdmin,
    "*": deny,
  },
}, {
  fallbackRule: allow,
  allowExternalErrors: process.env.NODE_ENV !== 'production',
});