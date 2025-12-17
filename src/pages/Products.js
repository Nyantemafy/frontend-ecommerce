import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'All',
        sort: searchParams.get('sort') || 'newest',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        rating: searchParams.get('rating') || '',
        search: searchParams.get('search') || ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0
    });
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];
    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' }
    ];

    useEffect(() => {
        fetchProducts();
    }, [filters, pagination.page]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
        const params = {
            page: pagination.page,
            keyword: filters.search,
            category: filters.category !== 'All' ? filters.category : '',
            sort: filters.sort,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            rating: filters.rating
        };

        const { data } = await axios.get(`${API_URL}/api/products`, { params });
        setProducts(data.products);
        setPagination({
            page: data.page,
            pages: data.pages,
            total: data.total
        });
        } catch (error) {
        console.error('Error fetching products:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setPagination({ ...pagination, page: 1 });

        // Update URL params
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
        if (v) params.set(k, v);
        });
        setSearchParams(params);
    };

    const resetFilters = () => {
        setFilters({
        category: 'All',
        sort: 'newest',
        minPrice: '',
        maxPrice: '',
        rating: '',
        search: ''
        });
        setSearchParams({});
        setPagination({ ...pagination, page: 1 });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow"
            >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
            </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                    </h2>
                    <button
                    onClick={resetFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                    >
                    Reset
                    </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-gray-700">Category</h3>
                    <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="category"
                            checked={filters.category === category}
                            onChange={() => handleFilterChange('category', category)}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-600">{category}</span>
                        </label>
                    ))}
                    </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-gray-700">Price Range</h3>
                    <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-gray-700">Minimum Rating</h3>
                    <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === rating.toString()}
                            onChange={() => handleFilterChange('rating', rating.toString())}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-600">{rating}+ Stars</span>
                        </label>
                    ))}
                    <label className="flex items-center cursor-pointer">
                        <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === ''}
                        onChange={() => handleFilterChange('rating', '')}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-600">All Ratings</span>
                    </label>
                    </div>
                </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
                {/* Sort and Results */}
                <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
                <p className="text-gray-600">
                    Showing {products.length} of {pagination.total} results
                </p>
                <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))}
                </select>
                </div>

                {/* Products */}
                {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-gray-200 h-96 rounded-lg animate-pulse"></div>
                    ))}
                </div>
                ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No products found</p>
                    <button
                    onClick={resetFilters}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                    >
                    Clear Filters
                    </button>
                </div>
                ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                        <button
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        Previous
                        </button>

                        {[...Array(pagination.pages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPagination({ ...pagination, page: i + 1 })}
                            className={`px-4 py-2 rounded-lg ${
                            pagination.page === i + 1
                                ? 'bg-primary-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {i + 1}
                        </button>
                        ))}

                        <button
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={pagination.page === pagination.pages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        Next
                        </button>
                    </div>
                    )}
                </>
                )}
            </div>
            </div>
        </div>
        </div>
    );
};

export default Products;