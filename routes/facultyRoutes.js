// Importing necessary libraries and classes
const express = require("express");
const { addFaculty, getFaculties, dropFaculty, updateCreditCount } = require("../controllers/facultyController");


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

// Making our router accessible to other files
module.exports = router;
