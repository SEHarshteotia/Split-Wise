const {pool} = require("../Databse/Dbmysql");
const asyncHandler = require("express-async-handler");

//@ desc get all groups 
const getallGroups = asyncHandler(async(req,res) => {
    const [result] = await pool.query("SELECT * FROM gro_ups WHERE created_by=? ",[req.user.id]);
    if(result.length===0) {
       return  res.status(404).json({ ok: false, message: "No groups found for this user" })
    }
    return res.json({ ok: true, data: result });

});


//@ desc create  groups 
const createGroups = asyncHandler(async(req,res) => {
    const{group_name} = req.body;

    const [existing] = await pool.query(
  "SELECT * FROM gro_ups WHERE group_name = ? AND created_by = ?",
  [group_name, req.user.id]
);

if (existing.length > 0) {
  return res.status(400).json({ ok: false, message: "Group name already exists for this user" });
}

    const [result] = await pool.query("INSERT INTO gro_ups(group_name,created_by) values(?,?) ",[group_name,req.user.id]);
    if(result.affectedRows===0) {
       return res.status(404).json({ ok: false, message: "No groups found for this user" })
    }
    return res.json({ ok: true, data: { id: result.insertId, group_name, created_by: req.user.id }  });

});

//@ desc update all groups 
const updateGroups = asyncHandler(async(req,res) => {
    const{group_name} = req.body;
      const { id } = req.params; 
    const [result] = await pool.query("UPDATE gro_ups SET group_name = ? WHERE created_by=? AND id = ? ",[group_name,req.user.id,id]);
    if(result.affectedRows===0) {
       return res.status(404).json({ ok: false, message: "No groups found for this user" })
    }
   return res.json({ ok: true, data: { id, group_name } });

});

//@ desc delete all groups 
const DeleteGroups = asyncHandler(async(req,res) => {
    const{id} = req.params;
   
   
    const [result] = await pool.query("DELETE FROM gro_ups WHERE id=? AND created_by = ?",[id,req.user.id]);

    if(result.affectedRows===0) {
      return  res.status(404).json({ ok: false, message: "No groups found for this user" })
    }
  return res.json({ ok: true, message: "Group deleted successfully", id });

});

module.exports = {DeleteGroups ,updateGroups, createGroups, getallGroups   };




