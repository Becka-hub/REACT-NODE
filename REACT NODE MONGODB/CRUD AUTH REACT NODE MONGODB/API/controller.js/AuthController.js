import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import { GenerateAccessToken, GenerateRefreshToken, validateAdmin, validateLogin } from "../service/service.js";
import admins from "../models/adminSchema.js";

const InscriptionAdmin = async (req, res) => {
    const { nom, prenom, email, password } = req.body;

    // if (!nom || !prenom || !email || !password) {
    //     res.status(404).json({ msg: "Completez les champs !" });
    // }

    try {
        const { error } = validateAdmin(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        const admin = await admins.findOne({ email: email });

        if (admin) {
            return res.status(409).json({ msg: "User with given email already exist" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(password, salt);

        const adminAdd = new admins({
            nom: nom,
            prenom: prenom,
            email: email,
            password: hashPassword
        })

        await adminAdd.save();

        return res.status(201).json({ msg: "Inscription avec success" });

    } catch (error) {
        res.status(422).json({ msg: error });
    }
}


const LoginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error } = validateLogin(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }
        const admin = await admins.findOne({ email: email });
        if (!admin) {
            return res.status(401).json({ msg: "Invalid Email" });
        }


        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ msg: "Password incorrect" });
        }

        const accessToken = GenerateAccessToken(admin.id, admin.nom, admin.prenom, admin.email);
        const refreshToken = GenerateRefreshToken(admin.id, admin.nom, admin.prenom, admin.email);

        admin.refresh_token = refreshToken;
        await admin.save();

        res.status(200).json({ donner: admin, accessToken: accessToken, refreshToken: refreshToken });

    } catch (error) {
        res.status(422).json({ msg: error });
    }
}




export { InscriptionAdmin, LoginAdmin }