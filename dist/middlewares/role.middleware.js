export const authorizeRoles = (roles) => {
    return (req, res, next) => {
        // @ts-ignore
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access Denied: User not authenticated or role not found!' });
        }
        // @ts-ignore
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access Denied: Insufficient permissions!' });
        }
        next();
    };
};
//# sourceMappingURL=role.middleware.js.map