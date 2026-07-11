import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const type = "customer";

  async function handleSignup(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          type,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(data.error || "Signup failed");
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

        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-pink-500/30 blur-3xl animate-pulse"></div>

        <div
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl animate-bounce"
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

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-4xl shadow-xl">
            👤
          </div>
        </div>

        <h1 className="text-center text-4xl font-bold text-white">
          Create Account
        </h1>

        <p className="mt-2 text-center text-gray-300">
          Join us today and start shopping.
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          {/* Username */}
          <div>
            <label className="mb-2 block text-sm text-gray-200">
              Username
            </label>

            <input
              type="text"
              placeholder="JohnDoe"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-300 outline-none transition duration-300 focus:scale-[1.02] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
            />
          </div>

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

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm text-gray-200">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="********"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-xl border bg-white/10 px-4 py-3 pr-14 text-white placeholder-gray-300 outline-none transition duration-300 focus:scale-[1.02]
                ${
                  confirmPassword.length > 0
                    ? password === confirmPassword
                      ? "border-green-400 focus:ring-green-400"
                      : "border-red-400 focus:ring-red-400"
                    : "border-white/20 focus:ring-cyan-400"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
              >
                {showConfirm ? "🙈" : "👁"}
              </button>

            </div>

            {confirmPassword && (
              <p
                className={`mt-2 text-sm ${
                  password === confirmPassword
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {password === confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          {/* Privacy */}
          <label className="flex cursor-pointer items-center gap-3 text-gray-200">
            <input
              type="checkbox"
              required
              className="h-5 w-5 accent-cyan-500"
            />

            <span className="text-sm">
              I agree to the Privacy Policy & Terms
            </span>
          </label>

          {/* Button */}
          <button
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 py-3 font-bold text-white shadow-xl transition duration-300 hover:scale-105 hover:shadow-cyan-500/50 disabled:opacity-70"
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
                    opacity=".3"
                  />
                  <path
                    d="M22 12a10 10 0 0 1-10 10"
                    stroke="white"
                    strokeWidth="4"
                  />
                </svg>

                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>

        </form>

        <div className="my-7 flex items-center">
          <div className="h-px flex-1 bg-white/20"></div>
          <span className="px-4 text-gray-300">OR</span>
          <div className="h-px flex-1 bg-white/20"></div>
        </div>

        <Link
          to="/login"
          className="block text-center text-cyan-300 transition hover:text-white"
        >
          Already have an account? Login
        </Link>

      </div>

 
    </div>
  );
}

export default CreateAccount;






// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function CreateAccount() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   // const [type, setType] = useState("customer"); // default
//   const type = "customer";

//   async function handleSignup(e) {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, email, password, type }), // ✅ type included
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("Account created successfully!");
//         navigate("/login");
//       } else {
//         alert(data.error || "Signup failed");
//       }
//     } catch (err) {
//       console.error("Signup error:", err);
//       alert("Backend not reachable. Check server.");
//     }
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
//       <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
//         <h1 className="mb-6 text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100">
//           Create Account
//         </h1>

//         <form onSubmit={handleSignup} className="space-y-5">
//           {/* Username */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
//               Username
//             </label>
//             <input
//               type="text"
//               placeholder="JohnDoe"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
//                          shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm 
//                          dark:bg-gray-700 dark:text-gray-200"
//             />
//           </div>

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

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               placeholder="***************"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 
//                          shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm 
//                          dark:bg-gray-700 dark:text-gray-200"
//             />
//           </div>

//           {/* Privacy Policy */}
//           <div className="flex items-center mt-4">
//             <input type="checkbox" required className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
//             <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
//               I agree to the <span className="underline">privacy policy</span>
//             </span>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md 
//                        hover:bg-indigo-700 focus:outline-none focus:ring-2 
//                        focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
//           >
//             Create Account
//           </button>
//         </form>

//         {/* Links */}
//         <p className="mt-6 text-center">
//           <Link
//             className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-800 transition-colors"
//             to="/login"
//           >
//             Already have an account? Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default CreateAccount;




