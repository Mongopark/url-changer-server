const jwt = require('jsonwebtoken');
const User = require("../models/user");
const ErrorResponse = require('../utils/errorResponse');


// check if user is authenticated
// exports.isAuthenticated = async (req, res, next) =>{

//     const {token} = req.cookies;

//     // make sure token exists
//     if (!token){
//         return next (new ErrorResponse('You must log in to access this ressource', 401));
//     }

//     try {
//         //verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);
//         next();

//     } catch (error) {
//         return next (new ErrorResponse('You must log in to access this ressource', 401));
//     }
// }


/**
 * Protect middleware, adds req.user
 * @desc Checks if user is authenticated
 * By checking authorization headers for bearer token
 */
exports.isAuthenticated = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      return next (new ErrorResponse("Unauthorized, Token Required", 401));
    }
  
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    // Check if user exists
    const exists = await User.findById(decoded.id);
    next();
    if (!exists) {
        return next (new ErrorResponse("The user belonging to this token no longer exists", 401));
    }}

// admin middleware
exports.isAdmin = (req, res, next) =>{
    if (req.user.role === 0){
        return next (new ErrorResponse('Access denied, you must be an admin', 401));
    }
    next();
}


    // admin middleware
exports.isUser = async(req, res, next) =>{
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      return next (new ErrorResponse("Unauthorized, Token Required", 401));
    }
  
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if user exists
    const exists = await User.findById(decoded.id);
    if (exists.role !== 'user'){
        return next (new ErrorResponse('Access denied, you must be a User', 401));
    }
    if (!exists) {
        return next (new ErrorResponse("The user belonging to this token no longer exists", 401));
    }
    next();
}
