"use client"
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function CustomDomainLayout(props: React.PropsWithChildren<{}>) {
    return (
        <div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] h-screen">
            <Header  />
            <Sidebar />
            {props.children}
        </div>

    );
  }