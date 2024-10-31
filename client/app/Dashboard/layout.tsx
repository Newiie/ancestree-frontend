"use client"
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { TreeProvider } from "@/providers/TreeProvider";

export default function CustomDomainLayout(props: React.PropsWithChildren<{}>) {
    return (
        <TreeProvider>
        <div className="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] h-screen">
            <Header  />
            <Sidebar />
            {props.children}
        </div>
        </TreeProvider>
    );
  }