// require('dotenv').config();
// const express = require('express');
// const { use } = require('express/lib/application');
// const { json } = require('express/lib/response');
// const app = express();
// const jwt = require('jsonwebtoken');

// app.use(express.json());
// let refreshTokens = [];
// app.post('/token',(req,res)=>{
//     const rToken = req.body.token;
//     console.log(rToken);
//     if(rToken == null){
//         return res.json({message: "token has no value"});
//     }
//     else{
//         if(refreshTokens.includes(rToken)){
//             jwt.verify(rToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
//                 if(err){return res.json({message: "Invalid token"})}
//                 else{
//                     const accessToken = generateToken({name:user.name});
//                     res.json({accessToken:accessToken});
//                 }
//             })
//         }
//         else{
//             res.json({message:"refreshToken not found"})
//         }
//     }
// })
// app.post('/login',(req,res)=>{

//     console.log(req.body);
//     const username = req.body.username;
//     const user = {name:username};
//     const accessToken = generateToken(user);
//     const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
//     refreshTokens.push(refreshToken);
//     res.json({accessToken:accessToken,refreshToken:refreshToken});
// })

// function generateToken(user){
//     return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: "30s"});
// }

// app.listen(4000,()=>{
//     console.log("Server running on 4000");
// })