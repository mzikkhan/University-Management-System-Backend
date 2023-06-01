// Importing mongoose library to work with MongoDB
const mongoose = require("mongoose");

// Creating the room schema
const roomSchema = new mongoose.Schema({
    Rooms: {
        type: String,
        required: [true, "Room name is required"],
    },
    RoomNumber: {
        type: String,
        required: [true, "Room number is required"],
    },
    AcademicBuilding: {
        type: String,
        required: [true, "Academic building is required"],
    },
    FloorNumber: {
        type: Number,
        required: [true, "Floor number is required"],
    },
    AssignFor: {
        type: String,
        required: [true, "Room assign is required"],
    },
    TimeSlot: {
        type: [String],
    },
}, { timestamps: true });

// Creating the room model with collection name 'rooms'
const roomModel = mongoose.model("rooms", roomSchema);

// Exporting the room model
module.exports = roomModel;
