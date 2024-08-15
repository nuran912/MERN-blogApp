import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';   //cookie-parser is installed in the back end using 'npm i cookie-parser' and initialized in this file
 
dotenv.config();

//mongoose.connect() method is used to connect to the database.but we need a mongodb uri to connect to it, we need to create that in the mongodb website
//process.env.MONGO is used in place of the URI that we hid within .env
mongoose.connect(process.env.MONGO).then(() => { console.log('Mongodb is connected');}).catch(err=> {console.log(err);})   

const app = express();   //to create the application

//this will allow json as inputs in the backend
app.use(express.json());    // <-- this is essentially where we create the application
app.use(cookieParser());   //This allows us to extract the cookie from the browser

//listen to port 3000, that's where the server is running(can be 3000 or any other)
app.listen( 3000, () => {
    console.log('Server is running on port 3000')
});

//run this file on the terminal using 'node api/index.js'
//put "type": "module" in package.json inorder to import express

//if i make changes to this file, we need to restart the server to see changes which will be time consuming
//to avoid that we can install nodemon package using 'npm i nodemon'
//then add a script for that in package.json as below;
//                  "dev": "nodemon api/index.js"   , to run it use npm run dev in the console. it will detected the changes we make and automatically restart the server.
//                  "start": "node api/index.js"    , for when we need to run the application as we'll be doing that using node


//using the 'use' method cus we're getting the 'get' request from 'user.route.js' using 'userRoutes'
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

//this middleware gives us: error we get from the input,request(sending info),response(getting info),next(the next middleware).
app.use((err, req, res, next ) => {
    const statusCode = err.statusCode || 500;   //the status code we get from the error OR 500(if there is not status code from error)
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
});