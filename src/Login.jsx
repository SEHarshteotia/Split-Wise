
     
    
import { useState } from "react";
import {  useNavigate } from "react-router-dom";


function Login() {
  const [Name, setName] = useState("Guest");
  const [Password, setPassword] = useState("Password");
  const [Message, setMessage] = useState("");
  const navigate  = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    console.log("UserName:", Name);
    console.log("Password:", Password);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: Name, // fixed
          password: Password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        setMessage("Login successful!");
       setTimeout  (()=> navigate("/dashboard") , 2000);
        console.log("Logged in user data:", data);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Try again.");
    }  
  };

  return (
    <div className="flex items-center justify-center bg-blend-color w-screen h-screen">
      <div className="bg-white h-190 w-150 justify-center items-center absolute top-50 border-10 border-b-gray-500 border-r-gray-500 rounded shadow-md">
        <div className="text-blue-600 text-4xl bg-gray-100 font-bold">Login In</div>
        <form className="absolute top-50 left-30 block justify-center" onSubmit={handleClick}>
          <label className="text-gray-600 text-3xl px-2 py-2">Email:</label>
          <br />
          <input
            className="bg-gray-200 font-serif text-black w-90 h-10 rounded"
            value={Name}
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <label className="text-gray-600 text-3xl px-2 py-2">Password:</label>
          <br />
          <input
            className="bg-gray-200 rounded text-black w-90 h-10"
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <p>
            <a className="text-gray-800 hover:text-black" href="#">
              Forget Password
            </a>
          </p>
          <br />
          <br />
          <br />
          <br />
          <button type="submit" className="text-white w-90 justify-center">
            Login
          </button>
                  <p className="mt-4 text-blue-600 top-10">
  Don't have an account?{" "}
  <a href="/register" className="text-blue-600 hover:underline">
    Register here
  </a>
</p>
        </form>

       
      </div>
    </div>
  );
}

export default Login;
