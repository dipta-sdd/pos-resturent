import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { UserRole } from '../../types';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { z } from 'zod';

const FlavorFusionLogo = () => (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
        <g transform="rotate(45 50 50)">
            <rect x="15" y="15" width="70" height="70" rx="8" fill="#F28500"/>
            <path d="M50 15 L15 50 L50 85 Z" fill="currentColor" className="text-gray-50 dark:text-gray-800"/>
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
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  // FIX: Explicitly cast the input name to a key of FormData to prevent potential type errors with dynamic keys.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // FIX: Explicitly cast the event target's name to a key of FormData to resolve the "Type 'symbol' cannot be used as an index type" error.
    const name = e.target.name as keyof FormData;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      // FIX: Use Zod's .flatten() method to safely map errors to the form state.
      // This avoids manual iteration and potential indexing issues with issue.path.
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    
    setErrors({});
    login(formData.email, 'customer');
    navigate('/customer/dashboard');
  };

  const handleQuickLogin = (demoRole: UserRole) => {
    const demoEmail = `${demoRole}@example.com`;
    login(demoEmail, demoRole);
    
    switch (demoRole) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'staff':
        navigate('/pos/dashboard');
        break;
      case 'rider':
        navigate('/rider/dashboard');
        break;
      default:
        navigate('/customer/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex flex-col items-center justify-center gap-4 mb-8 text-gray-800 dark:text-white">
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
                <Link to="/forgot-password" className="text-sm font-medium text-orange-600 hover:text-orange-500">
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
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Login
              </button>
            </div>
          </form>

           <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Quick Demo Logins</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => handleQuickLogin('customer')} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">Customer</button>
              <button onClick={() => handleQuickLogin('staff')} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">Staff</button>
              <button onClick={() => handleQuickLogin('rider')} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">Rider</button>
              <button onClick={() => handleQuickLogin('admin')} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">Admin</button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;