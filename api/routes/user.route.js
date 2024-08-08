import express from 'express';
//need to import express in order to create route
import { test } from '../controllers/user.controller.js';

const router = express.Router();

//'test' api route:
//for a get request, use 'get' . 'req' is the data we send to the api. 'res' is the data we receive from the api.
router.get('/test', test);
//in the browser, type the url localhost:3000/test to see the api message 

export default router;

//the best practice in backend development is to create a route file for each route section.
//for example, routes folder contains these routes as files for various routes such as user, auth, etc.