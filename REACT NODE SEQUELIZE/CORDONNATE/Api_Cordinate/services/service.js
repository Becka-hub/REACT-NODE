import jwt from "jsonwebtoken";

export const GenerateAccessToken = (id, nom, prenom, email) => {
    return jwt.sign({ id, nom, prenom, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1800s'
    });
}

export const GenerateRefreshToken = (id, nom, prenom, email) => {
    return jwt.sign({ id, nom, prenom, email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1y'
    });
}