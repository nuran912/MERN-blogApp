import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs  from 'bcryptjs'

export const test = (req,res) => {
    res.json({message: 'API is working!'});
};
//for a get request, use 'get' . 'req' is the data we send to the api. 
//'res' is the data we receive from the api.

export const updateUser = async (req,res,next) => {
    // req.user.id is the user id we get from the cookie. req.params.userId is the user id we get from the route request/url
    if(req.user.id !== req.params.userId){  //if these two are equal, it means the request is valid(the person who is making the request is the owner of the cookie)
        return next(errorHandler(403, 'You are not allowed to update this user'))
    }
    if(req.body.password){  //if user tries to update the password
        if( req.body.password.length < 6 ) {
            return next(errorHandler(400, 'Password must be at least 6 characters'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);   //if the password is updated, hash it
    }
    if( req.body.username ) {
        if(req.body.username.length < 7 || req.body.username.length > 20 ) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username cannot contain spaces'))
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, 'Username must be in lowercase'))
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, 'Username can only contain letters and numbers'))
        }
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: { //  <- this will update the whatever is included below
                username: req.body.username,    //if there is a username to update, update it
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            },  //this will return the previous info
        }, { new: true })   //when we use 'new: true' it will return the updated info
        const { password, ...rest } = updatedUser._doc; //to seperate the password from the rest as we don't wana send that back
        res.status(200).json(rest); //response
    } catch (error) {
        next(error);
    }
}


//we use seperate controller files in a controller folder cuz,
//these functions sometimes have a lot of logic to them.
