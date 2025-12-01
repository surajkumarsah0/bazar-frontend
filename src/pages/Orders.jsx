import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-body">
        <div className="text-2xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-body">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-body">
      <div className="container mx-auto px-4 mt-12">
        <h1 className="text-4xl font-bold text-[#0b3d91] mb-8 font-heading text-center" >MY ORDERS</h1>
        {/* underline */}
        <div className="h-1 w-24 bg-[#Fef250] mx-auto mb-8 rounded"></div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Order ID: #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-lg font-bold text-gray-800 mt-2">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.OrderItems?.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.Product?.image || 'https://via.placeholder.com/100'}
                        alt={item.Product?.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.Product?.name}</h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Info */}
                <div className="mt-6 pt-6 border-t">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Shipping Address</p>
                      <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Contact</p>
                      <p className="text-sm text-gray-600">{order.phone}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Payment: {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
