import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'

const dbConnection= async ()=>{
    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log('mongodb connected successfully: ',  connectionInstance.connection.host)
}

export default dbConnection