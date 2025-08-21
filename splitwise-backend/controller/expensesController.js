const express = require("express");
const asyncHandler = require("express-async-handler");
const { pool } = require("../Databse/Dbmysql");
 
//@desc getting expenses
const getExpenses = asyncHandler(async(req,res)  => {
    const[rows] = await pool.query("SELECT * FROM expenses WHERE user_id =?",[req.params.user_id]);
    res.json(rows);


});

//@desc getting expenses sum
const getTotalExpenses = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT 
      COALESCE(
        (SELECT SUM(amount) FROM expenses WHERE user_id = ?), 0
      ) 
      +
      COALESCE(
        (SELECT SUM(amount) FROM friends_expenses WHERE user_id = ?), 0
      ) AS total
    `,
    [req.params.user_id, req.params.user_id]
  );

  // Ensure it's always a number
  const total = rows[0]?.total ?? 0;

  res.json({ total });
});




//@desc setting expenses
const setExpenses =  asyncHandler(async(req,res) => {
  
  
    const {user_id,category,amount,da_te} = req.body;
    
    if (!user_id || !category || !amount || !da_te) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }
    await pool.query("INSERT  INTO expenses (user_id,category,amount,da_te) VALUES(?,?,?,?)",[user_id,category,amount,da_te]);
    res.json({message:"expense added successfully "});


});



//@desc Updating expenses

const UpdateExpenses =  asyncHandler(async(req,res) => {
    const {category,amount,da_te} = req.body;
    const [result] = await pool.query("UPDATE   expenses SET category =?,amount = ?,da_te=? WHERE id=? AND  user_id=? ",[category,amount,da_te,req.params.id,req.params.user_id]);

    if(result.affectedRows==0){
        res.status(404);
        throw new Error("Expenses Not Found")
    }

    res.json({message:"expense Updated successfully "});


});

//@desc Deleting  expenses

const DeleteExpenses =  asyncHandler(async(req,res) => {

    const [result] = await pool.query("DELETE FROM expenses  WHERE id=? AND  user_id=? ",[req.params.id,req.params.user_id]);

    if(result.affectedRows===0){
        res.status(404);
        throw new Error("Expenses Not Found")
    }
    
    res.json({message:"expense Deleted  successfully "});
});


module.exports = {getExpenses,setExpenses,UpdateExpenses,DeleteExpenses,getTotalExpenses };
