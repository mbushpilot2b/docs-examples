import { rule } from 'graphql-shield';
import { AuthContext } from './auth.js';

// Rule 1: Check if user is authenticated
export const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx: AuthContext, info) => {
    return ctx.user !== undefined;
  }
)

// Rule 2: Check if user is admin
export const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx: AuthContext, info) => {
    return ctx.user?.username === 'admin';
  }
)