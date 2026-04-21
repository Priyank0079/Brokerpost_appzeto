import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Dashboard';
import Brokers from '../pages/Brokers';
import Listings from '../pages/Listings';
import Groups from '../pages/Groups';
import Subscriptions from '../pages/Subscriptions';
import Payments from '../pages/Payments';
import Settings from '../pages/Settings';
import Reports from '../pages/Reports';
import Profile from '../pages/Profile';

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/brokers" element={<Brokers />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>


    </AdminLayout>
  );
};

export default AdminRoutes;
