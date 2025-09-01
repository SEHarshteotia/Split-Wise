const express = require("express")
const router = express.Router();
const protect = require("../middelwear/authMiddelwear")
const {DeleteGroups ,updateGroups, createGroups, getallGroups  } = require("../controller/groupController");

// Debugging log (optional)
console.log("Loaded controllers:", { DeleteGroups, updateGroups, createGroups, getallGroups });

router.route("/").get(protect,getallGroups).post(protect,createGroups);
router.route("/:id").put(protect,updateGroups).delete(protect,DeleteGroups);

module.exports = router;