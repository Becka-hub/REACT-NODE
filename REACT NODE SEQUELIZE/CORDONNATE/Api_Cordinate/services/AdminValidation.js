import Joi from "joi";

const AdminValidation = (body) => {
    const AdminSchema = Joi.object({
        nom: Joi.string().min(2).trim().required(),
        prenom: Joi.string().min(2).trim().required(),
        email: Joi.string().min(2).required(),
        password: Joi.string().min(6).required()
    });

    return AdminSchema.validate(body);
}

const LoginValidation = (body) => {
    const AdminSchema = Joi.object({
        email: Joi.string().min(2).required(),
        password: Joi.string().min(2).required()
    });
    return AdminSchema.validate(body);
}

export { AdminValidation, LoginValidation };  