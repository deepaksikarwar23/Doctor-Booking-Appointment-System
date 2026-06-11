import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, paymentRazorpay, registerUser, updateProfile, verifyRazorpay } from '../controllers/user.controllers.js'
import authUser from '../middlewares/authUser.js'
import { upload } from '../middlewares/multer.middleware.js'

const userRouter= express.Router()


userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)

userRouter.route('/get-profile').get(authUser ,getProfile)
userRouter.route('/update-profile').post(authUser, upload.single('image'), updateProfile)
userRouter.route('/book-appointment').post(authUser , bookAppointment)
userRouter.route('/appointments').get(authUser, listAppointment)
userRouter.route('/cancel-appointment').post(authUser, cancelAppointment)
userRouter.route('/payment-razorpay').post(authUser, paymentRazorpay)
userRouter.route('/verify-razorpay').post(authUser , verifyRazorpay)

export default userRouter