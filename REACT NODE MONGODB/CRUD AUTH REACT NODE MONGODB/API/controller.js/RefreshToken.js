import admins from "../models/adminSchema.js";
import jwt from "jsonwebtoken";
import { GenerateAccessToken } from "../service/service.js";

export const RefreshToken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (refreshToken === null) return res.status(401).json("Token required");

    const admin = await admins.findOne({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!admin) {
        return res.status(401).json("Refresh Token invalid")
    };

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).json("Refresh Token invalid");
        const refreshedToken = GenerateAccessToken(admin.id, admin.nom, admin.prenom, admin.email);
        res.status(200).json({ accessToken: refreshedToken });
    });
}