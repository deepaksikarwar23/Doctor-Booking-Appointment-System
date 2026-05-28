import multer from 'multer'
import path from 'path'



const storage= multer.diskStorage({
    // firstly we defines where our file is going to store (the destination )
    destination:function(req, file, cb ){
        cb(null, "./public/temp")
    },

    // generate a unique file name so the files name won't overwrite the files later 
    filename:function(req, file , cb){
       // Creates a unique stamp: 17168345123-987654321
        const uniqueSuffix= Date.now()+ '-' + Math.round(Math.random()* 1E9)

        // Safely extracts the extension (e.g., '.jpg')
        const fileExtension = path.extname(file.originalname);

        // Final secure name: image-17168345123-987654321.jpg
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    }
})

export const upload= multer({storage})