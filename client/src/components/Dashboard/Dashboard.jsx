import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar, { SidebarItem } from '../Dashboard/dashboardComponents/SideBar Section/Sidebar';
import Body from '../Dashboard/dashboardComponents/Body Section/Body';
import Nav_Logged from '/src/components/NavBar/Nav_Logged.jsx';
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { BarChart, Bell, File, FileArchive, FrameIcon, GalleryThumbnails, Handshake, HelpCircle, Home, LucideFrame, LucideGlasses, MailIcon, MemoryStick, Settings, TreePine, User } from 'lucide-react';
import { FaRecordVinyl, FaSimplybuilt } from 'react-icons/fa';
import { AiTwotonePicture } from "react-icons/ai";
import { ToastContainer } from 'react-toastify';
import "./Dashboard.css"

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigateTo = useNavigate();

  const fetchUserData = async (user) => {
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setUserDetails(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Nav_Logged />
      <div className="dashboard flex">
        <div className="dashboardContainer flex">
          <SideBar>
          <a href='/dashboard'><SidebarItem icon={<Home size={20} />} text="Home" active/></a>
          <a href='/analytics'><SidebarItem icon={<BarChart size={20} />} text="Analytics"/></a>
          <a href='/profile'><SidebarItem icon={<User size={20} />} text="Profile" /></a>
          <a href='/notifications'><SidebarItem icon={<Bell size={20} />} text="Notifications" /></a>
          <a href='/family_tree'><SidebarItem icon={<TreePine size={20} />} text="Family Tree" /></a>
          <a href='/relationships'><SidebarItem icon={<Handshake size={20} />} text="Relationships" /></a>
          <a href='/my_records'><SidebarItem icon={<FileArchive size={20} />} text="My Records" /></a>
          <a href='/memories'><SidebarItem icon={<AiTwotonePicture size={20} />} text="Gallery" /></a>
          <a href='/help'><SidebarItem icon={<HelpCircle size={20} />} text="Help" /></a>
          <a href='/user_settings'><SidebarItem icon={<Settings size={20} />} text="Settings" /></a>

          </SideBar>
          <Body />
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;
