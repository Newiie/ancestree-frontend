"use client";

import Header from '@/components/dashboard/Header';
import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Sidebar from '@/components/dashboard/Sidebar';
import Content from '@/components/dashboard/Content';
import notificationService from '@/services/api/notificationService';
import { isReadable } from 'stream';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [isClient, setIsClient] = useState(false);

    const [selectedTab, setSelectedTab] = useState('All');

    const [notifications, setNotifications] = useState([{
        recipient: '',
        message: '',
        type: '',
        relatedId: '',
        createdAt: '',
        isRead: false,
        notificationId: ''
    }]);

    useEffect(() => {
        setIsClient(true);
        const fetchNotifications = async () => {
            try {
                const notifications = await notificationService.fetchNotifications();
                console.log("NOTIFICATIONS", notifications)
                setNotifications(notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    if (!isClient) {
        return null;  
    }

    if (!user) {
        return null;  
    }

    const handleReadNotification = async (
        notificationId : string, 
        relatedId : string,
        type : string
    ) => {
        try {
            await notificationService.readNotification(notificationId)
            router.push(`/dashboard/profile/${relatedId}`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }
  return (
      <div className="content | overflow-y-auto">
        <div className='bg-[#DFDFDF] text-black h-full p-6'>
       
          <div className='w-full p-4 h-full bg-gray-100 rounded-lg shadow-md'>

            <h1 className='text-2xl font-bold mb-4'>Notifications</h1>
            <div className='flex items-center  border-b-1 border-primary'>
                {["All"].map((item, index) => (
                    <div key={index} onClick={() => {
                        console.log(item)
                        setSelectedTab(item)
                    }} className={`text-lg pl-8 pr-8 font-semibold  border-primary transition hover:border-b-2 hover:text-primary text-muted-foreground cursor-pointer duration-300 ${selectedTab === item ? 'border-b-2 text-primary' : ''}`}>{item}</div>
                ))}
            </div>
            <div className='mt-4'>
                {notifications.map((notification) => (
                    <div 
                    key={notification.notificationId} 
                    onClick={() => handleReadNotification(notification.notificationId, notification.relatedId, notification.type)}
                    className='flex items-center text-muted-foreground gap-4 border-b border-gray-300 p-2 hover:text-black hover:bg-gray-200 cursor-pointer duration-300'>
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-primary rounded-full'></div>
                                <div className='text-lg font-semibold'>{notification.message}</div>
                            </div>
                            <div className='text-sm text-muted-foreground'>
                                {notification.createdAt ? new Date(notification.createdAt).toISOString().split('T')[0] : 'Invalid Date'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

    
  );
};

export default Page;