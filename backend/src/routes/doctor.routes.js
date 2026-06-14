import express from 'express'
import { doctorList, doctorLogin } from '../controllers/doctor.controllers.js'

const doctorRouter= express.Router()

doctorRouter.route('/list').get(doctorList)
doctorRouter.route('/login').post(doctorLogin)


export default doctorRouter