import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import validator from 'validator'
import bcrypt from 'bcrypt'
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// api to register the user 
const registerUser = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body

    if (!email || !password || !name) {
        throw new ApiError(400, 'All the fields are required')
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, 'Please enter valid email id ')
    }

    if (password.length < 8) {
        throw new ApiError(400, 'please enter a strong password')
    }

    const emailExisting = await User.findOne({ email })

    if (emailExisting) {
        throw new ApiError(400, 'email already exist please enter a different email')
    }

    const createdUser = await User.create({
        email,
        password,
        name
    })

    if (!createdUser) {
        throw new ApiError(500, 'internal server error while registering the user ')
    }

    const token = createdUser.generateAccessToken()

    const loggedInUser = await User.findById(createdUser._id).select('-password')

    return res.status(201)
        .json(new ApiResponse(201, { user: loggedInUser, token }, 'user registered successfully'))
})

// api to login the user 
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, 'All fields are required')
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, 'Please enter a valid email ID')
    }

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        throw new ApiError(404, 'User does not exist')
    }

    const isMatch = await bcrypt.compare(password, existingUser.password)

    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password')
    }

    const token = existingUser.generateAccessToken()

    const loggedInUser = await User.findById(existingUser._id).select('-password')

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie('token', token , options)
        .json(new ApiResponse(
            200,
            { user: loggedInUser, token },
            'User logged in successfully'
        ))
})

// api to get profile data 
const getProfile= asyncHandler(async(req , res )=>{

    const userId = req.userId
    console.log("2. CONTROLLER REACHED - req.userId received is:", req.userId);

    if(!userId){
        throw new ApiError(404, 'invalid authorization login again ')
    }

    const userProfileData= await User.findById(userId).select('-password')

    return res.status(200)
    .json(new ApiResponse(200, {user: userProfileData} , 'user profile data fetched successfully'))
})

// api to update the data 
const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file 

    // 1. Validation check
    if (!name && !phone && !address && !dob && !gender && !imageFile) {
        throw new ApiError(400, 'Please enter at least one field to update')
    }

    // 2. Initialize an empty object to store only the fields that are actually being changed
    const updateFields = {}

    // 3. Conditionally build the update object (prevents overwriting data with undefined)
    if (name) updateFields.name = name
    if (phone) updateFields.phone = phone
    if (dob) updateFields.dob = dob
    if (gender) updateFields.gender = gender

    // Handle nested address parsing smoothly if it's sent as a string/JSON from frontend Form Data
    if (address) {
        try {
            updateFields.address = typeof address === 'string' ? JSON.parse(address) : address
        } catch (error) {
            updateFields.address = address // Fallback if it's already a regular string/object
        }
    }

    // 4. Handle Cloudinary upload inside the same execution block
    if (imageFile) {
        const uploadedImage = await uploadOnCloudinary(imageFile.path)
        if (!uploadedImage) {
            throw new ApiError(500, "Failed to upload profile image to Cloudinary")
        }
        updateFields.image = uploadedImage.secure_url   
    }

    // 5. Run ONE single database operation to update everything smoothly!
    // { new: true } returns the fresh, updated user document to the client
    const updatedUserData = await User.findByIdAndUpdate(
        userId, 
        { $set: updateFields }, 
        { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUserData) {
        throw new ApiError(404, "User profile not found")
    }

    // Status 200 is more semantically accurate for updates than 201 (Created)
    return res.status(200)
        .json(new ApiResponse(200, {user: updatedUserData}, 'Profile data updated successfully'))
})


export { registerUser, loginUser, getProfile , updateProfile }