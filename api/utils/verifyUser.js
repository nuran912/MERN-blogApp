//Before we update user info in the profile page, the user has to be signed in.
//We will use cookies to verify whether user is authenticated or not.
//We create this seperate file for that cuz several files will need authentication.

import jwt from "jsonwebtoken";
import { errorHandler } from './error.js';

//install package called cookie-parser in the backend and initialize inside index.js
export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;   //to get the token from the cookie of the browser using the cookie's name 'access_token'

    if(!token){
        return next(errorHandler(401, 'Unauthorized'));
    }
    //to verify we got the right token -> jwt.verify()
    //token - the toke we wanna verify, process.JWT_SECRET - we verify the token based on the secret key we created in .env
    //this verification gives us either an error (err) or the user data (user) from the cookie
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return next(errorHandler(401, 'Unauthorized'));
        }
        //if there's no error(user is verified), we wanna send the user data along with the request
        req.user = user;
        next();
    });
}
