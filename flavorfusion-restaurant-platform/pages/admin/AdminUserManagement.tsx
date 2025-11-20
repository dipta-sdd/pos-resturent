import React, { useState } from 'react';
import { mockUsers, mockRoles } from '../../data/mockData';
import { User, UserRole, Role } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

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
  can_manage_shop_settings: "Manage Shop Settings",
  can_manage_billing_and_plan: "Manage Billing and Plan",
  can_manage_branches_and_counters: "Manage Branches and Counters",
  can_manage_payment_methods: "Manage Payment Methods",
  can_configure_taxes: "Configure Taxes",
  can_customize_receipts: "Customize Receipts",
  can_manage_staff: "Manage Staff",
  can_manage_roles_and_permissions: "Manage Roles and Permissions",
  can_view_user_activity_log: "View User Activity Log",
  can_view_products: "View Products",
  can_manage_products: "Manage Products",
  can_manage_categories: "Manage Categories",
  can_manage_units_of_measure: "Manage Units of Measure",
  can_import_products: "Import Products",
  can_export_products: "Export Products",
  can_view_inventory_levels: "View Inventory Levels",
  can_perform_stock_adjustments: "Perform Stock Adjustments",
  can_manage_stock_transfers: "Manage Stock Transfers",
  can_manage_purchase_orders: "Manage Purchase Orders",
  can_receive_purchase_orders: "Receive Purchase Orders",
  can_manage_suppliers: "Manage Suppliers",
  can_use_pos: "Use POS",
  can_view_sales_history: "View Sales History",
  can_override_prices: "Override Prices",
  can_apply_manual_discounts: "Apply Manual Discounts",
  can_void_sales: "Void Sales",
  can_process_returns: "Process Returns",
  can_issue_cash_refunds: "Issue Cash Refunds",
  can_issue_store_credit: "Issue Store Credit",
  can_open_close_cash_register: "Open/Close Cash Register",
  can_perform_cash_transactions: "Perform Cash Transactions",
  can_view_customers: "View Customers",
  can_manage_customers: "Manage Customers",
  can_manage_expenses: "Manage Expenses",
  can_view_dashboard: "View Dashboard",
  can_view_reports: "View Reports",
  can_view_profit_loss_data: "View Profit/Loss Data",
  can_export_data: "Export Data",
};

const permissionGroups = [
  {
    title: "General Settings",
    permissions: [
      'can_manage_shop_settings', 'can_manage_billing_and_plan', 'can_manage_branches_and_counters',
      'can_manage_payment_methods', 'can_configure_taxes', 'can_customize_receipts'
    ]
  },
  {
    title: "User Management",
    permissions: ['can_manage_staff', 'can_manage_roles_and_permissions', 'can_view_user_activity_log']
  },
  {
    title: "Product & Inventory",
    permissions: [
      'can_view_products', 'can_manage_products', 'can_manage_categories', 'can_manage_units_of_measure',
      'can_import_products', 'can_export_products', 'can_view_inventory_levels', 'can_perform_stock_adjustments',
      'can_manage_stock_transfers', 'can_manage_purchase_orders', 'can_receive_purchase_orders', 'can_manage_suppliers'
    ]
  },
  {
    title: "Point of Sale (POS)",
    permissions: [
      'can_use_pos', 'can_view_sales_history', 'can_override_prices', 'can_apply_manual_discounts',
      'can_void_sales', 'can_process_returns', 'can_issue_cash_refunds', 'can_issue_store_credit',
      'can_open_close_cash_register', 'can_perform_cash_transactions'
    ]
  },
  {
    title: "Customer Management",
    permissions: ['can_view_customers', 'can_manage_customers']
  },
  {
    title: "Financials",
    permissions: ['can_manage_expenses', 'can_view_profit_loss_data']
  },
  {
    title: "Reporting & Analytics",
    permissions: ['can_view_dashboard', 'can_view_reports', 'can_export_data']
  }
];

