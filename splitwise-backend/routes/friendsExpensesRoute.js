const express = require("express");
const router  = express.Router();
const{  DeleteFriendExpenses,
  UpdateFriendExpenses,
  setFriendExpenses,
  getFriendsExpenses,
  pendingToCollect,
  pendingToPay,
  detailedPendingToCollect,
  detailedPendingToPay,
  PendingToCollectEachFriend,
  PendingToPayEachFriend,
  friendsDetailsPage,
  RecentActivity} = require("../controller/friendsExpensesController")


router.route("/:user_id/collect/details/each").get(PendingToCollectEachFriend);
router.route("/:user_id/pay/details/each").get(PendingToPayEachFriend);
  router.route("/:user_id/collect").get(pendingToCollect);
router.route("/:user_id/pay").get(pendingToPay);
router.route("/:user_id/recent").get(RecentActivity);
router.route("/:user_id/collect/:friend_id").get(detailedPendingToCollect);
router.route("/:user_id/pay/:friend_id").get(detailedPendingToPay);

router.route("/:user_id/details/:friend_id").get(friendsDetailsPage)

router.route("/:user_id").get(getFriendsExpenses)
router.route("/").post(setFriendExpenses);
router.route("/:user_id/:expense_id").put(UpdateFriendExpenses).delete(DeleteFriendExpenses);


module.exports = router ;

