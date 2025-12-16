import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    const shippingPrice = getCartTotal() > 50 ? 0 : 10;
    const taxPrice = getCartTotal() * 0.1; // 10% tax
    const totalPrice = getCartTotal() + shippingPrice + taxPrice;

    const handleCheckout = () => {
        if (!user) {
        navigate('/login?redirect=checkout');
        } else {
        navigate('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">Add some products to get started!</p>
                <Link
                to="/products"
                className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
                </Link>
            </div>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-semibold"
            >
                Clear Cart
            </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center gap-4"
                >
                    <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                    />

                    <div className="flex-1">
                    <Link
                        to={`/products/${item._id}`}
                        className="text-lg font-semibold text-gray-800 hover:text-primary-600"
                    >
                        {item.name}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">{item.brand}</p>
                    <p className="text-primary-600 font-bold mt-2">
                        ${item.price.toFixed(2)}
                    </p>
                    </div>

                    <div className="flex items-center space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-gray-100"
                        >
                        <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border-x">{item.quantity}</span>
                        <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[100px]">
                        <p className="font-bold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-600 hover:text-red-700 p-2"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    </div>
                </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                    </div>

                    {shippingPrice > 0 && (
                    <p className="text-sm text-primary-600">
                        Add ${(50 - getCartTotal()).toFixed(2)} more for free shipping!
                    </p>
                    )}

                    <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>${taxPrice.toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                    Proceed to Checkout
                </button>

                <Link
                    to="/products"
                    className="block text-center text-primary-600 hover:text-primary-700 mt-4 font-semibold"
                >
                    Continue Shopping
                </Link>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Cart;