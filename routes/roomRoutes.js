const express = require('express');
const router = express.Router();
const { importCSV, addRoom, getRooms, dropRoom, updateRooms, roomRoutine } = require('../controllers/roomController');

// Route for importing new rooms from CSV file
router.post("/importCSV", importCSV);

// Route for adding a new room
router.post('/addRoom', addRoom);

// Route for getting all rooms
router.get('/getRooms', getRooms);

// Route for getting room routine
router.get('/getRoutine/:id', roomRoutine);

// Route for dropping a room by RoomNumber
router.delete('/dropRoom/:Rooms', dropRoom);

// Route for updating a room by Room ID
router.put('/updateRooms/:Rooms', updateRooms);

module.exports = router;
