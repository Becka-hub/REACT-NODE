import { Sequelize } from "sequelize";
const db = new Sequelize('cordinate', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;