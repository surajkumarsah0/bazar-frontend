import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI, orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [, setLoading] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', stock: '', categoryId: '', image: '', brand: '', discountPrice: '', images: '', featured: false
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  // Confirmation modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => {});
  const [confirmMessage, setConfirmMessage] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        productAPI.getAll({ limit: 100 }),
        categoryAPI.getAll(),
        orderAPI.getAllOrders()
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Product submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productAPI.update(editingId, productForm);
        toast.success('Product updated successfully');
      } else {
        await productAPI.create(productForm);
        toast.success('Product created successfully');
      }
      setProductForm({
        name: '', description: '', price: '', stock: '', categoryId: '', image: '', brand: '', discountPrice: '', images: '', featured: false
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  // Category submit
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoryAPI.update(editingId, categoryForm);
        toast.success('Category updated successfully');
      } else {
        await categoryAPI.create(categoryForm);
        toast.success('Category created successfully');
      }
      setCategoryForm({ name: '', description: '' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  // Delete Product
  const deleteProduct = (id) => {
    setConfirmMessage('Are you sure you want to delete this product?');
    setConfirmAction(() => async () => {
      try {
        await productAPI.delete(id);
        toast.success('Product deleted');
        fetchData();
      } catch (error) {
        toast.error('Delete failed');
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  // Delete Category
  const deleteCategory = (id) => {
    setConfirmMessage('Are you sure you want to delete this category?');
    setConfirmAction(() => async () => {
      try {
        await categoryAPI.delete(id);
        toast.success('Category deleted');
        fetchData();
      } catch (error) {
        toast.error('Delete failed');
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  // Edit product
  const editProduct = (product) => {
    setProductForm(product);
    setEditingId(product.id);
    setActiveTab('products');
  };

  // Edit category
  const editCategory = (category) => {
    setCategoryForm(category);
    setEditingId(category.id);
    setActiveTab('categories');
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-body">
      <div className="container mx-auto px-4 mt-12 ">
        <h1 className="text-4xl md:text-4xl font-bold font-heading mb-8 text-center text-[#0b3d91]">
          ADMIN DASHBOARD
        </h1>
        <div className="w-24 h-1 bg-[#fef250] mx-auto mb-6 rounded"></div>

        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap border-b">
            {['products', 'categories', 'orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold font-heading transition ${activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'products' && ` (${products.length})`}
                {tab === 'categories' && ` (${categories.length})`}
                {tab === 'orders' && ` (${orders.length})`}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <h1 className="text-2xl font-bold font-heading mb-6">
                  {editingId ? 'Edit' : 'Add'} Product
                </h1>
                <form onSubmit={handleProductSubmit} className="grid md:grid-cols-2 gap-4 mb-8">
                  {['name', 'price', 'stock', 'brand', 'image', 'discountPrice'].map((field) => (
                    <input
                      key={field}
                      type={field === 'price' || field === 'stock' || field === 'discountPrice' ? 'number' : 'text'}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={productForm[field]}
                      onChange={(e) => setProductForm({ ...productForm, [field]: e.target.value })}
                      required={field !== 'brand' && field !== 'image' && field !== 'discountPrice'}
                      className="px-4 py-2 border rounded-lg font-body"
                    />
                  ))}
                  <input
                    type="text"
                    placeholder="Additional Images (comma separated URLs)"
                    value={productForm.images}
                    onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                    className="px-4 py-2 border rounded-lg font-body md:col-span-2"
                  />
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg font-body"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="px-4 py-2 border rounded-lg md:col-span-2 font-body"
                    rows="3"
                  />
                  <label className="flex items-center gap-2 md:col-span-2">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-body">Featured Product</span>
                  </label>
                  <div className="md:col-span-2 flex gap-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-button">
                      {editingId ? 'Update' : 'Create'} Product
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setProductForm({
                            name: '', description: '', price: '', stock: '', categoryId: '', image: '', brand: '', discountPrice: '', images: '', featured: false
                          });
                        }}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-button"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <h3 className="text-xl font-bold font-heading mb-4">All Products</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 font-heading">
                      <tr>
                        {['Name', 'Category', 'Price', 'Stock', 'Actions'].map((col) => (
                          <th key={col} className="px-4 py-3 text-left">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="font-body">
                      {products.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3">{product.Category?.name}</td>
                          <td className="px-4 py-3">Rs.{product.price}</td>
                          <td className="px-4 py-3">{product.stock}</td>
                          <td className="px-4 py-3 flex gap-2">
                            <button onClick={() => editProduct(product)} className="text-blue-600 hover:text-blue-700 font-body">Edit</button>
                            <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-700 font-body">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <h2 className="text-2xl font-bold font-heading mb-6">{editingId ? 'Edit' : 'Add'} Category</h2>
                <form onSubmit={handleCategorySubmit} className="max-w-md mb-8 space-y-4">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg font-body"
                  />
                  <textarea
                    placeholder="Description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg font-body"
                    rows="3"
                  />
                  <div className="flex gap-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-button">
                      {editingId ? 'Update' : 'Create'} Category
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => { setEditingId(null); setCategoryForm({ name: '', description: '' }); }}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-button"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <h3 className="text-xl font-bold font-heading mb-4">All Categories</h3>
                <div className="grid md:grid-cols-2 gap-4 font-body">
                  {categories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg font-heading">{category.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                      <div className="flex gap-4">
                        <button onClick={() => editCategory(category)} className="text-green-600 hover:text-blue-700 font-body">Edit</button>
                        <button onClick={() => deleteCategory(category.id)} className="text-red-600 hover:text-red-700 font-body">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold font-heading mb-6">Manage Orders</h2>
                <div className="space-y-4 font-body">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">Customer: {order.User?.name}</p>
                          <p className="text-sm text-gray-600">Total: ${order.totalAmount}</p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-4 py-2 border rounded-lg font-body mt-2 md:mt-0"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Items:</p>
                        {order.OrderItems?.map((item) => (
                          <p key={item.id}>• {item.Product?.name} × {item.quantity}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Popup open={confirmOpen} closeOnDocumentClick onClose={() => setConfirmOpen(false)} modal nested>
        {close => (
          <div className="bg-white p-6 rounded-lg w-80 md:w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
            <p className="mb-6">{confirmMessage}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => { confirmAction(); close(); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-button"
              >
                Yes
              </button>
              <button
                onClick={() => close()}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-button"
              >
                No
              </button>
            </div>
          </div>
        )}
      </Popup>

      <Toaster />
    </div>
  );
};

export default Admin;
