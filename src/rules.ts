import { rule } from 'graphql-shield';
import { AuthContext } from './auth.js';

export const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, ctx: AuthContext) => {
    return ctx.user !== null;
  }
)

export const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx: AuthContext, info) => {
    return ctx.user?.username === 'admin';
  }
)