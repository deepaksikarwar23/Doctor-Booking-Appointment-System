import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import validator from 'validator'
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import Doctor from "../models/doctor.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'

//api for adding doctor
const addDoctor = asyncHandler(async (req, res, next) => {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageLocalPath = req.file?.path

    // 1.check for all the fields
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
        // return res.json({success:false, message:'all fields are required'})
        throw new ApiError(400, 'All fields are required')
    }

    if (!imageLocalPath) {
    throw new ApiError(400, 'Doctor profile image file is required from Multer!')
}

    //2.  check for valid email 
    if (!validator.isEmail(email)) {
        throw new ApiError(400, 'please enter valid email format')
    }

    //3.  check for strong password length
    if (password.length < 8) {
        throw new ApiError(400, 'please create a strong password')
    }

    // 4. check if doctor already exist 
    const existingDoctor = await Doctor.findOne({ email })

    if (existingDoctor) {
        throw new ApiError(400, "doctor with same email id already exist")
    }

    // 5. upload the image on cloudinary 
    const cloudinaryUrl = await uploadOnCloudinary(imageLocalPath)

    // check if we got the cloudinary files 
    if (!cloudinaryUrl) {
        throw new ApiError(500, 'error occured in uploading the file on cloudinary')
    }

    // console.log("cloudinary response data: ", cloudinaryUrl)
    const doctorImage = cloudinaryUrl.secure_url

    // getting the public id of the image 
    const imagePublicId = cloudinaryUrl.public_id;

    // 6. create the doctor in database 
    try {
        // throw new Error("Simulated Database Crash"); // write this line to check if image deletion on cloudinary works fine 
        const newDoctor = await Doctor.create({
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            image: doctorImage,
            date: Date.now()
        })

        // 7. filter out the password field to send back the response 
        const createdDoctor = await Doctor.findById(newDoctor._id).select('-password')
        console.log('doctor registered successfully');

        // 8. gives the response to the frontend or user 
        return res.status(201)
            .json(new ApiResponse(201, createdDoctor, 'Doctor created successfully'))
    } catch (error) {
        console.log("DB registration failed, cleaning up the cloudinary space...")
        await deleteFromCloudinary(imagePublicId)
        throw error
    }
});

// api for login the admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'email and password are required')
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: '1d' })

        return res.status(200)
            .json(new ApiResponse(200, { token }, 'admin logged in successfully'))
    }
    else {
        throw new ApiError(401, 'invalid user credentials')
    }
})

export { addDoctor, loginAdmin }