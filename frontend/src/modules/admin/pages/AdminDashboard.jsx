import React from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Console</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card>
            <h3 className="text-sm font-medium text-slate-500">Total Brokers</h3>
            <p className="text-2xl font-bold">1,240</p>
         </Card>
         <Card>
            <h3 className="text-sm font-medium text-slate-500">Platform Revenue</h3>
            <p className="text-2xl font-bold text-emerald-600">₹4.5L</p>
         </Card>
         <Card>
            <h3 className="text-sm font-medium text-slate-500">Active Sessions</h3>
            <p className="text-2xl font-bold text-blue-600">84</p>
         </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
