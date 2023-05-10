// Importing required libraries and classes
const courseModel = require('../models/courseModel')

// Add a new course
const addCourse = async (req, res) => {
    const newCourse = new courseModel(req.body)
    try {
        // Check if course exists in database
        const course = await courseModel.findOne({code : req.body.code})
        if(course){
            return res.status(200).send({message:'Course Already Exists', success:false})
        }
        const savedCourse = await newCourse.save()
        res.status(200).json(savedCourse)
    } catch (error) {
        console.log(error)
        res.status(500).send({message:`Error: ${error.message}`})
    }
}

// Get All Courses
const getCourses = async(req, res)=>{
    try {
        const courses = await courseModel.find()
        if(!courses){
            return res.status(200).send({
                message:"no courses",
                success:false,
            })
        }else{
            const courseDetails = [];
            for (const element of courses) {
                detail = {};
                detail['code'] = element['code'];
                detail['title'] = element['title'];
                detail['credits'] = element['credits'];
                detail['type'] = element['type'];
                detail['sections'] = element['sections'];
                courseDetails.push(detail);
            }

            res.status(200).send({
                success: true,
                details: courseDetails,
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({message: `${error.message}`})
    }
} 

module.exports = {addCourse, getCourses}