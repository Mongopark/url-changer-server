const SpinRecords = require("../models/spin");
const User = require("../models/user");
const Category = require("../models/category");
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../utils/cloudinary');



exports.createSpinRecord = async (req, res, next) => {

    const { title, color, user_id } = req.body;

    try {
        const spinRecord = await SpinRecords.create({
            title,
            color,
            user_id
        });
        res.status(201).json({
            success: true,
            spinRecord,
            message: "Spin Record added Successfully"
        })

    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.getUserSpinRecord = async (req, res, next) => {
    const user_id = req.params.id   
    console.log(user_id);
    try {
        const spinRecord = await SpinRecords.find({
            user_id
        })
        console.log("my id",user_id);
        const user = await User.findById(user_id); 
        res.status(201).json({
            success: true,
            spinRecords: spinRecord,
            message: `Spin Records for user ${user.name} retrieved succesfully`
        })

    } catch (error) {
        console.log(error);
        next(error);
    }

}



// To delete a particular spin record belonging to a user
exports.deleteSpinRecord = async (req, res, next) => {
    const user_id = req.params.id; // User ID passed as a URL parameter
    const spinRecordId = req.body.id; // Spin record ID passed in the body

    try {
        // Step 1: Find all spin records for the user
        const userSpinRecords = await SpinRecords.find({ user_id });

        // Step 2: Find the specific spin record to be deleted
        const spinRecordToDelete = userSpinRecords.find(record => record._id.toString() === spinRecordId);

        if (!spinRecordToDelete) {
            return next(new ErrorResponse(`Spin Record not found with id: ${spinRecordId}`, 404));
        }

        // Step 3: Delete the found spin record
        await SpinRecords.findByIdAndDelete(spinRecordToDelete._id);

        res.status(200).json({
            success: true,
            message: `Spin Record '${spinRecordToDelete.title}' successfully deleted`,
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};
