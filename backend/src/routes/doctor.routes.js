import express from 'express'
import { appointmentCancelled, appointmentCompleted, doctorAppointments, doctorList, doctorLogin } from '../controllers/doctor.controllers.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter= express.Router()

doctorRouter.route('/list').get(doctorList)
doctorRouter.route('/login').post(doctorLogin)
doctorRouter.route('/appointments').get(authDoctor, doctorAppointments)
doctorRouter.route('/complete-appointment').post(authDoctor, appointmentCompleted)
doctorRouter.route('/cancel-appointment').post(authDoctor, appointmentCancelled )



export default doctorRouter