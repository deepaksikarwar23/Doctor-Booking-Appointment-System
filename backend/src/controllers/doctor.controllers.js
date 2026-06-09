import asyncHandler from "../utils/asyncHandler.js"
import Doctor from '../models/doctor.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

// function to change the doctor availability 
const changeAvailability = asyncHandler(async (req, res) => {
    const { docId } = req.body;

    // 🎯 FIX: Pass 'docId' directly as a plain string, NOT as an object { docId }
    const docData = await Doctor.findById(docId);
    
    if (!docData) {
        throw new ApiError(404, "Doctor profile not found");
    }

    // 🎯 FIX: Pass 'docId' directly here as well
    await Doctor.findByIdAndUpdate(docId, { available: !docData.available });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Availability updated successfully'));
});

// function to get doctor list data from backend 
const doctorList= asyncHandler(async(req , res )=>{
    const doctors = await Doctor.find({}).select(['-password' , '-email'])

    if(doctors){
        return res.status(200)
                    .json(new ApiResponse(200, {doctors}, 'doctors data fetched successfully'))
    }

    throw new ApiError(500, 'internal server error while fetching doctors data ')
})

export { changeAvailability, doctorList };
