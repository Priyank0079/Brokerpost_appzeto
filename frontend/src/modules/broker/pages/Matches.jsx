import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bell, MapPin, Building, Ruler, Calendar, CheckCircle, ChevronRight, X } from 'lucide-react';
import ListingDetailModal from '../components/home/ListingDetailModal';
import { useAuth } from '../context/AuthContext';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
};

const Matches = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosting, setSelectedPosting] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/notifications');
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await api.patch(`/auth/notifications/${notification._id}/read`);
        setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
      } catch (err) {
        console.error('Failed to mark as read', err);
      }
    }

    if (notification.type === 'POST_MATCH' && notification.relatedId) {
      setSelectedPosting(notification.relatedId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a365d]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif text-[#1a365d] mb-2">Your Matches</h1>
        <p className="text-slate-500">View automated property matches based on your requirements and availabilities.</p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No matches yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">
            When you post a requirement or availability, we'll automatically notify you here if another broker has a matching property.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`bg-white rounded-xl shadow-sm border transition-all cursor-pointer overflow-hidden flex flex-col md:flex-row group hover:shadow-md ${!notification.isRead ? 'border-[#c8962a]/30' : 'border-slate-200'}`}
            >
              <div className={`w-1.5 shrink-0 ${!notification.isRead ? 'bg-[#c8962a]' : 'bg-transparent'}`} />
              
              <div className="p-5 md:p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm md:text-base ${!notification.isRead ? 'font-bold text-[#1a365d]' : 'font-semibold text-slate-800'}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md">
                    {timeAgo(notification.createdAt)}
                  </span>
                </div>
                
                <p className={`text-sm ${!notification.isRead ? 'text-slate-700' : 'text-slate-500'} mb-4`}>
                  {notification.message}
                </p>

                {notification.relatedId && typeof notification.relatedId === 'object' && (
                  <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                      <MapPin size={14} className="text-[#c8962a]" />
                      {notification.relatedId.location}, {notification.relatedId.city}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                      <Building size={14} className="text-blue-500" />
                      {notification.relatedId.subType?.replace(/_/g, ' ')}
                    </span>
                    {notification.relatedId.size && (
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                        <Ruler size={14} className="text-emerald-500" />
                        {notification.relatedId.size} {notification.relatedId.sizeUnit?.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-4 md:w-48 flex items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 group-hover:bg-slate-100 transition-colors">
                <span className="text-[13px] font-semibold text-[#1a365d] md:hidden">View Details</span>
                <ChevronRight className="text-slate-400 group-hover:text-[#c8962a] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPosting && (
        <ListingDetailModal 
          isOpen={!!selectedPosting}
          onClose={() => setSelectedPosting(null)}
          item={selectedPosting}
          isAuthenticated={!!user}
          user={user}
          onLogin={() => {}}
        />
      )}
    </div>
  );
};

export default Matches;
