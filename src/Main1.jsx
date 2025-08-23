import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Main1() {
  const navigate = useNavigate();
  const [TotalExpenses, setTotalExpenses] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showIndividualForm, setShowIndividualForm] = useState(false);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [showFriendForm, setShowFriendForm] = useState(false);
  const [friends, SetFriends] = useState([]);
  const [selectedfriendid, SetSelectedFriendId] = useState("");
  const [selectedfriendname, SetSelectedFriendName] = useState("");
  const [paymentType, SetPaymentType] = useState("full");
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [pendingCollect, setPendingCollect] = useState(0);
  const [pendingPay, setPendingPay] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;


   const handleGoToCollect = async () => {
    try {
      // Navigate directly — data will be fetched inside CollectPage
      navigate("/collect");
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };
     const handleGoToPay = async () => {
    try {
      // Navigate directly — data will be fetched inside CollectPage
      navigate("/pay");
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };
  
   const handleGoToFriends = async () => {
    try {
      // Navigate directly — data will be fetched inside Friendspage
      navigate("/friend/${userId}/${friendId}");
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  // Fetch total expenses every 5 seconds
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/expenses/${userId}/total`);
        if (!response.ok) throw new Error("Failed to fetch total expense");
        const Data = await response.json(); 
        setTotalExpenses(Data.total);
      } catch (err) {
        console.error("Error fetching total expense:", err);
      }
    };
    fetchTotal();
    const interval = setInterval(fetchTotal, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  // Fetch friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/friends/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        SetFriends(data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, [userId]);

  // Fetch pending collect/pay every 5 seconds
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const collectRes = await fetch(`http://localhost:5000/api/friends_expenses/${userId}/collect`);
        if (!collectRes.ok) throw new Error("Failed to fetch collect amount");
        const collectData = await collectRes.json();
        setPendingCollect(collectData.total_to_collect);

        const pendingRes = await fetch(`http://localhost:5000/api/friends_expenses/${userId}/pay`);
        if (!pendingRes.ok) throw new Error("Failed to fetch pay amount");
        const pendingData = await pendingRes.json();
        setPendingPay(pendingData.total_to_pay);
      } catch (err) {
        console.error("Error fetching pending amounts:", err);
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  // Fetch recent activity
  const fetchRecentActivity = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/friends_expenses/${userId}/recent`);
      if (!res.ok) throw new Error("Failed to fetch recent activity");
      const data = await res.json();
      setRecentActivity(data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching recent activity:", err);
    }
  };
  useEffect(() => {
    fetchRecentActivity();
  }, [userId]);

  // Handle individual expense submission
  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, amount: parseFloat(amount), da_te: date, category }),
      });
      if (!response.ok) throw new Error("Failed to save expense");
      const data = await response.json();

      const displayAmount = paymentType === "split" ? parseFloat(amount) / 2 : parseFloat(amount);

      setTotalExpenses((prev) => prev + displayAmount);
      setAmount("");
      setDate("");
      setCategory("");
      setShowIndividualForm(false);
      setShowPopup(false);

      setRecentActivity((prev) => {
        const newEntry = {
          id: data.id,
          friend_name: "",
          category,
          amount: displayAmount,
          payment_type: paymentType,
         
          da_te: date,
        };
        return [newEntry, ...prev].slice(0, 5);
      });
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  // Handle friend expense submission
  const handleFriendSubmit = async (e) => {
    e.preventDefault();
    try {
      let halfAmount = parseFloat(amount) / 2;
      const expenseData = {
        user_id: userId,
        friend_id: selectedfriendid,
        amount: halfAmount,
        da_te: date,
        category,
        payment_type: paymentType,
      };

      const response = await fetch(`http://localhost:5000/api/friends_expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
      if (!response.ok) throw new Error("Failed to save friend expense");
      const data = await response.json();
                      
        
       


// Update totals and pending amounts
if (paymentType === "split") {
  setTotalExpenses((prev) => prev + halfAmount);
} else if (paymentType === "full") {
  setTotalExpenses((prev) => prev + halfAmount);
  setPendingCollect((prev) => prev + halfAmount);
} else if (paymentType === "friend") {
  setTotalExpenses((prev) => prev + halfAmount);
  setPendingPay((prev) => prev + halfAmount);
}



       

      setRecentActivity((prev) => {
        const newEntry = {
          id: data.id,
          friend_name: selectedfriendname,
          category,
          amount: halfAmount,
          payment_type: paymentType,
          status:
            paymentType === "friend" ? "to_pay" : paymentType === "full" ?"to_collect" : "settled" ,
          da_te: date,
        };
        return [newEntry, ...prev].slice(0, 5);
      });

      setAmount("");
      setDate("");
      setCategory("");
      SetSelectedFriendId("");
      SetPaymentType("full");
      setShowFriendForm(false);
      setShowPopup(false);
    } catch (err) {
      console.error("Error saving friend expense:", err);
    }
  };

return (
  <main className="flex-1 p-10 space-y-10 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-100">
    {/* Quick Stats */}
    <div
      className="grid grid-cols-1 md:grid-cols-4 gap-6"
      data-aos="fade-up"
    >
      {/* Total Expenses */}
      <div className="bg-gradient-to-tr from-blue-600 to-blue-500 text-white p-8 rounded-2xl shadow-xl hover:scale-105 transition transform">
        <h2 className="text-blue-100 text-lg">Total Expenses</h2>
        <p className="text-4xl font-extrabold mt-2">₹{TotalExpenses}</p>
        <button
          onClick={() => {
            setShowPopup(true);
            setShowIndividualForm(false);
          }}
          className="mt-6 w-full bg-white text-blue-700 font-semibold py-2.5 rounded-lg hover:bg-blue-50 transition shadow"
        >
          + Add Expense
        </button>
      </div>

      {/* Pending to Collect */}
      <div
        className="bg-white p-8 rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer border border-green-100 hover:border-green-300 hover:shadow-2xl"
        onClick={handleGoToCollect}
      >
        <h2 className="text-gray-500">Pending to Collect</h2>
        <p className="text-3xl font-bold text-green-600">{pendingCollect}</p>
        <p className="text-sm text-gray-600 mt-2">
          Click to see who owes you 💸
        </p>
      </div>

      {/* Pending to Pay */}
      <div className="bg-white p-8 rounded-2xl shadow-xl hover:scale-105 transition border border-red-100 hover:border-red-300 hover:shadow-2xl" onClick={handleGoToPay }>
        <h2 className="text-gray-500">Pending to Pay</h2>
        <p className="text-3xl font-bold text-red-600">{pendingPay}</p>
        <p className="text-sm text-gray-600 mt-2">Keep track of dues ⚠️</p>
      </div>

      {/* Friends */}
      <div className="bg-gradient-to-tr from-green-500 to-green-400 text-white p-8 rounded-2xl shadow-xl hover:scale-105 transition"onClick={handleGoToFriends }>
        <h2 className="text-green-100">Friends</h2>
        <p className="text-3xl font-extrabold">{friends.length}</p>
          <button
           onClick={(e) => {
           e.stopPropagation(); // Prevent parent div click
            setShowAddFriendForm(true);
    }}
          className="mt-6 w-full bg-white text-green-700 font-semibold py-2.5 rounded-lg hover:bg-green-50 transition shadow"
        >
          + Add Friend
        </button>
      </div>
    </div>

    {/* Recent Activity */}
    <div
      className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100"
      data-aos="fade-up"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        Recent Activity
      </h2>
      <ul className="space-y-3 text-gray-700">
        {recentActivity.length === 0 ? (
          <li className="text-gray-500 italic">No recent activity</li>
        ) : (
          recentActivity.map((exp) => (
            <li
              key={exp.id}
              className="text-sm leading-relaxed bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
            >
              {exp.status === "to_collect" &&
                `✔️ Your friend ${exp.friend_name} owes you ₹${exp.amount} for ${exp.category} on ${new Date(
                  exp.da_te
                ).toLocaleDateString()}`}

              {exp.status === "to_pay" &&
                `✔️ You owe ${exp.friend_name} ₹${exp.amount} for ${exp.category} on ${new Date(
                  exp.da_te
                ).toLocaleDateString()}`}

              {exp.status === "settled" &&
                `✔️ You paid your split: ₹${exp.amount} for ${exp.category} on ${new Date(
                  exp.da_te
                ).toLocaleDateString()}`}
            </li>
          ))
        )}
      </ul>
    </div>




      {/* Popups */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm bg-black/30 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
            {!showIndividualForm ? (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                  Add Expense
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setShowFriendForm(true);
                      setShowPopup(false);
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    Add with a Friend
                  </button>
                  <button
                    onClick={() => setShowIndividualForm(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Individual Expense
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                  Add Individual Expense
                </h2>
                <form
                  onSubmit={handleIndividualSubmit}
                  className="space-y-4 text-left"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 w-full border rounded-lg p-2 text-black focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1 w-full border rounded-lg p-2 text-black focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 w-full border rounded-lg p-2 text-black focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Bills">Bills</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIndividualForm(false)}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    {/* Friend Expense Form */}
{showFriendForm && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50">
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center backdrop-blur-md">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-6">
        Add Friend Expense
      </h2>
      <form onSubmit={handleFriendSubmit} className="space-y-4 text-left">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 text-black w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full border text-black rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-black mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            required
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Friend */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Friend</label>
          {friends.length === 0 ? (
            <div>
              <p className="text-black mb-2">You don’t have any friends yet.</p>
              <button
                onClick={() => setShowAddFriendForm(true)}
                type="button"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Add Friend
              </button>
            </div>
          ) : (
            <select
              value={selectedfriendid}
              onChange={(e) => {
                SetSelectedFriendId(e.target.value);
                const friend = friends.find(
                  (f) => f.id === parseInt(e.target.value)
                );
                SetSelectedFriendName(friend?.friend_name || "");
              }}
              className="text-black w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Select Friend</option>
              {friends.map((friend) => (
                <option key={friend.id} value={friend.id}>
                  {friend.friend_name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Payment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => SetPaymentType(e.target.value)}
            className="text-black mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
          >
            <option value="full">Full Pay</option>
            <option value="split">Split</option>
            <option value="friend">Friend</option>
          </select>
        </div>

        {/* Buttons */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Save Expense
        </button>
        <button
          type="button"
          onClick={() => {
            setShowFriendForm(false);
            setShowPopup(true);
          }}
          className="w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Back
        </button>
      </form>
    </div>
  </div>
)}

{/* Add Friend Form */}
{showAddFriendForm && (
  <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm bg-black/30 z-50">
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent mb-6">
        Add New Friend
      </h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const response = await fetch("http://localhost:5000/api/friends", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: userId, friend_name: newFriendName }),
            });
            if (!response.ok) throw new Error("Failed to add Friend");
            const newFriend = await response.json();
            SetFriends((prev) => [...prev, newFriend]);
            setShowAddFriendForm(false);
          } catch (err) {
            console.error("Error adding friend:", err);
          }
        }}
        className="space-y-4"
      >
        <input
          type="text"
          value={newFriendName}
          onChange={(e) => setNewFriendName(e.target.value)}
          className="w-full border p-2 text-black rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
          placeholder="Enter friend's name"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Save Friend
        </button>
        <button
          type="button"
          onClick={() => setShowAddFriendForm(false)}
          className="w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
)}

    </main>
  );
}

export default Main1;
