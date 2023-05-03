// Importing mongoose library to act as a frontend to work with MongoDB
const mongoose = require("mongoose")

// Creating the faculty schema
const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    designation: {
        type: String,
        required: [true, "designation is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
    },
    extension: {
        type: Number,
        required: [true, "ext is required"],
    },
    room: {
        type: String,
        required: [true, "room number is required"],
    },
    mobile: {
        type: Number,
        required: [true, "mobile number is required"],
    },
})

// Establishing link between our model and our collection in MongoDB
const facultyModel = mongoose.model("faculties", facultySchema)

// Making our model available to other files
module.exports = facultyModel