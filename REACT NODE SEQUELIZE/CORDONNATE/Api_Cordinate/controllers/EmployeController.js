// import { getDistance, convertDistance, getCenter } from "geolib";
import fs from "fs";
import Employe from "../models/Employe.js";
import { EmployeValidation } from "../services/EmployeValidation.js";

const AjouteEmploye = (req, res) => {
    const { body } = req;
    const { error } = EmployeValidation(body);
    if (error) return res.status(401).json(error.details[0].message);

    const name = Date.now() + '.png';
    const path = '/uploads/' + name;

    const base64Data = body.image.replace(/^data:([A-Za-z-+/]+);base64,/, '');

    fs.writeFileSync('./public/uploads/' + name, base64Data, {
        encoding: 'base64'
    });

    console.log("name file=>", name);

    Employe.create({
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        longitude: body.longitude,
        latitude: body.latitude,
        image: path
    })
        .then(() => res.status(200).json({ msg: "Insertion avec success" }))
        .catch((error) => res.status(500).json(error));
}

const AfficheEmploye = async (req, res) => {
    // let dataEmployes = [];
    const employes = await Employe.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } });

    // const data = employes.map((item) => {
    //     const my_coord = { latitude: 13.6750876, longitude: 100.59918309999999 };
    //     const your_coord = { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) };
    //     let distance = getDistance(my_coord, your_coord, 1000);
    //     let center = getCenter([my_coord, your_coord]);
    //     let centerLatitude = center.latitude;
    //     let centerLongitude = center.longitude;
    //     return [...dataEmployes, {
    //         id: item.id, nom: item.nom, prenom: item.prenom, email: item.email,
    //         distance: convertDistance(distance, 'km'), centerLatitude: centerLatitude, centerLongitude: centerLongitude
    //     }]
    // });

    return res.status(200).json({ employes: employes });
}


const SuprimerEmployer = async (req, res) => {
    const { id } = req.params;

    const employeSingle = await Employe.findByPk(id);

    const deleteFile = './public' + employeSingle.image;

    if (fs.existsSync(deleteFile)) {
        fs.unlinkSync(deleteFile, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('File deleted');
            }
        });
    }

    Employe.destroy({ where: { id: id } })
        .then((employe) => {
            if (employe === 0) {
                return res.status(404).json({ msg: "Not Found" });
            } else {
                return res.status(201).json({ msg: "Deleted succesFully" });
            }
        })
        .catch((error) => res.status(500).json(error));
}



const AfficheUneEmploye = async (req, res) => {
    const { id } = req.params;

    const employe = await Employe.findByPk(id);
    if (!employe) {
        return res.json({ msg: "Not found employe" });
    } else {
        return res.status(200).json({employe:employe});
    }

}

const ModifierEmploye = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const employe = await Employe.findByPk(id);
    if (body.nom !== "") {
        employe.nom = body.nom;
    }

    if (body.prenom !== "") {
        employe.prenom = body.prenom;
    }

    if (body.email !== "") {
        employe.email = body.email;
    }

    if (body.longitude !== "") {
        employe.longitude = body.longitude;
    }

    if (body.latitude !== "") {
        employe.latitude = body.latitude;
    }

    if (body.image.length !==0) {

       return console.log(body.image);

        // const deleteFile = '.' + employe.image;
        // if (fs.existsSync(deleteFile)) {
        //     fs.unlinkSync(deleteFile, (err) => {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             console.log('File deleted');
        //         }
        //     });
        // }

        // const name = Date.now() + '.png';
        // const path = '/uploads/' + name;

        // const base64Data = body.image.replace(/^data:([A-Za-z-+/]+);base64,/, '');

        // fs.writeFileSync('./uploads/' + name, base64Data, {
        //     encoding: 'base64'
        // });

        // employe.image = path;
    }

    await employe.save();

    res.status(201).json({ msg: "Updated successfully" })
}

export { AjouteEmploye, AfficheEmploye, SuprimerEmployer, AfficheUneEmploye, ModifierEmploye }