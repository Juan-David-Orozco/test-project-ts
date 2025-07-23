import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/conf.js";
import { container } from 'tsyringe'; // Importamos el contenedor para resolver dependencias
// Importamos el token del repositorio del nuevo archivo tokens.ts
import { USER_REPOSITORY } from '../config/tokens.js';
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided!' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Usamos IJwtPayload
        // const decoded = jwt.verify(token, JWT_SECRET as string) as { id: number; role: string; iat: number; exp: number };
        // Resolvemos el repositorio de usuarios usando el contenedor
        const userRepository = container.resolve(USER_REPOSITORY);
        const user = await userRepository.findById(decoded.id);
        // const user = await UserService.findUserById(decoded.id);
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