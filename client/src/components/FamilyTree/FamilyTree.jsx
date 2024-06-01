import React from 'react';
import SideBar, { SidebarItem } from '../Dashboard/dashboardComponents/SideBar Section/Sidebar';
import Nav_Logged from '/src/components/NavBar/Nav_Logged.jsx';
import TreeMain from './TreeMain';
import "../../components/Dashboard/Dashboard.css";
import { BarChart, Handshake, HelpCircle, Home, LucideGlasses, Settings, TreePine, User, Bell, FileArchive } from 'lucide-react';
import { AiTwotonePicture } from "react-icons/ai";

const FamilyTree = () => {
  return (
    <div>
      <Nav_Logged />
      <div className="dashboard flex">
        <div className="dashboardContainer flex">
          <SideBar>
            <a href='/dashboard'><SidebarItem icon={<Home size={20} />} text="Home" /></a>
            <a href='/analytics'><SidebarItem icon={<BarChart size={20} />} text="Analytics" /></a>
            <a href='/profile'><SidebarItem icon={<User size={20} />} text="Profile" /></a>
            <a href='/notifications'><SidebarItem icon={<Bell size={20} />} text="Notifications" /></a>
            <a href='/family_tree'><SidebarItem icon={<TreePine size={20} />} text="Family Tree" active/></a>
            <a href='/relationships'><SidebarItem icon={<Handshake size={20} />} text="Relationships" /></a>
            <a href='/my_records'><SidebarItem icon={<FileArchive size={20} />} text="My Records" /></a>
            <a href='/memories'><SidebarItem icon={<AiTwotonePicture size={20} />} text="Gallery" /></a>
            <a href='/help'><SidebarItem icon={<HelpCircle size={20} />} text="Help" /></a>
            <a href='/user_settings'><SidebarItem icon={<Settings size={20} />} text="Settings" /></a>
          </SideBar>
          <TreeMain />
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;
