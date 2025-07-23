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
import { injectable, inject } from 'tsyringe';
import { handleServiceError } from '../utils/errorHandler.js';
import { AUTH_SERVICE } from '../config/tokens.js';
// import { AUTH_SERVICE } from '../config/container.js'; // Importamos el token del servicio de auth
// import { AuthService } from "../services/impl/auth.service.js";
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    } // Inyectamos el servicio de auth
    async register(req, res) {
        try {
            const { username, email, password, role } = req.body;
            const user = await this.authService.register({ username, email, password, role });
            res.status(201).json({ message: "User registered successfully", user });
        }
        catch (error) {
            handleServiceError(res, error, 'Failed to register user.');
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await this.authService.login({ email, password });
            res.status(200).json({ message: "Logged in successfully", user, token });
        }
        catch (error) {
            handleServiceError(res, error, 'Failed to log in.');
        }
    }
    async profile(req, res) {
        // @ts-ignore
        const user = req.user; // User information attached by the auth middleware
        res.status(200).json({ message: "User profile", user });
    }
};
AuthController = __decorate([
    injectable(),
    __param(0, inject(AUTH_SERVICE)),
    __metadata("design:paramtypes", [Object])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map