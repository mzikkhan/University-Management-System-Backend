// Importing required libraries and classes
const userModel = require('../models/userModels')
const jwt = require('jsonwebtoken')

// Login Callback
const loginController = async (req, res) => {
    try {
        // Check if mail exists in database
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(200).send({message:'User Not Found', success:false})
        }

        // Check if password matches given mail
        if(!(req.body.password == user.password)){
            return res.status(200).send({message:'Invalid email or password.', success:false})
        } else{
            // Assign token for protection
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
            res.status(200).send({message:'Logged In Successfully!', success:true, token, data: {
                name: user.name,
                id:user.id,
                email: user.email,
            }})
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({message:`Error in Login Controller ${error.message}`})
    }
}

module.exports = {loginController}