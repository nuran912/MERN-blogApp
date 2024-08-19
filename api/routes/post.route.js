import express from 'express';
import { verifyToken } from '../utils/verifyUser.js'
import { create, getPosts, deletepost, updatePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);

//get posts api route. to search posts from the search bar etc.
router.get('/getposts', getPosts);   //don't need verify token cuz any user is allowed to search for posts

router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);  //need to pass postId and userId when doing this

router.put('/updatepost/:postId/:userId', verifyToken, updatePost)

export default router;