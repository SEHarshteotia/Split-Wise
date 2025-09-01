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
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL); 

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 animate-fadeInScale">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Register</h2>

        {message && (
          <p className="mb-4 text-center text-sm font-medium text-yellow-200">
            {message}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-white">
              Name
            </label>
            <input
              className="w-full px-4 py-2 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">
              Email
            </label>
            <input
              className="w-full px-4 py-2 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">
              Password
            </label>
            <input
              className="w-full px-4 py-2 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200 text-sm">
          Already have an account?{" "}
          <a href="/" className="font-semibold text-black hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Registration;


