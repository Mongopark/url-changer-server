const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


const orgSchema = new mongoose.Schema({

  title: {
       type: String,
       trim: true,
       required : [true, 'Please add an Organisation Name'],
       maxlength: 32
   },

   description: {
       type: String,
       trim: true,
       required : [true, 'Please add an Organisation Description'],
       maxlength: 2000,
   },

   user_id: {       
    type: ObjectId,
       trim: true,
       required : [true, 'Creator of this Organisation does not exist'],
       maxlength: 64
   },

//    image: {
//        public_id: {
//            type: String,
//            required: true
//        },
//        url: {
//            type: String,
//            required: true
//        }
   
//    },

   members: {
       type: Array,
       ref: "Members",
    //    required : [
    //     true, 
    //     'Organisation must have members'],
        default: []   
   },

 


}, {timestamps: true});






module.exports = mongoose.model("Organisation", orgSchema);