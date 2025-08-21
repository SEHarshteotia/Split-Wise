import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [name, setName] = useState("");       
  const [email, setEmail] = useState("");     
  const [password, setPassword] = useState(""); 
  const [message, setMessage] = useState(""); 

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-blend-color w-screen h-screen">
      <div className="bg-white h-190 w-150 justify-center items-center absolute top-50 border-10 border-b-gray-500 border-r-gray-500 rounded shadow-md">
        <div className="text-blue-600 text-4xl bg-gray-100 font-bold">Register</div>
        <form className="absolute top-50 left-30 block justify-center" onSubmit={handleRegister}>
          <label className="text-gray-600 text-3xl px-2 py-2">Name:</label>
          <br />
          <input
            className="bg-gray-200 font-serif text-black w-90 h-10 rounded"
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />
          <label className="text-gray-600 text-3xl px-2 py-2">Email:</label>
          <br />
          <input
            className="bg-gray-200 font-serif text-black w-90 h-10 rounded"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label className="text-gray-600 text-3xl px-2 py-2">Password:</label>
          <br />
          <input
            className="bg-gray-200 rounded text-black w-90 h-10"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <br />
          <button type="submit" className="text-white w-90 justify-center">
            Register
          </button>
         
          <p className="mt-8 text-blue-600 ">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
        </form>
        
        <p className="mt-4 text-center text-red-600">{message}</p>
      </div>
    </div>
  );
}

export default Registration;

