import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    return (
        <Link
        to={`/products/${product._id}`}
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
        >
        <div className="relative overflow-hidden">
            <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">Out of Stock</span>
            </div>
            )}
            {product.featured && (
            <div className="absolute top-2 left-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
            </div>
            )}
        </div>

        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
            {product.name}
            </h3>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
            </p>

            <div className="flex items-center mb-3">
            <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.numReviews})
                </span>
            </div>
            <span className="ml-auto text-xs text-gray-500">{product.brand}</span>
            </div>

            <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
            </span>

            <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
                <ShoppingCart className="w-4 h-4" />
                <span>Add</span>
            </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
        </div>
        </Link>
    );
};

export default ProductCard;