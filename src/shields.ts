import { shield, allow } from 'graphql-shield';

// Import permissions from all modules
import { bookPermissions } from './books/index.js';
import { userPermissions } from './user/index.js';

// Stitch together all permissions into a single shield
export const permissions = shield({
  ...bookPermissions,
  ...userPermissions,
}, {
  fallbackRule: allow,
  allowExternalErrors: process.env.NODE_ENV !== 'production',
});
