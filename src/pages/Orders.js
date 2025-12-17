import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (!userInfo || !userInfo.token) {
        toast.error('User not logged in');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/api/orders/myorders`,
        config
      );

      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
          <div className="flex border-b">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-4 font-semibold capitalize transition whitespace-nowrap ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status}
                <span className="ml-2 text-sm">
                  ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet." 
                : `No ${filter} orders found.`}
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="mb-4 lg:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-primary-600">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <Link
                        to={`/orders/${order._id}`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-4 overflow-x-auto">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item._id} className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                          />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-600 font-semibold">
                          +{order.items.length - 4}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Delivery Status */}
                  <div className="border-t mt-4 pt-4 flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.isPaid ? '✓ Paid' : '✗ Not Paid'}
                      </span>
                      {order.isPaid && (
                        <span className="ml-2 text-xs text-gray-500">
                          on {new Date(order.paidAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.isDelivered ? '✓ Delivered' : '◷ In Transit'}
                      </span>
                      {order.isDelivered && (
                        <span className="ml-2 text-xs text-gray-500">
                          on {new Date(order.deliveredAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;