# GraphQL Shield Example

This is a comprehensive example demonstrating **fully integrated GraphQL Shield** with JWT authentication and authorization patterns in Apollo Server 5. It shows a complete production-ready setup with proper permission handling.

## Features

- ✅ **Fully Integrated GraphQL Shield** with Apollo Server 5
- ✅ JWT Authentication with login/logout
- ✅ Modular file structure with separated concerns
- ✅ TypeScript support
- ✅ Apollo Server 5 integration
- ✅ Multiple authentication rule examples
- ✅ Clean resolvers (auth handled by Shield middleware)

## Project Structure

```
src/
├── auth.ts              # JWT authentication utilities
├── index.ts             # Server startup
├── resolvers.ts         # GraphQL resolvers
├── server.ts            # Apollo Server configuration
├── shield-example.ts    # GraphQL Shield patterns (examples)
└── typedefs.ts          # GraphQL type definitions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Server will be running at `http://localhost:4000/graphql`

4. **Test the Shield functionality**:
```bash
npm run test:shield
```

This will run automated tests to demonstrate that GraphQL Shield is working correctly.

## Authentication

The API supports JWT-based authentication. Use the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Test Users

- **Admin**: username: `admin`, password: `password`
- **User**: username: `user`, password: `password`

## GraphQL Shield Integration

**GraphQL Shield is now fully integrated and working!** The shield middleware is applied to the GraphQL schema using `applyMiddleware` from `graphql-middleware`.

### Shield Rules Implemented

The `shield.ts` file contains fully functional shield rules:

### 1. Basic Authentication Rules

```typescript
const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx: AuthContext, info) => {
    return ctx.user !== undefined;
  }
);

const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx: AuthContext, info) => {
    return ctx.user?.username === 'admin';
  }
);
```

### 2. Logical Rule Combinations

```typescript
const isAuthenticatedUser = and(isAuthenticated, or(isUser, isAdmin));
const isAuthenticatedAdmin = and(isAuthenticated, isAdmin);
```

### 3. Field-Level Permissions

```typescript
const permissions = shield({
  Query: {
    books: allow,              // Public access
    me: isAuthenticated,       // Auth required
    protectedBooks: isAuthenticated, // Auth required
    adminBooks: isAdmin,       // Admin only
  },
  Mutation: {
    login: allow,              // Public
    logout: allow,             // Public
    addBook: isAuthenticated,  // Auth required
    deleteBook: isAdmin,       // Admin only
  },
});
```

## Available Queries

### Public Queries
- `books`: Get all books (no auth required)
- `login(username, password)`: Login mutation

### Protected Queries (require authentication)
- `me`: Get current user info
- `protectedBooks`: Get books (auth required)
- `addBook(title, author)`: Add a book (auth required)

### Admin Queries (require admin role)
- `adminBooks`: Get books (admin only)
- `deleteBook(title)`: Delete a book (admin only)

## Example GraphQL Queries

### Login
```graphql
mutation {
  login(username: "admin", password: "password") {
    success
    message
    user {
      username
      firstName
      lastName
    }
    token
  }
}
```
The `token` field contains the JWT that should be used in subsequent requests as a Bearer token in the Authorization header.

### Get Protected Books (with auth header)
```graphql
query {
  protectedBooks {
    title
    author
  }
}
```

### Add Book (with auth header)
```graphql
mutation {
  addBook(title: "New Book", author: "New Author") {
    title
    author
  }
}
```

### Admin Only Query (admin auth required)
```graphql
query {
  adminBooks {
    title
    author
  }
}
```

## Testing GraphQL Shield

Now that GraphQL Shield is fully integrated, you can test different authorization scenarios:

### ✅ Public Access (No Authentication Required)
```graphql
query {
  books {
    title
    author
  }
}
```
This will work **without** any authentication header.

### ❌ Protected Access (Authentication Required)
```graphql
query {
  protectedBooks {
    title
    author
  }
}
```
This will **fail** without authentication and return a Shield error.

### ✅ Protected Access (With Authentication)
```graphql
query {
  protectedBooks {
    title
    author
  }
}
```
This will **succeed** with proper JWT token in Authorization header.

### ❌ Admin Access (Non-admin User)
```graphql
query {
  adminBooks {
    title
    author
  }
}
```
This will **fail** if user is not admin, even with authentication.

### ✅ Admin Access (Admin User)
```graphql
query {
  adminBooks {
    title
    author
  }
}
```
This will **succeed** only for admin users.

### Mutation Examples

```graphql
# ❌ Will fail without authentication
mutation {
  addBook(title: "New Book", author: "New Author") {
    title
    author
  }
}

# ✅ Will succeed with authentication
mutation {
  addBook(title: "New Book", author: "New Author") {
    title
    author
  }
}

# ❌ Will fail for non-admin users
mutation {
  deleteBook(title: "The Awakening")
}

# ✅ Will succeed for admin users
mutation {
  deleteBook(title: "The Awakening")
}
```

## Shield Error Messages

When access is denied, GraphQL Shield returns specific error messages:
- `"Not Authorised!"` - Authentication required but not provided
- Custom error messages can be configured in the shield rules

## Automated Testing

Run the automated test suite to verify Shield functionality:

```bash
npm run test:shield
```

The test script (`test-shield.js`) performs comprehensive checks:

✅ **Public queries work without authentication**
✅ **Protected queries are blocked without authentication**
✅ **Login returns JWT token in response**
✅ **Protected queries work with JWT tokens from login**
✅ **Admin queries are blocked for non-admin users**
✅ **Admin queries work for admin users**
✅ **End-to-end authentication flow works**

This automated testing ensures that your GraphQL Shield implementation is working as expected, including proper JWT token handling.

## How It Works

1. **Client sends GraphQL request**
2. **Shield middleware intercepts** the request before it reaches resolvers
3. **Shield evaluates rules** based on context (user authentication)
4. **If allowed**: Request proceeds to resolver
5. **If denied**: Shield throws error, resolver never executes
6. **Clean separation**: Business logic in resolvers, authorization in Shield

## Shield Rule Types Demonstrated

1. **Authentication Rules**: `isAuthenticated`, `isAdmin`, `isUser`
2. **Logical Operators**: `and`, `or`, `not`
3. **Field-Level Rules**: Applied to specific fields
4. **Global Fallback**: `deny` by default
5. **Caching**: `contextual` cache for performance

## Development Notes

- JWT tokens contain: `username`, `firstName`, `lastName`
- Shield uses contextual caching for better performance
- Fallback rule is `deny` for security
- External errors are shown in development mode

## Testing Shield Rules

Try these scenarios:

1. **Unauthenticated access to protected queries** → Should fail
2. **User accessing admin queries** → Should fail
3. **Admin accessing any query** → Should succeed
4. **Public queries without auth** → Should succeed

This example covers the most common GraphQL Shield patterns and can be extended for more complex authorization scenarios.