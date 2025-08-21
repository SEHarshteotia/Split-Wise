const express = require("express");
const router  = express.Router();
const{  DeleteFriendExpenses,
  UpdateFriendExpenses,
  setFriendExpenses,
  getFriendsExpenses,
  pendingToCollect,
  pendingToPay,
  detailedPendingToCollect,
  RecentActivity} = require("../controller/friendsExpensesController")

router.route("/:user_id").get(getFriendsExpenses)
router.route("/").post(setFriendExpenses);
router.route("/:user_id/:expense_id").put(UpdateFriendExpenses).delete(DeleteFriendExpenses);
router.route("/:user_id/collect").get(pendingToCollect);
router.route("/:user_id/pay").get(pendingToPay);
router.route("/:user_id/recent").get(RecentActivity);
router.route("/:user_id/collect/details").get(detailedPendingToCollect);

module.exports = router ;

