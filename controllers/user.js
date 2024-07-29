const jwt = require('jsonwebtoken');
const User = require("../models/user");
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../utils/cloudinary');


exports.signup = async (req, res, next)=>{

    const {email} = req.body;
    const userExist = await User.findOne({email});
    
    // if (userExist){
      
    //  return  next(new ErrorResponse('E-mail already exists', 400))
    // }

    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        })
        
    } catch (error) {
        console.log(error);
        next(error);
        
    }
   
}


exports.signin = async (req, res, next)=>{

    try{
        const {email, password} = req.body;
        if(!email || !password){
       
            return  next(new ErrorResponse('E-mail and password are required', 400))
        }

        // check user e-mail
        const user = await User.findOne({email});
        if(!user){
           
            return  next(new ErrorResponse('Invalid credentials', 400))
        }

        // verify user password
        const isMatched = await user.comparePassword(password);
        if (!isMatched){
         
          return  next(new ErrorResponse('Invalid credentials', 400))
        }

        generateToken(user, 200, res);
    }
    catch(error){
        console.log(error);
       
        next(new ErrorResponse('Cannot log in, check your credentials', 400))
    }
   
}


const generateToken = async (user, statusCode, res) =>{

    const token = await user.jwtGenerateToken();

    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.EXPIRE_TOKEN)
    };

    res
    .status(statusCode)
    .cookie('token', token, options )
    .json({success: true, token})
}


//LOG OUT USER
exports.logout = (req, res, next)=>{
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out"
    })
}




// EDIT THE USER PROFILE
exports.editProfile = async (req, res, next) => {
    const { name, description, price, image } = req.body;
    console.log(req.body);

    try {
        let token;
        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Initialize updateData with the fields that are always updated
        let updateData = {
            name,
            about: description,
            age: price,
//             profilePicture: {
// public_id: user.profilePicture.public_id,
// url: user.profilePicture.url
//             }
        };
console.log('oh image', image)

        
        // If an image is provided, delete the old image and upload the new image to Cloudinary
        if (image !== undefined) {
            if (user.profilePicture && user.profilePicture.public_id) {
                // Delete the old image from Cloudinary
                await cloudinary.uploader.destroy(user.profilePicture.public_id);
            }

            // Upload the new image to Cloudinary
            const result = await cloudinary.uploader.upload(image, {
                folder: "profile",
                width: 300,
                height: 300,
                crop: "scale"
            });

            updateData.profilePicture = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        const updatedUser = await User.findByIdAndUpdate(decoded.id, updateData, { new: true, runValidators: false });
        console.log(updatedUser);

        res.status(201).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}



//CHANGE USER PASSWORD
exports.changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    console.log(req.body);

    try {
        let token;
        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify user password
        const isMatched = await user.comparePassword(oldPassword);
        if (!isMatched) {
            return next(new ErrorResponse('Invalid credentials', 400));
        }

        // Password change logic
        user.password = newPassword;

        // Encrypt the new password before saving
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            user
        });

    } catch (error) {
        console.log(error);
        next(new ErrorResponse('Error changing password', 500));
    }
}




exports.singleUser = async (req, res, next)=>{

    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            sucess: true,
            user
        })
        
    } catch (error) {
        next(error)
        
    }
   
}