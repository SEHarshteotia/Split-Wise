import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [Name, setName] = useState("Guest");
  const [Password, setPassword] = useState("Password");
  const [Message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    console.log("UserName:", Name);
    console.log("Password:", Password);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: Name,
          password: Password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token",data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setMessage("Login successful!");
        setTimeout(() => navigate("/dashboard"), 2000);
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>

        {Message && (
          <p className="mb-4 text-center text-sm font-medium text-yellow-200">
            {Message}
          </p>
        )}

        <form onSubmit={handleClick} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-white">
              Email
            </label>
            <input
              className="w-full px-4 py-2 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={Name}
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">
              Password
            </label>
            <input
              className="w-full px-4 py-2 text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-between text-sm text-white">
            <a href="#" className="hover:underline ">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="font-semibold text-black hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;

