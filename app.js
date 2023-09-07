require('dotenv').config()
const { error } = require('console');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());


const users = [
    {
        username : "itachi",
        aka : "clanSlayer"
    },
    {
        username : "minato_namikazae",
        clan : "yellowFlash"
    }

]

app.get('/post',Authenticate,(req,res)=>{
  res.json(users.filter(user => user.username == req.user.name));
})

app.post('/login',(req,res)=>{

    console.log(req.body);
    const username = req.body.username;
    const user = {name:username};

   const accessToken =  jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
   res.json({accessToken:accessToken});
})

function Authenticate(req,res,next){
    const authHeader = req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
     return res.sendStatus(401)
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,user) =>{

        if(error) return res.json({error:error});

        req.user = user
        next();
    });
}

app.listen(5000,()=>{
    console.log("Server running on 5000");
})