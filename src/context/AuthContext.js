import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
        axios.defaults.headers.common['Authorization'] = token
            ? `Bearer ${token}`
            : '';

        loadUser();
        } else {
        setLoading(false);
        }
    }, [token]);

    // Charger les infos utilisateur
    const loadUser = async () => {
        try {
        const { data } = await axios.get(`${API_URL}/api/auth/me`);
        setUser(data);
        } catch (error) {
        console.error('Load user error:', error);
        logout();
        } finally {
        setLoading(false);
        }
    };

    // Register
    const register = async (name, email, password) => {
        try {
        const { data } = await axios.post(`${API_URL}/api/auth/register`, {
            name,
            email,
            password
        });
        
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        toast.success('Account created successfully!');
        return { success: true };
        } catch (error) {
        const message = error.response?.data?.message || 'Registration failed';
        toast.error(message);
        return { success: false, message };
        }
    };

    // Login
    const login = async (email, password) => {
        try {
        const { data } = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password
        });
        
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        toast.success('Welcome back!');
        return { success: true };
        } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        toast.error(message);
        return { success: false, message };
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        toast.success('Logged out successfully');
    };

    // Update profile
    const updateProfile = async (userData) => {
        try {
        const { data } = await axios.put(`${API_URL}/api/auth/profile`, userData);
        setUser(data);
        toast.success('Profile updated successfully!');
        return { success: true };
        } catch (error) {
        const message = error.response?.data?.message || 'Update failed';
        toast.error(message);
        return { success: false, message };
        }
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};