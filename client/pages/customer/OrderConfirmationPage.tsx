
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';

const OrderConfirmationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const breadcrumbs = [
        { name: 'Cart', path: '/checkout' },
        { name: 'Checkout', path: '/checkout' },
        { name: 'Confirmation', path: `/order-confirmation/${id}` },
    ];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="container mx-auto text-center py-20 px-4">
                <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
                <h1 className="mt-6 text-4xl font-extrabold text-gray-900">Thank You For Your Order!</h1>
                <p className="mt-2 text-lg text-gray-500">Your order has been placed successfully.</p>
                <p className="mt-4 text-gray-600">Your order number is <span className="font-bold text-orange-500">#{id}</span>.</p>
                <p className="text-gray-600">You will receive an email confirmation shortly.</p>
                <div className="mt-8 flex justify-center gap-4">
                     <Link to={`/track-order/${id}`} className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                        Track Your Order
                    </Link>
                    <Link to="/menu" className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </>
    );
};

export default OrderConfirmationPage;
