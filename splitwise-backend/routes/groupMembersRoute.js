const express = require("express");
const router = express.Router();
const{DeleteGroupMembers , AddFriendToGroups,getallGroupMembers  } = require("../controller/groupMembersController");
const protect = require("../middelwear/authMiddelwear")

router.route("/:group_id/members").get(protect,getallGroupMembers).post(protect,AddFriendToGroups);

router.route("/:group_id/members/:id").delete(protect,DeleteGroupMembers);

module.exports = router;