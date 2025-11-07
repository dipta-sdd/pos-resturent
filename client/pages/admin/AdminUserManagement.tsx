import React, { useState } from 'react';
import { mockUsers, mockRoles } from '../../data/mockData';
import { User, UserRole } from '../../types';
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

const AdminUserManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | Partial<User> | null>(null);

  const openModal = (user?: User) => {
    // FIX: Use properties that exist on the User type (firstName, lastName, role_id).
    setCurrentUser(user || { firstName: '', lastName: '', email: '', role_id: 4 });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleSave = () => {
    // In a real app, you'd save the data to your backend
    console.log('Saving user:', currentUser);
    closeModal();
  };

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
        <button onClick={() => openModal()} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2">
            <Plus size={20} /> Add New User
        </button>
      </div>

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
              // FIX: Get role name from role_id to use for display and styling.
              const roleName = mockRoles.find(r => r.id === user.role_id)?.name as UserRole || 'customer';
              const userName = `${user.firstName} ${user.lastName}`;
              return (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {/* FIX: Use combined userName for the alt text. */}
                      <img className="h-10 w-10 rounded-full object-cover" src={user.avatar_url} alt={userName} />
                    </div>
                    <div className="ml-4">
                      {/* FIX: Display user's full name from firstName and lastName. */}
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{userName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* FIX: Use roleName for styling and display. */}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getRoleColor(roleName)}`}>
                    {roleName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(user)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-4"><Edit size={18} /></button>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

       {showModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{'id' in currentUser ? 'Edit' : 'Add'} User</h2>
            <form className="space-y-4">
              {/* FIX: Use firstName and lastName instead of a single name field. */}
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
                {/* FIX: Use role_id and populate options from mockRoles. */}
                <select defaultValue={currentUser.role_id || ''} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {mockRoles.map(r => (
                      <option key={r.id} value={r.id} className="capitalize">{r.name}</option>
                    ))}
                </select>
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={handleSave} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUserManagement;
