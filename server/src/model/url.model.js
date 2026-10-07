import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalUrl : {
        type : String,
        required : true,
        maxLength : [2048, "URL is too long"]
    },
    shortUrl : {
        type : String,
        unique : true,
        required : true,
    },
    clicks : {
        type : Number,
        default : 0,
    },
})

const UrlModel = mongoose.model('shortUl', urlSchema);

export default UrlModel;