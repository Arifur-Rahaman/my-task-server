const asyncHandler = require("express-async-handler")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModels')

//@des Register new user
//@route /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please include all fields')
    }
    //Find if user already exist
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error('User already exist')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new error('Invalid user data');
    }
})


//@des Login a user
//@route /api/users/login
//@access public
const loginUser = asyncHandler( async (req, res)=>{
    const {email, password} = req.body
    const user = await User.findOne({email})

    //check the user is exist or not if exist then compare the password of user and db
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error('Invalid credentials')
    }
})


//@des get current user
//@route /api/users/me
//@access private
const getMe = asyncHandler( async (req, res)=>{
    const user = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
    }
    res.status(200).json(user)
})


const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}