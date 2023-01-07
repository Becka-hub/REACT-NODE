import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import { AdminValidation, LoginValidation } from "../services/AdminValidation.js";
import { GenerateAccessToken, GenerateRefreshToken } from "../services/service.js";


const Inscription = async (req, res) => {
    const { body } = req;
    const { error } = AdminValidation(body);
    if (error) return res.status(401).json(error.details[0].message);

    const adminExiste = await Admin.findOne({ where: { email: body.email } });

    if (adminExiste) return res.status(400).json({ msg: "Adresse email deja utiliser" });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(body.password, salt);

    Admin.create({
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        password: hashPassword
    })
        .then(() => res.status(200).json({ msg: "Inscription avec success" }))
        .catch((error) => res.status(500).json(error));

}


const Login = async (req, res) => {
    const { error } = LoginValidation(req.body);
    if (error) return res.status(401).json(error.details[0].message);

    const admin = await Admin.findOne({
        where: {
            email: req.body.email
        }
    });

    if (!admin) return res.status(400).json({ msg: "Utilisateur n'existe pas" });

    const match = await bcrypt.compare(req.body.password, admin.password);
    if (!match) return res.status(400).json({ msg: "Mot de passe incorrect" });

    const accessToken = GenerateAccessToken(admin.id, admin.nom, admin.prenom, admin.email);
    const refreshToken = GenerateRefreshToken(admin.id, admin.nom, admin.prenom, admin.email);

    await Admin.update({ refreshToken: refreshToken }, {
        where: {
            id: admin.id
        }
    });

    res.status(200).json({ title: "success", donner: admin, accessToken: accessToken, refreshToken: refreshToken });
}

const RefreshToken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (refreshToken === null) return res.status(401).json("Token required");

    const admin = await Admin.findOne({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!admin) return res.status(401).json("Refresh Token invalid");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).json("Refresh Token invalid");
        const id = admin.id;
        const nom = admin.nom;
        const prenom = admin.prenom;
        const email = admin.email;

        const refreshedToken = GenerateAccessToken(id, nom, prenom, email);
        res.status(200).json({ accessToken: refreshedToken });
    });
}
export { Inscription, Login, RefreshToken };
