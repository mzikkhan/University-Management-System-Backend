// Importing necessary libraries and classes
const express = require("express")
const {loginController} = require("../controllers/userController")

// Router object
const router = express.Router()

// LOGIN | POST | USER
router.post("/login", loginController)

// Making our router accessible to other files
module.exports = router