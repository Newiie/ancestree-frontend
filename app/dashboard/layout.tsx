"use client"

import React, { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import useAuth from "@/hooks/useAuth";
import { ProfileProvider } from "@/providers/ProfileProvider";

export default function CustomDomainLayout(props: React.PropsWithChildren<{}>) {
    const { user } = useAuth();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;  
    }

    if (!user) {
        return null;  
    }

    return (
        <ProfileProvider userId={user.id as string}> 
            <div className="grid grid-rows-[auto_1fr]  grid-cols-[1fr] md:grid-cols-[auto_1fr]  h-screen">
                <Header  />
                <Sidebar />
                {props.children}
            </div>
        </ProfileProvider>

    );
  }