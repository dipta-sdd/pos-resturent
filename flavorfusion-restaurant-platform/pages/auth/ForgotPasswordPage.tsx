import React, { useState } from 'react';
// FIX: Split react-router-dom imports to resolve "no exported member" errors.
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { z } from 'zod';
import { useSettings } from '../../contexts/SettingsContext';

const FlavorFusionLogo = () => (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
        <g transform="rotate(45 50 50)">
            <rect x="15" y="15" width="70" height="70" rx="8" fill="#F28500"/>
            <path d="M50 15 L15 50 L50 85 Z" fill="currentColor" className="text-gray-50 dark:text-gray-800"/>
        </g>
    </svg>
);

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    console.log('Sending reset link to:', email);
    setSubmitted(true);
  };
  
  if (submitted) {
     return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                 <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                    <Mail className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Check Your Email</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        If an account exists for <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>, you will receive an email with a link to reset your password.
                    </p>
                    <button onClick={() => navigate('/login')} className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
     )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-md">
         <Link to="/" className="flex flex-col items-center justify-center gap-4 mb-8 text-gray-800 dark:text-white">
            <FlavorFusionLogo />
            <h1 className="text-3xl font-bold">{settings.restaurantName}</h1>
        </Link>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Your Password?</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No problem. Enter your email address below and we'll send you a link to reset it.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                </span>
                <input id="email" name="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }} className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'}`} placeholder="Enter your email" />
              </div>
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
             <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                Send Reset Link
              </button>
            </div>
          </form>
           <p className="mt-8 text-center text-sm">
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                Back to Login
              </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
