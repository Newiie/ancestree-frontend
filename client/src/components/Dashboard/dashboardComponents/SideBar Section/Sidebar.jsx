import React, { useEffect, useContext, createContext, useState } from 'react';
import './Sidebar.css';
import { MoreVertical, ChevronLast, ChevronFirst } from 'lucide-react';
import logo from "../../dashboardAssets/doge.png";
import { auth, db } from "../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { RxDashboard } from "react-icons/rx";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [userDetails, setUserDetails] =useState(null)

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
    <aside className="sidebar-container">
      <nav className="sidebar-nav">
        <div className="sidebar-header">
          <img
            src={logo}
            className={`logo ${expanded ? 'expanded' : 'collapsed'}`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="toggle-btn"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="sidebar-content">{children}</ul>
        </SidebarContext.Provider>

        <div className="sidebar-footer">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="user-avatar"
          />
          <div className={`user-info ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className="user-details">
              <h4 className="user-name">
              {userDetails ? `Hello, ${userDetails.user_name}` : 'WELCOME'}
              </h4>
              <span className="user-email">
              {userDetails ? `${userDetails.email}` : 'WELCOME'}
              </span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`sidebar-item ${active ? 'active' : 'inactive'} ${expanded ? 'expanded' : 'collapsed'}`}
    >
      {icon}
      <span className={`item-text ${expanded ? 'expanded' : 'collapsed'}`}>{text}</span>
      {alert && <div className="item-alert" />}
      {!expanded && <div className="item-tooltip">{text}</div>}
    </li>
  );
}
