const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


const spinSchema = new mongoose.Schema({
  title: {
       type: String,
       trim: true,
       required : [true, 'Please add a spin result Name'],
       maxlength: 32
   },
   color: {
       type: String,
       trim: true,
       required : [true, 'Please add a spin result color'],
       maxlength: 32,
   },
   user_id: {       
    type: ObjectId,
       trim: true,
       required : [true, 'Creator of this Organisation does not exist'],
       maxlength: 64
   },
}, {timestamps: true});






module.exports = mongoose.model("Spin", spinSchema);