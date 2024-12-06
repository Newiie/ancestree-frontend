"use client"
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import useAuth from "@/hooks/useAuth";
import { ProfileProvider } from "@/providers/ProfileProvider";

export default function CustomDomainLayout(props: React.PropsWithChildren<{}>) {
    const { user } = useAuth();
    return (
        <ProfileProvider userId={user.id as string}> 
        <div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] h-screen">
            <Header  />
            <Sidebar />
            {props.children}
        </div>
        </ProfileProvider>

    );
  }