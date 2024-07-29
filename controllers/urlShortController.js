// import { Request, Response } from 'express'
const Url = require("../models/url");
const jwt = require('jsonwebtoken');
const User = require("../models/user");




const loadNanoid = async () => {
    const { customAlphabet } = await import('nanoid');
    return customAlphabet;
}

exports.shortenUrl = async (req, res, next) => {
    const { url, name, description } = req.body;

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

        let shortUrl;
        let savedUrl = await Url.findOne({ user_id: user._id, originalUrl: url });
        if (savedUrl) {
            shortUrl = savedUrl.shortUrl;
            res.status(201).json({
                status: 201,
                message: `url already exists at ${`https://yourlinkapp.vercel.app/api/url/${shortUrl}`}, please create another`,
                short_url: shortUrl,
                original_url: url,
                urlName: name,
                urlDescription: description,
                success: true,
                user
            });
        } else {
            const customAlphabet = await loadNanoid();
            const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);
            shortUrl = nanoid();
            savedUrl = new Url({
                shortUrl: shortUrl,
                originalUrl: url,
                user_id: user._id,
                urlName: name,
                urlDescription: description
            });
            await savedUrl.save();
            res.status(200).json({
                status: 200,
                message: "url created successfully",
                short_url: shortUrl,
                original_url: url,
                urlName: name,
                urlDescription: description,
                success: true,
                user
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Server Error');
    }
};




exports.getShortUrl = async (req, res, next) => {
    const shortUrl = req.params.short_url;
    let url = await Url.findOne({ shortUrl: shortUrl });

    if (url) {
        res.redirect(url.originalUrl);
    } else {
        res.status(500).json('Server Error');
    }
};





exports.getUserUrls = async (req, res, next) => {

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

        
        let allUrl = await Url.find({ user_id: user._id });
        if (allUrl[0]) {
            res.status(200).json({
                status: 200,
                message: allUrl.length>1 ? "All your Urls has been retrieved Successfully":"Your Url has been retrieved Successfully",
                urls: allUrl,
                success: true,
                user
            });
        } else {
        res.status(201).json({  
            status: 201,
            message: "This User has no existing URLs, Please Create some ",   
            urls: [],    
            success: true,   
            user
        });
    }
    } catch (err) {
        console.log(err);
        res.status(500).json('Server Error');
    }
};