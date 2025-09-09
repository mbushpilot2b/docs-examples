import { rule } from 'graphql-shield';
import { AuthContext, getUserPermissions } from './auth.js';

export const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: AuthContext) => {
    if (ctx.user === null) {
      return new Error('Authentication required. Please log in to access this resource.');
    }
    return true;
  }
)

export const canReadBooks = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: AuthContext) => {
    const permissions = getUserPermissions(ctx.user.id);
    if (!permissions?.canReadBooks) {
      return 'Insufficient permissions. You do not have permission to read books.';
    }
    return true;
  }
)

export const canAddBooks = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: AuthContext) => {
    const permissions = getUserPermissions(ctx.user.id);
    if (!permissions?.canAddBooks) {
      return 'Insufficient permissions. You do not have permission to add books.';
    }
    return true;
  }
)

export const canDeleteBooks = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: AuthContext) => {
    const permissions = getUserPermissions(ctx.user.id);
    if (!permissions?.canDeleteBooks) {
      return 'Insufficient permissions. You do not have permission to delete books.';
    }
    return true;
  }
)