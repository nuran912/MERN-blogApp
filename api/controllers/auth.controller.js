import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';    //bcrypt is a package used for password hashing(installed in the backend using 'npm i bcrypt')
import { errorHandler } from "../utils/error.js";

//use async cus we need to stop time to get the results from mongodb
export const signup = async (req,res,next) => {
    //console.log(req.body);  <-this would just display the data in the console.
    // req.body contains the key-value pairs of data submitted in the request body
    const {username, email, password} = req.body;    //to get the username, email, password information seperately

    //to prevent someone from submitting an empty string or nothing at all    
    if( !username || !email || !password || username==='' || email==='' || password===''){
        next(errorHandler(400, 'All fields are required'));        // instead of this: return res.status(400).json({message: "All fields are required"});
    }

    //here we encrypt the 'password' using a hashing function. 10 is
    const hashedPassword = bcryptjs.hashSync(password, 10);

    //to create a new user; we import 'User' model from user.model.js
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        //to save this new user in the database
        await newUser.save();
        res.json("Signup successfull");  //this message will display(in the insomnia console) upon success
    } catch (error) {
        //next is the middleware for the error?
        next(error);    //instead of : res.status(500).json({ message: error.message })
    }

}