// Importing required libraries and classes
const facultyModel = require('../models/facultyModel')

// Add a new faculty
const addFaculty = async (req, res) => {
    const newFaculty = new facultyModel(req.body)
    try {
        // Check if faculty exists in database
        const faculty = await facultyModel.findOne({ name: req.body['FacultyName'] })
        if (faculty) {
            return res.status(200).send({ message: 'Faculty-Info Already Exists', success: false })
        }
        const savedFaculty = await newFaculty.save()
        res.status(200).json(savedFaculty)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `Error: ${error.message}` })
    }
}

// Get All faculties
const getFaculties = async (req, res) => {
    try {
        const { FacultyName, FacultyInitial, FacultyEmail, FacultyEXT, FacultyRoom, FacultyMobile, wishCourses, preferredDaysFor, creditCountFor } = req.query;

        const query = {};

        if (FacultyInitial) {
            query.FacultyInitial = FacultyInitial;
        }

        if (FacultyName) {
            query.FacultyName = { $regex: new RegExp(`^${FacultyName}$`, "i") };
        }

        if (wishCourses) {
            query.Courses = wishCourses;
        }

        if (FacultyEXT) {
            query.EXT = FacultyEXT;
        }

        if (FacultyRoom) {
            query.Room = FacultyRoom
        }

        if (FacultyMobile) {
            query.Mobile = FacultyMobile;
        }

        if (FacultyEmail) {
            query.Email = FacultyEmail;
        }

        const faculties = await facultyModel.find(query);

        if (!faculties || faculties.length === 0) {
            return res.status(200).send({
                message: "No faculties found",
                success: false,
            });
        }
        if (creditCountFor) {
            const faculty = await facultyModel.findOne({ FacultyInitial: creditCountFor });
            if (faculty) {
                res.status(200).send({
                    success: true,
                    details: faculty.CreditCount,
                });
            } else {
                res.status(200).send({
                    message: 'Faculty not found',
                    success: false,
                });
            }
        } else if (preferredDaysFor) {
            const faculty = await facultyModel.findOne({ FacultyInitial: preferredDaysFor });
            if (faculty) {
                res.status(200).send({
                    success: true,
                    details: faculty.PreferredDays,
                });
            } else {
                res.status(200).send({
                    message: 'Faculty not found',
                    success: false,
                });
            }
        } else if (wishCourses) {
            const matchingFaculties = faculties.filter(faculty => faculty.Courses.includes(wishCourses));
            if (matchingFaculties.length > 0) {
                const facultyInitials = matchingFaculties.map(faculty => faculty.FacultyInitial);
                res.status(200).send({
                    success: true,
                    details: facultyInitials,
                });
            } else {
                res.status(200).send({
                    message: 'No faculties found for the specified course',
                    success: false,
                });
            }
        } else {
            const facultiesDetails = faculties.map(element => ({
                FacultyName: element.FacultyName,
                FacultyInitial: element.FacultyInitial,
                Courses: element.Courses,
                Email: element.Email,
                EXT: element.EXT,
                Room: element.Room,
                Mobile: element.Mobile,
                OfficeHour: element.OfficeHour,
                PreferredDays: element.PreferredDays,
                CreditCount: element.CreditCount,
                Image: element.Image
            }));

            res.status(200).send({
                success: true,
                details: facultiesDetails,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `${error.message}` });
    }
};

// Drop Faculty by FacultyName
const dropFaculty = async (req, res) => {
    try {
        const FacultyInitial = req.params.FacultyInitial;
        await facultyModel.deleteOne({ FacultyInitial: FacultyInitial });
        const faculties = await facultyModel.find();
        res.status(200).json({ message: "Faculty dropped successfully", details: faculties });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error dropping course" });
    }
};

// Update CreditCount for a faculty
const updateCreditCount = async (req, res) => {
    try {
        const facultyInitial = req.query.FacultyInitial;
        const newCreditCount = req.query.CreditCount;

        // Find the faculty by facultyInitial
        const faculty = await facultyModel.findOne({ FacultyInitial: facultyInitial });

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found', success: false });
        }

        // Update the CreditCount
        faculty.CreditCount = newCreditCount;
        await faculty.save();

        res.status(200).json({
            message: 'CreditCount updated successfully',
            success: true,
            details: faculty.CreditCount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `Error updating CreditCount: ${error.message}` });
    }
};

module.exports = { addFaculty, getFaculties, dropFaculty, updateCreditCount }