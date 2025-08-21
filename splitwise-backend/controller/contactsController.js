const express = require("express");

const asyncHandler = require("express-async-handler");
const { pool } = require("../Databse/Dbmysql");


//@desc Get all contacts 
//@routes Get /api/contacts
//access public 

const getAllContacts = asyncHandler( async (req,res) => {
   const  [rows] = await pool.query('SELECT * FROM contacts ORDER BY  created_at DESC');
   res.status(200).json(rows)

});

//@desc create a contact 
//@routes Get /api/contacts
//access public 

const CreateContact = asyncHandler(async(req,res) => {

  
   
   const{name,email,phone} = req.body;
   if(!name || !email || !phone){
      
    res.status(400);
    throw new Error("ALL field are mandatry")
   }

     const [result] = await pool.query('INSERT INTO contacts  (name , email , phone ) values (?,?,?) ',[name , email, phone ]);

     res.status(201).json({id:result.insertId,name ,email,phone})

});

//@desc update  a contact 
//@routes Get /api/contacts
//access public 

const UpdateContact = asyncHandler(async(req,res) => {
   const{name , email, phone } = req.body;
   const[result] = await pool.query('UPDATE contacts SET name = ? ,email = ? , phone = ? WHERE ID = ?',[name ,email,phone ,req.params.id]);
   if(result.affectedRows===0) return  res.status(404).json({Message : `Contact Not Found `});

   res.status(200).json({Message : `update a contact for ${req.params.id}`})

});
//@desc Delete  a contact
//@routes Get /api/contacts
//access public 

const DeleteContact = asyncHandler(async (req,res) => {
   const[result] = await pool.query('DELETE FROM contacts WHERE  id=?',[req.params.id]);
   if(result.affectedRows===0) return res.status(404).json({ message: 'Contact not found'});
   res.status(200).json({Message : `Deleted  a contact for ${req.params.id}`});

});
//@desc Get a contact
//@routes Get /api/contacts
//access public 

const GetContact = asyncHandler(async(req,res) => {
    const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    if(rows.length===0) return res.status(404).json({ message: 'Contact not found' });
   res.status(200).json(rows)

});

module.exports = {getAllContacts,UpdateContact,DeleteContact,CreateContact,GetContact}



