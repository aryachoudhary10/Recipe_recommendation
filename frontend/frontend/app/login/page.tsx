// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/login", {
//         username,
//         password,
//       });
  
//       localStorage.setItem("token", response.data.access_token);
//       alert("Login successful!");
//       router.push("/");
//     } catch (error: any) {
//       console.error("Login error:", error);
  
//       // Fix: Ensure error response is properly accessed
//       const errorMessage =
//         error.response?.data?.detail || "Login failed. Please try again.";
      
//       alert(errorMessage);
//     }
//   };
  

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           className="w-full p-2 mb-3 border border-gray-300 rounded"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 mb-3 border border-gray-300 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded">
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      alert("Login successful!");
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.response?.data?.detail || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Welcome Back! 👋</h2>
        
        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 transition-all"}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">
            Forgot password? <a href="#" className="text-blue-500 hover:underline">Reset here</a>
          </p>
          <p className="text-gray-500 text-sm">
            New here? <a href="/signup" className="text-blue-500 hover:underline">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}
