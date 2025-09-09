import { allow, deny } from 'graphql-shield';
import { isAuthenticated } from '../rules.js';

// Export user-related permission rules (rule tree)
export const userPermissions = {
  Query: {
    me: isAuthenticated,
  },
  Mutation: {
    login: allow,
    logout: allow,
  },
};
