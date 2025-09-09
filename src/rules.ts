import { rule } from 'graphql-shield';
import { GraphQLError } from 'graphql';
import { AuthContext, getUserPermissions } from './auth.js';

export const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: AuthContext) => {
    if (ctx.user === null) {
      return new GraphQLError('Authentication required. Please log in to access this resource.', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
    }
    return true;
  }
)

export const canReadBooks = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: AuthContext) => {
    const permissions = getUserPermissions(ctx.user.id);
    if (!permissions?.canReadBooks) {
      return new GraphQLError('Insufficient permissions. You do not have permission to read books.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }
    return true;
  }
)

export const canAddBooks = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: AuthContext) => {
    const permissions = getUserPermissions(ctx.user.id);
    if (!permissions?.canAddBooks) {
      return new GraphQLError('Insufficient permissions. You do not have permission to add books.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }
    return true;
  }
)

export const canDeleteBooks = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: AuthContext) => {
    const permissions = getUserPermissions(ctx.user.id);
    if (!permissions?.canDeleteBooks) {
      return new GraphQLError('Insufficient permissions. You do not have permission to delete books.', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }
    return true;
  }
)