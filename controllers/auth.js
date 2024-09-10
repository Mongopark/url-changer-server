const jwt = require('jsonwebtoken');
const User = require("../models/user");
const ErrorResponse = require('../utils/errorResponse');


exports.signup = async (req, res, next)=>{

    const {email} = req.body;
    const userExist = await User.findOne({email});
    
    if (userExist){
      
     return  next(new ErrorResponse('E-mail already exists', 400))
    }

    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true, 
            user, 
            message: "Account Created Successfully"})
        
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
    .json({success: true, token, id:user.id, user, message: "Logged In Successfully"})
}


//LOG OUT USER
exports.logout = (req, res, next)=>{
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out"
    })
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




// USESR PROFILE 
exports.userProfile = async (req, res, next)=>{
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      return next (new ErrorResponse("Unauthorized, Token Required", 401));
    }
    try {
  
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if user exists
        const user = await await User.findById(decoded.id);
        res.status(200).json({
            sucess: true,
            user,
            message: "My Account gotten successfully"
        })
        
    } catch (error) {
        next(error)
        
    }
   
}