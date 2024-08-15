import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';    //bcrypt is a package/library used for password hashing(installed in the backend using 'npm i bcrypt')
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'; //jsonwebtoken is a package used for token generation(installed in the backend using 'npm i jsonwebtoken')

//use async cus we need to stop time to get the results from mongodb
export const signup = async (req,res,next) => { //next is used for error handling
    //console.log(req.body);  <-this would just display the data in the console.
    // req.body contains the key-value pairs of data submitted in the request body
    const {username, email, password} = req.body;    //to get the username, email, password information seperately

    //to prevent someone from submitting an empty string or nothing at all    
    if( !username || !email || !password || username==='' || email==='' || password===''){
        next(errorHandler(400, 'All fields are required'));        // instead of this: return res.status(400).json({message: "All fields are required"});
    }

    //here we encrypt the 'password' using a hashing function. 
    //hashSync hashes the 'password' synchronously
    //10 is the no. of salt rounds(higher the number means more iteration of hashing which means more security but more computational time)
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

export const signin = async (req,res,next) => {
    /*  we get email and password from the user and then test them to see if the fields are valid.
        if valid, we're gonna set a cookie inside the browser of the user so later when the user wants
        to do some request inside the website, we're gonna check if it is authenticated or not. */

    const { email, password } = req.body;
    
    if( !email || !password || email === '' || password === ''){
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        //findOne() method searches if this email exist
        const validUser = await User.findOne({ email });
        if(!validUser){
           return next(errorHandler(404, 'User not found'));
        }
        //compareSync() compares the entered password("password") with the one that we get back if the user exists("validUser.password")
        //validUser.password is hashed. so to compare these to bcrypt js hashes password as well.
        const validPass = bcryptjs.compareSync(password, validUser.password);
        if(!validPass){
            return next(errorHandler(400, 'Invalid password'));
        }

        //if authentication is valid, we create a token using a method from jwt called sign. 
        //whatever we add is gonna be encrypted fot us(kind of like password hashing).this encrypted value can't be read normally. 
        //then we save this encrypted value to the cookie of the browser and use it later on to authenticate user.
        const token = jwt.sign({ id: validUser._id } , process.env.JWT_SECRET);
            //"_id" is a type of unique id created in mongodb when we create a new user.it can be used for authentication.
            /* we need to add a secret key. it is a unique key only for me(developer). 
               the token will be created and encrypted based on this secret key.
               if someone has this secret key, they can hijack the user's cookie(this cookie is encrypted uniquely by this secret key).  
               it is hidden within .env and JWT_SECRET is used in its place. we add it here using process.env.JWT_SECRET */

        //to seperate the password from the rest of the dtails we get from validUser
        const { password: pass, ...rest} = validUser._doc;

        //we send back the details without the password using 'rest' upon successful authentication.
        //to add the token to the cookie, we use a response⬇️.
        res.status(200).cookie('access_token' , token , {httpOnly: true}).json(rest);
        //200 is the status code for an 'okay' response. we send a cookie with the token("access_token" will be the name shown for 'token'). 
        //{httpOnly: true} is to make the cookie secure. we add a json to send back the user info using validUser to add it to our redux toolkit.
    } catch(error) {
        next(error);
    }
}

export const google = async (req,res,next) => {
    //get email,name,profile pic URl from the body
    const {email, name, googlePhotoURL} = req.body;

    try {
        //to check if the user exists or not
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET); //creating  the token
            const {password, ...rest} = user._doc;  //to seperate the password and the rest
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest); //'access_token' is the name of the cookie
        }else{  
            /*
            If user(email) doesn't exist. we need to create a new user. We already have the username/email. [user model requires username,email and password]
            But we don't have the password. So we make a random password when creating the profile(user can change this afterwards).
            Math.random() generates a random number, toString(36) -> 36 means we get numbers(0-9)+letters(a-z) , slice(-8) to get only the last 8 characters
            */
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                //name=> Nuran Alwis . we convert it to eg: nuranalwis8362
                username: name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoURL
            });
            await newUser.save()    //save newUser in the db
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const { password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest);
        }
    } catch (error) {
        next(error)
    }
}