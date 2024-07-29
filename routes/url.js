const express = require('express');
const router = express.Router();
const { UrlMiddleware }  = require("../middleware/url");
const { shortenUrl, getShortUrl, getUserUrls }  = require("../controllers/urlShortController");
const {isUser} = require("../middleware/auth");


router.post('/shorturl', 
    // isAuthenticated,
    //  isAdmin, 
    isUser, //checks if user is authenticated too
    // UrlMiddleware, //validates the url
    shortenUrl);
router.get('/url/:short_url', getShortUrl);
router.get('/geturls', isUser, getUserUrls);


module.exports = router;

