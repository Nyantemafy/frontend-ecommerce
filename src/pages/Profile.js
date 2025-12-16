import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            street: user.address?.street || '',
            city: user.address?.city || '',
            postalCode: user.address?.postalCode || '',
            country: user.address?.country || ''
        });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
        ...passwordData,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country
        }
        };

        const result = await updateProfile(updateData);
        setLoading(false);
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
        }

        if (passwordData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
        }

        setLoading(true);

        const result = await updateProfile({
        password: passwordData.newPassword
        });

        if (result.success) {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b">
                <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                    activeTab === 'profile'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                >
                <User className="w-5 h-5 inline-block mr-2" />
                Profile Info
                </button>
                <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                    activeTab === 'password'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                >
                <Lock className="w-5 h-5 inline-block mr-2" />
                Change Password
                </button>
            </div>

            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
                <form onSubmit={handleSubmitProfile} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="John Doe"
                        />
                    </div>
                    </div>

                    {/* Email */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="john@example.com"
                        />
                    </div>
                    </div>

                    {/* Phone */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="+1234567890"
                        />
                    </div>
                    </div>

                    {/* Street */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="123 Main St"
                        />
                    </div>
                    </div>

                    {/* City */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="New York"
                    />
                    </div>

                    {/* Postal Code */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                    </label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="10001"
                    />
                    </div>

                    {/* Country */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                    </label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="USA"
                    />
                    </div>
                </div>

                <div className="mt-8">
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center"
                    >
                    <Save className="w-5 h-5 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
                </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <form onSubmit={handleSubmitPassword} className="p-8">
                <div className="space-y-6 max-w-md">
                    {/* Current Password */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="••••••••"
                        />
                    </div>
                    </div>

                    {/* New Password */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="••••••••"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="••••••••"
                        />
                    </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center"
                    >
                    <Lock className="w-5 h-5 mr-2" />
                    {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
                </form>
            )}
            </div>
        </div>
        </div>
    );
};

export default Profile;