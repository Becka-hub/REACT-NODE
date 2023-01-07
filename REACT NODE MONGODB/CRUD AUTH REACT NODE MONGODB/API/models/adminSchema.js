import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: false
    },
    activeCount:{
        type:Boolean,
        required:false
    }
});

const admins = new mongoose.model("admins", adminSchema);

export default admins;
