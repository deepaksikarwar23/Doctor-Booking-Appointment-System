import express from 'express'
import { appointmentCancelled, doctorDashboard, appointmentCompleted, doctorAppointments, doctorList, doctorLogin, doctorProfile, updateDoctorProfile } from '../controllers/doctor.controllers.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter= express.Router()

doctorRouter.route('/list').get(doctorList)
doctorRouter.route('/login').post(doctorLogin)
doctorRouter.route('/appointments').get(authDoctor, doctorAppointments)
doctorRouter.route('/complete-appointment').post(authDoctor, appointmentCompleted)
doctorRouter.route('/cancel-appointment').post(authDoctor, appointmentCancelled )
doctorRouter.route('/dashboard').get(authDoctor, doctorDashboard)
doctorRouter.route('/profile').get(authDoctor, doctorProfile)
doctorRouter.route('/update-profile').post(authDoctor, updateDoctorProfile)

export default doctorRouter