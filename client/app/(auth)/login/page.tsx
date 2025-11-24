'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useSettings } from '../../../contexts/SettingsContext';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { LaravelErrorResponse } from '@/types';
import { api } from '@/services/api';

const FlavorFusionLogo = () => (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
        <g transform="rotate(45 50 50)">
            <rect x="15" y="15" width="70" height="70" rx="8" fill="#F28500" />
            <path d="M50 15 L15 50 L50 85 Z" fill="currentColor" className="text-gray-50 dark:text-gray-800" />
        </g>
    </svg>
);

const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

type FormData = z.infer<typeof loginSchema>;
type FormErrors = { [key in keyof FormData]?: string };


const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user } = useAuth();
    const { settings } = useSettings();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof FormData;
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
            });
            toast.error('Please fix the errors in the form');
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            await login(formData.email, formData.password);
            toast.success('Login successful!');
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                setErrors({ email: 'Invalid email or password' });
                toast.error('Invalid email or password');
            }
            // Handle Laravel validation errors
            else if (error.response?.data) {
                const backendErrors: LaravelErrorResponse = error.response.data;
                setErrors(api.normalizeErrors(backendErrors));
                toast.error('Please fix the validation errors');
            }
            // Handle other errors
            else {
                const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
                setErrors({ email: errorMessage });
                toast.error(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/" className="flex flex-col items-center justify-center gap-4 mb-8 text-gray-800 dark:text-white">
                    <FlavorFusionLogo />
                    <h1 className="text-3xl font-bold">{settings.restaurantName}</h1>
                </Link>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Sign in to access your account and manage your restaurant.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'}`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <Link href="/forgot-password" className="text-sm font-medium text-orange-600 hover:text-orange-500">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.password ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>


                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-orange-600 hover:text-orange-500">
                            Register
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
