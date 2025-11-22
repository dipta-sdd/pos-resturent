import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-orange-500">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Sorry, the page you're looking for doesn't exist in the customer area.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/customer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    )
}