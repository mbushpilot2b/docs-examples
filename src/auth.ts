import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

// Permissions definition
export interface UserPermissions {
  canReadBooks: boolean;
  canAddBooks: boolean;
  canDeleteBooks: boolean;
}

// User permissions by ID
const userPermissions: Record<number, UserPermissions> = {
  1: { // admin
    canReadBooks: true,
    canAddBooks: true,
    canDeleteBooks: true,
  },
  2: { // user
    canReadBooks: true,
    canAddBooks: false,
    canDeleteBooks: false,
  },
};

// Function to get permissions by user ID
export const getUserPermissions = (userId: number): UserPermissions | null => {
  return userPermissions[userId] || null;
};

// Mock user database - in real app this would be a database
const users: Array<User & { password: string }> = [
  {
    id: 1,
    username: 'admin',
    firstName: 'John',
    lastName: 'Doe',
    password: bcrypt.hashSync('password', 8), // In real app, hash this properly
  },
  {
    id: 2,
    username: 'user',
    firstName: 'Jane',
    lastName: 'Doe',
    password: bcrypt.hashSync('password', 8),
  },
];

export interface AuthContext {
  user?: User;
}

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  const user = users.find(u => u.username === username);
  if (!user) return null;

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return null;

  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

export const generateToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const verifyToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      username: decoded.username,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };
  } catch (error) {
    return null;
  }
};

export const getUserFromToken = (token: string): User | null => {
  if (!token) return null;
  return verifyToken(token);
};