interface RoleModalProps {
    role: Role | Partial<Role>;
    onClose: () => void;
    onSave: (role: Role | Partial<Role>) => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ role, onClose, onSave }) => {
    const [editedRole, setEditedRole] = useState(role);

    const handlePermissionChange = (permissionKey: string, value: boolean) => {
        setEditedRole(prev => ({
            ...prev,
            [permissionKey as keyof Role]: value
        }));
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedRole(prev => ({ ...prev, name: e.target.value }));
    };

    const toggleGroupPermissions = (group: { title: string; permissions: string[] }, value: boolean) => {
        const updatedPermissions: Partial<Role> = {};
        for (const key of group.permissions) {
            // FIX: Type 'boolean' is not assignable to type 'never'.
            // This is due to TypeScript's strict index signature checking. By casting to `any`,
            // we bypass this check, as we know the `key` corresponds to a boolean property.
            (updatedPermissions as any)[key] = value;
        }
        setEditedRole(prev => ({ ...prev, ...updatedPermissions }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold dark:text-white">{'id' in editedRole ? 'Edit' : 'Create'} Role</h2>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role Name</label>
                        <input
                            type="text"
                            value={editedRole.name || ''}
                            onChange={handleNameChange}
                            className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
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
                                    {group.permissions.map(key => (
                                        <label key={key} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={!!(editedRole as any)[key]}
                                                onChange={(e) => handlePermissionChange(key, e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                            />
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

    // User management state
    const [showUserModal, setShowUserModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | Partial<User> | null>(null);

    // Role management state
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role | Partial<Role> | null>(null);

    const openUserModal = (user?: User) => {
        setCurrentUser(user || { firstName: '', lastName: '', email: '', role_id: 4 });
        setShowUserModal(true);
    };

    const closeUserModal = () => {
        setShowUserModal(false);
        setCurrentUser(null);
    };

    const handleSaveUser = () => {
        console.log('Saving user:', currentUser);
        closeUserModal();
    };
    
    const openRoleModal = (role?: Role) => {
        const fullRolePermissions: Partial<Role> = {};
        Object.keys(permissionLabels).forEach(key => {
            (fullRolePermissions as any)[key] = false;
        });

        setCurrentRole(role ? {...fullRolePermissions, ...role} : { name: '', ...fullRolePermissions });
        setShowRoleModal(true);
    };

    const closeRoleModal = () => {
        setShowRoleModal(false);
        setCurrentRole(null);
    };

    const handleSaveRole = (roleToSave: Role | Partial<Role>) => {
        if ('id' in roleToSave) {
            setRoles(roles.map(r => r.id === roleToSave.id ? roleToSave as Role : r));
        } else {
            const newRole = { ...roleToSave, id: Date.now() } as Role;
            setRoles([...roles, newRole]);
        }
        console.log('Saving role:', roleToSave);
        closeRoleModal();
    };

    const handleDeleteRole = (id: number) => {
        if (window.confirm("Are you sure you want to delete this role? This might affect users with this role.")) {
            setRoles(roles.filter(r => r.id !== id));
        }
    };

    const handleAddNew = () => {
        if (activeTab === 'users') {
            openUserModal();
        } else {
            openRoleModal();
        }
    };
    
    const addButtonText = {
        users: 'Add New User',
        roles: 'Create New Role'
    }[activeTab];

    const renderUsers = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockUsers.map(user => {
                        const roleName = roles.find(r => r.id === user.role_id)?.name as UserRole || 'customer';
                        const userName = `${user.firstName} ${user.lastName}`;
                        return (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={user.avatar_url} alt={userName} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{userName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getRoleColor(roleName)}`}>
                                        {roleName}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openUserModal(user)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-4"><Edit size={18} /></button>
                                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );

    const renderRoles = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role Name</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {roles.map(role => (
                        <tr key={role.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full capitalize ${getRoleColor(role.name as UserRole)}`}>
                                    {role.name}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => openRoleModal(role)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-4"><Edit size={18} /></button>
                                <button onClick={() => handleDeleteRole(role.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                    <input type="text" defaultValue={currentUser.firstName} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                    <input type="text" defaultValue={currentUser.lastName} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input type="email" defaultValue={currentUser.email} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                                <select defaultValue={currentUser.role_id || ''} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id} className="capitalize">{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </form>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={closeUserModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
                            <button onClick={handleSaveUser} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {showRoleModal && currentRole && (
                <RoleModal 
                    role={currentRole}
                    onClose={closeRoleModal}
                    onSave={handleSaveRole}
                />
            )}
        </div>
    );
};

export default AdminUserManagement;