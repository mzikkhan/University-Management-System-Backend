const express = require('express');
const router = express.Router();
const { addSection, getSections, getAllSections, getSectionsForCourse, getSectionByCodeAndNumber, dropSection, updateSection } = require('../controllers/sectionController');
// Route for adding a new Section
router.post('/addSection', addSection);

// Route for getting all Section
router.get('/getSections', getSections);

// Route for getting all Section
router.get('/getAllSections', getAllSections);
// Route for dropping a section by CourseCode and CourseSectionNumber || DELETE
router.delete('/dropSection/:code/:number', dropSection);

// Route for updating a section by CourseCode and CourseSectionNumber || PUT
router.put('/updateSection/:code/:number', updateSection);

// Get sections of CourseCode || GET
router.get("/getSectionsForCourse/:code", getSectionsForCourse);

// Get section by CourseCode and CourseSectionNumber || GET
router.get("/getSectionByCodeAndNumber/:code/:number", getSectionByCodeAndNumber);

module.exports = router;