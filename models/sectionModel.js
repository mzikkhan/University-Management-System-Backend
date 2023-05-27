// Importing mongoose library to act as a frontend to work with MongoDB
const mongoose = require("mongoose")

// Creating the section schema
const sectionSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: [true, "section no. is required"],
    },
    course: {
        type: String,
        required: [true, "course is required"],
    },
    faculty: {
        type: String,
        required: [true, "faculty is required"],
    },
    room: {
        type: String,
        required: [true, "room no. is required"],
    },
    day: {
        type: String,
        required: [true, "day is required"],
    },
    time: {
        type: String,
        required: [true, "time is required"],
    },
});


// Establishing link between our model and our collection in MongoDB
const sectionModel = mongoose.model("sections", sectionSchema)

// Making our model available to other files
module.exports = sectionModel
