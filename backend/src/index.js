import { app } from "./app.js";
import dbConnection from "./config/db.js";


const port= process.env.PORT || 4000;

dbConnection()
.then(()=>{

    app.on("error", (error)=>{
        console.error('error occured in connecting with server : ', error)
    })

    app.listen(port, ()=>{
        console.log(`server runnign on port ${port}`)
    })
})
.catch((error)=>{
    console.error('Mongodb Connection failed: ', error)
    process.exit(1)
})