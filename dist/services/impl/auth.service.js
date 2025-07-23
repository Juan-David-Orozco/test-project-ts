var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { injectable, inject } from 'tsyringe';
import { JWT_SECRET } from "../../config/conf.js";
// Importamos el token del repositorio de usuarios del nuevo archivo tokens.ts
import { USER_REPOSITORY } from '../../config/tokens.js';
let AuthService = class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    } // Inyectamos el repositorio
    async register(registerData) {
        const { username, email, password, role: roleName = 'user' } = registerData;
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("User with this email already exists.");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let role = await this.userRepository.findRoleByName(roleName);
        if (!role) {
            role = await this.userRepository.createRole(roleName);
        }
        const user = await this.userRepository.create(username, email, hashedPassword, role.id);
        return { id: user.id, username: user.username, email: user.email, role: { name: user.role.name } };
    }
    async login(loginData) {
        const { email, password } = loginData;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials. Email incorrect.");
        }
        // Check if user is active
        if (!user.isActive) {
            throw new Error('Account is deactivated');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials. Password incorrect.");
        }
        const token = jwt.sign({ id: user.id, role: user.role.name }, JWT_SECRET, { expiresIn: "1h" });
        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isActive: user.isActive,
                role: user.role.name
            },
            token
        };
    }
};
AuthService = __decorate([
    injectable(),
    __param(0, inject(USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map