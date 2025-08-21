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
    <main className="flex-1 p-10 space-y-10 overflow-y-auto">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-aos="fade-up">
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:scale-105 transition relative">
          <h2 className="text-gray-600 text-lg">Total Expenses</h2>
          <p className="text-black text-3xl font-bold">₹{TotalExpenses}</p>
          <button
            onClick={() => { setShowPopup(true); setShowIndividualForm(false); }}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >+ Add Expense</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition"   onClick={handleGoToCollect} >
          <h2 className="text-gray-600">Pending to Collect</h2>
          <p className="text-2xl font-bold text-green-600">{pendingCollect}</p>
          <p className="text-sm text-gray-600">Click to see who owes you money</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h2 className="text-gray-600">Pending to Pay</h2>
          <p className="text-2xl font-bold text-red-600">{pendingPay}</p>
          
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h2 className="text-gray-600">Friends</h2>
          <p className="text-2xl font-bold">{friends.length}</p>
           <button
            onClick={() => {  setShowAddFriendForm(true) }}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >+ Add Friend</button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow" data-aos="fade-up">
        <h2 className="font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-2 text-gray-700">
          {recentActivity.length === 0 ? (
            <li>No recent activity</li>
          ) : (
            recentActivity.map((exp) => (
              <li key={exp.id}>
              {exp.status === "to_collect" &&
              `✔️ Your friend ${exp.friend_name} owes you ₹${exp.amount} for ${exp.category} on ${new Date(exp.da_te).toLocaleDateString()}`}

              {exp.status === "to_pay" &&
              `✔️ You owe ${exp.friend_name} ₹${exp.amount} for ${exp.category} on ${new Date(exp.da_te).toLocaleDateString()}`}

              {exp.status === "settled" &&
               `✔️ You paid your split: ₹${exp.amount} for ${exp.category} on ${new Date(exp.da_te).toLocaleDateString()}`}

              </li>
            ))
          )}
        </ul>
      </div>


  




      {/* Add Expense Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
            {!showIndividualForm ? (
              <>
                <h2 className="text-xl text-black font-bold mb-6">Add Expense</h2>
                <div className="space-y-4">
                  <button onClick={() => { setShowFriendForm(true); setShowPopup(false); }}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
                    Add with a Friend
                  </button>
                  <button onClick={() => setShowIndividualForm(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                    Individual Expense
                  </button>
                  <button onClick={() => setShowPopup(false)}
                    className="mt-4 w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl text-black font-bold mb-6">Add Individual Expense</h2>
                <form onSubmit={handleIndividualSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 text-black w-full border rounded-lg p-2" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                      className="mt-1 w-full border text-black rounded-lg p-2" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}
                      className="text-black mt-1 w-full border rounded-lg p-2" required>
                      <option value="">Select category</option>
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Bills">Bills</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Save Expense</button>
                  <button type="button" onClick={() => setShowIndividualForm(false)}
                    className="w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition">Back</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Friend Expense Form */}
      {showFriendForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
            <h2 className="text-xl text-black font-bold mb-6">Add Friend Expense</h2>
            <form onSubmit={handleFriendSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 text-black w-full border rounded-lg p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full border text-black rounded-lg p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="text-black mt-1 w-full border rounded-lg p-2" required>
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Friend</label>
                {friends.length === 0 ? (
                  <div>
                    <p className="text-black">You don’t have any friends yet.</p>
                    <button onClick={() => setShowAddFriendForm(true)}>Add Friend</button>
                  </div>
                ) : (
                  <select value={selectedfriendid}
                    onChange={(e) => {
                      SetSelectedFriendId(e.target.value);
                      const friend = friends.find(f => f.id === parseInt(e.target.value));
                      SetSelectedFriendName(friend?.friend_name || "");
                    }} className="text-black w-full border rounded-lg p-2">
                    <option value="">Select Friend</option>
                    {friends.map(friend => (
                      <option key={friend.id} value={friend.id}>{friend.friend_name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                <select value={paymentType} onChange={(e) => SetPaymentType(e.target.value)}
                  className="text-black mt-1 w-full border rounded-lg p-2">
                  <option value="full">Full Pay</option>
                  <option value="split">Split</option>
                  <option value="friend">Friend</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Save Expense</button>
              <button type="button" onClick={() => { setShowFriendForm(false); setShowPopup(true); }}
                className="w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition">Back</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Friend Form */}
      {showAddFriendForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-bold text-black mb-4">Add New Friend</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch("http://localhost:5000/api/friends", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ user_id: userId, friend_name: newFriendName })
                });
                if (!response.ok) throw new Error("Failed to add Friend");
                const newFriend = await response.json();
                SetFriends((prev) => [...prev, newFriend]);
                setShowAddFriendForm(false);
              } catch (err) {
                console.error("Error adding friend:", err);
              }
            }} className="space-y-4">
              <input type="text" value={newFriendName} onChange={(e) => setNewFriendName(e.target.value)}
                className="w-full border p-2 text-black rounded-lg" placeholder="Enter friend's name" required />
              <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">Save Friend</button>
              <button type="button" onClick={() => setShowAddFriendForm(false)}
                className="w-full bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400 transition">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Main1;
