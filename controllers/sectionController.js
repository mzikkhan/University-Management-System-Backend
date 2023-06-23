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

// Get all sections || GET
const getAllSections = async (req, res) => {
    try {
        const sections = await sectionModel.find()
        if (!sections) {
            return res.status(200).send({
                message: "No sections",
                success: false,
            })
        } else {
            const sectionDetails = [];
            for (const element of sections) {
                detail = {};
                detail['Course'] = element['Course'];
                detail['SectionNumber'] = element['SectionNumber'];
                detail['FacultyInitial'] = element['FacultyInitial'];
                detail['TimeSlot'] = element['TimeSlot'];
                detail['Room'] = element['Room'];
                sectionDetails.push(detail);
            }

            res.status(200).send({
                success: true,
                details: sectionDetails,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error: ${error.message}` });
    }
}
// Get sections by Course and return those sections only || GET
const getSectionsForCourse = async (req, res, next) => {
    try {
        const code = req.params.code;
        const sections = await sectionModel.find({ Course: code })
        res.status(200).json(sections);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error finding course" });
    }
};

// Get a section by Course and SectionNumber || GET
const getSectionByCodeAndNumber = async (req, res) => {
    try {
        const { code, number } = req.params;
        const section = await sectionModel.findOne({ Course: code, SectionNumber: number });

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        res.status(200).json(section);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error finding section' });
    }
};


// Drop a section by Course and SectionNumber || DELETE
const dropSection = async (req, res) => {
    try {
        const { code, number } = req.params;
        const section = await sectionModel.findOneAndDelete({ Course: code, SectionNumber: number });

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        res.status(200).json(section);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error dropping section' });
    }
};

// Update a section by Course and SectionNumber || PUT
const updateSection = async (req, res) => {
    try {
        const { code, number } = req.params;
        const updateData = req.body;

        const section = await sectionModel.findOneAndUpdate({ Course: code, SectionNumber: number }, updateData, { new: true });

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        res.status(200).json(section);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating section' });
    }
};

// Drop all sections by CourseCode || DELETE
const dropSectionByCourseCode = async (req, res) => {
    try {
        const code = req.params.code;

        // Find and delete all sections with the given Course code
        const deletedSections = await sectionModel.deleteMany({ Course: code });

        if (deletedSections.deletedCount === 0) {
            return res.status(404).json({ message: 'No sections found with the given Course code' });
        }

        res.status(200).json({ message: 'Sections deleted successfully', deletedCount: deletedSections.deletedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error dropping sections' });
    }
};

// Drop all sections by CourseCode || DELETE
const dropSectionByFacultyInitial = async (req, res) => {
    try {
        const facultyInitial = req.params.facultyInitial;

        // Find and delete all sections with the given Course code
        const deletedSections = await sectionModel.deleteMany({ FacultyInitial: facultyInitial });

        if (deletedSections.deletedCount === 0) {
            return res.status(404).json({ message: 'No sections found with the given FacultyInitial' });
        }

        res.status(200).json({ message: 'Sections deleted successfully', deletedCount: deletedSections.deletedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error dropping sections' });
    }
};
// Export the controller functions
module.exports = {
    addSection,
    getSections,
    getAllSections,
    getSectionsForCourse,
    getSectionByCodeAndNumber,
    dropSection,
    updateSection,
    dropSectionByCourseCode,
    dropSectionByFacultyInitial
};