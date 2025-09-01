const {pool} = require("../Databse/Dbmysql");
const asyncHandler = require("express-async-handler");

//@ desc get all groups members  
const getallGroupMembers = asyncHandler(async(req,res) => {
    const{group_id} =req.params;
    const [result] = await pool.query("SELECT * FROM groups_members WHERE group_id=? ",[group_id]);
    if(result.length===0) {
       return  res.status(404).json({ ok: false, message: "No groups found for this user" })
    }
    return res.json({ ok: true, data: result });

});


//@ desc add friends to   groups 
const AddFriendToGroups = asyncHandler(async(req,res) => {
    const{friend_id,friend_name } = req.body;
    const{group_id} = req.params;

     // check if that specific friend is already in this group
  const [existing] = await pool.query(
    "SELECT * FROM groups_members WHERE group_id = ? AND friend_id = ?",
    [group_id, friend_id]
  );

  if (existing.length > 0) {
    return res.status(400).json({ ok: false, message: "This friend is already in the group" });
  }
    const [result] = await pool.query("INSERT INTO groups_members(group_id,friend_id,friend_name) values(?,?,?) ",[group_id,friend_id||null,friend_name||null]);
    if(result.affectedRows===0) {
       return res.status(404).json({ ok: false, message: "No groups found for this user" })
    }
    return res.json({ ok: true, data: { id: result.insertId, group_id,friend_id,friend_name }  });

});



//@ desc delete  group members  
const DeleteGroupMembers = asyncHandler(async(req,res) => {
  const { group_id, id } = req.params;
   
   
   const [result] = await pool.query(
    "DELETE FROM groups_members WHERE id = ? AND group_id = ?",
    [id, group_id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ ok: false, message: "Member not found" });
  }

  return res.json({ ok: true, message: "Member deleted successfully", id });
});




module.exports = {DeleteGroupMembers , AddFriendToGroups,getallGroupMembers  };