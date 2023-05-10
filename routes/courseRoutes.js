// Importing necessary libraries and classes
const express = require("express")
const {addCourse, getCourses} = require("../controllers/courseController")

// Router object
const router = express.Router()

// ADD NEW COURSE | POST  
router.post("/addCourse", addCourse)

// GET ALL COURSES | GET  
router.get("/getCourses", getCourses)

// Making our router accessible to other files
module.exports = router