// Importing mongoose library to act as a frontend to work with MongoDB
const mongoose = require("mongoose")

// Creating the course schema
const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "code is required"],
    },
    title: {
        type: String,
        required: [true, "title is required"],
    },
    credits: {
        type: String,
        required: [true, "credits is required"],
    },
    type: {
        type: String,
        required: [true, "type is required"],
    },
    parallel: {
        type: String,
    },
    sections: {
        type: [String],
    },
}, { timestamps: true });


// Establishing link between our model and our collection in MongoDB
const courseModel = mongoose.model("courses", courseSchema)

// Making our model available to other files
module.exports = courseModel
