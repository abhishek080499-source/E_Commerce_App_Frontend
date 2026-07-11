// src/pages/Bills.jsx
import React, { useEffect, useState } from "react";
import useCountUp from "../components/hook/UseCountUp"; // ✅ countup hook import
import Pagination from "../components/Pagination"


function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBill, setExpandedBill] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

   const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5; 

  useEffect(() => {
    async function fetchBills() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/payment/all`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setBills(data.bills);
        }
      } catch (err) {
        console.error("Error fetching bills:", err);
        setBills([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []);

useEffect(() => {
  setCurrentPage(1);
}, [startDate, endDate]);


  // Filter bills by date range
  const filteredBills = bills.filter((bill) => {
    const billDate = new Date(bill.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && billDate < start) return false;
    if (end && billDate > end) return false;
    return true;
  });

    const totalPages = Math.ceil(filteredBills.length / resultsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // ✅ Summary counts with countup
  const totalBills = useCountUp(filteredBills.length, 1200);
  const totalAmount = useCountUp(
    filteredBills.reduce((sum, b) => sum + b.grandTotal, 0),
    1200
  );
  const uniqueCustomers = useCountUp(
    new Set(filteredBills.map((b) => b.customerName)).size,
    1200
  );

  if (loading) {
    return <p className="p-6 dark:text-white">Loading bills...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">All Bills Details</h1>

      {/* Date filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      {/* ✅ Summary Cards with hover + countup */}
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition transform hover:scale-105 hover:shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Bills</p>
          <p className="text-xl font-bold dark:text-white">{totalBills}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition transform hover:scale-105 hover:shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Total Amount</p>
          <p className="text-xl font-bold dark:text-white">₹{totalAmount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition transform hover:scale-105 hover:shadow-lg">
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Unique Customers</p>
          <p className="text-xl font-bold dark:text-white">{uniqueCustomers}</p>
        </div>
      </div>

      {/* ✅ Bills Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Bill Number</th>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Customer</th>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Phone</th>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Total (₹)</th>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Created At</th>
              <th className="px-6 py-3 text-left text-sm sm:text-base dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {paginatedBills.length > 0 ? (
              paginatedBills.map((bill) => (
                <React.Fragment key={bill._id}>
                  <tr className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 focus-within:bg-gray-100 dark:focus-within:bg-gray-600">
                    <td className="px-6 py-4 dark:text-white">{bill.billNumber}</td>
                    <td className="px-6 py-4 dark:text-white">{bill.customerName}</td>
                    <td className="px-6 py-4 dark:text-white">{bill.phone}</td>
                    <td className="px-6 py-4 dark:text-white">₹{bill.grandTotal}</td>
                    <td className="px-6 py-4 dark:text-white">
                      {new Date(bill.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() =>
                          setExpandedBill(expandedBill === bill._id ? null : bill._id)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs sm:text-sm transition transform hover:scale-105 focus:ring-2 focus:ring-green-400"
                      >
                        {expandedBill === bill._id ? "Hide Details" : "Show Details"}
                      </button>
                      <a
                        href={`http://localhost:5000/payment/invoice/${bill.billNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs sm:text-sm transition transform hover:scale-105 focus:ring-2 focus:ring-blue-400 inline-block"
                      >
                        Download PDF
                      </a>
                    </td>
                  </tr>

                  {expandedBill === bill._id && (
                    <tr>
                      <td colSpan="6" className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                        <h4 className="font-semibold mb-2 dark:text-white">Products:</h4>
                        <ul className="list-disc list-inside dark:text-gray-200">
                          {bill.items.map((item, idx) => (
                            <li key={idx}>
                              {item.productName} (x{item.quantity}) – ₹{item.price}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 dark:text-white">
                  No bills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  );
}

export default Bills;
