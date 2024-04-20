require('dotenv').config()
const { error } = require('console');
const express = require('express');
const app = express();
const port = 5000;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');


app.use(cors());
app.use(express.json());

const connectionUrl = `mongodb+srv://${process.env.MONGOO_USERNAME}:${process.env.MONGO_PASSWORD}@userdata.e6nklgz.mongodb.net/?retryWrites=true&w=majority&appName=UserData`
mongoose.connect(connectionUrl)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(port,()=>{
            console.log("server is on ",port);
        })
       
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'], 
            lowercase: true 
        },
        contactNumber: {
            type: String,
            required: false, 
            match: [/^\d{10}$/, 'Please use a valid contact number.'], 
        }
    });



const User =  mongoose.model("User",userSchema);


app.get('/login', Authenticate, async (req, res) => {
    try {
        console.log("user",req.user);
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});




function Authenticate(req,res,next){
    //const token = req.cookies.jwt;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
     return res.sendStatus(401)
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,decoded) =>{

        if(error) return res.json({error:error});
        req.user = decoded
        next();
    });
}

app.post("/signup",async(req,res)=>{
    const data = req.body;
    try{
     const response =  await User.create(data);

     console.log(req.body);
     const username = req.body.username;
     const user = {username:username};
 
     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

     res.cookie('jwt', accessToken, {
        httpOnly: true, 
        secure: true, 
        sameSite: 'strict', 
    });
    res.json({accessToken:accessToken,response:response});
    }
    catch(err){
        console.log(err);
    }
   
})

app.listen(()=>{
    console.log("Server running on ",port);
})