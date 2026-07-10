import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
localStorage.setItem("user", JSON.stringify(data.user));


        if (data.user.type === "admin") {
          navigate("/admin");
        } else if (data.user.type === "customer") {
          navigate("/customer");
        } else {
          navigate("/login");
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Backend not reachable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-5">

      {/* Animated Background */}
      <div className="absolute inset-0">

        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-pink-500/30 blur-3xl animate-pulse"></div>

        <div
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl animate-bounce"
          style={{ animationDuration: "8s" }}
        ></div>

        <div
          className="absolute top-1/2 left-1/2 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"
          style={{
            transform: "translate(-50%,-50%)",
            animation: "pulse 6s infinite",
          }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-4xl shadow-lg">
            🔐
          </div>
        </div>

        <h1 className="text-center text-4xl font-extrabold text-white">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-gray-300">
          Sign in to continue
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-gray-200">
              Email
            </label>

            <input
              type="email"
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-300 outline-none transition duration-300 focus:scale-[1.02] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm text-gray-200">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-14 text-white placeholder-gray-300 outline-none transition duration-300 focus:scale-[1.02] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
              >
                {showPassword ? "🙈" : "👁"}
              </button>

            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-cyan-300 hover:text-white"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-xl transition duration-300 hover:scale-105 hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg
                  className="mr-2 h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                    opacity="0.3"
                  />
                  <path
                    d="M22 12a10 10 0 0 1-10 10"
                    stroke="white"
                    strokeWidth="4"
                  />
                </svg>

                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

        </form>

        {/* Divider */}
        <div className="my-7 flex items-center">
          <div className="h-px flex-1 bg-white/20"></div>
          <span className="px-4 text-sm text-gray-300">
            OR
          </span>
          <div className="h-px flex-1 bg-white/20"></div>
        </div>

        {/* Create Account */}
        <Link
          to="/create-account"
          className="block text-center text-cyan-300 transition hover:text-white"
        >
          Create New Account
        </Link>

      </div>


    </div>
  );
}

export default Login;




// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleLogin(e) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:5000/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//         credentials: "include",
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("role", data.user.type);
//         localStorage.setItem("username", data.user.username);

//         if (data.user.type === "admin") {
//           navigate("/admin");
//         } else if (data.user.type === "customer") {
//           navigate("/customer");
//         } else {
//           navigate("/login");
//         }
//       } else {
//         alert(data.error || "Login failed");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       alert("Backend not reachable. Check server.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
//       <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
//         <h1 className="mb-6 text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100">
//           Welcome Back
//         </h1>
//         <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
//           Please login to continue
//         </p>

//         <form onSubmit={handleLogin} className="space-y-5">
//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="john@doe.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
//                          shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm 
//                          dark:bg-gray-700 dark:text-gray-200"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="***************"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
//                          shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm 
//                          dark:bg-gray-700 dark:text-gray-200"
//             />
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md 
//                        hover:bg-indigo-700 focus:outline-none focus:ring-2 
//                        focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 
//                        transition-colors duration-300"
//           >
//             {loading ? "Logging in..." : "Log in"}
//           </button>
//         </form>

//         {/* Links */}
//         <div className="mt-6 text-center space-y-2">
//           <Link
//             className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-800 transition-colors"
//             to="/forgot-password"
//           >
//             Forgot your password?
//           </Link>
//           <br />
//           <Link
//             className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-800 transition-colors"
//             to="/create-account"
//           >
//             Create account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
