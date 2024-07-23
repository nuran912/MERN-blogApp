export const test = (req,res) => {
    res.json({message: 'API is working!'});
};
//for a get request, use 'get' . 'req' is the data we send to the api. 
//'res' is the data we receive from the api.

//we use seperate controller files in a controller folder cuz,
//these functions sometimes have a lot of logic to them.
