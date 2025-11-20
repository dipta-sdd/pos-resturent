
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import POSDashboard from '../staff/POSDashboard';
import RiderDashboard from '../rider/RiderDashboard';

const DashboardHomePage: React.FC = () => {
    const { permissions } = useAuth();

    if (!permissions) {
        // This should be handled by route guards, but as a fallback
        return <div>Loading...</div>;
    }

    // The order of these checks is important, from most to least privileged.
    if (permissions.can_manage_shop_settings) {
        return <AdminDashboard />;
    }
    if (permissions.can_use_pos) {
        return <POSDashboard />;
    }
    if (permissions.can_view_rider_profile) {
        return <RiderDashboard />;
    }
    
    // Fallback dashboard for any other role that might exist
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
            <p className="dark:text-white">Welcome! You don't have a specific dashboard view assigned.</p>
        </div>
    );
};

export default DashboardHomePage;