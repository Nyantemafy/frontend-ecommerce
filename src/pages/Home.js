import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, Star } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
        const { data } = await axios.get(`${API_URL}/api/products/featured`);
        setFeaturedProducts(data);
        } catch (error) {
        console.error('Error fetching featured products:', error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
                Welcome to ShopHub
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Discover amazing products at unbeatable prices
                </p>
                <Link
                to="/products"
                className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition text-lg"
                >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
                <p className="text-gray-600">On orders over $50</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                <p className="text-gray-600">100% secure transactions</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Always here to help</p>
                </div>
            </div>
            </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
                <p className="text-gray-600 text-lg">Check out our handpicked selection</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-gray-200 h-96 rounded-lg animate-pulse"></div>
                ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
                </div>
            )}

            <div className="text-center mt-12">
                <Link
                to="/products"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-lg"
                >
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </div>
            </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
                Shop by Category
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'].map((category) => (
                <Link
                    key={category}
                    to={`/products?category=${category}`}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition text-center"
                >
                    <div className="text-4xl mb-2">
                    {category === 'Electronics' && '💻'}
                    {category === 'Clothing' && '👕'}
                    {category === 'Books' && '📚'}
                    {category === 'Home' && '🏠'}
                    {category === 'Sports' && '⚽'}
                    {category === 'Other' && '🎁'}
                    </div>
                    <h3 className="font-semibold text-gray-800">{category}</h3>
                </Link>
                ))}
            </div>
            </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-primary-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-primary-100 mb-8 text-lg">
                Get the latest updates on new products and upcoming sales
            </p>
            <form className="max-w-md mx-auto flex gap-4">
                <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                type="submit"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
                >
                Subscribe
                </button>
            </form>
            </div>
        </section>
        </div>
    );
};

export default Home;