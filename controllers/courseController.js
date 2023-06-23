// Importing required libraries and classes
const courseModel = require('../models/courseModel')
const csvtoJson = require("csvtojson");
const sectionModel = require('../models/sectionModel');
const _ = require('lodash');

// Import courses from CSV file
const importCSV = async (req, res) => {
    try {
        const courses = await csvtoJson().fromString(req.body.data);

        const existingCourses = await courseModel.find({ code: { $in: courses.map(course => course.code) } });
        const existingCoursesMap = existingCourses.reduce((map, course) => {
            map[course.code] = course;
            return map;
        }, {});

        const bulkOps = [];
        for (const course of courses) {
            const existingCourse = existingCoursesMap[course.code];
            if (existingCourse) {
                if (!_.isEqual(existingCourse, course)) {
                    bulkOps.push({
                        updateOne: {
                            filter: { code: course.code },
                            update: course
                        }
                    });
                }
            } else {
                bulkOps.push({
                    insertOne: {
                        document: course
                    }
                });
            }
        }

        if (bulkOps.length > 0) {
            await courseModel.bulkWrite(bulkOps);
        }

        res.status(200).send({ message: 'Import successful', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error: ${error.message}`, success: false });
    }
};



// Add a new course
const addCourse = async (req, res) => {
    const newCourse = new courseModel(req.body)
    try {
        // Check if course exists in database
        const course = await courseModel.findOne({ code: req.body.code })
        if (course) {
            return res.status(200).send({ message: 'Course Already Exists', success: false })
        }
        const savedCourse = await newCourse.save()
        res.status(200).json(savedCourse)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `Error: ${error.message}` })
    }
}

// Get All Courses
const getCourses = async (req, res) => {
    try {
        const { code, title } = req.query;
        const { codes } = req.params; // Extract the 'codes' parameter from the URL

        let courses;
        if (code && title) {
            courses = await courseModel.find({ code, title: { $regex: new RegExp(`^${title}$`, "i") } });
        } else if (code) {
            courses = await courseModel.find({ code });
        } else if (title) {
            courses = await courseModel.find({ title: { $regex: new RegExp(`^${title}$`, "i") } });
        } else {
            courses = await courseModel.find();
        }
        // Find all courses and retrieve only the 'title' field
        const courses2 = await courseModel.find({}, 'title');
        // Send the response with the titles



        if (!courses || courses.length === 0) {
            return res.status(200).send({
                message: "no courses",
                success: false,
            });
        } else {
            if (codes && codes.toUpperCase() === "CODES") {
                const courseCodes = courses.map(element => element.code);
                return res.status(200).send({
                    success: true,
                    codes: courseCodes,
                });
            }
            if (codes && codes.toUpperCase() === "TITLES") {
                // Extract the titles from the courses
                const titles = courses2.map((course) => course.title);
                return res.json({
                    success: true,
                    codes: titles,
                });
            }
            const courseDetails = courses.map(element => {
                return {
                    code: element.code,
                    title: element.title,
                    credits: element.credits,
                    type: element.type,
                    sections: element.sections
                };
            });

            res.status(200).send({
                success: true,
                details: courseDetails,
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `${error.message}` });
    }
};

// Drop section from course by code and section
const dropSectionByCodeAndSection = async (req, res) => {
    try {
        const { CourseCode, Section } = req.query;

        const existingCourse = await courseModel.findOne({ code: CourseCode });
        if (!existingCourse) {
            return res.status(404).json({ message: "Course not found", success: false });
        }

        const updatedSections = existingCourse.sections.filter(sec => sec !== Section);
        existingCourse.sections = updatedSections;

        const result = await existingCourse.save();

        if (result) {
            return res.status(200).json({ message: "Section dropped successfully", success: true });
        } else {
            return res.status(500).json({ message: "Error dropping section", success: false });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error dropping section: ${error.message}`, success: false });
    }
};



// Drop course by code
const dropCourse = async (req, res) => {
    try {
        const code = req.params.code;
        await courseModel.deleteOne({ code: code });
        const courses = await courseModel.find();
        res.status(200).json({ message: "Course dropped successfully", details: courses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error dropping course" });
    }
};
// Update course by code
const updateCourse = async (req, res) => {
    try {
        const code = req.params.code;
        const updatedCourse = req.body;

        const existingCourse = await courseModel.findOne({ code });
        if (!existingCourse) {
            return res.status(404).json({ message: "Course not found", success: false });
        }

        const updatedFields = {
            ...existingCourse.toObject(),
            ...updatedCourse
        };

        const result = await courseModel.updateOne({ code }, updatedFields);

        if (result.matchedCount > 0) {
            if (result.modifiedCount > 0) {
                return res.status(200).json({ message: "Course updated successfully", success: true });
            } else {
                return res.status(200).json({ message: "No changes made to the course", success: false });
            }
        } else {
            return res.status(404).json({ message: "Course not found", success: false });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error updating course: ${error.message}`, success: false });
    }
};
// Get credits by code
const getCreditsByCode = async (req, res) => {
    try {
        const code = req.params.code;

        const course = await courseModel.findOne({ code });
        if (!course) {
            return res.status(404).json({ message: "Course not found", success: false });
        }

        const credits = course.credits;

        res.status(200).json({ credits, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error retrieving credits: ${error.message}`, success: false });
    }
};

// Get course routine
const courseRoutine = async (req, res) => {
    try {
        const sections = await sectionModel.find({ Course: req.params.id })
        res.status(200).json(sections)

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `${error.message}` });
    }
};

module.exports = { importCSV, addCourse, getCourses, dropCourse, updateCourse, dropSectionByCodeAndSection, getCreditsByCode, courseRoutine };
