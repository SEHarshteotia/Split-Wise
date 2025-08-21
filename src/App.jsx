import Login from "./Login.jsx";
import NavBar from "./NavBar.jsx";
import { BrowserRouter as Router , Routes , Route,Navigate } from "react-router-dom";
import Dashboard from "./dashboard.jsx";
import Registration from "./Registration.jsx";

function ProtectedRoute({children}){
  const  user = localStorage.getItem("user");
  if(!user){
    return <Navigate to ="/" />   //redirect to login if not logged in 

  }
  return children; // render  the protected page if logged in 
}




function App() {



  return(

 <>
<Router>
 <NavBar/>
 <Routes>

 <Route path  = "/" element = {<Login/>}  />
   <Route path="/register" element={<Registration />} />
 <Route path = "/dashboard" element =<ProtectedRoute>{<Dashboard/>} </ProtectedRoute>  />
 
 </Routes>
 </Router>

 </>
  


  );
 
}

export default App
