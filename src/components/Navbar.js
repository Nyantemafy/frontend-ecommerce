import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout, isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
        navigate(`/products?search=${searchQuery}`);
        setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsUserMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
                <ShoppingCart className="w-8 h-8 text-primary-600" />
                <span className="text-2xl font-bold text-gray-800">ShopHub</span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
            </form>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
                <Link to="/products" className="text-gray-700 hover:text-primary-600 transition">
                Products
                </Link>

                {/* Cart */}
                <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary-600 transition" />
                {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                    </span>
                )}
                </Link>

                {/* User Menu */}
                {user ? (
                <div className="relative">
                    <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition"
                    >
                    <User className="w-6 h-6" />
                    <span>{user.name}</span>
                    </button>

                    {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                        <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile
                        </Link>
                        <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                        <Package className="w-4 h-4 mr-2" />
                        My Orders
                        </Link>
                        {isAdmin && (
                        <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Admin Dashboard
                        </Link>
                        )}
                        <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-50"
                        >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                        </button>
                    </div>
                    )}
                </div>
                ) : (
                <div className="flex items-center space-x-4">
                    <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 transition"
                    >
                    Login
                    </Link>
                    <Link
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                    Sign Up
                    </Link>
                </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-700"
            >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
                <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                    <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                </form>

                <div className="space-y-2">
                <Link
                    to="/products"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                >
                    Products
                </Link>
                <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                >
                    Cart ({getCartCount()})
                </Link>

                {user ? (
                    <>
                    <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                    >
                        Profile
                    </Link>
                    <Link
                        to="/orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                    >
                        My Orders
                    </Link>
                    {isAdmin && (
                        <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                        >
                        Admin Dashboard
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 rounded"
                    >
                        Logout
                    </button>
                    </>
                ) : (
                    <>
                    <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 bg-primary-600 text-white text-center rounded hover:bg-primary-700"
                    >
                        Sign Up
                    </Link>
                    </>
                )}
                </div>
            </div>
            )}
        </div>
        </nav>
    );
};

export default Navbar;