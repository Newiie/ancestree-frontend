"use client";

import Header from '@/components/dashboard/Header';
import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Sidebar from '@/components/dashboard/Sidebar';
import Content from '@/components/dashboard/Content';
import notificationService from '@/services/api/notificationService';
import treeService from '@/services/api/treeService';
import { isReadable } from 'stream';
import { useRouter } from 'next/navigation';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"


const Page = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [isClient, setIsClient] = useState(false);
    const [selectedTab, setSelectedTab] = useState('All');
    const [apiEvent, setApiEvent] = useState(false);
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
    }, [apiEvent]);

    if (!isClient) {
        return null;  
    }

    if (!user) {
        return null;  
    }



    const handleReadNotification = async (
        notificationId : string, 
        relatedId : string,
    ) => {
        try {
            await notificationService.readNotification(notificationId)
            router.push(`/dashboard/profile/${relatedId}`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    const handleAcceptConnection = async (
        notificationId : string, 
        nodeId : string,
    ) => {
        try {
            await notificationService.readNotification(notificationId);
            await treeService.acceptConnectionRequest(nodeId);
            setApiEvent(!apiEvent);
        } catch (error) {
            console.error('Error accepting connection:', error);
        }
    }

    const handleDeclineConnection = async (
        notificationId : string, 
    ) => {
        try {
            await notificationService.readNotification(notificationId);
            setApiEvent(!apiEvent);
        } catch (error) {
            console.error('Error declining connection:', error);
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
                {notifications.length === 0 ? (
                    <div className="flex justify-center py-8 text-muted-foreground">
                        <p className="text-[2rem]">No notifications to display</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <Popover key={notification.notificationId}>
                            <PopoverTrigger 
                                className='flex items-center w-full text-muted-foreground gap-4 border-b border-gray-300 p-2 hover:text-black hover:bg-gray-200 cursor-pointer duration-300'
                                onClick={() => {
                                    if (notification.type === 'GENERAL') {
                                        handleReadNotification(notification.notificationId, notification.relatedId);
                                    }
                                    if (notification.type === 'MATCH' || notification.type === 'FRIEND_REQUEST') {
                                        handleReadNotification(notification.notificationId, notification.relatedId);
                                    }
                                }}
                            >
                                <div className='flex items-center justify-between w-full'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-2 h-2 bg-primary rounded-full'></div>
                                        <div className='text-lg font-semibold'>{notification.message}</div>
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                        {notification.createdAt ? new Date(notification.createdAt).toISOString().split('T')[0] : 'Invalid Date'}
                                    </div>
                                </div>
                            </PopoverTrigger>
                            {notification.type === 'CONNECT' && (
                                <PopoverContent className="w-fit">
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => handleAcceptConnection(notification.notificationId, notification.relatedId)}
                                            className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleDeclineConnection(notification.notificationId)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-md"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </PopoverContent>
                            )}
                        </Popover>
                    ))
                )}
            </div>
          </div>
        </div>
      </div>

    
  );
};

export default Page;