const {getExpenses,setExpenses, DeleteExpenses, UpdateExpenses, getTotalExpenses} = require("../controller/expensesController");
const express = require("express");
const router = express.Router();


router.route("/:user_id").get(getExpenses)
router.route("/:user_id/:id").delete(DeleteExpenses).put(UpdateExpenses);
router.route("/").post(setExpenses);
router.route("/:user_id/total").get(getTotalExpenses);

module.exports = router;