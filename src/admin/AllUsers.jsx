// src/pages/AllUsers.jsx
import React, { useEffect, useState } from "react";
import useCountUp from "../components/hook/UseCountUp"; // ✅ countup hook import
import Pagination from "../components/Pagination"; 

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://localhost:5000/users", {
          credentials: "include",
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);


   const totalPages = Math.ceil(users.length / resultsPerPage);
  const paginatedBills = users.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // ✅ Summary counts with countup
  const totalUsers = useCountUp(users.length, 1200);
  const totalAdmins = useCountUp(users.filter((u) => u.type === "admin").length, 1200);
  const totalCustomers = useCountUp(users.filter((u) => u.type === "customer").length, 1200);

  if (loading) {
    return <p className="p-6 dark:text-white">Loading users...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">All Users Details</h1>

      {/* ✅ Summary Cards with hover + countup */}
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition transform hover:scale-105 hover:shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Users</p>
          <p className="text-xl font-bold dark:text-white">{totalUsers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition transform hover:scale-105 hover:shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Admins</p>
          <p className="text-xl font-bold dark:text-white">{totalAdmins}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition transform hover:scale-105 hover:shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Customers</p>
          <p className="text-xl font-bold dark:text-white">{totalCustomers}</p>
        </div>
      </div>

      {/* ✅ Users Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Username</th>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Email</th>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Type</th>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Created At</th>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            { paginatedBills.length > 0 ? (
               paginatedBills.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 focus-within:bg-gray-100 dark:focus-within:bg-gray-600"
                >
                  <td className="px-6 py-4 dark:text-white">{user.username}</td>
                  <td className="px-6 py-4 dark:text-white">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.type === "admin" ? (
                      <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Customer
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 dark:text-white">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition transform hover:scale-105 focus:ring-2 focus:ring-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 dark:text-white">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
         {/* ✅ Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  );
}

export default AllUsers;
