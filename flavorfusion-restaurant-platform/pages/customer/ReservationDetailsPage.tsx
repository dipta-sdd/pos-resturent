
import React, { useState, useEffect } from 'react';
// FIX: Split react-router-dom imports to resolve "no exported member" errors.
import { useParams, Link } from 'react-router-dom';
import { Reservation } from '../../types';
import { api } from '../../services/api';
import { Calendar, Users, Clock, Hash, Info, Edit, X } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';

const ReservationDetailsPage: React.FC = () => {
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            api.getReservationById(parseInt(id, 10)).then(setReservation);
        }
    }, [id]);

    const breadcrumbs = [
        { name: 'Dashboard', path: '/customer/dashboard' },
        { name: 'Reservations', path: '/customer/reservations' },
        { name: `Booking #${id}`, path: `/customer/reservations/${id}` }
    ];

    if (!reservation) return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <p className="dark:text-white text-center p-10">Loading reservation details...</p>
            </div>
        </>
    );

    const breadcrumbsWithId = [
        { name: 'Dashboard', path: '/customer/dashboard' },
        { name: 'Reservations', path: '/customer/reservations' },
        { name: `Booking #${reservation.id}`, path: `/customer/reservations/${reservation.id}` }
    ];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbsWithId} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Reservation Details</h1>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                    <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                        <h2 className="text-2xl font-semibold dark:text-white">Booking #{reservation.id}</h2>
                        <span className="font-semibold capitalize px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{reservation.status}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-orange-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                <p className="font-medium">{new Date(reservation.reservation_time).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="text-orange-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                                <p className="font-medium">{new Date(reservation.reservation_time).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="text-orange-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Guests</p>
                                <p className="font-medium">{reservation.num_guests}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Hash className="text-orange-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Table</p>
                                <p className="font-medium">{reservation.table?.name_or_number ?? 'Not Assigned'}</p>
                            </div>
                        </div>
                    </div>

                    {reservation.notes && (
                        <div className="mt-6 pt-6 border-t dark:border-gray-700">
                            <div className="flex items-start gap-3">
                                <Info className="text-orange-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Special Requests</p>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">{reservation.notes}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {(reservation.status === 'confirmed' || reservation.status === 'pending') && (
                        <div className="mt-6 pt-6 border-t dark:border-gray-700 flex justify-end gap-4">
                            <button className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                                <Edit size={16} /> Modify
                            </button>
                            <button className="flex items-center gap-2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ReservationDetailsPage;