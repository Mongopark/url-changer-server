const express = require('express');
const router = express.Router();
const { createOrganisation, getUserOrg, addMember, displayProduct, deleteProduct, productCategory, updateProduct } = require("../controllers/orgController")
const { isAuthenticated, isAdmin, isUser } = require("../middleware/auth");


router.post('/org/create', 
    // isAuthenticated,
    //  isAdmin, 
    // isUser, //checks if user is authenticated too
    createOrganisation);
    router.get('/org/get/:id', isAuthenticated, getUserOrg);
router.post('/org/add/:id', addMember);
// router.delete('/product/delete/:id', isAuthenticated, isAdmin, deleteProduct);
// router.put('/product/update/:id', isAuthenticated, isAdmin, updateProduct);
// router.get('/product/categories', productCategory);





module.exports = router;