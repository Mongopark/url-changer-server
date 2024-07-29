const express = require('express');
const router = express.Router(); 
const {signup, signin, logout, singleUser, editProfile, changePassword } = require("../controllers/user")
const { isAuthenticated, isAdmin, isUser } = require("../middleware/auth");

router.post('/signup', signup );
router.post('/signin', signin );
router.get('/logout', logout );
router.get('/user/:id', singleUser );
router.post('/profile/edit', 
    // isAuthenticated,
    //  isAdmin, 
    isUser, //checks if user is authenticated too
    editProfile);
    router.post('/password/edit', changePassword);


module.exports = router;