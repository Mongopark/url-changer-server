const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const UrlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    urlName: {
        type: String,
        required: true,
    },
    urlDescription: {
        type: String,
        required: true,
    },
    user_id: {
        type: ObjectId,
        ref: "User",
        required : [
         true, 
         'Url must belong to a user'],
    
    },
});


module.exports = mongoose.model("Url", UrlSchema);