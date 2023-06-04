const express = require('express');
const router = express.Router();
const { addSection, getSections } = require('../controllers/sectionController');

// Route for adding a new Section
router.post('/addSection', addSection);

// Route for getting all Section
router.get('/getSections', getSections);

// // Route for dropping a Section by CourseSection
// router.delete('/dropSection/:CourseSection', dropSection);

// // Route for updating a Section by CourseSection
// router.put('/updateSection/:Course_Section', updateSection);

module.exports = router;