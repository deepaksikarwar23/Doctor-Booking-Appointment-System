import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

const authDoctor = asyncHandler(async (req, res, next) => {
    // 🎯 Note: Header keys are automatically lowercased by Express, so 'dtoken' is perfect!
    const { dtoken } = req.headers

    if (!dtoken) {
        throw new ApiError(401, 'Unauthorized request. Please login again.')
    }

    try {
        const decoded_token = jwt.verify(dtoken, process.env.JWT_SECRET)
        
        if (!decoded_token || !decoded_token.id) {
            throw new ApiError(401, 'Invalid authorization payload. Please login again.')
        }

        // 🎯 FIXED KEY: Assigning the correct doctor id claim to the request bundle
        req.docId = decoded_token.id;
        
        return next()

    } catch (error) {
        console.error("JWT Verification Engine Exception:", error.message);
        return next(new ApiError(401, error.message || 'Authorization failed. Token is invalid or expired.'))
    }
})

export default authDoctor