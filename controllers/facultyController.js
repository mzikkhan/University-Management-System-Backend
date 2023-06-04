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
        const { FacultyName, FacultyInitial, wishCourses } = req.query;
        let faculties;

        if (FacultyInitial && FacultyName) {
            faculties = await facultyModel.find({ FacultyInitial, FacultyName: { $regex: new RegExp(`^${FacultyName}$`, "i") } });
        } else if (FacultyInitial) {
            faculties = await facultyModel.find({ FacultyInitial });
        } else if (FacultyName) {
            faculties = await facultyModel.find({ FacultyName: { $regex: new RegExp(`^${FacultyName}$`, "i") } });
        } else if (wishCourses) {
            faculties = await facultyModel.find({ Courses: wishCourses });
        } else {
            faculties = await facultyModel.find();
        }

        if (!faculties || faculties.length === 0) {
            return res.status(200).send({
                message: "No faculties found",
                success: false,
            });
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
                Mobile: element.Mobile
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

module.exports = { addFaculty, getFaculties, dropFaculty }