import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Minus, Plus, Truck, Shield, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [review, setReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        } catch (error) {
        toast.error('Product not found');
        navigate('/products');
        } finally {
        setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product.stock === 0) {
        toast.error('Product is out of stock');
        return;
        }
        addToCart(product, quantity);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!user) {
        toast.error('Please login to write a review');
        navigate('/login');
        return;
        }

        setSubmittingReview(true);
        try {
        await axios.post(`/api/products/${id}/reviews`, review);
        toast.success('Review submitted successfully');
        setReview({ rating: 5, comment: '' });
        fetchProduct();
        } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
        setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition"
            >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
            </button>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {/* Images */}
                <div>
                <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                    />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === index ? 'border-primary-600' : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                        <img 
                        src={image} 
                        alt={`${product.name} ${index + 1}`} 
                        className="w-full h-20 object-cover" 
                        />
                    </button>
                    ))}
                </div>
                </div>

                {/* Product Info */}
                <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

                <div className="flex items-center mb-4">
                    <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star
                        key={i}
                        className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                        />
                    ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                    {product.rating.toFixed(1)} ({product.numReviews} reviews)
                    </span>
                </div>

                <p className="text-4xl font-bold text-primary-600 mb-6">
                    ${product.price.toFixed(2)}
                </p>

                <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                    <span className="font-semibold w-24 text-gray-700">Brand:</span>
                    <span className="text-gray-600">{product.brand}</span>
                    </div>
                    <div className="flex items-center">
                    <span className="font-semibold w-24 text-gray-700">Category:</span>
                    <span className="text-gray-600">{product.category}</span>
                    </div>
                    <div className="flex items-center">
                    <span className="font-semibold w-24 text-gray-700">Stock:</span>
                    <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </span>
                    </div>
                </div>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                    <div className="flex items-center space-x-4 mb-6">
                    <span className="font-semibold text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100 transition"
                        >
                        <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-6 py-2 border-x font-semibold">{quantity}</span>
                        <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-2 hover:bg-gray-100 transition"
                        >
                        <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    </div>
                )}

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-6 shadow-md"
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>

                {/* Benefits */}
                <div className="space-y-3 border-t pt-6">
                    <div className="flex items-center text-gray-600">
                    <Truck className="w-5 h-5 mr-3 text-primary-600" />
                    <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                    <Shield className="w-5 h-5 mr-3 text-primary-600" />
                    <span>Secure payment & buyer protection</span>
                    </div>
                </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t p-8 bg-gray-50">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>

                {/* Review Form */}
                {user && (
                <form onSubmit={handleSubmitReview} className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-semibold mb-4 text-lg text-gray-800">Write a Review</h3>
                    <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                        value={review.rating}
                        onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Poor</option>
                        <option value="1">1 - Terrible</option>
                    </select>
                    </div>
                    <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        required
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Share your experience with this product..."
                    ></textarea>
                    </div>
                    <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
                )}

                {!user && (
                <div className="mb-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
                    <p className="text-blue-800">
                    Please{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="font-semibold underline hover:text-blue-900"
                    >
                        login
                    </button>
                    {' '}to write a review.
                    </p>
                </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                {product.reviews.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    product.reviews.map((review) => (
                    <div key={review._id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                        <div>
                            <div className="flex items-center mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                />
                                ))}
                            </div>
                            <span className="ml-3 font-semibold text-gray-800">{review.user?.name || 'Anonymous'}</span>
                            </div>
                            <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            </p>
                        </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                    ))
                )}
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default ProductDetail;