import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Mock user database - in real app this would be a database
const users = [
    {
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        password: bcrypt.hashSync('password', 8), // In real app, hash this properly
    },
    {
        username: 'user',
        firstName: 'Regular',
        lastName: 'User',
        password: bcrypt.hashSync('password', 8),
    },
];
export const authenticateUser = async (username, password) => {
    const user = users.find(u => u.username === username);
    if (!user)
        return null;
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
        return null;
    return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
    };
};
export const generateToken = (user) => {
    return jwt.sign({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
    }, JWT_SECRET, { expiresIn: '1h' });
};
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return {
            username: decoded.username,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
        };
    }
    catch (error) {
        return null;
    }
};
export const getUserFromToken = (token) => {
    if (!token)
        return null;
    return verifyToken(token);
};
