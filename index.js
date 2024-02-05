const express = require('express')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const knex = require('knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('./db/db.js')
const bodyParser = require('body-parser')
const axios = require('axios')




require('dotenv').config()


const app = express()
const port = process.env.PORT
const githubUsername = 'ekayZ7875'
const githubApiUrl = `https://api.github.com/users/${githubUsername}/repos`;




app.use(express.json())
app.use(bodyParser.json())
















// Route For Registering The User
app.post('/register',async(req,res)=>{

    try{
        const{ Username,Password } = req.body

        const hashedPassword = await bcrypt.hash(Password,16)

       inserTion =  await db('Users_2').insert({
            Username,
            Password:hashedPassword
        })
  if(inserTion){
    res.json('User created successfully')
  }
    } catch(error){
        console.log('Error',error);
        res.json({message:'some error ocuurred while registering the user please try again'})
    }
})

//Route For Logging In The User
app.post('/login',async(req,res)=>{

    try{
        const{ Username,Password } = req.body


        const user = await db('Users_2').where({Username}).first()

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(Password,user.Password)


        if (passwordMatch) {
    
            const token = jwt.sign({username:user.Username},process.env.SECRET_KEY,{expiresIn:'1h'})   // generating the token
            res.json({message:"login successfull",token})
            
        } else {
            res.status(401).json({message:'invalid credentials'})
            
        }
        
    

    

    } catch(error){
        res.json(error)
    }
})




//middleware for authentication
function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, process.env.SECRET_KEY , (error, decoded) => {
      if (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      req.user = decoded;
      next();
    });
  }


// Route For Fetching Github Repositories

app.get('/repositories',authenticateToken,async(req,res)=>{
    try{
        const response = await axios.get(githubApiUrl,{
            headers:{
                Authorization: process.env.AUTH
            }
        })
        
    
const repositories = response.data.map(repo =>({
    name:repo.name,
    url:repo.html_url

}))

const inserTion =  await db('Repos').insert(repositories)
    res.json(repositories)
    console.log(repositories);

    if(inserTion){
        console.log('Entry in database is successfull')

    } else{
        console.log('Error occurred while entering data in databse');
    }

   

        } catch(error){
            res.json('Internal Server Error Occurred')
            console.log(error)
        }

})


// Route For Fetching Commits In Repositories
app.get('/commits',authenticateToken,async(req,res)=>{

    const { repo } = req.body

    try{
        const response_1 = await axios.get(`https://api.github.com/repos/ekayZ7875/${repo}/commits`,{
            headers:{
                Authorization: process.env.AUTH
            }
        })
        const commits = response_1.data.map(commits=>({
            sha:commits.sha,
            message:commits.commit.message,
            author:commits.commit.author.name
        }))

        const inserTion = await db('Commits_1').insert(commits)

if(inserTion){
    console.log('Entry in database  is successfull');
} else{
    console.log('Some error occurred while entering data in databse');

}


        res.json(commits)
        console.log(commits)

    } catch(error){
        res.json('Some Internal Error Occurred')
        console.log(error);
    }

})





































app.listen(port,()=>{
    console.log('app is listening on',3000)
})