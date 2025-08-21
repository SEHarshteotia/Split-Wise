import { useState , useEffect } from "react";

function Collect(){
    
    const[friendsToCollect,setFriendsToCollect]=useState([]);
    const[loading,setLoading ] = useState(false); 

      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      useEffect(()=> {
        const fetchCollectData = async() => {  
           
           
           try{ 
            setLoading(true);
            const response =  await fetch(  `http://localhost:5000/api/friends_expenses/${userId}/collect/details`);
            if(!response.ok) {
                throw new Error ("failed to fetch");

            }
            const data  = await response.json();
            setFriendsToCollect(data);
            console.log("Fetched data:", data);
            }catch (err) {
            console.error("Error fetching collect data:", err);
            }finally {
          setLoading(false);
            }
            
        };
        fetchCollectData();
      },[userId])

       if (loading) {
      return <p className="text-center text-gray-600 mt-6">Loading pending collections...</p>;
  }







    return(<>

    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-green-800">💰 Friends Who Owe You</h1>

      {friendsToCollect.length === 0 ? (
        <p className="text-gray-600">No pending collections 🎉</p>
      ) : (
        <ul className="space-y-3">
          {friendsToCollect.map((friend) => (
            <li
              key={friend.id}
              className="bg-white shadow rounded-lg p-4 border flex justify-between"
            >
              <span className="font-medium text-gray-800">{friend.friend_name}</span>
              <span className="text-green-700 font-semibold">₹{friend.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>




    
    
    
    </>);
}
export default Collect;
