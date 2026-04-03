"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAuth from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import {
  BookImageIcon,
  BookTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  HelpCircleIcon,
  HouseIcon,
  LogOutIcon,
  MenuIcon,
  NetworkIcon,
  SettingsIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';

// Label: always mounted, fades + shrinks when collapsed so width animates cleanly
const SidebarLabel = ({ children, collapsed }: { children: React.ReactNode; collapsed: boolean }) => (
  <span
    className={`
      overflow-hidden whitespace-nowrap tracking-wide
      transition-all duration-300 ease-in-out
      ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100 delay-100'}
    `}
  >
    {children}
  </span>
);
import { useProfile } from '@/providers/ProfileProvider';

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const { userData } = useProfile();
  const pathName = usePathname();

  const toggleSidebar = () => setIsMinimized(prev => !prev);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);

  const sidebarItems = [
    { icon: <HouseIcon size={18} />, label: 'Home', url: '/dashboard' },
    { icon: <UserIcon size={18} />, label: 'Profile', url: user?.id ? `/dashboard/profile/${user.id}` : '/dashboard/profile' },
    { icon: <NetworkIcon size={18} />, label: 'Family Tree', url: `/dashboard/family-tree/${user?.id}` },
    { icon: <HeartIcon size={18} />, label: 'Relationships', url: '/dashboard/relationships' },
    { icon: <BookTextIcon size={18} />, label: 'My Records', url: '/dashboard/my-records' },
    { icon: <BookImageIcon size={18} />, label: 'Gallery', url: '/dashboard/gallery' },
  ];

  const isActive = (url: string) => {
    if (url === '/dashboard') return pathName === '/dashboard';
    return pathName.startsWith(url.split('/').slice(0, 3).join('/'));
  };

  const userName = [
    userData?.generalInformation?.firstName,
    userData?.generalInformation?.lastName,
  ].filter(Boolean).join(' ') || user?.username || 'User';

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className="flex-grow px-3 py-2 space-y-0.5">
      {sidebarItems.map((item) => {
        const active = isActive(item.url);
        const collapsed = isMinimized && !mobile;
        return (
          <Link
            href={item.url}
            key={item.label}
            onClick={mobile ? toggleMobileSidebar : undefined}
            title={collapsed ? item.label : undefined}
            className={`
              group flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium
              transition-colors duration-200 relative
              ${collapsed ? 'px-2 justify-center' : 'px-3'}
              ${active
                ? 'bg-white/15 text-white'
                : 'text-white/60 hover:bg-white/10 hover:text-white/90'
              }
            `}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#D4F3C0] rounded-full" />
            )}
            <span className={`flex-shrink-0 transition-colors ${active ? 'text-[#D4F3C0]' : 'text-white/50 group-hover:text-white/80'}`}>
              {item.icon}
            </span>
            {!mobile && <SidebarLabel collapsed={collapsed}>{item.label}</SidebarLabel>}
            {mobile && <span className="tracking-wide">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  const UserFooter = ({ mobile = false }: { mobile?: boolean }) => {
    const collapsed = isMinimized && !mobile;
    return (
    <Popover>
      <div className="px-3 pt-3 pb-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="relative flex-shrink-0">
            <Image
              src={userData?.profilePicture || '/images/doge.png'}
              alt="Profile"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#D4F3C0]/40"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#D4F3C0] rounded-full border-2 border-[#1B5A1B]" />
          </div>
          <div className={`flex-grow min-w-0 transition-all duration-300 ease-in-out ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[120px] opacity-100 delay-100'}`}>
            <p className="text-sm font-semibold text-white truncate leading-tight">{userName}</p>
            <p className="text-xs text-white/40 truncate leading-tight">Online</p>
          </div>
          <div className={`flex-shrink-0 transition-all duration-300 ease-in-out ${collapsed ? 'max-w-0 opacity-0 overflow-hidden' : 'max-w-[28px] opacity-100 delay-100'}`}>
            <PopoverTrigger asChild>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <SettingsIcon size={14} />
              </button>
            </PopoverTrigger>
          </div>
        </div>
      </div>
      <PopoverContent side="top" align="end" className="w-44 p-1">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOutIcon size={14} />
          Logout
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircleIcon size={14} />
          Help
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <SettingsIcon size={14} />
          Settings
        </button>
      </PopoverContent>
    </Popover>
  );};

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <div
        className={`
          hidden md:flex flex-col h-full
          bg-[#1B5A1B]
          transition-[width] duration-300 ease-in-out
          ${isMinimized ? 'w-[4.5rem]' : 'w-[14rem]'}
        `}
      >
        <div className="pt-4" />

        <NavLinks />

        <UserFooter />

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="mx-auto mb-3 w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/10 transition-colors"
        >
          {isMinimized ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
        </button>
      </div>

      {/* ── Mobile Trigger ── */}
      <button
        className={`
          md:hidden fixed top-4 left-4 z-50
          w-9 h-9 flex items-center justify-center
          bg-[#1B5A1B] rounded-xl shadow-lg text-white
          transition-all duration-300
          ${isMobileSidebarOpen ? 'opacity-0 pointer-events-none -translate-x-2' : 'opacity-100'}
        `}
        onClick={toggleMobileSidebar}
      >
        <MenuIcon size={16} />
      </button>

      {/* ── Mobile Sidebar ── */}
      <div
        className={`
          md:hidden fixed inset-0 z-40
          transition-all duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'bg-black/50 visible' : 'bg-transparent invisible'}
        `}
        onClick={toggleMobileSidebar}
      >
        <div
          className={`
            absolute left-0 top-0 h-full w-72 bg-[#1B5A1B] shadow-2xl
            flex flex-col
            transform transition-transform duration-300 ease-in-out
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile header */}
          <div className="flex items-center justify-end px-4 py-4 border-b border-white/10">
            <button
              onClick={toggleMobileSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <XIcon size={16} />
            </button>
          </div>

          <NavLinks mobile />
          <UserFooter mobile />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
