import mongoose from "mongoose";
import admins from "./adminSchema.js";
const userSchema = new mongoose.Schema({
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
  age: {
    type: Number,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  admins: {
    type: mongoose.Schema.ObjectId,
    ref: admins,
    required: true,
    index: true
  }
});

const users = new mongoose.model("users", userSchema);

export default users;
