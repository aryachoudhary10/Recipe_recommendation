// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function SignupPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleSignup = async () => {
//     try {
//       await axios.post("http://127.0.0.1:8000/register", {
//         username,
//         password,
//       });
  
//       alert("Signup successful! Please log in.");
//       router.push("/login");
//     } catch (error: any) {
//       console.error("Signup error:", error);
  
//       // Fix: Ensure error response is properly accessed
//       const errorMessage =
//         error.response?.data?.detail || "Signup failed. Please try again.";
      
//       alert(errorMessage);
//     }
//   };
  
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
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
//         <button onClick={handleSignup} className="w-full bg-green-500 text-white p-2 rounded">
//           Sign Up
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("http://127.0.0.1:8000/register", { username, password });

      alert("Signup successful! Please log in.");
      router.push("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Create an Account 🚀</h2>

        {error && <p className="text-white text-sm text-center mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500  placeholder:text-gray-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500  placeholder:text-gray-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500  placeholder:text-gray-200"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700 transition-all"}`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="text-center mt-4">
          <p className="text-white text-sm">
            Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
