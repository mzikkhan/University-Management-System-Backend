const roomModel = require('../models/roomModel');
const csvtoJson = require("csvtojson");
const _ = require('lodash');

// Import rooms from CSV file
const importCSV = async (req, res) => {
    try {
        const rooms = await csvtoJson().fromString(req.body.data);

        const existingRooms = await roomModel.find({ RoomNumber: { $in: rooms.map(room => room.RoomNumber) } });
        const existingRoomsMap = existingRooms.reduce((map, room) => {
            map[room.RoomNumber] = room;
            return map;
        }, {});

        const bulkOps = [];
        const timeSlots = new Set();

        for (const room of rooms) {
            const existingRoom = existingRoomsMap[room.RoomNumber];

            if (existingRoom) {
                if (!_.isEqual(existingRoom, room)) {
                    bulkOps.push({
                        updateOne: {
                            filter: { RoomNumber: room.RoomNumber },
                            update: room
                        }
                    });
                }
            } else {
                bulkOps.push({
                    insertOne: {
                        document: room
                    }
                });
            }

            if (room.AssignFor === 'Academic Classes') {
                if (!room.TimeSlot) {
                    throw new Error('TimeSlot is required for Academic Classes');
                }
                timeSlots.add(room.TimeSlot);
            } else {
                if (room.TimeSlot) {
                    throw new Error(`TimeSlot should not Assign For: ${room.AssignFor} other than Academic Classes On ${room.Rooms}`);
                }
            }

            if (!room.AcademicBuilding.startsWith(room.Rooms.slice(0, 3))) {
                throw new Error(`AcademicBuilding should match the first three characters of Room: ${room.Rooms}`);
            }

            const roomNumberFromRooms = room.Rooms.match(/\d+\w*$/)[0]; // Extract the last digits with optional characters from Rooms field
            if (roomNumberFromRooms !== room.RoomNumber) {
                throw new Error(`RoomNumber should match the last characters of Rooms: ${room.Rooms}`);
            }
        }

        if (bulkOps.length > 0) {
            await roomModel.bulkWrite(bulkOps);
        }

        res.status(200).send({ message: 'Import successful', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error: ${error.message}`, success: false });
    }
};




// Add a new room
const addRoom = async (req, res) => {
    const newRoom = new roomModel(req.body);
    try {
        const savedRoom = await newRoom.save();
        res.status(200).json(savedRoom);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error: ${error.message}` });
    }
};

// Get all rooms
// Get rooms by AssignFor and return only Rooms
const getRooms = async (req, res) => {
    try {
        const { AssignFor, Rooms } = req.query;
        let query = {};

        if (AssignFor) {
            query.AssignFor = AssignFor;
        }

        if (Rooms) {
            query.Rooms = { $regex: Rooms, $options: 'i' };
        }

        const rooms = await roomModel.find(query);

        if (!rooms || rooms.length === 0) {
            return res.status(200).send({
                message: 'No rooms found',
                success: false,
            });
        } else {
            if (AssignFor && (AssignFor.toLowerCase() === 'faculty' || AssignFor.toLowerCase() === 'academic classes' || AssignFor.toLowerCase() === 'others')) {
                const roomNames = rooms.map((room) => room.Rooms); // Extract the Rooms field from each room object
                res.status(200).send({
                    success: true,
                    details: roomNames,
                });
            } else {
                res.status(200).send({
                    success: true,
                    details: rooms,
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `${error.message}` });
    }
};





// Drop a room by Room Name
const dropRoom = async (req, res) => {
    try {
        const Rooms = req.params.Rooms;
        await roomModel.deleteOne({ Rooms: Rooms });
        const rooms = await roomModel.find();
        res.status(200).json({ message: 'Room dropped successfully', details: rooms });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error dropping room' });
    }
};

const updateRoom = async (req, res) => {
    try {
        const rooms = req.params.Rooms;
        const updatedRoom = req.body;

        const room = await roomModel.findOneAndUpdate({ Rooms: rooms }, updatedRoom, { new: true });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating room' });
    }
};

module.exports = { importCSV, addRoom, getRooms, dropRoom, updateRoom };




