
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../../components/common/Breadcrumb';

// Skeleton Loader Component
const ProfileSettingsSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-10"></div>
        <div className="space-y-8">
            {/* Avatar Skeleton */}
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200/80 dark:border-gray-700/60">
                <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-40 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                        <div className="h-11 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                </div>
            </div>
            {/* Personal Info Skeleton */}
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200/80 dark:border-gray-700/60">
                <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <div className="h-11 w-36 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                </div>
            </div>
            {/* Password Skeleton */}
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200/80 dark:border-gray-700/60">
                <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <div className="h-11 w-40 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                </div>
            </div>
        </div>
    </div>
);


const ProfileSettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (user) {
            // FIX: Use firstName and lastName to construct the full name.
            setName(`${user.firstName} ${user.lastName}`);
            // FIX: Use the 'mobile' property from the User object, not 'phone'.
            setPhone(user.mobile || '(123) 456-7890'); // Placeholder for demo
            setAvatarPreview(user.avatar_url || null);
            setTimeout(() => setIsLoading(false), 500); 
        } else {
            setIsLoading(true);
        }
    }, [user]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarPreview(null);
    };

    const handleInfoSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Personal info saved!");
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!");
            return;
        }
        alert("Password updated successfully!");
    };

    const breadcrumbs = [
        { name: 'Dashboard', path: '/customer/dashboard' },
        { name: 'Profile Settings', path: '/customer/profile' },
    ];

    if (isLoading || !user) {
        return (
            <>
                <Breadcrumb crumbs={breadcrumbs} />
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <ProfileSettingsSkeleton />
                </div>
            </>
        );
    }
    
    // FIX: Use firstName and lastName to construct the full name for the avatar API.
    const userNameForAvatar = `${user.firstName} ${user.lastName}`;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
                
                <div className="space-y-8 mt-10">
                    {/* Profile Avatar */}
                    <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200/80 dark:border-gray-700/60">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Avatar</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Update your profile picture.</p>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img 
                                    src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(userNameForAvatar)}&background=fde68a&color=a16207`} 
                                    alt="Profile Avatar" 
                                    className="w-24 h-24 rounded-full object-cover" 
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button onClick={handleUploadClick} className="bg-orange-500 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-orange-600 transition-colors">
                                    Upload New Photo
                                </button>
                                <button onClick={handleRemoveAvatar} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2.5 px-5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <form onSubmit={handleInfoSave}>
                        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200/80 dark:border-gray-700/60">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Update your name and phone number.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="submit" className="bg-orange-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                    
                    {/* Update Password */}
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200/80 dark:border-gray-700/60">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Update Password</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Change your account password.</p>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="submit" className="bg-orange-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProfileSettingsPage;