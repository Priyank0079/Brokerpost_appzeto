import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

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

const NotificationBell = ({ onNotificationClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/auth/notifications/unread-count');
      if (res.success) {
        setUnreadCount(res.count);
      }
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/notifications');
      if (res.success) {
        setNotifications(res.data);
        const unread = res.data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  // Poll every 30 seconds for unread count
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch full list when opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.patch(`/auth/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    setIsOpen(false);
    
    // If it's a POST_MATCH, open the modal with the related posting
    if (notification.type === 'POST_MATCH' && notification.relatedId) {
      if (onNotificationClick) {
        onNotificationClick(notification.relatedId);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-[#0F172A]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-full lg:bottom-auto lg:top-full right-0 lg:left-0 mb-2 lg:mb-0 lg:mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
          <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800 text-[13px]">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[11px] text-slate-500 font-medium bg-slate-200 px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate-400 text-[12px]">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <Bell size={24} className="mx-auto mb-2 opacity-20" />
                <p className="text-[12px]">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 cursor-pointer transition-colors hover:bg-slate-50 ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className={`text-[12px] flex-1 ${!notification.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug ${!notification.isRead ? 'text-slate-700' : 'text-slate-500'}`}>
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
