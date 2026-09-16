import jwt from 'jsonwebtoken';
import env from '../config/env.js';


const protect = (req, res, next) => {
    const token = req.cookies[ env.COOKIE_NAME ];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Please login.',
        });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Session expired. Please login again.',
        });
    }
};

export default protect;
