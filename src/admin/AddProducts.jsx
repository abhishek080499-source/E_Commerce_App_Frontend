// src/admin/AddProducts.jsx
import React, { useState, useEffect } from "react";

import Pagination from "../components/Pagination";

function AddProducts() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editItemName, setEditItemName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5; 

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:5000/products", { credentials: "include" });
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:5000/categories", { credentials: "include" });
      const data = await response.json();
      setCategories(data);
      console.log("Fetched categories:", data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  async function addProduct(e) {
    e.preventDefault();
    if (!itemName || price <= 0 || availableQuantity < 0 || !categoryId) {
      alert("Enter valid product details including category");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("itemName", itemName);
      formData.append("description", description);
      formData.append("availableQuantity", availableQuantity);
      formData.append("price", price);
      formData.append("categoryId", categoryId);
      if (image) formData.append("image", image);

      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        alert("Product added!");
        setItemName("");
        setDescription("");
        setAvailableQuantity("");
        setPrice("");
        setImage(null);
        setCategoryId("");
        fetchProducts();
      } else {
        alert(data.error || "Failed to add product");
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        alert("Product deleted!");
        fetchProducts();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  function startEdit(p) {
    setEditId(p._id);
    setEditItemName(p.itemName);
    setEditDescription(p.description);
    setEditQuantity(p.availableQuantity);
    setEditPrice(p.price);
    setEditImage(null);
    setEditCategoryId(p.category?._id || "");
  }

  async function saveEdit(id) {
    try {
      const formData = new FormData();
      formData.append("itemName", editItemName);
      formData.append("description", editDescription);
      formData.append("availableQuantity", editQuantity);
      formData.append("price", editPrice);
      formData.append("categoryId", editCategoryId);
      if (editImage) formData.append("image", editImage);

      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (res.ok) {
        alert("Product updated!");
        setEditId(null);
        fetchProducts();
      }
    } catch (err) {
      console.error("Edit error:", err);
    }
  }

    // ✅ Pagination logic
  const totalPages = Math.ceil(products.length / resultsPerPage);
  const paginatedBills = products.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Add Product</h1>

      {/* Add Product Form */}
<form
  onSubmit={addProduct}
  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 mb-8 
             transition transform hover:shadow-lg hover:scale-[1.01]"
>
  <input
    className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 
               focus:outline-none focus:ring-2 focus:ring-indigo-400 
               hover:border-indigo-400 hover:shadow-sm 
               transition duration-200"
    placeholder="Item Name"
    value={itemName}
    onChange={(e) => setItemName(e.target.value)}
    required
  />

  <textarea
    className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 
               focus:outline-none focus:ring-2 focus:ring-indigo-400 
               hover:border-indigo-400 hover:shadow-sm 
               transition duration-200"
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />

  <input
    type="number"
    className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 
               focus:outline-none focus:ring-2 focus:ring-indigo-400 
               hover:border-indigo-400 hover:shadow-sm 
               transition duration-200"
    placeholder="Available Quantity"
    value={availableQuantity}
    onChange={(e) => setAvailableQuantity(e.target.value)}
  />

  <input
    type="number"
    className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 
               focus:outline-none focus:ring-2 focus:ring-indigo-400 
               hover:border-indigo-400 hover:shadow-sm 
               transition duration-200"
    placeholder="Price"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    required
  />

  <select
    className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 
               focus:outline-none focus:ring-2 focus:ring-indigo-400 
               hover:border-indigo-400 hover:shadow-sm 
               transition duration-200"
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
    required
  >
    <option value="">Select Category</option>
    {categories.map((c) => (
      <option key={c._id} value={c._id}>
        {c.name}
      </option>
    ))}
  </select>

  <input
    type="file"
    accept="image/*"
    className="w-full text-gray-700 dark:text-gray-200 
               file:mr-4 file:py-2 file:px-4 
               file:rounded-full file:border-0 
               file:text-sm file:font-semibold 
               file:bg-indigo-50 file:text-indigo-700 
               hover:file:bg-indigo-100 
               transition duration-200"
    onChange={(e) => setImage(e.target.files[0])}
  />

  <button
    type="submit"
    className="w-full py-2 px-4 bg-indigo-600 text-white rounded 
               hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 
               transition duration-200 transform hover:scale-105"
  >
    Add Product
  </button>
</form>


      {/* Products List */}
      <h2 className="text-xl font-semibold mb-4 dark:text-white">All Products</h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700  dark:text-white">
          <tr>
            <th className="px-4 py-2 text-left">Image</th>
            <th className="px-4 py-2 text-left">Item Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBills.map((p) => (
            <tr key={p._id} className="border-t  dark:text-white">
              <td className="px-4 py-2 ">
                {editId === p._id ? (
                  <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} />
                ) : p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.itemName} className="h-16 w-16 object-cover rounded" />
                ) : (
                  "No image"
                )}
              </td>
              <td className="px-4 py-2">
                {editId === p._id ? (
                  <input value={editItemName} onChange={(e) => setEditItemName(e.target.value)} className="border px-2 py-1 rounded   dark:text-black " />
                ) : (
                  p.itemName
                )}
              </td>
                            <td className="px-4 py-2">
                {editId === p._id ? (
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border px-2 py-1 rounded   dark:text-black"
                  />
                ) : (
                  p.description
                )}
              </td>
              <td className="px-4 py-2">
                {editId === p._id ? (
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="border px-2 py-1 rounded   dark:text-black"
                  />
                ) : (
                  p.availableQuantity
                )}
              </td>
              <td className="px-4 py-2">
                {editId === p._id ? (
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="border px-2 py-1 rounded   dark:text-black"
                  />
                ) : (
                  `$${p.price}`
                )}
              </td>
              <td className="px-4 py-2">
                {editId === p._id ? (
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="border px-2 py-1 rounded   dark:text-black"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  p.category?.name || "No category"
                )}
              </td>
              <td className="px-4 py-2 space-x-2">
                {editId === p._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(p._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(p)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
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

export default AddProducts;


