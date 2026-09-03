
// src/admin/AddProducts.jsx

import React, { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import Pagination from "../components/Pagination";

const MAX_DIGITS = 8;
const MAX_QUANTITY = 10000;
const MAX_PRICE = 5000000;
const RESULTS_PER_PAGE = 5;

const EMPTY_ERRORS = {
  itemName: "",
  description: "",
  quantity: "",
  price: "",
  categoryId: "",
};

function AddProducts() {
  // ============================================================
  // ADD PRODUCT STATE
  // ============================================================

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // ============================================================
  // DATA
  // ============================================================

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // ============================================================
  // EDIT STATE
  // ============================================================

  const [editId, setEditId] = useState(null);
  const [editItemName, setEditItemName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState("");

  // ============================================================
  // ERRORS
  // ============================================================

  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [editErrors, setEditErrors] = useState(EMPTY_ERRORS);
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ============================================================
  // LOADING
  // ============================================================

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // ============================================================
  // REFS
  // ============================================================

  const imageInputRef = useRef(null);
  const editImageInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ============================================================
  // FETCH
  // ============================================================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/products`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (res.ok) {
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/categories`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (res.ok) {
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  }

  // ============================================================
  // NUMERIC INPUT
  // ============================================================

  function getNumericValue(value, decimal = false) {
    let cleaned = value.replace(/[^\d.]/g, "");

    if (!decimal) {
      cleaned = cleaned.replace(/\./g, "");

      return cleaned.length <= MAX_DIGITS
        ? cleaned
        : null;
    }

    const parts = cleaned.split(".");

    if (parts.length > 2) {
      cleaned = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    const [integer = "", decimalPart = ""] =
      cleaned.split(".");

    const digitCount =
      integer.length + decimalPart.length;

    return digitCount <= MAX_DIGITS
      ? cleaned
      : null;
  }

  // ============================================================
  // VALIDATION
  // ============================================================

  function validateProduct({
    name,
    description,
    quantity,
    price,
    category,
  }) {
    const newErrors = { ...EMPTY_ERRORS };

    const numericQuantity = Number(quantity);
    const numericPrice = Number(price);

    if (!name.trim()) {
      newErrors.itemName = "Product name is required.";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (quantity === "") {
      newErrors.quantity = "Quantity is required.";
    } else if (Number.isNaN(numericQuantity)) {
      newErrors.quantity = "Please enter a valid quantity.";
    } else if (numericQuantity < 0) {
      newErrors.quantity = "Quantity cannot be negative.";
    } else if (numericQuantity > MAX_QUANTITY) {
      newErrors.quantity = "Quantity cannot exceed 10,000.";
    }

    if (price === "") {
      newErrors.price = "Price is required.";
    } else if (Number.isNaN(numericPrice)) {
      newErrors.price = "Please enter a valid price.";
    } else if (numericPrice <= 0) {
      newErrors.price = "Price must be greater than 0.";
    } else if (numericPrice > MAX_PRICE) {
      newErrors.price = "Price cannot exceed 5,000,000.";
    }

    if (!category) {
      newErrors.categoryId = "Please select a category.";
    }

    return newErrors;
  }

  function hasErrors(errorObject) {
    return Object.values(errorObject).some(Boolean);
  }

  // ============================================================
  // IMAGE COMPRESSION
  // ============================================================

  async function compressImage(file) {
    if (!file) return null;

    try {
      return await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        initialQuality: 0.8,
      });
    } catch (error) {
      console.error("Image compression error:", error);
      return file;
    }
  }

  // ============================================================
  // ADD PRODUCT
  // ============================================================

  async function addProduct(e) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const validationErrors = validateProduct({
      name: itemName,
      description,
      quantity: availableQuantity,
      price,
      category: categoryId,
    });

    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    try {
      setIsAdding(true);

      const formData = new FormData();

      formData.append("itemName", itemName.trim());
      formData.append("description", description.trim());
      formData.append(
        "availableQuantity",
        Number(availableQuantity)
      );
      formData.append("price", Number(price));
      formData.append("categoryId", categoryId);

      if (image) {
        const compressedImage = await compressImage(image);

        if (compressedImage) {
          formData.append(
            "image",
            compressedImage,
            image.name
          );
        }
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/products`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error || "Failed to add product."
        );
        return;
      }

      resetAddForm();

      setSuccessMessage("Product added successfully.");
      alert("Product added successfully.");

      await fetchProducts();
    } catch (error) {
      console.error("Add product error:", error);

      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsAdding(false);
    }
  }

  // ============================================================
  // RESET ADD FORM
  // ============================================================

  function resetAddForm() {
    setItemName("");
    setDescription("");
    setAvailableQuantity("");
    setPrice("");
    setImage(null);
    setCategoryId("");

    setErrors({ ...EMPTY_ERRORS });
    setErrorMessage("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  // ============================================================
  // DELETE
  // ============================================================

  async function deleteProduct(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Failed to delete product."
        );
        return;
      }

      await fetchProducts();
      alert("Product deleted successfully.");
      
} catch (error) {
  console.error("Delete error:", error);
  alert("Failed to delete product. Please try again.");
}
  }

  // ============================================================
  // START EDIT
  // ============================================================

  function startEdit(product) {
    setSuccessMessage("");

    setEditId(product._id);
    setEditItemName(product.itemName || "");
    setEditDescription(product.description || "");

    setEditQuantity(
      product.availableQuantity ?? ""
    );

    setEditPrice(product.price ?? "");
    setEditImage(null);

    setEditCategoryId(
      product.category?._id || ""
    );

    setEditErrors({ ...EMPTY_ERRORS });
    setEditErrorMessage("");

    if (editImageInputRef.current) {
      editImageInputRef.current.value = "";
    }
  }

  // ============================================================
  // SAVE EDIT
  // ============================================================

  async function saveEdit(id) {
    setEditErrorMessage("");
    setSuccessMessage("");

    const validationErrors = validateProduct({
      name: editItemName,
      description: editDescription,
      quantity: editQuantity,
      price: editPrice,
      category: editCategoryId,
    });

    setEditErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    try {
      setIsUpdating(true);

      const formData = new FormData();

      formData.append(
        "itemName",
        editItemName.trim()
      );

      formData.append(
        "description",
        editDescription.trim()
      );

      formData.append(
        "availableQuantity",
        Number(editQuantity)
      );

      formData.append(
        "price",
        Number(editPrice)
      );

      formData.append(
        "categoryId",
        editCategoryId
      );

      if (editImage) {
        const compressedImage =
          await compressImage(editImage);

        if (compressedImage) {
          formData.append(
            "image",
            compressedImage,
            editImage.name
          );
        }
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const message =
          data?.error ||
          "Failed to update product.";

        if (isDuplicateNameError(message)) {
          setEditErrors((prev) => ({
            ...prev,
            itemName: message,
          }));

          setEditErrorMessage("");
        } else {
          setEditErrorMessage(message);
        }

        return;
      }

      setEditId(null);
      setEditImage(null);
      setEditErrors({ ...EMPTY_ERRORS });
      setEditErrorMessage("");

      setSuccessMessage(
        "Product updated successfully."
      );

      alert("Product updated successfully.");

      if (editImageInputRef.current) {
        editImageInputRef.current.value = "";
      }

      await fetchProducts();
    } catch (error) {
      console.error("Edit product error:", error);

      setEditErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.ceil(
    products.length / RESULTS_PER_PAGE
  );

  const paginatedProducts = products.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  // ============================================================
  // FIELD CLASS
  // ============================================================

  const fieldClass = (error) =>
    `w-full min-w-[120px] border px-2 py-1 rounded dark:text-black ${
      error
        ? "border-red-500"
        : "border-gray-300"
    }`;

  function isDuplicateNameError(message) {
    return /product with this name already exists|already exists|duplicate/i.test(
      message
    );
  }

  return (
    <div className="w-full min-w-0 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white">
        Add Product
      </h1>

      {successMessage && (
        <p className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
          {successMessage}
        </p>
      )}

      {/* ======================================================
          ADD PRODUCT
      ====================================================== */}

      <form
        onSubmit={addProduct}
        className="w-full bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md space-y-4 mb-8
                   transition transform hover:shadow-lg hover:scale-[1.01]"
      >
        {/* ITEM NAME */}

        <div className="w-full">
          <input
            className={`w-full border rounded px-3 py-2
              dark:bg-gray-700 dark:text-gray-200
              focus:outline-none focus:ring-2
              ${
                errors.itemName
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);

              setErrors((prev) => ({
                ...prev,
                itemName: "",
              }));

              setErrorMessage("");
              setSuccessMessage("");
            }}
          />

          {errors.itemName && (
            <ErrorText>
              {errors.itemName}
            </ErrorText>
          )}
        </div>

        {/* DESCRIPTION */}

        <div className="w-full">
          <textarea
            className={`w-full border rounded px-3 py-2
              dark:bg-gray-700 dark:text-gray-200
              focus:outline-none focus:ring-2
              ${
                errors.description
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);

              setErrors((prev) => ({
                ...prev,
                description: "",
              }));

              setErrorMessage("");
              setSuccessMessage("");
            }}
          />

          {errors.description && (
            <ErrorText>
              {errors.description}
            </ErrorText>
          )}
        </div>

        {/* QUANTITY */}

        <div className="w-full">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className={`w-full border rounded px-3 py-2
              dark:bg-gray-700 dark:text-gray-200
              focus:outline-none focus:ring-2
              ${
                errors.quantity
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            placeholder="Available Quantity"
            value={availableQuantity}
            onChange={(e) => {
              const value =
                getNumericValue(
                  e.target.value
                );

              if (value === null) {
                setErrors((prev) => ({
                  ...prev,
                  quantity:
                    "Quantity cannot contain more than 8 digits.",
                }));
                return;
              }

              setAvailableQuantity(value);

              setErrors((prev) => ({
                ...prev,
                quantity: "",
              }));

              setErrorMessage("");
              setSuccessMessage("");
            }}
          />

          {errors.quantity && (
            <ErrorText>
              {errors.quantity}
            </ErrorText>
          )}
        </div>

        {/* PRICE */}

        <div className="w-full">
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9.]*"
            className={`w-full border rounded px-3 py-2
              dark:bg-gray-700 dark:text-gray-200
              focus:outline-none focus:ring-2
              ${
                errors.price
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            placeholder="Price"
            value={price}
            onChange={(e) => {
              const value =
                getNumericValue(
                  e.target.value,
                  true
                );

              if (value === null) {
                setErrors((prev) => ({
                  ...prev,
                  price:
                    "Price cannot contain more than 8 digits.",
                }));
                return;
              }

              setPrice(value);

              setErrors((prev) => ({
                ...prev,
                price: "",
              }));

              setErrorMessage("");
              setSuccessMessage("");
            }}
          />

          {errors.price && (
            <ErrorText>
              {errors.price}
            </ErrorText>
          )}
        </div>

        {/* CATEGORY */}

        <div className="w-full">
          <select
            className={`w-full border rounded px-3 py-2
              dark:bg-gray-700 dark:text-gray-200
              focus:outline-none focus:ring-2
              ${
                errors.categoryId
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);

              setErrors((prev) => ({
                ...prev,
                categoryId: "",
              }));

              setErrorMessage("");
              setSuccessMessage("");
            }}
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {errors.categoryId && (
            <ErrorText>
              {errors.categoryId}
            </ErrorText>
          )}
        </div>

        {/* SERVER ERROR */}

        {errorMessage && (
          <ErrorText>
            {errorMessage}
          </ErrorText>
        )}

        {/* IMAGE */}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="w-full max-w-full text-gray-700 dark:text-gray-200
                     file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100"
          onChange={(e) =>
            setImage(
              e.target.files[0] || null
            )
          }
        />

        {/* ADD BUTTON */}

        <button
          type="submit"
          disabled={isAdding}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded
                     hover:bg-indigo-700 transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding
            ? "Adding Product..."
            : "Add Product"}
        </button>
      </form>

      {/* ======================================================
          PRODUCTS
      ====================================================== */}

      <h2 className="text-lg sm:text-xl font-semibold mb-4 dark:text-white">
        All Products
      </h2>

      {successMessage && (
        <p className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
          {successMessage}
        </p>
      )}

      {/* Responsive table wrapper */}

      <div className="w-full max-w-full overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-[900px] w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 dark:text-white">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Image
              </th>

              <th className="px-4 py-2 text-left whitespace-nowrap">
                Item Name
              </th>

              <th className="px-4 py-2 text-left whitespace-nowrap">
                Description
              </th>

              <th className="px-4 py-2 text-left whitespace-nowrap">
                Quantity
              </th>

              <th className="px-4 py-2 text-left whitespace-nowrap">
                Price
              </th>

              <th className="px-4 py-2 text-left whitespace-nowrap">
                Category
              </th>

              <th className="px-4 py-2 text-left whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product) => {
              const editing =
                editId === product._id;

              return (
                <tr
                  key={product._id}
                  className="border-t dark:text-white"
                >
                  {/* IMAGE */}

                  <td className="px-4 py-2 align-top">
                    {editing ? (
                      <input
                        ref={editImageInputRef}
                        type="file"
                        accept="image/*"
                        className="max-w-[220px]"
                        onChange={(e) =>
                          setEditImage(
                            e.target.files[0] ||
                              null
                          )
                        }
                      />
                    ) : product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.itemName}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>

                  {/* ITEM NAME */}

                  <td className="px-4 py-2 align-top">
                    {editing ? (
                      <div className="min-w-[180px]">
                        <input
                          value={editItemName}
                          onChange={(e) => {
                            setEditItemName(
                              e.target.value
                            );

                            setEditErrors(
                              (prev) => ({
                                ...prev,
                                itemName: "",
                              })
                            );

                            setEditErrorMessage("");
                          }}
                          className={fieldClass(
                            editErrors.itemName
                          )}
                        />

                        {editErrors.itemName && (
                          <ErrorText>
                            {editErrors.itemName}
                          </ErrorText>
                        )}
                      </div>
                    ) : (
                      product.itemName
                    )}
                  </td>

                  {/* DESCRIPTION */}

                  <td className="px-4 py-2 align-top">
                    {editing ? (
                      <div className="min-w-[220px]">
                        <textarea
                          value={editDescription}
                          onChange={(e) => {
                            setEditDescription(
                              e.target.value
                            );

                            setEditErrors(
                              (prev) => ({
                                ...prev,
                                description: "",
                              })
                            );

                            setEditErrorMessage("");
                          }}
                          className={fieldClass(
                            editErrors.description
                          )}
                        />

                        {editErrors.description && (
                          <ErrorText>
                            {editErrors.description}
                          </ErrorText>
                        )}
                      </div>
                    ) : (
                      <div className="max-w-[300px] break-words">
                        {product.description}
                      </div>
                    )}
                  </td>

                  {/* QUANTITY */}

                  <td className="px-4 py-2 align-top">
                    {editing ? (
                      <div className="min-w-[120px]">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={editQuantity}
                          onChange={(e) => {
                            const value =
                              getNumericValue(
                                e.target.value
                              );

                            if (value === null) {
                              setEditErrors(
                                (prev) => ({
                                  ...prev,
                                  quantity:
                                    "Quantity cannot contain more than 8 digits.",
                                })
                              );

                              return;
                            }

                            setEditQuantity(value);

                            setEditErrors(
                              (prev) => ({
                                ...prev,
                                quantity: "",
                              })
                            );

                            setEditErrorMessage("");
                          }}
                          className={fieldClass(
                            editErrors.quantity
                          )}
                        />

                        {editErrors.quantity && (
                          <ErrorText>
                            {editErrors.quantity}
                          </ErrorText>
                        )}
                      </div>
                    ) : (
                      product.availableQuantity
                    )}
                  </td>

                  {/* PRICE */}

                  <td className="px-4 py-2 align-top">
                    {editing ? (
                      <div className="min-w-[130px]">
                        <input
                          type="text"
                          inputMode="decimal"
                          pattern="[0-9.]*"
                          value={editPrice}
                          onChange={(e) => {
                            const value =
                              getNumericValue(
                                e.target.value,
                                true
                              );

                            if (value === null) {
                              setEditErrors(
                                (prev) => ({
                                  ...prev,
                                  price:
                                    "Price cannot contain more than 8 digits.",
                                })
                              );

                              return;
                            }

                            setEditPrice(value);

                            setEditErrors(
                              (prev) => ({
                                ...prev,
                                price: "",
                              })
                            );

                            setEditErrorMessage("");
                          }}
                          className={fieldClass(
                            editErrors.price
                          )}
                        />

                        {editErrors.price && (
                          <ErrorText>
                            {editErrors.price}
                          </ErrorText>
                        )}
                      </div>
                    ) : (
                      `$${product.price}`
                    )}
                  </td>

                  {/* CATEGORY */}

                  <td className="px-4 py-2 align-top">
                    {editing ? (
                      <div className="min-w-[160px]">
                        <select
                          value={editCategoryId}
                          onChange={(e) => {
                            setEditCategoryId(
                              e.target.value
                            );

                            setEditErrors(
                              (prev) => ({
                                ...prev,
                                categoryId: "",
                              })
                            );

                            setEditErrorMessage("");
                          }}
                          className={fieldClass(
                            editErrors.categoryId
                          )}
                        >
                          <option value="">
                            Select Category
                          </option>

                          {categories.map(
                            (category) => (
                              <option
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </option>
                            )
                          )}
                        </select>

                        {editErrors.categoryId && (
                          <ErrorText>
                            {editErrors.categoryId}
                          </ErrorText>
                        )}
                      </div>
                    ) : (
                      product.category?.name ||
                      "No category"
                    )}
                  </td>

                  {/* ACTIONS */}

                  <td className="px-4 py-2 align-top">
                    {editing ? (
                      <div className="flex flex-wrap gap-2 min-w-[160px]">
                        <button
                          type="button"
                          onClick={() =>
                            saveEdit(product._id)
                          }
                          disabled={isUpdating}
                          className="px-3 py-1 bg-green-600 text-white rounded
                                     hover:bg-green-700
                                     disabled:opacity-50"
                        >
                          {isUpdating
                            ? "Saving..."
                            : "Save"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditId(null);
                            setEditImage(null);
                            setEditErrors({
                              ...EMPTY_ERRORS,
                            });
                            setEditErrorMessage("");
                            setSuccessMessage("");
                          }}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-gray-400 text-white rounded
                                     hover:bg-gray-500"
                        >
                          Cancel
                        </button>

                        {editErrorMessage && (
                          <div className="w-full">
                            <ErrorText>
                              {editErrorMessage}
                            </ErrorText>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 min-w-[150px]">
                        <button
                          type="button"
                          onClick={() =>
                            startEdit(product)
                          }
                          className="px-3 py-1 bg-blue-600 text-white rounded
                                     hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteProduct(
                              product._id
                            )
                          }
                          className="px-3 py-1 bg-red-600 text-white rounded
                                     hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ======================================================
          PAGINATION
      ====================================================== */}

      <div className="w-full overflow-x-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

// ============================================================
// ERROR COMPONENT
// ============================================================

function ErrorText({ children }) {
  return (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
      {children}
    </p>
  );
}

export default AddProducts;






















// // src/admin/AddProducts.jsx
// import React, { useState, useEffect } from "react";

// import Pagination from "../components/Pagination";

// function AddProducts() {
//   const [itemName, setItemName] = useState("");
//   const [description, setDescription] = useState("");
//   const [availableQuantity, setAvailableQuantity] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState(null);
//   const [categoryId, setCategoryId] = useState("");
//   const [categories, setCategories] = useState([]);

//   const [products, setProducts] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [editItemName, setEditItemName] = useState("");
//   const [editDescription, setEditDescription] = useState("");
//   const [editQuantity, setEditQuantity] = useState("");
//   const [editPrice, setEditPrice] = useState("");
//   const [editImage, setEditImage] = useState(null);
//   const [editCategoryId, setEditCategoryId] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//   const resultsPerPage = 5; 

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, []);

//   async function fetchProducts() {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/products`, { credentials: "include" });
//       const data = await response.json();
//       setProducts(data);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   }

//   async function fetchCategories() {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/categories`, { credentials: "include" });
//       const data = await response.json();
//       setCategories(data);
//       console.log("Fetched categories:", data);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   }

//   async function addProduct(e) {
//     e.preventDefault();
//     if (!itemName || price <= 0 || availableQuantity < 0 || !categoryId) {
//       alert("Enter valid product details including category");
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append("itemName", itemName);
//       formData.append("description", description);
//       formData.append("availableQuantity", availableQuantity);
//       formData.append("price", price);
//       formData.append("categoryId", categoryId);
//       if (image) formData.append("image", image);

//       const res = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert("Product added!");
//         setItemName("");
//         setDescription("");
//         setAvailableQuantity("");
//         setPrice("");
//         setImage(null);
//         setCategoryId("");
//         fetchProducts();
//       } else {
//         alert(data.error || "Failed to add product");
//       }
//     } catch (err) {
//       console.error("Add error:", err);
//     }
//   }

//   async function deleteProduct(id) {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     try {
//       const res = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (res.ok) {
//         alert("Product deleted!");
//         fetchProducts();
//       }
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   }

//   function startEdit(p) {
//     setEditId(p._id);
//     setEditItemName(p.itemName);
//     setEditDescription(p.description);
//     setEditQuantity(p.availableQuantity);
//     setEditPrice(p.price);
//     setEditImage(null);
//     setEditCategoryId(p.category?._id || "");
//   }

//   async function saveEdit(id) {
//     try {
//       const formData = new FormData();
//       formData.append("itemName", editItemName);
//       formData.append("description", editDescription);
//       formData.append("availableQuantity", editQuantity);
//       formData.append("price", editPrice);
//       formData.append("categoryId", editCategoryId);
//       if (editImage) formData.append("image", editImage);

//       const res = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
//         method: "PUT",
//         body: formData,
//         credentials: "include",
//       });
//       if (res.ok) {
//         alert("Product updated!");
//         setEditId(null);
//         fetchProducts();
//       }
//     } catch (err) {
//       console.error("Edit error:", err);
//     }
//   }

//     // ✅ Pagination logic
//   const totalPages = Math.ceil(products.length / resultsPerPage);
//   const paginatedBills = products.slice(
//     (currentPage - 1) * resultsPerPage,
//     currentPage * resultsPerPage
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4 dark:text-white">Add Product</h1>

//       {/* Add Product Form */}
// <form
//   onSubmit={addProduct}
//   className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 mb-8 
//              transition transform hover:shadow-lg hover:scale-[1.01]"
// >
//   <input
//     className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 
//                focus:outline-none focus:ring-2 focus:ring-indigo-400 
//                hover:border-indigo-400 hover:shadow-sm 
//                transition duration-200"
//     placeholder="Item Name"
//     value={itemName}
//     onChange={(e) => setItemName(e.target.value)}
//     required
//   />

//   <textarea
//     className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 
//                focus:outline-none focus:ring-2 focus:ring-indigo-400 
//                hover:border-indigo-400 hover:shadow-sm 
//                transition duration-200"
//     placeholder="Description"
//     value={description}
//     onChange={(e) => setDescription(e.target.value)}
//   />

//   <input
//     type="number"
//     className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 
//                focus:outline-none focus:ring-2 focus:ring-indigo-400 
//                hover:border-indigo-400 hover:shadow-sm 
//                transition duration-200"
//     placeholder="Available Quantity"
//     value={availableQuantity}
//     onChange={(e) => setAvailableQuantity(e.target.value)}
//   />

//   <input
//     type="number"
//     className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 
//                focus:outline-none focus:ring-2 focus:ring-indigo-400 
//                hover:border-indigo-400 hover:shadow-sm 
//                transition duration-200"
//     placeholder="Price"
//     value={price}
//     onChange={(e) => setPrice(e.target.value)}
//     required
//   />

//   <select
//     className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 
//                focus:outline-none focus:ring-2 focus:ring-indigo-400 
//                hover:border-indigo-400 hover:shadow-sm 
//                transition duration-200"
//     value={categoryId}
//     onChange={(e) => setCategoryId(e.target.value)}
//     required
//   >
//     <option value="">Select Category</option>
//     {categories.map((c) => (
//       <option key={c._id} value={c._id}>
//         {c.name}
//       </option>
//     ))}
//   </select>

//   <input
//     type="file"
//     accept="image/*"
//     className="w-full text-gray-700 dark:text-gray-200 
//                file:mr-4 file:py-2 file:px-4 
//                file:rounded-full file:border-0 
//                file:text-sm file:font-semibold 
//                file:bg-indigo-50 file:text-indigo-700 
//                hover:file:bg-indigo-100 
//                transition duration-200"
//     onChange={(e) => setImage(e.target.files[0])}
//   />
// {/* 
// <div className="w-full">
//       <input
//         type="file"
//         accept="image/*"
//         className="w-full text-gray-700 dark:text-gray-200 
//                    file:mr-4 file:py-2 file:px-4 
//                    file:rounded-full file:border-0 
//                    file:text-sm file:font-semibold 
//                    file:bg-indigo-50 file:text-indigo-700 
//                    hover:file:bg-indigo-100 
//                    transition duration-200"
//         onChange={(e) => setImage(e.target.files[0])}
//       />


//       {image && (
//         <div className="mt-4">
//           <p className="text-sm text-gray-600 dark:text-gray-300">
//             Preview:
//           </p>
//           <img
//             src={URL.createObjectURL(image)}
//             alt="Selected preview"
//             className="mt-2 w-40 h-40 object-cover rounded-lg shadow-md"
//           />
//         </div>
//       )}
//     </div> */}
//   <button
//     type="submit"
//     className="w-full py-2 px-4 bg-indigo-600 text-white rounded 
//                hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 
//                transition duration-200 transform hover:scale-105"
//   >
//     Add Product
//   </button>
// </form>


//       {/* Products List */}
//       <h2 className="text-xl font-semibold mb-4 dark:text-white">All Products</h2>
//       <div className="overflow-x-auto rounded-lg shadow-md">
//       <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
//         <thead className="bg-gray-100 dark:bg-gray-700  dark:text-white">
//           <tr>
//             <th className="px-4 py-2 text-left">Image</th>
//             <th className="px-4 py-2 text-left">Item Name</th>
//             <th className="px-4 py-2 text-left">Description</th>
//             <th className="px-4 py-2 text-left">Quantity</th>
//             <th className="px-4 py-2 text-left">Price</th>
//             <th className="px-4 py-2 text-left">Category</th>
//             <th className="px-4 py-2 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedBills.map((p) => (
//             <tr key={p._id} className="border-t  dark:text-white">
//               <td className="px-4 py-2 ">
//                 {editId === p._id ? (
//                   <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} />
//                 ) : p.imageUrl ? (
//                   <img src={p.imageUrl} alt={p.itemName} className="h-16 w-16 object-cover rounded" />
//                 ) : (
//                   "No image"
//                 )}
//               </td>
//               <td className="px-4 py-2">
//                 {editId === p._id ? (
//                   <input value={editItemName} onChange={(e) => setEditItemName(e.target.value)} className="border px-2 py-1 rounded   dark:text-black " />
//                 ) : (
//                   p.itemName
//                 )}
//               </td>
//                             <td className="px-4 py-2">
//                 {editId === p._id ? (
//                   <textarea
//                     value={editDescription}
//                     onChange={(e) => setEditDescription(e.target.value)}
//                     className="border px-2 py-1 rounded   dark:text-black"
//                   />
//                 ) : (
//                   p.description
//                 )}
//               </td>
//               <td className="px-4 py-2">
//                 {editId === p._id ? (
//                   <input
//                     type="number"
//                     value={editQuantity}
//                     onChange={(e) => setEditQuantity(e.target.value)}
//                     className="border px-2 py-1 rounded   dark:text-black"
//                   />
//                 ) : (
//                   p.availableQuantity
//                 )}
//               </td>
//               <td className="px-4 py-2">
//                 {editId === p._id ? (
//                   <input
//                     type="number"
//                     value={editPrice}
//                     onChange={(e) => setEditPrice(e.target.value)}
//                     className="border px-2 py-1 rounded   dark:text-black"
//                   />
//                 ) : (
//                   `$${p.price}`
//                 )}
//               </td>
//               <td className="px-4 py-2">
//                 {editId === p._id ? (
//                   <select
//                     value={editCategoryId}
//                     onChange={(e) => setEditCategoryId(e.target.value)}
//                     className="border px-2 py-1 rounded   dark:text-black"
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((c) => (
//                       <option key={c._id} value={c._id}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                 ) : (
//                   p.category?.name || "No category"
//                 )}
//               </td>
//               <td className="px-4 py-2 space-x-2">
//                 {editId === p._id ? (
//                   <>
//                     <button
//                       onClick={() => saveEdit(p._id)}
//                       className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setEditId(null)}
//                       className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <button
//                       onClick={() => startEdit(p)}
//                       className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => deleteProduct(p._id)}
//                       className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                     >
//                       Delete
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//        {/* ✅ Pagination Component */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={(newPage) => setCurrentPage(newPage)}
//       />
//     </div>
//   );
// }

// export default AddProducts;





