import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar, { SidebarItem } from '../Dashboard/dashboardComponents/SideBar Section/Sidebar';
import Body from '../Dashboard/dashboardComponents/Body Section/Body';
import Nav_Logged from '/src/components/NavBar/Nav_Logged.jsx';
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaSimplybuilt } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';

import { BarChart, Handshake, HelpCircle, Home, LucideGlasses, Settings, TreePine, User, Bell, FileArchive} from 'lucide-react';
import { AiTwotonePicture } from "react-icons/ai";


const Help = () => {
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
          <a href='/family_tree'><SidebarItem icon={<TreePine size={20} />} text="Family Tree" /></a>
          <a href='/relationships'><SidebarItem icon={<Handshake size={20} />} text="Relationships" /></a>
          <a href='/my_records'><SidebarItem icon={<FileArchive size={20} />} text="My Records" /></a>
          <a href='/memories'><SidebarItem icon={<AiTwotonePicture size={20} />} text="Gallery" /></a>
          <a href='/help'><SidebarItem icon={<HelpCircle size={20} />} text="Help" active/></a>
          <a href='/user_settings'><SidebarItem icon={<Settings size={20} />} text="Settings" /></a>

          </SideBar>
          <div className="content">

          </div>
        </div>
      </div>
    </div>
  )
}

export default Help