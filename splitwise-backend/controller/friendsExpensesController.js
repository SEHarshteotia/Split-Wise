const { pool } = require("../Databse/Dbmysql");
const asyncHandler = require("express-async-handler");

// @desc Get all friend expenses for a user
const getFriendsExpenses = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM friends_expenses WHERE user_id = ? ORDER BY da_te DESC",
    [req.params.user_id]
  );
  res.status(200).json(rows);
});

// @desc Add new friend expense
const setFriendExpenses = asyncHandler(async (req, res) => {
  const { user_id, friend_id, category, amount, da_te, payment_type } = req.body;

  // Validate input
  if (!user_id || !friend_id || !category || !amount || !da_te || !payment_type) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Determine status based on payment type
  let status;
  switch (payment_type) {
    case "full":
      status = "to_collect";
      break;
    case "split":
      status = "settled"; // user paid their share, friend owes rest
      break;
    case "friend":
      status = "to_pay"; // friend paid, user owes back
      break;
    default:
      res.status(400);
      throw new Error("Invalid payment_type");
  }

  // Check if friend exists for this user
  const [friendExists] = await pool.query(
    "SELECT id FROM friends WHERE id = ? AND user_id = ?",
    [friend_id, user_id]
  );
  if (friendExists.length === 0) {
    res.status(400);
    throw new Error("Friend does not exist for this user");
  }

  // Insert into friends_expenses
  const [result] = await pool.query(
    "INSERT INTO friends_expenses (user_id, friend_id, category, amount, da_te, payment_type, status) VALUES (?,?,?,?,?,?,?)",
    [user_id, friend_id, category, amount, da_te, payment_type, status]
  );

  res.status(201).json({ message: "Expense added successfully" });
});

// @desc Update an expense
const UpdateFriendExpenses = asyncHandler(async (req, res) => {
  const { category, amount, da_te, payment_type, status } = req.body;

  const [result] = await pool.query(
    "UPDATE friends_expenses SET category=COALESCE(?, category), amount=COALESCE(?, amount), da_te=COALESCE(?, da_te), payment_type=COALESCE(?, payment_type), status=COALESCE(?, status) WHERE user_id=? AND id=?",
    [category, amount, da_te, payment_type, status, req.params.user_id, req.params.expense_id]
  );

  if (result.affectedRows === 0) {
    res.status(404);
    throw new Error("Expense not found");
  }

  res.json({ message: "Expense updated successfully" });
});

// @desc Delete an expense
const DeleteFriendExpenses = asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM friends_expenses WHERE user_id=? AND id=?",
    [req.params.user_id, req.params.expense_id]
  );

  if (result.affectedRows === 0) {
    res.status(404);
    throw new Error("Expense not found");
  }

  res.json({ message: "Expense deleted successfully" });
});

// @desc Pending to collect
const pendingToCollect = asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    "SELECT COALESCE(SUM(amount),0) AS total_to_collect FROM friends_expenses WHERE user_id=? AND status='to_collect'",
    [req.params.user_id]
  );

  res.json(result[0]);
});

// @desc Pending to pay
const pendingToPay = asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    "SELECT COALESCE(SUM(amount),0) AS total_to_pay FROM friends_expenses WHERE user_id=? AND status='to_pay'",
    [req.params.user_id]
  );

  res.json(result[0]);
});

// @desc Recent activity (last 10 expenses)
const RecentActivity = asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    `SELECT fe.id, f.friend_name, fe.category, fe.amount, fe.status, fe.da_te
     FROM friends_expenses fe
     JOIN friends f ON fe.friend_id = f.id
     WHERE fe.user_id = ?
     ORDER BY fe.da_te DESC
     LIMIT 5`,
    [req.params.user_id]
  );

  res.json(result);
});
//@desc detailed_to_collect list
const detailedPendingToCollect = asyncHandler(async(req,res) => {

const [result] = await pool.query(`
  SELECT fe.id, f.friend_name, fe.amount, fe.category, fe.da_te
  FROM friends_expenses fe
  JOIN friends f ON f.id = fe.friend_id
  WHERE fe.user_id = ? AND fe.friend_id = ? AND  fe.status = 'to_collect'
`, [req.params.user_id,req.params.friend_id]);


 res.json(result);

});

//@desc detailed_to_pay list 
const detailedPendingToPay = asyncHandler(async(req,res) => {

const [result] = await pool.query(`
  SELECT fe.id, f.friend_name, fe.amount, fe.category, fe.da_te
  FROM friends_expenses fe
  JOIN friends f ON f.id = fe.friend_id
  WHERE fe.user_id = ? AND fe.friend_id = ? AND fe.status = 'to_pay'
`, [req.params.user_id,req.params.friend_id]);


 res.json(result);

});

//@ desc  total to_collect from individual friend 
const PendingToCollectEachFriend = asyncHandler(async(req,res) => {

const [result] = await pool.query(`
  SELECT f.id AS friend_id, f.friend_name, Sum(fe.amount) AS total_amount 
  FROM friends_expenses fe
  JOIN friends f ON f.id = fe.friend_id
  WHERE fe.user_id = ? AND fe.status = 'to_collect'
  GROUP BY f.id,f.friend_name ORDER BY f.friend_name
`, [req.params.user_id]);


 res.json(result);

});

//@ desc  total to_Pay to  individual friend 
const PendingToPayEachFriend = asyncHandler(async(req,res) => {

const [result] = await pool.query(`
  SELECT f.id AS friend_id, f.friend_name, Sum(fe.amount) AS total_amount 
  FROM friends_expenses fe
  JOIN friends f ON f.id = fe.friend_id
  WHERE fe.user_id = ? AND fe.status = 'to_pay'
  GROUP BY f.id,f.friend_name ORDER BY f.friend_name
`, [req.params.user_id]);


 res.json(result);

});

const friendsDetailsPage  = asyncHandler(async(req,res) => {
  const [result] = await pool.query(`
  SELECT fe.id, f.friend_name, fe.amount, fe.category, fe.da_te
  FROM friends_expenses fe
  JOIN friends f ON f.id = fe.friend_id
  WHERE fe.user_id = ? AND f.id = ? 

    
`, [req.params.user_id,req.params.friend_id]);


 res.json(result);
  });






module.exports = {
  DeleteFriendExpenses,
  UpdateFriendExpenses,
  setFriendExpenses,
  getFriendsExpenses,
  pendingToCollect,
  pendingToPay,
  RecentActivity,
  detailedPendingToCollect,
  detailedPendingToPay,
  PendingToCollectEachFriend,
  PendingToPayEachFriend,
  friendsDetailsPage
};
