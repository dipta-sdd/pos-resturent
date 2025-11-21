'use client';

import React from 'react';
import { MenuItem, Category, AddOn, ItemVariant } from '@/types';
import { api } from '@/services/api';
import AdminMenuItemManagement from '@/components/dashboard/AdminMenuItemManagement';

const EditMenuItemPage: React.FC = () => {
    return <AdminMenuItemManagement />;
};

export default EditMenuItemPage;
