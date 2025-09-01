const {pool} = require("../Databse/Dbmysql");
const asyncHandler = require("express-async-handler");


//@desc getting all expenses from the group_expenses table 
const getGroupExpense = asyncHandler(async(req,res)=>{
    const {group_id} =req.params;
    const [result] = await pool.query("SELECT * FROM group_expenses WHERE group_id=?",[group_id]);
     if(result.length===0) {
       return  res.status(404).json({ ok: false, message: "No groups found for this user" })
    }
    
      res.json({ ok: true, data: result });

});

//@desc adding expenses in group_expenses table  
const AddExpenseToGroup = asyncHandler(async (req, res) => {
  const {
    paid_by_user_id,
    paid_by_friend_name,
    amount,
    category,
    description,
    expense_date,
    members = [],       // array of user_ids
    friend_names = []   // array of unregistered friends
  } = req.body;
  const { group_id } = req.params;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1️⃣ Insert main expense
    const [expenseresult] = await connection.query(
      `INSERT INTO group_expenses 
       (group_id, paid_by_user_id, paid_by_friend_name, amount, category, description, expense_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        group_id,
        paid_by_user_id || null,
        paid_by_friend_name || null,
        amount,
        category,
        description,
        expense_date
      ]
    );

    const expenseId = expenseresult.insertId;

    // 2️⃣ Auto-calculate equal splits
    const totalMembers = members.length + friend_names.length;
    if (totalMembers === 0) {
      throw new Error("No members provided for splitting");
    }

    const perPersonShare = parseFloat(amount) / totalMembers;

    const splitValues = [];

    // registered members
    members.forEach((uid) => {
      splitValues.push([expenseId, uid, null, perPersonShare]);
    });

    // unregistered friends
    friend_names.forEach((fname) => {
      splitValues.push([expenseId, null, fname, perPersonShare]);
    });

    // 3️⃣ Insert splits
    if (splitValues.length > 0) {
      await connection.query(
        `INSERT INTO group_expense_splits (group_expense_id, user_id, friend_name, share_amount) 
         VALUES ?`,
        [splitValues]
      );
    }

    await connection.commit();

    return res.json({
      ok: true,
      data: {
        id: expenseId,
        group_id,
        paid_by_user_id,
        paid_by_friend_name,
        amount,
        category,
        description,
        expense_date,
        per_person_share: perPersonShare,
        total_members: totalMembers,
        splits: splitValues
      }
    });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    return res.status(500).json({ ok: false, message: "Failed to add expense with splits" });
  } finally {
    connection.release();
  }
});




const updateGroupExpense = asyncHandler(async (req, res) => {
  const { id, group_id } = req.params;
  const { amount, category, description, members } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update group_expenses
    const [result] = await connection.query(
      "UPDATE group_expenses SET amount=?, category=?, description=? WHERE id=? AND group_id=?",
      [amount, category, description, id, group_id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ ok: false, message: "Expense not found" });
    }

    // Delete old splits
    await connection.query("DELETE FROM group_expense_splits WHERE group_expense_id=?", [id]);

    // Insert updated equal splits
    if (members && members.length > 0) {
      const share = (amount / members.length).toFixed(2);
      const splitValues = members.map((m) => [
        id,
        m.user_id || null,
        m.friend_name || null,
        share,
      ]);

      await connection.query(
        "INSERT INTO group_expense_splits (group_expense_id, user_id, friend_name, share_amount) VALUES ?",
        [splitValues]
      );
    }

    await connection.commit();
    res.json({ ok: true, message: "Expense updated successfully" });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to update expense" });
  } finally {
    connection.release();
  }
});

const deleteGroupExpense = asyncHandler(async (req, res) => {
  const { id, group_id } = req.params;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete splits first
    await connection.query("DELETE FROM group_expense_splits WHERE group_expense_id=?", [id]);

    // Delete main expense
    const [result] = await connection.query(
      "DELETE FROM group_expenses WHERE id=? AND group_id=?",
      [id, group_id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ ok: false, message: "Expense not found" });
    }

    await connection.commit();
    res.json({ ok: true, message: "Expense deleted successfully" });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to delete expense" });
  } finally {
    connection.release();
  }
});


module.exports = { getGroupExpense, AddExpenseToGroup, updateGroupExpense, deleteGroupExpense };












