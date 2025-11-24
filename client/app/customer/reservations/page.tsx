'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../../services/api';
import { useAuth } from '@/components//AuthContext';
import { Reservation } from '../../../types';
import { CalendarX } from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '@/components/common/Breadcrumb';

// Status Badge Component
const StatusBadge: React.FC<{ status: Reservation['status'] }> = ({ status }) => {
    const styles = {
        confirmed: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400',
        completed: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400',
    };
    return (
        <span className={`px-4 py-1.5 text-xs font-semibold rounded-full ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// Reservation Card Component
const ReservationCard: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
    const reservationDate = new Date(reservation.reservation_time);
    const isUpcoming = ['pending', 'confirmed'].includes(reservation.status);

    return (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
                {/* Date */}
                <div className="md:col-span-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {reservationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
                {/* Time */}
                <div className="md:col-span-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {reservationDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </p>
                </div>
                {/* Guests */}
                <div className="md:col-span-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Guests</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{reservation.num_guests} People</p>
                </div>
                {/* Status */}
                <div className="md:col-span-1 flex md:justify-center">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                        <StatusBadge status={reservation.status} />
                    </div>
                </div>
                {/* Actions */}
                <div className="col-span-2 md:col-span-1 flex items-center justify-end gap-3">
                    {isUpcoming ? (
                        <>
                            <button className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                Modify
                            </button>
                            <button className="bg-transparent border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                        </>
                    ) : (
                        <Link href="/reserve" className="bg-orange-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                            Book Again
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};


// Skeleton Loader Component
const ReservationSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-full w-24"></div>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex items-center justify-end gap-3">
                        <div className="h-11 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-11 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Empty State Component
const EmptyState: React.FC = () => (
    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
        <CalendarX className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No Reservations Found</h3>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">You don't have any reservations yet. Ready to book a table?</p>
        <div className="mt-6">
            <Link href="/reserve" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                Book a Table
            </Link>
        </div>
    </div>
);


const ReservationHistoryPage: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const { user } = useAuth();

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            if (user) {
                // Simulate network delay
                setTimeout(async () => {
                    const data = await api.getCustomerReservations(user.id);
                    setReservations(data);
                    setLoading(false);
                }, 1000);
            } else {
                setLoading(false);
            }
        };
        fetchReservations();
    }, [user]);

    const { upcomingReservations, pastReservations } = useMemo(() => {
        const upcoming = reservations.filter(r => ['pending', 'confirmed'].includes(r.status));
        const past = reservations.filter(r => ['completed', 'cancelled'].includes(r.status));
        return { upcomingReservations: upcoming, pastReservations: past };
    }, [reservations]);

    const reservationsToShow = activeTab === 'upcoming' ? upcomingReservations : pastReservations;
    const totalReservations = upcomingReservations.length + pastReservations.length;

    const breadcrumbs = [
        { name: 'Dashboard', path: '/customer' },
        { name: 'My Reservations', path: '/customer/reservations' }
    ];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">My Reservations</h1>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">View and manage your upcoming and past reservations.</p>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`${activeTab === 'upcoming'
                                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-lg transition-colors`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`${activeTab === 'past'
                                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-lg transition-colors`}
                        >
                            Past
                        </button>
                    </nav>
                </div>

                <div>
                    {loading ? (
                        <ReservationSkeleton />
                    ) : totalReservations === 0 ? (
                        <EmptyState />
                    ) : reservationsToShow.length > 0 ? (
                        <div className="space-y-6">
                            {reservationsToShow.map(res => <ReservationCard key={res.id} reservation={res} />)}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                            No {activeTab} reservations found.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ReservationHistoryPage;
