import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
export class UserService {
    static async createUser(username, email, passwordPlain, roleName) {
        const hashedPassword = await bcrypt.hash(passwordPlain, 10); // Hash password with salt rounds
        let role = await prisma.role.findUnique({ where: { name: roleName } });
        // If role doesn't exist, create it (e.g., for initial 'user' or 'admin' roles)
        if (!role) { // Updated this enhanced condition
            role = await prisma.role.create({ data: { name: roleName } });
        }
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: {
                    connect: { id: role.id },
                },
            },
            include: {
                role: true, // Include role information in the returned user object
            },
        });
        return user;
    }
    static async findUserByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
    }
    static async findUserById(id) {
        return prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
    }
}
//# sourceMappingURL=user.service.js.map