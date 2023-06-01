const express = require('express');
const router = express.Router();
const { importCSV, addRoom, getRooms, dropRoom, updateRoom } = require('../controllers/roomController');

// Route for importing new rooms from CSV file
router.post("/importCSV", importCSV);

// Route for adding a new room
router.post('/addRoom', addRoom);

// Route for getting all rooms
router.get('/getRooms', getRooms);

// Route for dropping a room by RoomNumber
router.delete('/dropRoom/:Rooms', dropRoom);

// Route for updating a room by Room ID
router.put('/updateRoom/:Rooms', updateRoom);

module.exports = router;
