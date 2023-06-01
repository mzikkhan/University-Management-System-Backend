// Importing required libraries and classes
const courseModel = require('../models/courseModel')
const csvtoJson = require("csvtojson");
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
        let courses;
        if (code && title) {
            courses = await courseModel.find({ code, title: { $regex: new RegExp(`^${title}$`, "i") } });
        } else if (code) {
            courses = await courseModel.find({ code });
        } else if (title) {
            courses = await courseModel.find({ title: { $regex: new RegExp(`^${title}$`, "i") } }); //The "i" flag stands for case-insensitive matching
        } else {
            courses = await courseModel.find();
        }
        if (!courses || courses.length === 0) {
            return res.status(200).send({
                message: "no courses",
                success: false,
            })
        } else {
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
        res.status(500).send({ message: `${error.message}` })
    }
}



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
module.exports = { importCSV, addCourse, getCourses, dropCourse }