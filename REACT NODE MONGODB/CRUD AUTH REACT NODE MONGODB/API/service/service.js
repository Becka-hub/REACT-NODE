import jwt from "jsonwebtoken";
import Joi from "joi";

export const GenerateAccessToken = (id, nom, prenom, email) => {
    return jwt.sign({ id, nom, prenom, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1y'
    });
}

export const GenerateRefreshToken = (id, nom, prenom, email) => {
    return jwt.sign({ id, nom, prenom, email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1y'
    });
}

export const validateAdmin = (data) => {
    const schema = Joi.object({
        nom: Joi.string().required().label("Nom"),
        prenom: Joi.string().required().label("Prenom"),
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });

    return schema.validate(data);
}

export const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });

    return schema.validate(data);
}
