const express = require("express");
const { importCSV, addCourse, getCourses, dropCourse } = require("../controllers/courseController");
const Course = require("../models/courseModel");
const csvtoJson = require("csvtojson");
const router = express.Router();
const csvFilePath = './test1.csv'

// IMPORT COURSES | POST
// router.post("/import", (req, res) => {
//     const csvData = `code,title,credits,type,parallel,sections
// CSE411,Advanced Database Systems,3,ME,NO,Section 13
// CSE442,Micro Array Bioinformatics,3,ME,NO,Section 11`;

//     csvtoJson()
//         .fromString(csvData)
//         .then((courses) => {
//             Course.create(courses)
//                 .then(() => {
//                     res.send("Import successful");
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                     res.status(500).send("Error importing courses");
//                 });
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).send("Error importing courses");
//         });
// });
// IMPORT COURSES | POST
router.post("/importCSV", importCSV);

// ADD NEW COURSE | POST
router.post("/addCourse", addCourse);

// GET ALL COURSES | GET
router.get("/getCourses", getCourses);

// DROP COURSE | DELETE
router.delete("/dropCourse/:code", dropCourse);
module.exports = router;