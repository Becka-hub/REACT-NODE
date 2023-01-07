import fs from "fs";
import users from "../models/userSchema.js";

const AjouteUser = async (req, res) => {
    const { nom, prenom, email, age, photo, idAdmin } = req.body;

    if (!nom || !prenom || !email || !age || !photo || !idAdmin) {
        res.status(404).json({ msg: "Completez les champs !" });
    }
    try {
        const existeUser = await users.findOne({ email: email });
        if (existeUser) {
            res.status(404).json({ msg: "Email user dejas utiliser" });
        } else {

            const name = Date.now() + '.png';
            const path = '/uploads/' + name;

            const base64Data = photo.replace(/^data:([A-Za-z-+/]+);base64,/, '');

            fs.writeFileSync('./public/uploads/' + name, base64Data, {
                encoding: 'base64'
            });

            const user = new users({
                nom: nom, prenom: prenom, email: email, age: age, photo: path, admins: idAdmin
            })

            await user.save();
            res.status(201).json(user);
        }
    } catch (error) {
        res.status(422).json({ msg: error });
    }
}


const AfficheUser = async (req, res) => {
    try {
        const data = await users.find().populate('admins');
        res.status(201).json({ donner: data });
    } catch (error) {
        res.status(422).json({ msg: error });
    }
}

const AfficheUneUser = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await users.findById({ _id: id });
        res.status(201).json({ donner: data });
    } catch (error) {
        res.status(422).json({ msg: error });
    }
}

const ModifierUser = async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, age, photo } = req.body;
    try {

        let userExiste = await users.findById({ _id: id });
        if (userExiste) {

            if (photo !== "") {

                const deleteFile = './public' + userExiste.photo;
                if (fs.existsSync(deleteFile)) {
                    fs.unlinkSync(deleteFile, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('File deleted');
                        }
                    });
                }

                const name = Date.now() + '.png';
                const path = '/uploads/' + name;

                const base64Data = photo.replace(/^data:([A-Za-z-+/]+);base64,/, '');

                fs.writeFileSync('./public/uploads/' + name, base64Data, {
                    encoding: 'base64'
                });


                userExiste.photo = path;

            }

            if (nom !== "") {
                userExiste.nom = nom;
            }

            if (prenom !== "") {
                userExiste.prenom = prenom;
            }

            if (email !== "") {
                userExiste.email = email;
            }


            if (age !== "") {
                userExiste.age = age;
            }

            const updateUser = await userExiste.save();

            res.status(201).json({ title: "Success", msg: "Update user success", donner: updateUser });

        } else {
            res.status(404).json({ msg: "User introuvable" });
        }

    } catch (error) {
        res.status(422).json({ msg: error });
    }
}


const DeleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await users.findByIdAndRemove(id);
        const deleteFile = './public' + data.photo;
        if (fs.existsSync(deleteFile)) {
            fs.unlinkSync(deleteFile, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('File deleted');
                }
            });
        }

        res.status(201).json({ title: "Success", msg: "Deleted user success", donner: data });


    } catch (error) {
        res.status(422).json({ msg: error });
    }
}


const ChercheUser = async (req, res) => {
    const { value } = req.params;
    let regex=new RegExp(value,'i');
    try {
        const data = await users.find({
            "$or": [
                { nom: { $regex: regex } },
                { prenom: { $regex: regex } }
            ]
        });
        res.status(201).json({ donner: data });
    } catch (error) {
        res.status(422).json({ msg: error });
    }
}



export { AjouteUser, AfficheUser, AfficheUneUser, ModifierUser, DeleteUser, ChercheUser }