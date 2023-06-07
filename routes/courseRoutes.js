const express = require("express");
const { importCSV, addCourse, getCourses, dropCourse, updateCourse } = require("../controllers/courseController");
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

module.exports = router;
