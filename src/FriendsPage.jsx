import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/friends/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        setFriends(data);
        console.log("Fetched friends:", data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchFriends();
  }, [userId]);

  if (loading) {
    return (
      <p className="text-center text-gray-600 mt-6 animate-pulse">
        Loading friends...
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
          👥 Your Friends
        </h1>

        {friends.length === 0 ? (
          <p className="text-gray-600 text-lg">No friends added yet 🎉</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <div
                key={friend.id}
                data-aos="fade-up"
                className="bg-gradient-to-tr from-blue-50 to-blue-100 rounded-xl p-6 shadow-md hover:shadow-2xl hover:scale-[1.02] transition transform cursor-pointer"  onClick={() =>
                  navigate(
                    `/friendsexp/${userId}/details/${friend.id}`
                  )
                }
               // navigate to friend's transactions page
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  {friend.friend_name}
                </h2>
                <p className="mt-2 text-gray-500">
                  {/* Optional: show number of transactions or summary */}
                  Friend ID: {friend.id}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default FriendsPage;
