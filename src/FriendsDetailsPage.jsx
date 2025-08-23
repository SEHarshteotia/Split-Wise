import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function FriendsDetailsPage() {
  const { user_id, friend_id } = useParams(); // Get user_id and friend_id from URL
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendName, setFriendName] = useState("");
  const navigate = useNavigate();

  // Function to fetch friend details
  const fetchFriendDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/friends_expenses/${user_id}/details/${friend_id}`
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      if (data.length > 0) {
        setFriendName(data[0].friend_name);
        setTransactions(data);
      } else {
        setFriendName("");
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to fetch data when user_id or friend_id changes
  useEffect(() => {
    fetchFriendDetails();
  }, [user_id, friend_id]);

  if (loading) {
    return (
      <p className="text-center text-gray-600 mt-6 animate-pulse">
        Loading transactions...
      </p>
    );
  }

  return (
    <main className="flex-1 p-10 space-y-8 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <section data-aos="fade-up" className="bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          💸 Transactions with {friendName || "this friend"}
        </h1>

        {transactions.length === 0 ? (
          <p className="text-gray-600 text-lg">No transactions found 🎉</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-gradient-to-tr from-blue-50 to-blue-100 rounded-xl p-6 shadow-md hover:shadow-2xl hover:scale-[1.02] transition transform"
              >
                <p className="text-gray-700 font-semibold">{tx.category}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(tx.da_te).toLocaleDateString()}
                </p>
                <p className="mt-4 text-2xl font-bold text-blue-600">
                  ₹{tx.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default FriendsDetailsPage;

