import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

//'test' api route:
//for a get request, use 'get' . 'req' is the data we send to the api. 'res' is the dta we receive from the api.
router.get('/test', test);
//in the browser, type the url localhost:3000/test to see the api message 

export default router;