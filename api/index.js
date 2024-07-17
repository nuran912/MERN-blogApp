import express from 'express';

const app = express();   //to create the application

//listen to port 3000, that's where the server is running(can be 3000 or any other)
app.listen( 3000, () => {
    console.log('Server is running on port 3000')
});

//run this file on the terminal using 'node api/index.js'
//put "type": "module" in package.json inorder to import express

//if i make changes to this file, we need to restart the server to see changes which will be time consuming
//to avoid that we can install nodemon package using 'npm i nodemon'
//then add a script for that in package.json as below;
//                  "dev": "nodemon api/index.js"   , to run it use npm run dev in the console. it will detected the changes we make and automatically restart the server.
//                  "start": "node api/index.js"    , for when we need to run the application as we'll be doing that using node