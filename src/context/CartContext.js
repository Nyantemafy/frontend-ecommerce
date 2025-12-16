import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
    };

    export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Charger le panier depuis localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
        setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Sauvegarder le panier dans localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Ajouter au panier
    const addToCart = (product, quantity = 1) => {
        const existingItem = cartItems.find(item => item._id === product._id);

        if (existingItem) {
        // Vérifier le stock
        if (existingItem.quantity + quantity > product.stock) {
            toast.error('Not enough stock available');
            return;
        }

        setCartItems(
            cartItems.map(item =>
            item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
        );
        toast.success('Cart updated');
        } else {
        if (quantity > product.stock) {
            toast.error('Not enough stock available');
            return;
        }

        setCartItems([...cartItems, { ...product, quantity }]);
        toast.success('Added to cart');
        }
    };

    // Retirer du panier
    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item._id !== productId));
        toast.success('Removed from cart');
    };

    // Mettre à jour la quantité
    const updateQuantity = (productId, quantity) => {
        const item = cartItems.find(item => item._id === productId);
        
        if (quantity > item.stock) {
        toast.error('Not enough stock available');
        return;
        }

        if (quantity <= 0) {
        removeFromCart(productId);
        return;
        }

        setCartItems(
        cartItems.map(item =>
            item._id === productId ? { ...item, quantity } : item
        )
        );
    };

    // Vider le panier
    const clearCart = () => {
        setCartItems([]);
        toast.success('Cart cleared');
    };

    // Calculer le total
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Nombre d'articles
    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};