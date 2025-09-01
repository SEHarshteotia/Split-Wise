const express = require("express");
const router = express.Router();
const{  getGroupExpense, AddExpenseToGroup, updateGroupExpense, deleteGroupExpense } = require("../controller/groupExpenseController");
const protect = require("../middelwear/authMiddelwear")

router.route("/:group_id/expense").get(protect,getGroupExpense).post(protect,AddExpenseToGroup);

router.route("/:group_id/expense/:id").put(protect,updateGroupExpense).delete(protect,deleteGroupExpense)

module.exports = router;