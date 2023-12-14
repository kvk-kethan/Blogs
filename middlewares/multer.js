const multer=require("multer")
const storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,"public/uploads")
    },
    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})
module.exports=storage;