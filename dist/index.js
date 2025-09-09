import { startStandaloneServer } from '@apollo/server/standalone';
import { server, context } from './server.js';
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context,
});
console.log(`🚀 Server listening at: ${url}`);
console.log(`📝 Use Authorization header with Bearer token for authentication`);
console.log(`📝 Example: Authorization: Bearer <your-jwt-token>`);
