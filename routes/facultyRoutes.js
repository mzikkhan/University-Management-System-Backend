// Importing necessary libraries and classes
const express = require("express");
const {
    addFaculty,
    getFaculties,
    dropFaculty,
    updateCreditCount,
    updateFaculty,
    getFacultyByInitial,
} = require("../controllers/facultyController");

// Router object
const router = express.Router();

// ADD NEW Faculty | POST
router.post("/addFaculty", addFaculty);

// GET ALL Faculty | GET
router.get("/getFaculties", getFaculties);

// DROP FACULTY | DELETE
router.delete("/dropFaculty/:FacultyInitial", dropFaculty);

// UPDATE CreditCount | PUT
router.put("/updateCreditCount", updateCreditCount);

// UPDATE FACULTY | PUT
router.put("/updateFaculty/:FacultyInitial", updateFaculty);

// GET Faculty by FacultyInitial | GET
router.get("/getFaculty/:FacultyInitial", getFacultyByInitial);

// Making our router accessible to other files
module.exports = router;
