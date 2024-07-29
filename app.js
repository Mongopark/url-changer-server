const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');


//IMPORT ROUTES
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const bannerRoutes = require('./routes/banner');
const orgRoutes = require('./routes/organisation');
const userRoutes = require('./routes/user');
const urlRoutes = require('./routes/url');




// CONNECT DATABASE
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(()=> console.log('DB connected'))
.catch((err)=> console.log(err));

// MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '100mb',
    extended: true
    }));
app.use(cookieParser());
// app.use(cors()); //THIS WAS USED BEFORE DEPLOTMENT NOW REPLACED WITH THE BELOW



// CORS Configuration
const allowedOrigins = ['https://urlchanger.netlify.app', 'http://localhost:3000', 'http://localhost:5173']; // Add your frontend URLs here
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // This allows cookies to be sent cross-origin
}));




// ROUTES MIDDLEWARE
app.use("/api", authRoutes)
app.use("/api", productRoutes)
app.use("/api", categoryRoutes)
app.use("/api", bannerRoutes)
app.use("/api", orgRoutes)
app.use("/api", userRoutes)
app.use("/api", urlRoutes)



//ERROR MIDDLEWARE
 app.use(errorHandler);

const port = process.env.PORT || 8000;


app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
})