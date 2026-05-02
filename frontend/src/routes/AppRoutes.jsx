import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BrokerLayout from '../modules/broker/components/layout/Layout';
import AdminRoutes from '../modules/admin/routes/AdminRoutes';
import { useAuth } from '../modules/broker/context/AuthContext';

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Broker Pages (Lazy Loaded)
const Home = lazy(() => import('../modules/broker/pages/Home'));
const Dashboard = lazy(() => import('../modules/broker/pages/Dashboard'));
const ResidentialInventory = lazy(() => import('../modules/broker/pages/ResidentialInventory'));
const CommercialInventory = lazy(() => import('../modules/broker/pages/CommercialInventory'));
const MyListings = lazy(() => import('../modules/broker/pages/MyListings'));
const MyRequirements = lazy(() => import('../modules/broker/pages/MyRequirements'));
const Feed = lazy(() => import('../modules/broker/pages/Feed'));
const Groups = lazy(() => import('../modules/broker/pages/Groups'));
const Subscription = lazy(() => import('../modules/broker/pages/Subscription'));
const Profile = lazy(() => import('../modules/broker/pages/Profile'));
const PropertyDetails = lazy(() => import('../modules/broker/pages/PropertyDetails'));
const Login = lazy(() => import('../modules/broker/pages/Login'));
const BrokerRegistration = lazy(() => import('../modules/broker/pages/BrokerRegistration'));
const PostProperty = lazy(() => import('../modules/broker/pages/PostProperty'));

const AdminLogin = lazy(() => import('../modules/admin/pages/Login'));

const AppRoutes = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator' || user?.role === 'Super Admin';

  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
};

export default AppRoutes;
