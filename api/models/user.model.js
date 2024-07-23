//we create the user model here for the database

import mongoose from 'mongoose'

//user schema is a set of rules we set for the user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        unique: false,
    }
}, {timestamps: true}    //to save time of creation and time of update when creating users.
)

//to create the model. 'User' is the name of the model.
const User = mongoose.model('User',userSchema)

//need to export it so that we can use it in other places
export default User; 