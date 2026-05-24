import mongoose from "mongoose";

const studentSchema =
new mongoose.Schema({

  studentId: {

    type: String,

    required: true,

    unique: true,

    trim: true,

    index: true

  },

  name: {

    type: String,

    required: true,

    trim: true

  },

  course: {

    type: String,

    trim: true,

    default: ""

  },

  teacherName: {

    type: String,

    trim: true,

    default: ""

  },

  courseDuration: {

    type: String,

    trim: true,

    default: ""

  },

  email: {

    type: String,

    required: true,

    lowercase: true,

    trim: true,

    index: true

  }

}, {

  timestamps: true

});

export default mongoose.model(
  "Student",
  studentSchema
);