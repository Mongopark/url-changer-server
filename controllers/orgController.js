const Organisation = require("../models/organisation");
const User = require("../models/user");
const Category = require("../models/category");
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../utils/cloudinary');



exports.createOrganisation = async (req, res, next) => {

    const { title, description, user_id } = req.body;

    try {
        const organisation = await Organisation.create({
            title,
            description,
            user_id
        });
        res.status(201).json({
            success: true,
            organisation,
            message: "Organisation added Successfully"
        })

    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.getUserOrg = async (req, res, next) => {
    const user_id = req.params.id   
    console.log(user_id);
    try {
        const orgs = await Organisation.find({
            user_id
        })
        console.log("my id",user_id);
        const user = await User.findById(user_id); 
        res.status(201).json({
            success: true,
            organisations: orgs,
            message: `Organisation for user ${user.name} retrieved succesfully`
        })

    } catch (error) {
        console.log(error);
        next(error);
    }

}



// Update product image in Cloudinary and product data in MongoDB.
exports.addMember = async (req, res, next) => {
    try {
        const org_id = req.params.id;
        const user_email = req.body.email;

        console.log('Organization ID:', org_id);
        console.log('User Email:', user_email);

        const currentOrg = await Organisation.findById(org_id);
        if (!currentOrg) {
            return res.status(404).json({ success: false, message: 'Organisation not found' });
        }

        const userAdded = await User.findOne({ email: user_email });
        if (!userAdded) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Build the data object
        const data = {
            _id: userAdded._id,
            name: userAdded.name,
            profilePicture: userAdded.profilePicture,
            email: userAdded.email,
            role: userAdded.role
        };

        currentOrg.members.push(data);
        await currentOrg.save();

        res.status(200).json({
            success: true,
            organisation: currentOrg,
            message: `User ${userAdded.name} successfully added to Organisation ${currentOrg.title}`
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};




// delete product and product image in cloudinary
exports.deleteProduct = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id);
        //retrieve current image ID
        const imgId = product.image.public_id;
        if (imgId) {
            await cloudinary.uploader.destroy(imgId);
        }

        const rmProduct = await Product.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: " Product deleted",

        })

    } catch (error) {
        console.log(error);
        next(error);

    }

}





// display category
exports.productCategory = async (req, res, next) => {

    try {
        const cat = await Product.find().populate('category', 'name').distinct('category');
        res.status(201).json({
            success: true,
            cat
        })

    } catch (error) {
        console.log(error);
        next(error);
    }

}




