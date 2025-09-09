import { mergeTypeDefs } from '@graphql-tools/merge';

// Import type definitions from all modules
import { bookTypeDefs } from './books/index.js';
import { userTypeDefs } from './user/index.js';

// Stitch together all type definitions
export const typeDefs = mergeTypeDefs([bookTypeDefs, userTypeDefs]);
