// Importing mongoose library to act as a frontend to work with MongoDB
const mongoose = require("mongoose");

// Creating the faculty schema
const facultySchema = new mongoose.Schema({
    FacultyName: {
        type: String,
        required: [true, "name is required"],
    },
    FacultyInitial: {
        type: String,
        required: [true, "initial is required"],
    },
    Courses: {
        type: [String],
        required: [true, "courses is required"],
    },
    Email: {
        type: String,
        required: [true, "e-mail is required"],
    },
    EXT: {
        type: Number,
        required: [true, "ext is required"],
    },
    Room: {
        type: String,
        required: [true, "room number is required"],
    },
    Mobile: {
        type: Number,
        required: [true, "mobile number is required"],
    },
    OfficeHour: {
        type: [String],
        required: [true, "OfficeHour is required"],
    },
    PreferredDays: {
        type: [String],
        required: [true, "PreferredDays is required"],
    },
    CreditCount: {
        type: Number,
        precision: 1,
    },
    Image: {
        type: String,
    }
});

// Establishing link between our model and our collection in MongoDB
const facultyModel = mongoose.model("faculties", facultySchema);

// Making our model available to other files
module.exports = facultyModel;


