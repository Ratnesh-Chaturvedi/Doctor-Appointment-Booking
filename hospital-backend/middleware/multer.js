import multer from "multer";


// cb -> callback
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,"./public/temp") // file path where we store
  },
  filename: function (req, file, cb) {
    // we can use it when we have files with same name
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    
    //just for simple files we are doing this 
    cb(null,file.originalname)
  }
})

 const upload = multer({ storage, })

 export {upload}