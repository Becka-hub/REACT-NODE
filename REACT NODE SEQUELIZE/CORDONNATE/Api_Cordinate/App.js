import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/index.js";
// import Admin from "./models/Admin.js";
// import Employe from "./models/Employe.js";

dotenv.config();
const app = express();


try {
    await db.authenticate();
    console.log('Database Connected ...');
    // await Admin.sync();
    // await Employe.sync();
} catch (error) {
    console.log(error);
}

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.static("./public"));
app.use(router);
app.listen(8080, () => console.log('Serveur running at port 8080'));