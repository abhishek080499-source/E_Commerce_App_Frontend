// src/pages/Payment.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "../components/customerComponents/CustomerNavbar";
import Footer from "../components/customerComponents/Footer";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice"; // ✅ Redux action

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Redux cart is the single source of truth
  const cartItems = useSelector((state) => state.cart.items);

  const [grandTotal, setGrandTotal] = useState(0);
  const [billGenerated, setBillGenerated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [billNumber, setBillNumber] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Get logged-in user info
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  // ✅ Initialize customer info from localStorage or user object
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = JSON.parse(localStorage.getItem("customerInfo"));
    return (
      savedCustomer || {
        name: user?.username || "",
        address: "",
        phone: "",
        email: user?.email || "",
        pincode: "",
      }
    );
  });

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setGrandTotal(total);
  }, [cartItems]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    try {
      // ✅ Save customer info
      localStorage.setItem("customerInfo", JSON.stringify(customer));

      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/payment/pay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            customerName: customer.name,
            address: customer.address,
            phone: customer.phone,
            email: customer.email,
            pincode: customer.pincode,
            items: cartItems, 
            grandTotal,
          }),
        }
      );

      if (!res.ok) throw new Error("Payment request failed");
      const data = await res.json();

      setBillNumber(data.bill.billNumber);
      setPdfUrl(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${data.pdfUrl}`
      );
      setBillGenerated(true);

      // ✅ Clear cart via Redux
      dispatch(clearCart());

      setTimeout(() => {
        navigate("/customer");
      }, 15000);
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed!");
    }
  };

  const downloadInvoice = () => {
    window.open(pdfUrl, "_blank");
  };

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/auth/logout`,
        { method: "POST", credentials: "include" }
      );
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("customerInfo");
    localStorage.removeItem("theme");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <CustomerNavbar
        username={username}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex-grow p-6 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Payment Page
        </h2>

        {!billGenerated ? (
          <>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Bill Details
            </h4>

            {/* Customer Form */}
            <div className="space-y-4">
              {[
                { name: "name", label: "Full Name", type: "text", placeholder: "Enter your name" },
                { name: "address", label: "Address", type: "text", placeholder: "Enter your address" },
                { name: "phone", label: "Mobile Number", type: "number", placeholder: "Enter your mobile number" },
                { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
                { name: "pincode", label: "Pincode", type: "number", placeholder: "Enter your pincode" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={customer[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 
                               text-gray-900 dark:text-white 
                               focus:ring-2 focus:ring-blue-500 focus:outline-none 
                               transition hover:border-blue-400"
                  />
                </div>
              ))}
            </div>

            {/* Cart Table */}
            <div className="overflow-x-auto mt-6">
              <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2">Price (₹)</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 dark:text-white">
                  {cartItems.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <td className="px-3 py-2">{item.itemName}</td>
                      <td className="px-3 py-2">₹{item.price}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                      <td className="px-3 py-2">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h5 className="mt-4 font-bold text-gray-900 dark:text-white">
              Grand Total: ₹{grandTotal}
            </h5>

            <button
              onClick={handlePayment}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded mt-6 transition font-semibold w-full md:w-auto"
            >
              ✅ Confirm Payment
            </button>
          </>
        ) : (
          <div className="mt-6 border p-6 rounded bg-green-50 dark:bg-green-900">
            <h4 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
              ✅ Payment Successful!
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              Your bill has been generated and stored in backend.
            </p>
            <p><strong>Bill Number:</strong> {billNumber}</p>
            <p><strong>Customer Name:</strong> {customer.name}</p>
            <p><strong>Address:</strong> {customer.address}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>Total Paid:</strong> ₹{grandTotal}</p>

            {pdfUrl && (
              <button
                onClick={downloadInvoice}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mt-4 transition"
              >
                📄 Download Invoice PDF
              </button>
            )}

            <button
              onClick={() => navigate("/customer")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded mt-4 transition"
            >
              ⬅ Back to Customer Home
            </button>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Redirecting you to Customer Home in 15 seconds...
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Payment;
