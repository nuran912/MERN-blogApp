import express from 'express';
//need to import express in order to create route
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

//'test' api route:
//for a get request, use 'get' . 'req' is the data we send to the api. 'res' is the data we receive from the api.
router.get('/test', test);

//new route for user update
router.put('/update/:userId', verifyToken, updateUser);  //before we call the updateUser function we want to verify the token using verifyToken function
//to update user details from the profile page. We use  'put' request.
//the api route will have the address /update and we add the userId as a parameter to identify the user needs to be updated in the database
//updateUser function is created and imported from user.controller.js
// ** if userId we send in the url or route request  and the one we get from the cookie are equal, it means the request is valid(the person who is making the request is the owner of the cookie)
//in the browser, type the url localhost:3000/test to see the api message 

export default router;

//the best practice in backend development is to create a route file for each route section.
//for example, routes folder contains these routes as files for various routes such as user, auth, etc.