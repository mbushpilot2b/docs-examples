import { shield, rule, allow, deny, and, or } from 'graphql-shield';
// Rule 1: Check if user is authenticated
const isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return ctx.user !== undefined;
});
// Rule 2: Check if user is admin
const isAdmin = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return ctx.user?.username === 'admin';
});
// Rule 3: Check if user is regular user
const isUser = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return ctx.user?.username === 'user';
});
// Rule 4: Custom rule - check if user can access specific resource
const canAccessBooks = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    // Example: only admin can access if the query includes certain fields
    if (info.fieldName === 'adminBooks') {
        return ctx.user?.username === 'admin';
    }
    return true;
});
// Rule 5: Rate limiting rule (simplified example)
const rateLimit = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    // In a real app, you'd check rate limits from a cache/store
    return true; // Always allow for demo
});
// Rule 6: Input validation rule
const validInput = rule()(async (parent, args, info) => {
    if (info.fieldName === 'addBook') {
        return args.title && args.title.length > 0 && args.author && args.author.length > 0;
    }
    return true;
});
// Combine rules using logical operators
const isAuthenticatedUser = and(isAuthenticated, or(isUser, isAdmin));
const isAuthenticatedAdmin = and(isAuthenticated, isAdmin);
const canModifyBooks = and(isAuthenticated, validInput, rateLimit);
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
