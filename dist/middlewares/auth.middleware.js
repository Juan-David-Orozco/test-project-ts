import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/conf.js";
import { UserService } from '../services/user.service.js';
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided!' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserService.findUserById(decoded.id);
        if (!user) {
            return res.status(403).json({ message: 'Access Denied: User not found!' });
        }
        req.user = { id: user.id, role: user.role.name, email: user.email, username: user.username };
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Access Denied: Invalid token!' });
    }
};
//# sourceMappingURL=auth.middleware.js.map