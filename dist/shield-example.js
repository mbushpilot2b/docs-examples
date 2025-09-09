// GraphQL Shield Example - This shows how shield would be integrated
// Note: Full shield integration with Apollo Server 5 requires additional setup
// This file demonstrates the shield patterns that would be used
import { shield, rule, allow, deny, and, or } from 'graphql-shield';
// Rule 1: Check if user is authenticated
export const isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return ctx.user !== undefined;
});
// Rule 2: Check if user is admin
export const isAdmin = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return ctx.user?.username === 'admin';
});
// Rule 3: Check if user is regular user
export const isUser = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    return ctx.user?.username === 'user';
});
// Rule 4: Custom rule - check if user can access specific resource
export const canAccessBooks = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    // Example: only admin can access if the query includes certain fields
    if (info.fieldName === 'adminBooks') {
        return ctx.user?.username === 'admin';
    }
    return true;
});
// Rule 5: Rate limiting rule (simplified example)
export const rateLimit = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
    // In a real app, you'd check rate limits from a cache/store
    return true; // Always allow for demo
});
// Rule 6: Input validation rule
export const validInput = rule()(async (parent, args, info) => {
    if (info.fieldName === 'addBook') {
        return args.title && args.title.length > 0 && args.author && args.author.length > 0;
    }
    return true;
});
// Combine rules using logical operators
export const isAuthenticatedUser = and(isAuthenticated, or(isUser, isAdmin));
export const isAuthenticatedAdmin = and(isAuthenticated, isAdmin);
export const canModifyBooks = and(isAuthenticated, validInput, rateLimit);
// Apply shield to GraphQL operations
export const permissions = shield({
    // Query permissions
    Query: {
        // Public queries - anyone can access
        books: allow,
        // Authenticated users only
        me: isAuthenticated,
        protectedBooks: isAuthenticated,
        // Admin only
        adminBooks: isAdmin,
    },
    Mutation: {
        // Public mutations (for demo - login should be public)
        login: allow,
        logout: allow,
        // Authenticated users
        addBook: isAuthenticated,
        // Admin only
        deleteBook: isAdmin,
    },
    // Field-level permissions (example)
    Book: {
        // All fields allow by default
        title: allow,
        author: allow,
    },
    User: {
        // Sensitive fields might be restricted
        username: allow,
        firstName: allow,
        lastName: allow,
    },
}, {
    // Global fallback
    fallbackRule: deny,
    // Allow introspection in development
    allowExternalErrors: process.env.NODE_ENV !== 'production',
});
// Example of how to integrate with Apollo Server (requires additional setup):
//
// 1. For Apollo Server 4 and earlier:
// const server = new ApolloServer({
//   schema: applyMiddleware(schema, permissions),
// });
//
// 2. For Apollo Server 5 with graphql-shield (more complex):
// - Use @envelop/graphql-shield plugin
// - Or manually apply middleware to resolvers
//
// For now, this example demonstrates authentication through resolver logic
// and context, which is a simpler approach that works well with Apollo Server 5.
