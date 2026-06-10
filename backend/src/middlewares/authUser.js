import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

const authUser = asyncHandler(async (req, res, next) => {
    const { token } = req.headers

    if (!token) {
        throw new ApiError(401, 'Unauthorized request. Please login again.')
    }

    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET)
        
        // Safety check in case token parses but payload object is empty
        if (!decoded_token || !decoded_token._id) {
            throw new ApiError(401, 'Invalid authorization payload. Please login again.')
        }

        // Reads the exact '_id' claim you defined in userSchema.methods.generateAccessToken
        req.userId = decoded_token._id;
        
        return next()

    } catch (error) {
        console.error("JWT Verification Engine Exception:", error.message);
        return next(new ApiError(401, error.message || 'Authorization failed. Token is invalid or expired.'))
    }
})

export default authUser