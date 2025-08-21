const express = require("express");
const asyncHandler = require("express-async-handler");
const {pool} = require("../Databse/Dbmysql");

//@desc to get friends of a user 

  const getAllFriends = asyncHandler(async(req,res) => {
    [rows] = await pool.query("SELECT * FROM friends WHERE user_id = ? ", [req.params.user_id]);
  
    res.json(rows);
});
  
//@desc to set   friends of a user 
 const setFriend = asyncHandler(async(req,res) => {
    const{user_id,friend_name,} = req.body;
     if (!friend_name) {
    res.status(400);
    throw new Error("Please provide a friend name ");
  }
    
   await pool.query("INSERT INTO friends (user_id,friend_name)  VALUES (?,?)   ", [user_id,friend_name]);
   
     res.json({message:"friend  added successfully "});
});

//@desc to update friend of a user 
const UpdateFriends =  asyncHandler(async(req,res) => {
    const {friend_name} = req.body;
    const [result] = await pool.query("UPDATE   friends SET friend_name = ?  WHERE id=? AND  user_id=? ",[ friend_name,req.params.friend_id,req.params.user_id]);

    if(result.affectedRows==0){
        res.status(404);
        throw new Error("Friend Not Found")
    }

    res.json({message:"friend  Updated successfully "});


});

const deleteFriend =  asyncHandler(async(req,res) => {
  

    const [result] = await pool.query("DELETE FROM friends  WHERE id=? and user_id=? ",[req.params.friend_id,req.params.user_id]);

    if(result.affectedRows===0){
        res.status(404);
        throw new Error("Friend Not Found")
    }
    
    res.json({message:"Friends  Deleted  successfully "});
});
module.exports = {deleteFriend,UpdateFriends,setFriend,getAllFriends};




