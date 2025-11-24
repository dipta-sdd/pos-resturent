'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { mockUsers, mockRoles } from '../../../data/mockData';
import { User, UserRole, Role } from '../../../types';
import { Plus, Edit, Trash2, Search, ArrowUp, ArrowDown } from 'lucide-react';
import Pagination from '@/components/common/Pagination';

const getRoleColor = (role: UserRole) => {
    switch (role) {
        case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case 'staff': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'rider': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case 'customer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const permissionLabels: { [key: string]: string } = {
    can_manage_shop_settings: "Manage Shop Settings", can_manage_payment_methods: "Manage Payment Methods",
    can_manage_staff: "Manage Staff", can_manage_roles_and_permissions: "Manage Roles", can_view_user_activity_log: "View Activity Log",
    can_view_products: "View Products", can_manage_products: "Manage Products", can_manage_categories: "Manage Categories",
    can_import_products: "Import Products", can_export_products: "Export Products", can_use_pos: "Use POS",
    can_view_sales_history: "View Sales History", can_view_customers: "View Customers", can_manage_customers: "Manage Customers",
    can_manage_expenses: "Manage Expenses", can_view_dashboard: "View Dashboard", can_view_reports: "View Reports",
    can_view_profit_loss_data: "View Profit/Loss", can_export_data: "Export Data", can_manage_reservations: "Manage Reservations",
    can_manage_payouts: "Manage Payouts", can_send_communications: "Send Communications", can_view_rider_profile: "View Rider Profile",
};

const permissionGroups = [
    { title: "Shop & Organization", permissions: ['can_manage_shop_settings', 'can_manage_payment_methods'] },
    { title: "User Management", permissions: ['can_manage_staff', 'can_manage_roles_and_permissions', 'can_view_user_activity_log'] },
    { title: "Product & Catalog", permissions: ['can_view_products', 'can_manage_products', 'can_manage_categories', 'can_import_products', 'can_export_products'] },
    { title: "Sales & POS", permissions: ['can_use_pos', 'can_view_sales_history'] },
    { title: "Customer Management", permissions: ['can_view_customers', 'can_manage_customers'] },
    { title: "Financial & Reports", permissions: ['can_manage_expenses', 'can_view_dashboard', 'can_view_reports', 'can_view_profit_loss_data', 'can_export_data'] },
    { title: "Other Permissions", permissions: ['can_manage_reservations', 'can_manage_payouts', 'can_send_communications', 'can_view_rider_profile'] },
];

const RoleModal: React.FC<{ role: Role | Partial<Role>; onClose: () => void; onSave: (role: Role | Partial<Role>) => void; }> = ({ role, onClose, onSave }) => {
    const [editedRole, setEditedRole] = useState(role);
    const handlePermissionChange = (permissionKey: string, value: boolean) => { setEditedRole(prev => ({ ...prev, [permissionKey as keyof Role]: value })); };
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEditedRole(prev => ({ ...prev, name: e.target.value })); };
    const toggleGroupPermissions = (group: { permissions: string[] }, value: boolean) => {
        const updatedPermissions: Partial<Role> = {};
        for (const key of group.permissions) { if (permissionLabels[key]) (updatedPermissions as any)[key] = value; }
        setEditedRole(prev => ({ ...prev, ...updatedPermissions }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b dark:border-gray-700"><h2 className="text-2xl font-bold dark:text-white">{'id' in editedRole ? 'Edit' : 'Create'} Role</h2></div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role Name</label>
                        <input type="text" value={editedRole.name || ''} onChange={handleNameChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="space-y-6">
                        {permissionGroups.map(group => (
                            <div key={group.title}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold dark:text-white">{group.title}</h3>
                                    <div className="flex gap-2 text-xs font-medium">
                                        <button type="button" onClick={() => toggleGroupPermissions(group, true)} className="text-blue-600 hover:underline">Select All</button>
                                        <button type="button" onClick={() => toggleGroupPermissions(group, false)} className="text-blue-600 hover:underline">Deselect All</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                                    {group.permissions.map(key => permissionLabels[key] && (
                                        <label key={key} className="flex items-center space-x-3">
                                            <input type="checkbox" checked={!!(editedRole as any)[key]} onChange={(e) => handlePermissionChange(key, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{permissionLabels[key]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-auto p-6 flex justify-end gap-4 border-t dark:border-gray-700">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={() => onSave(editedRole)} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save Role</button>
                </div>
            </div>
        </div>
    );
};


const AdminUserManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [showUserModal, setShowUserModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | Partial<User> | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role | Partial<Role> | null>(null);

    // Users Table State
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('');
    const [userCurrentPage, setUserCurrentPage] = useState(1);
    const [userSortConfig, setUserSortConfig] = useState<{ key: keyof User | 'role' | 'name'; direction: 'ascending' | 'descending' } | null>({ key: 'first_name', direction: 'ascending' });
    const USERS_PER_PAGE = 10;

    // Roles Table State
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [roleSearchTerm, setRoleSearchTerm] = useState('');
    const [roleCurrentPage, setRoleCurrentPage] = useState(1);
    const [roleSortConfig, setRoleSortConfig] = useState<{ key: keyof Role | 'created_by_name' | 'updated_by_name'; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const ROLES_PER_PAGE = 10;

    useEffect(() => {
        setLoadingUsers(true); setLoadingRoles(true);
        setTimeout(() => {
            setUsers(mockUsers);
            setRoles(mockRoles);
            setLoadingUsers(false); setLoadingRoles(false);
        }, 500);
    }, []);

    const getUserNameById = (userId: number | null): string => {
        if (userId === null) return 'System';
        const user = mockUsers.find(u => u.id === userId);
        return user ? `${user.first_name} ${user.last_name}` : 'Unknown';
    };

    // Modal Handlers
    const openUserModal = (user?: User) => { setCurrentUser(user || { first_name: '', last_name: '', email: '', role_id: 4 }); setShowUserModal(true); };
    const closeUserModal = () => { setShowUserModal(false); setCurrentUser(null); };
    const handleSaveUser = () => { console.log('Saving user:', currentUser); closeUserModal(); };

    const openRoleModal = (role?: Role) => {
        const fullRolePermissions: Partial<Role> = {};
        Object.keys(permissionLabels).forEach(key => { (fullRolePermissions as any)[key] = false; });
        setCurrentRole(role ? { ...fullRolePermissions, ...role } : { name: '', ...fullRolePermissions });
        setShowRoleModal(true);
    };
    const closeRoleModal = () => { setShowRoleModal(false); setCurrentRole(null); };
    const handleSaveRole = (roleToSave: Role | Partial<Role>) => {
        if ('id' in roleToSave) setRoles(roles.map(r => r.id === roleToSave.id ? roleToSave as Role : r));
        else setRoles([...roles, { ...roleToSave, id: Date.now() } as Role]);
        console.log('Saving role:', roleToSave);
        closeRoleModal();
    };
    const handleDeleteRole = (id: number) => { if (window.confirm("Are you sure?")) setRoles(roles.filter(r => r.id !== id)); };

    const handleAddNew = () => { if (activeTab === 'users') openUserModal(); else openRoleModal(); };
    const addButtonText = { users: 'Add New User', roles: 'Create New Role' }[activeTab];

    // Users Table Logic
    const filteredUsers = useMemo(() => users.filter(user => { const searchLower = userSearchTerm.toLowerCase(); const nameMatch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLower); const emailMatch = user.email.toLowerCase().includes(searchLower); const roleMatch = userRoleFilter ? user.role_id === parseInt(userRoleFilter) : true; return (nameMatch || emailMatch) && roleMatch; }), [users, userSearchTerm, userRoleFilter]);
    const sortedUsers = useMemo(() => { let sortable = [...filteredUsers]; if (userSortConfig) { sortable.sort((a, b) => { let aVal: any, bVal: any; if (userSortConfig.key === 'role') { aVal = roles.find(r => r.id === a.role_id)?.name || ''; bVal = roles.find(r => r.id === b.role_id)?.name || ''; } else if (userSortConfig.key === 'name') { aVal = `${a.first_name} ${a.last_name}`; bVal = `${b.first_name} ${b.last_name}`; } else { aVal = a[userSortConfig.key as keyof User]; bVal = b[userSortConfig.key as keyof User]; } if (aVal < bVal) return userSortConfig.direction === 'ascending' ? -1 : 1; if (aVal > bVal) return userSortConfig.direction === 'ascending' ? 1 : -1; return 0; }); } return sortable; }, [filteredUsers, userSortConfig, roles]);
    const paginatedUsers = useMemo(() => { const start = (userCurrentPage - 1) * USERS_PER_PAGE; return sortedUsers.slice(start, start + USERS_PER_PAGE); }, [sortedUsers, userCurrentPage]);
    const requestUserSort = (key: keyof User | 'role' | 'name') => { let dir: 'ascending' | 'descending' = 'ascending'; if (userSortConfig?.key === key && userSortConfig.direction === 'ascending') dir = 'descending'; setUserSortConfig({ key, direction: dir }); setUserCurrentPage(1); };
    const getUserSortIcon = (key: keyof User | 'role' | 'name') => { if (userSortConfig?.key !== key) return null; return userSortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 ml-1 opacity-60" /> : <ArrowDown className="h-4 w-4 ml-1 opacity-60" />; };

    // Roles Table Logic
    const filteredRoles = useMemo(() => roles.filter(r => r.name.toLowerCase().includes(roleSearchTerm.toLowerCase())), [roles, roleSearchTerm]);
    const sortedRoles = useMemo(() => { let sortable = [...filteredRoles]; if (roleSortConfig) { sortable.sort((a, b) => { let aVal: any, bVal: any; if (roleSortConfig.key === 'created_by_name') { aVal = getUserNameById(a.created_by); bVal = getUserNameById(b.created_by); } else if (roleSortConfig.key === 'updated_by_name') { aVal = getUserNameById(a.updated_by); bVal = getUserNameById(b.updated_by); } else { aVal = a[roleSortConfig.key as keyof Role]; bVal = b[roleSortConfig.key as keyof Role]; } if (aVal < bVal) return roleSortConfig.direction === 'ascending' ? -1 : 1; if (aVal > bVal) return roleSortConfig.direction === 'ascending' ? 1 : -1; return 0; }); } return sortable; }, [filteredRoles, roleSortConfig]);
    const paginatedRoles = useMemo(() => { const start = (roleCurrentPage - 1) * ROLES_PER_PAGE; return sortedRoles.slice(start, start + ROLES_PER_PAGE); }, [sortedRoles, roleCurrentPage]);
    const requestRoleSort = (key: keyof Role | 'created_by_name' | 'updated_by_name') => { let dir: 'ascending' | 'descending' = 'ascending'; if (roleSortConfig?.key === key && roleSortConfig.direction === 'ascending') dir = 'descending'; setRoleSortConfig({ key, direction: dir }); setRoleCurrentPage(1); };
    const getRoleSortIcon = (key: keyof Role | 'created_by_name' | 'updated_by_name') => { if (roleSortConfig?.key !== key) return null; return roleSortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 ml-1 opacity-60" /> : <ArrowDown className="h-4 w-4 ml-1 opacity-60" />; };

    const renderUsers = () => (
        <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-t-lg shadow-md border-b dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search by name or email..." value={userSearchTerm} onChange={e => setUserSearchTerm(e.target.value)} className="w-full p-2 pl-10 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">All Roles</option>
                            {roles.map(r => <option key={r.id} value={r.id} className="capitalize">{r.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase"><button onClick={() => requestUserSort('name')} className="flex items-center">User {getUserSortIcon('name')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase"><button onClick={() => requestUserSort('email')} className="flex items-center">Email {getUserSortIcon('email')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase"><button onClick={() => requestUserSort('role')} className="flex items-center">Role {getUserSortIcon('role')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase"><button onClick={() => requestUserSort('created_at')} className="flex items-center">Created At {getUserSortIcon('created_at')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase"><button onClick={() => requestUserSort('updated_at')} className="flex items-center">Updated At {getUserSortIcon('updated_at')}</button></th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {loadingUsers ? Array.from({ length: 5 }).map((_, i) => (<tr key={i}><td colSpan={6} className="px-6 py-4"><div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div></td></tr>))
                            : paginatedUsers.length > 0 ? paginatedUsers.map(user => {
                                const roleName = roles.find(r => r.id === user.role_id)?.name as UserRole || 'customer';
                                return (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-full object-cover" src={user.avatar_url} alt="" /></div><div className="ml-4"><div className="text-sm font-medium dark:text-white">{`${user.first_name} ${user.last_name}`}</div></div></div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getRoleColor(roleName)}`}>{roleName}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400">{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => openUserModal(user)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 mr-4"><Edit size={18} /></button><button className="text-red-600 hover:text-red-900 dark:text-red-400"><Trash2 size={18} /></button></td>
                                    </tr>
                                )
                            }) : <tr><td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">No users found.</td></tr>}
                    </tbody>
                    <Pagination colSpan={6} currentPage={userCurrentPage} totalPages={Math.ceil(sortedUsers.length / USERS_PER_PAGE)} onPageChange={setUserCurrentPage} itemsPerPage={USERS_PER_PAGE} totalItems={sortedUsers.length} />
                </table>
            </div>
        </>
    );

    const renderRoles = () => (
        <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-t-lg shadow-md border-b dark:border-gray-700">
                <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by role name..." value={roleSearchTerm} onChange={e => setRoleSearchTerm(e.target.value)} className="w-full p-2 pl-10 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase"><button onClick={() => requestRoleSort('name')} className="flex items-center">Role Name {getRoleSortIcon('name')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase"><button onClick={() => requestRoleSort('created_at')} className="flex items-center">Created At {getRoleSortIcon('created_at')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase"><button onClick={() => requestRoleSort('created_by_name')} className="flex items-center">Created By {getRoleSortIcon('created_by_name')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase"><button onClick={() => requestRoleSort('updated_at')} className="flex items-center">Updated At {getRoleSortIcon('updated_at')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase"><button onClick={() => requestRoleSort('updated_by_name')} className="flex items-center">Updated By {getRoleSortIcon('updated_by_name')}</button></th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {loadingRoles ? Array.from({ length: 3 }).map((_, i) => (<tr key={i}><td colSpan={6} className="px-6 py-4"><div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div></td></tr>))
                            : paginatedRoles.length > 0 ? paginatedRoles.map(role => (
                                <tr key={role.id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full capitalize ${getRoleColor(role.name as UserRole)}`}>{role.name}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400">{role.created_at ? new Date(role.created_at).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400">{getUserNameById(role.created_by)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400">{role.updated_at ? new Date(role.updated_at).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400">{getUserNameById(role.updated_by)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => openRoleModal(role)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 mr-4"><Edit size={18} /></button><button onClick={() => handleDeleteRole(role.id)} className="text-red-600 hover:text-red-900 dark:text-red-400"><Trash2 size={18} /></button></td>
                                </tr>
                            )) : <tr><td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">No roles found.</td></tr>}
                    </tbody>
                    <Pagination colSpan={6} currentPage={roleCurrentPage} totalPages={Math.ceil(sortedRoles.length / ROLES_PER_PAGE)} onPageChange={setRoleCurrentPage} itemsPerPage={ROLES_PER_PAGE} totalItems={sortedRoles.length} />
                </table>
            </div>
        </>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User & Role Management</h1>
                <button onClick={handleAddNew} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2">
                    <Plus size={20} /> {addButtonText}
                </button>
            </div>
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Users</button>
                    <button onClick={() => setActiveTab('roles')} className={`${activeTab === 'roles' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Roles & Permissions</button>
                </nav>
            </div>
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'roles' && renderRoles()}
            {showUserModal && currentUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">{'id' in currentUser ? 'Edit' : 'Add'} User</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium dark:text-gray-300">First Name</label><input type="text" defaultValue={currentUser.first_name} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                                <div><label className="block text-sm font-medium dark:text-gray-300">Last Name</label><input type="text" defaultValue={currentUser.last_name} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                            </div>
                            <div><label className="block text-sm font-medium dark:text-gray-300">Email</label><input type="email" defaultValue={currentUser.email} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                            <div><label className="block text-sm font-medium dark:text-gray-300">Role</label><select defaultValue={currentUser.role_id || ''} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">{roles.map(r => (<option key={r.id} value={r.id} className="capitalize">{r.name}</option>))}</select></div>
                        </form>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={closeUserModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
                            <button onClick={handleSaveUser} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save</button>
                        </div>
                    </div>
                </div>
            )}
            {showRoleModal && currentRole && <RoleModal role={currentRole} onClose={closeRoleModal} onSave={handleSaveRole} />}
        </div>
    );
};

export default AdminUserManagement;
