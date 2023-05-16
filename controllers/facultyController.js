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
        const { FacultyName, FacultyInitial } = req.query;
        let faculties;
        if (FacultyInitial && FacultyName) {
            faculties = await facultyModel.find({ FacultyInitial, FacultyName: { $regex: new RegExp(`^${FacultyName}$`, "i") } });
        } else if (FacultyInitial) {
            faculties = await facultyModel.find({ FacultyInitial });
        } else if (FacultyName) {
            faculties = await facultyModel.find({ FacultyName: { $regex: new RegExp(`^${FacultyName}$`, "i") } });
        } else {
            faculties = await facultyModel.find()
        }
        if (!faculties) {
            return res.status(200).send({
                message: "no faculties found",
                success: false,
            })
        } else {
            const facultiesDetails = [];
            for (const element of faculties) {
                detail = {};
                detail['FacultyName'] = element['FacultyName'];
                detail['FacultyInitial'] = element['FacultyInitial'];
                detail['Courses'] = element['Courses'];
                detail['Email'] = element['Email'];
                detail['EXT'] = element['EXT'];
                detail['Room'] = element['Room'];
                detail['Mobile'] = element['Mobile'];
                facultiesDetails.push(detail);
            }

            res.status(200).send({
                success: true,
                details: facultiesDetails,
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `${error.message}` })
    }
}

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