import Login from "./Login.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./Registration.jsx";
import Dashboard from "./Dashboard.jsx";
import CollectPage from "./CollectPage.jsx";
import PayPage from "./PayPage.jsx";
import FriendDetailsCollectPage from "./FriendDetailsCollectPage.jsx";
import FriendDetailsPayPage from "./FriendDetailsPayPage.jsx";
import FriendsDetailsPage from "./FriendsDetailsPage.jsx";
import FriendsPage from "./FriendsPage.jsx";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/" />; // redirect to login if not logged in
  }
  return children; // render the protected page if logged in
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
    <Route path="/collect" element={  <ProtectedRoute><CollectPage /></ProtectedRoute>} />
    <Route path="/pay" element={<ProtectedRoute><PayPage /></ProtectedRoute>} />
    <Route path="/collect/:user_id/:friend_id" element={<ProtectedRoute><FriendDetailsCollectPage /></ProtectedRoute>}/>
     <Route path="/pay/:user_id/:friend_id" element={<ProtectedRoute><FriendDetailsPayPage /></ProtectedRoute>}/>
     <Route path="/friend/:userId}/:friendId" element={<ProtectedRoute><FriendsPage/></ProtectedRoute>}/>
   <Route
  path="/friendsexp/:user_id/details/:friend_id"
  element={<FriendsDetailsPage />}
  key={({ match }) => match.params.friend_id} // This ensures the component remounts on friend_id change
/>
       
   


      </Routes>
    </Router>
  );
}

export default App;


