import { AuthService } from "../services/auth.service.js";
export class AuthController {
    static async register(req, res) {
        try {
            const { username, email, password, role } = req.body;
            const user = await AuthService.register(username, email, password, role);
            res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role.name,
                },
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService.login(email, password);
            res.status(200).json({
                message: "Logged in successfully",
                user,
                token
            });
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    static async profile(req, res) {
        // @ts-ignore
        const user = req.user; // User information attached by the auth middleware
        res.status(200).json({
            message: "User profile",
            user
        });
    }
}
//# sourceMappingURL=auth.controller.js.map