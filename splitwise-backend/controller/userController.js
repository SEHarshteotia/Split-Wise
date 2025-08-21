const express =  require("express");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {pool} = require("../Databse/Dbmysql");




// @desc Register new user
// @route POST /api/users/register
// @access Public

const register= asyncHandler(async(req,res) =>{
    const{name , email ,  password } = req.body;
    if(!name || !email ||!password){
        res.status(400);
        throw new Error("All fields are required");
    }

    const[existing] = await  pool.query("SELECT * FROM users WHERE  email=?",[email])
    if(existing.length>0){
        res.status(400);
        throw new Error("User Already Exists ");
    }

        // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const[result] =  await pool.query("INSERT INTO users  (name ,email,password_hash) VALUES (?,?,?)  ",[name,email,hashedPassword]);

    res.status(201).json({
        id:result.insertId,
        name ,
        email
    });

});



//@desc Login User 
//@route POST api/users/login 
//@access public 

const loginUser = asyncHandler(async (req,res) => {
    const{email,password} = req.body;
    if(!email||!password){
    res.status(400);
    throw new Error("All Fields Are Required ");
    }
    //checking for email 
    const[rows] = await pool.query('SELECT * FROM users WHERE email = ?',[email]); // destructring of the rows using [rows]
    if(rows.length===0){
        res.status(401);
        throw new Error("Invalid email");
    }
    const user = rows[0]; // storing value of user if exists in user 

    //checking for password 
    const isMatch = await bcrypt.compare(password,user.password_hash);
    if(!isMatch){
        res.status(401);
        throw new Error("Invalid Password ");
    }

    // creating a jwt token 

    const token = jwt.sign(
        {id:user.id,email: user.email },
        process.env.JWT_SECRET,
        {expiresIn : '7d'}
    );
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token
    });


    
})
module.exports = {loginUser,register};