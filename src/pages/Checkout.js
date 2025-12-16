import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Package } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Remplacez par votre clé publique Stripe
const stripePromise = loadStripe('pk_test_51SekjHJfvPUob9nUUgs9ICBSfd8i48bm4zG2l0RgrBqYleCFBi4yIE9PsUjoFdb6yEIxMMP0OfXpxObZoXeF2yuY00M3rjYmgp');

const CheckoutForm = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        postalCode: user?.address?.postalCode || '',
        country: user?.address?.country || ''
    });

    const shippingPrice = getCartTotal() > 50 ? 0 : 10;
    const taxPrice = getCartTotal() * 0.1;
    const totalPrice = getCartTotal() + shippingPrice + taxPrice;

    const handleChange = (e) => {
        setShippingInfo({
        ...shippingInfo,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
        return;
        }

        // Validation
        if (!shippingInfo.street || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.country) {
        toast.error('Please fill in all shipping information');
        return;
        }

        setLoading(true);

        try {
        // Créer l'ordre d'abord
        const orderData = {
            items: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.images[0]
            })),
            shippingAddress: shippingInfo,
            paymentMethod: 'Stripe',
            taxPrice,
            shippingPrice,
            totalPrice
        };

        const { data: order } = await api.post('/api/orders', orderData);

        // Créer le Payment Intent
        const { data: paymentIntent } = await api.post('/api/payment/create-payment-intent', {
            amount: totalPrice
        });

        // Confirmer le paiement
        const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
            paymentIntent.clientSecret,
            {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                name: user.name,
                email: user.email,
                address: {
                    line1: shippingInfo.street,
                    city: shippingInfo.city,
                    postal_code: shippingInfo.postalCode,
                    country: shippingInfo.country
                }
                }
            }
            }
        );

        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        if (confirmedPayment.status === 'succeeded') {
            // Mettre à jour l'ordre comme payé
            await api.put(`/api/orders/${order._id}/pay`, {
            id: confirmedPayment.id,
            status: confirmedPayment.status,
            update_time: new Date().toISOString(),
            email_address: user.email
            });

            clearCart();
            toast.success('Payment successful!');
            navigate(`/order-success/${order._id}`);
        }
        } catch (error) {
        console.error('Payment error:', error);
        toast.error(error.response?.data?.message || 'Payment failed');
        } finally {
        setLoading(false);
        }
    };

    const cardElementOptions = {
        style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
            color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                    Shipping Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                        </label>
                        <input
                        type="text"
                        name="street"
                        value={shippingInfo.street}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="123 Main St"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                        </label>
                        <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="New York"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                        </label>
                        <input
                        type="text"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="10001"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                        </label>
                        <input
                        type="text"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="USA"
                        />
                    </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                    Payment Information
                    </h2>

                    <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Details
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4">
                        <CardElement options={cardElementOptions} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
                    </p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                </button>
                </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-primary-600" />
                    Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4">
                        <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

const Checkout = () => {
    return (
        <Elements stripe={stripePromise}>
        <CheckoutForm />
        </Elements>
    );
};

export default Checkout;