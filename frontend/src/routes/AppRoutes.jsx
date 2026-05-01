import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BrokerLayout from '../modules/broker/components/layout/Layout';
import AdminRoutes from '../modules/admin/routes/AdminRoutes';
import { useAuth } from '../modules/broker/context/AuthContext';

// Broker Pages
import Home from '../modules/broker/pages/Home';
import Dashboard from '../modules/broker/pages/Dashboard';
import ResidentialInventory from '../modules/broker/pages/ResidentialInventory';
import CommercialInventory from '../modules/broker/pages/CommercialInventory';
import MyListings from '../modules/broker/pages/MyListings';
import MyRequirements from '../modules/broker/pages/MyRequirements';
import Feed from '../modules/broker/pages/Feed';
import Groups from '../modules/broker/pages/Groups';
import Subscription from '../modules/broker/pages/Subscription';
import Profile from '../modules/broker/pages/Profile';
import PropertyDetails from '../modules/broker/pages/PropertyDetails';
import Login from '../modules/broker/pages/Login';
import BrokerRegistration from '../modules/broker/pages/BrokerRegistration';
import PostProperty from '../modules/broker/pages/PostProperty';

import AdminLogin from '../modules/admin/pages/Login';

const AppRoutes = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator' || user?.role === 'Super Admin';

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={
        user ? (
          <BrokerLayout><Home /></BrokerLayout>
        ) : (
          <Home />
        )
      } />

      {/* Auth */}
      <Route path="/login" element={
        !user ? (
          <Login />
        ) : (
          <Navigate to={isAdmin ? "/admin" : "/dashboard"} />
        )
      } />
      <Route path="/register" element={<BrokerRegistration />} />
      <Route path="/admin/login" element={!isAdmin ? <AdminLogin /> : <Navigate to="/admin" />} />

      {/* Admin Module */}
      <Route path="/admin/*" element={isAdmin ? <AdminRoutes /> : <Navigate to="/admin/login" />} />

      {/* Protected Broker Module */}
      <Route path="/*" element={
        user ? (
          <BrokerLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/residential" element={<ResidentialInventory />} />
              <Route path="/commercial" element={<CommercialInventory />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/my-requirements" element={<MyRequirements />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Profile title="Account Settings" />} />
              <Route path="/post-property" element={<PostProperty />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </BrokerLayout>
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
};

export default AppRoutes;
