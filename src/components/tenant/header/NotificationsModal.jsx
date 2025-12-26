"use client";
import React, { useState } from 'react';
import { X, Bell, Home, AlertCircle, CheckCircle, Info } from 'lucide-react';

const NotificationsModal = ({ isOpen, onClose, notifications = [] }) => {
  const [activeTab, setActiveTab] = useState('all');

  // Sample notifications data
  const sampleNotifications = [
    {
      id: 1,
      type: 'new_property',
      title: 'New Property Match',
      message: '3 new properties match your search criteria in Lilongwe',
      time: '5 min ago',
      read: false,
      icon: Home,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'price_drop',
      title: 'Price Alert',
      message: 'A property you saved dropped price by 15%',
      time: '1 hour ago',
      read: false,
      icon: AlertCircle,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'subscription',
      title: 'Subscription Update',
      message: 'Your premium subscription will expire in 3 days',
      time: '2 hours ago',
      read: true,
      icon: Info,
      color: 'text-orange-500'
    },
    {
      id: 4,
      type: 'system',
      title: 'Welcome to Nyumba App',
      message: 'Get started by exploring properties in your area',
      time: '1 day ago',
      read: true,
      icon: CheckCircle,
      color: 'text-purple-500'
    }
  ];

  const notificationsToShow = notifications.length > 0 ? notifications : sampleNotifications;

  const filteredNotifications = activeTab === 'all'
    ? notificationsToShow
    : notificationsToShow.filter(notification => !notification.read);

  const unreadCount = notificationsToShow.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[7000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-96 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'unread'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-64">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-100 ${notification.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {unreadCount > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <button className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700 py-2">
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsModal;
