// Import the Section model
const sectionModel = require('../models/sectionModel');

// Controller function for adding a section
const addSection = async (req, res) => {
    try {
        // Extract the section data from the request body
        const {
            Course_Section,
            Course,
            SectionNumber,
            FacultyInitial,
            Room,
            TimeSlot,
        } = req.body;

        // Create a new section using the Section model
        const section = new sectionModel({
            Course_Section,
            Course,
            SectionNumber,
            FacultyInitial,
            Room,
            TimeSlot,
        });

        // Save the section to the database
        const savedSection = await section.save();

        // Send the saved section as the response
        res.json(savedSection);
    } catch (error) {
        // Handle errors and send an error response
        console.error('Error adding section:', error);
        res.status(500).json({ error: 'Failed to add section' });
    }
};

// Controller function for getting all sections
const getSections = async (req, res) => {
    try {
        // Fetch all sections from the database
        const sections = await sectionModel.find();

        // Send the sections as the response
        res.json(sections);
    } catch (error) {
        // Handle errors and send an error response
        console.error('Error getting sections:', error);
        res.status(500).json({ error: 'Failed to get sections' });
    }
};


// Export the controller functions
module.exports = { addSection, getSections };