const express = require('express');
const router = express.Router();
const { createSpinRecord, getUserSpinRecord, deleteSpinRecord } = require("../controllers/spinController")
const { isAuthenticated, isAdmin, isUser } = require("../middleware/auth");


router.post('/spin/create', createSpinRecord);
router.get('/spin/get/:id', getUserSpinRecord);
router.delete('/spin/delete/:id', deleteSpinRecord);





module.exports = router;