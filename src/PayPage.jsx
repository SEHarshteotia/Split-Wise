import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PayPage() {
  const [friendsToPay, setFriendsToPay] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchPayData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/friends_expenses/${userId}/pay/details/each`
        );
        if (!response.ok) throw new Error("failed to fetch");
        const data = await response.json();
        setFriendsToPay(data);
      } catch (err) {
        console.error("Error fetching collect data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchPayData();
  }, [userId]);

  if (loading) {
    return (
      <p className="text-center text-gray-600 mt-6 animate-pulse">
        Loading pending collections...
      </p>
    );
  }

  return (
    <main className="flex-1 p-10 space-y-8 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <section
        data-aos="fade-up"
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          💰 Friends  You Owe
        </h1>

        {friendsToPay.length === 0 ? (
          <p className="text-gray-600 text-lg">No pending Payments 🎉</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friendsToPay.map((friend) => (
              <div
                key={friend.friend_id}
                data-aos="fade-up"
                className="bg-gradient-to-tr from-green-50 to-green-100 rounded-xl p-6 shadow-md hover:shadow-2xl hover:scale-[1.02] transition transform cursor-pointer"
                onClick={() =>
                  navigate(
                    `/pay/${userId}/${friend.friend_id}`
                  )
                }
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  {friend.friend_name}
                </h2>
                <p className="mt-4 text-2xl font-bold text-green-600">
                  ₹{friend.total_amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default PayPage;