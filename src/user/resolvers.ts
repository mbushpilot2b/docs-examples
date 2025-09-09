import { authenticateUser, generateToken, AuthContext } from '../auth.js';

// User resolvers handle authentication and user-related operations
export const userResolvers = {
  Query: {
    me: (_: any, __: any, context: AuthContext) => context.user,
  },
  Mutation: {
    login: async (_: any, { username, password }: { username: string; password: string }) => {
      const user = await authenticateUser(username, password);
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
          user: null,
          token: null,
        };
      }

      const token = generateToken(user);
      return {
        success: true,
        message: 'Login successful',
        user,
        token,
      };
    },
    logout: () => {
      return {
        success: true,
        message: 'Logout successful',
      };
    },
  },
};
