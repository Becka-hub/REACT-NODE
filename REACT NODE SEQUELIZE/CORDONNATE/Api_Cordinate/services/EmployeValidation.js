import Joi from "joi";

const EmployeValidation = (body) => {
    const EmployeSchema = Joi.object({
        nom: Joi.string().min(2).trim().required(),
        prenom: Joi.string().min(2).trim().required(),
        email: Joi.string().min(2).required(),
        longitude: Joi.string().min(2).required(),
        latitude: Joi.string().min(2).required(),
        image: Joi.required(),
    });

    return EmployeSchema.validate(body);
}


export { EmployeValidation };  