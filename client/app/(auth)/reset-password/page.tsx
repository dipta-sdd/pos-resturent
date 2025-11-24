'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useSettings } from '@/components//SettingsContext';

const FlavorFusionLogo = () => (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
        <g transform="rotate(45 50 50)">
            <rect x="15" y="15" width="70" height="70" rx="8" fill="#F28500" />
            <path d="M50 15 L15 50 L50 85 Z" fill="currentColor" className="text-gray-50 dark:text-gray-800" />
        </g>
    </svg>
);

const passwordSchema = z.string()
    .min(8, { message: "Must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Must include one uppercase letter" })
    .regex(/[0-9]/, { message: "Must include one number" });

const resetPasswordSchema = z.object({
    newPassword: passwordSchema,
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof resetPasswordSchema>;
type FormErrors = { [key in keyof FormData]?: string };

const PasswordStrengthMeter = ({ strength }: { strength: number }) => {
    const strengthLevels = [
        { label: 'Weak', color: 'bg-red-500' },
        { label: 'Medium', color: 'bg-yellow-500' },
        { label: 'Strong', color: 'bg-green-500' }
    ];

    const currentLevel = strengthLevels[strength];

    return (
        <div>
            <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                    {strength >= 0 && <div style={{ width: `${(strength + 1) * 33.33}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${currentLevel?.color} transition-all duration-300`}></div>}
                </div>
            </div>
            {currentLevel && <p className={`text-xs font-semibold ${strength === 0 ? 'text-red-500' : strength === 1 ? 'text-yellow-500' : 'text-green-500'}`}>{currentLevel.label}</p>}
        </div>
    );
};


const ResetPasswordPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(-1);
    const { settings } = useSettings();
    const router = useRouter();

    useEffect(() => {
        let score = -1;
        const pass = formData.newPassword;
        if (pass.length > 0) {
            score = 0;
            if (pass.length > 7) score++;
            if (/\d/.test(pass)) score++;
            if (/[A-Z]/.test(pass)) score++;
        }
        setStrength(Math.min(score, 2));
    }, [formData.newPassword]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof FormData;
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = resetPasswordSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                newPassword: fieldErrors.newPassword?.[0],
                confirmPassword: fieldErrors.confirmPassword?.[0],
            });
            return;
        }

        setErrors({});
        alert('Password has been reset successfully!');
        router.push('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/" className="flex flex-col items-center justify-center gap-4 mb-8 text-gray-800 dark:text-white">
                    <FlavorFusionLogo />
                    <h1 className="text-3xl font-bold">{settings.restaurantName}</h1>
                </Link>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Set Your New Password</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please enter and confirm your new password below.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                            <div className="mt-1 relative">
                                <input
                                    name="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.newPassword ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'}`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.newPassword ? (
                                <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>
                            ) : (
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters long, include one number and one uppercase letter.</p>
                            )}
                            {formData.newPassword && <PasswordStrengthMeter strength={strength} />}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                            <div className="mt-1 relative">
                                <input
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'}`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                                Reset Password
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Remembered your password?{' '}
                        <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
