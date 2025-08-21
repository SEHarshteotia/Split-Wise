const express  = require("express");
const router = express.Router();
const {deleteFriend,UpdateFriends,setFriend,getAllFriends} = require("../controller/friendsController");

router.route("/:user_id").get(getAllFriends);
router.route("/").post(setFriend);
router.route("/:user_id/:friend_id").put(UpdateFriends).delete(deleteFriend);
module.exports = router;
