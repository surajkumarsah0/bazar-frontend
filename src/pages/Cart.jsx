import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../src/context/CartContext.jsx';
import { useAuth } from '../../src/context/Authcontext.jsx';
import { orderAPI } from '../services/api';
import { toast,Toaster } from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: '',
    phone: '',
    paymentMethod: 'Cash on Delivery'
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        ...checkoutData
      };

      await orderAPI.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Empty Cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-body">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-button transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Checkout Form
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 font-body">
        <div className="container mx-auto px-4 max-w-2xl mt-12 ">
          <h1 className="text-4xl font-bold font-heading mb-8 text-center text-[#0b3d91]">CHECKOUT</h1>
          {/* underline */}
          <div className="h-1 w-24 bg-[#Fef250] mx-auto mb-8 rounded"></div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Shipping Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address *</label>
                <textarea
                  value={checkoutData.shippingAddress}
                  onChange={(e) => setCheckoutData({ ...checkoutData, shippingAddress: e.target.value })}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
                  placeholder="Enter your complete address"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={checkoutData.phone}
                  onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
                  placeholder="+1 234 567 8900"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={checkoutData.paymentMethod}
                  onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
                >
                  <option>Cash on Delivery</option>
                  <option>Online Payment</option>
                </select>
              </div>

              {/* Total & Actions */}
              <div className="border-t pt-6">
                <div className="flex justify-between text-xl font-bold mb-6 font-heading">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">Rs.{getTotalPrice().toFixed(2)}</span>
                </div>

                <div className="flex gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-button py-3 rounded-lg transition"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-button py-3 rounded-lg transition"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Cart Items
  return (
    <div className="min-h-screen bg-gray-50 py-12 font-body">
      <div className="container mx-auto px-4 mt-12 max-w-4xl">
        <h1 className="text-3xl font-bold font-heading mb-8 text-center text-[#0b3d91]">SHOPPING CART</h1>
     {/* underline */}
        <div className="w-24 h-1 bg-[#fef250] mx-auto mb-12 rounded"></div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const price = item.discountPrice || item.price;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <img
                    src={item.image || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1 w-full">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 font-heading">{item.name}</h3>
                    <p className="text-gray-600 mb-4 font-body">Rs.{price}</p>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 font-button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600 font-heading">
                      Rs.{(price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-heading">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 font-body">
                  <span>Subtotal</span>
                  <span>Rs.{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-body">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold font-heading">
                  <span>Total</span>
                  <span className="text-blue-600">Rs.{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-button py-3 rounded-lg transition mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-button py-3 rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Cart;
