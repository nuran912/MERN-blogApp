import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'you are not allowed to create a post'));
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'title and content are required'))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');   //replace(/[^a-zA-Z0-9]/g, '-')  <-- replace anythin taht is not a letter or a number with a dash
    
    const newPost = new Post({
        ...req.body, 
        slug,
         userId: req.user.id
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}

export const getPosts = async (req,res,next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0; //startIndex->to know which post to start fetching; parseInt->to convert to Int; we send which index we wanna start from, if it isn't specified then start from 0;
        const limit = parseInt(req.query.limit) || 9;    //to limit how many posts to show. If no specific limit sent, show 9
        const sortDirection = req.query.order === 'asc' ? 1:-1  //for sort direction. ascending or descending. 1->mongodb willshow asc, -1->mongodb will show desc
        const posts = await Post.find({  //posts-> the posts that we show. we get them from the 'Post' model in mongodb. below are instances for different search parameters;
            ...(req.query.userId && {userId: req.query.userId }),   //if the search query is for a userId(search for a specific user)
            ...(req.query.category && {category: req.query.category }),   //if the search query is for a category(search for a specific category)
            ...(req.query.slug && {slug: req.query.slug }),   //if the search query is for a title(search for a specific title)
            ...(req.query.postId && {_id: req.query.postId }),   //if the search query is for a postId(search for a specific post). it is saved in mongodb under _id key
            ...(req.query.searchTerm && {   //when user searches a specific term. the term could be in either a title or content.
                $or: [       //"$or" allows us to search among two places for example title or content
                    { title: { $regex: req.query.searchTerm , $options: 'i' }},     //"$regex" is going to search inside title. for example if you search 'er' it will return titles with 'er' in them. eg: 'er' --> 'query','Provider'
                    {content: {$regex: req.query.searchTerm, $options: 'i'}},   // $options: 'i' indicates uppercase or lowercase doesn't matter
                ],
            }),
        }).sort({ updatedAt: sortDirection}).skip(startIndex).limit(limit); //sort bt updatedAt(latest update time) based on sortDirection. skip to the startIndex. limit # of posts to limit.
    
        const totalPosts = await Post.countDocuments(); //to get the no. of posts
        
        const now= new Date();  //to get current time
        const oneMonthAgo = new Date( //to get time one month ago 
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthPosts = await Post.countDocuments({   //to get the no. of posts created in the last month
            createdAt: { $gte: oneMonthAgo }, //time of creation greater than oneMonthAgo
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        })
        
    } catch (error) {
        next(error);
    }
}