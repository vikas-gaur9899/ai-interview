import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

  name: {
    type: String,

    required: true,

    trim: true
  },

  email: {
    type: String,

    required: true,

    unique: true,

    lowercase: true,

    trim: true,

    index: true
  },

  phone: {
    type: String,

    required: true,

    trim: true,

    index: true
  },

  gender: {
    type: String,

    enum: [
      "male",
      "female",
      "other"
    ],

    required: true
  },

  course: {
    type: String,

    required: true,

    trim: true
  },

  password: {
    type: String,

    required: true
  },

  role: {
    type: String,

    enum: [
      "super_admin",
      "admin"
    ],

    default: "admin"
  }

}, {

  timestamps: true

});

export default mongoose.model(
  "Admin",
  adminSchema
);