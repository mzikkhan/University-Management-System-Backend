const express = require("express");
const { importCSV, addCourse, getCourses, dropCourse, updateCourse, dropSectionByCodeAndSection, getCreditsByCode, courseRoutine } = require("../controllers/courseController");
const Course = require("../models/courseModel");
const router = express.Router();

// IMPORT COURSES | POST
router.post("/importCSV", importCSV);

// ADD NEW COURSE | POST
router.post("/addCourse", addCourse);

// GET ALL COURSES | GET
router.get("/getCourses", getCourses);
// GET ALL CODES | GET
router.get("/getCourses/:codes", getCourses);
// UPDATE COURSE | PUT
router.put("/updateCourse/:code", updateCourse);

// DROP COURSE | DELETE
router.delete("/dropCourse/:code", dropCourse);
// DROP SECTION BY CODE AND SECTION | DELETE
router.delete("/dropSection", dropSectionByCodeAndSection);
// GET CREDITS BY CODE | GET
router.get("/getCredits/:code", getCreditsByCode);

// Route for getting course routine
router.get('/getRoutine/:id', courseRoutine);

module.exports = router;
