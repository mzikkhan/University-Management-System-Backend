// Importing mongoose library to work with MongoDB
const mongoose = require("mongoose");

// Creating the section schema
const sectionSchema = new mongoose.Schema({
    Course_Section: {
        type: String,
        required: [true, "Course with Section is required"],
    },
    Course: {
        type: String,
        required: [true, "Course is required"],
    },
    SectionNumber: {
        type: Number,
        required: [true, "SectionNumber is required"],
    },
    FacultyInitial: {
        type: String,
        required: [true, "FacultyInitial is required"],
    },
    Room: {
        type: String,
        required: [true, "Room assign is required"],
    },
    TimeSlot: {
        type: String,
        required: [true, "TimeSlot is required"],
    },
}, { timestamps: true });

// Creating the section model with collection name 'section'
const sectionModel = mongoose.model("sections", sectionSchema);

// Exporting the sections model
module.exports = sectionModel;