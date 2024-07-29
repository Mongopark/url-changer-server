const express = require('express');
const router = express.Router();
const { createProduct, displayProduct, deleteProduct, productCategory, updateProduct } = require("../controllers/productController")
const { isAuthenticated, isAdmin, isUser } = require("../middleware/auth");


router.post('/product/create', 
    // isAuthenticated,
    //  isAdmin, 
    isUser, //checks if user is authenticated too
     createProduct);
router.get('/products/all', displayProduct);
router.delete('/product/delete/:id', isAuthenticated, isAdmin, deleteProduct);
router.put('/product/update/:id', isAuthenticated, isAdmin, updateProduct);
router.get('/product/categories', productCategory);





module.exports = router;