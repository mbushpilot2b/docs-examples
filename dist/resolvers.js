import { mergeResolvers } from '@graphql-tools/merge';
// Import resolvers from all modules
import { bookResolvers } from './books/index.js';
import { userResolvers } from './user/index.js';
// Stitch together all resolvers
export const resolvers = mergeResolvers([bookResolvers, userResolvers]);
