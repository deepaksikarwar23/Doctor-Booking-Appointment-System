import express from 'express'
import { doctorList } from '../controllers/doctor.controllers.js'

const doctorRouter= express.Router()

doctorRouter.route('/list').get(doctorList)

export default doctorRouter