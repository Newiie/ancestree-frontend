import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useAuth from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (user.id != null) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Image 
              src="/images/favicon.ico" 
              alt='logo' 
              height={35} 
              width={35} 
              className="mr-3"
            />
            <Link 
              href="/" 
              className="text-primary text-xl font-medium hover:text-primary-dark transition-colors"
            >
              AncesTREE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link 
              href="/about" 
              className="text-nav hover:text-primary text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-nav hover:text-primary text-sm font-medium transition-colors"
            >
              Contact
            </Link>
            
            {/* Authentication Buttons */}
            <div className="flex space-x-2">
              <Link 
                href="/login" 
                className="py-2 px-4 text-sm rounded-md text-primary bg-secondary-btn hover:bg-secondary-btn-hover transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="py-2 px-4 text-sm rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/about" 
                className="text-nav hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-nav hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex flex-col px-2 space-y-2">
                <Link 
                  href="/login" 
                  className="block w-full text-center py-2 px-4 text-sm rounded-md text-primary bg-secondary-btn hover:bg-secondary-btn-hover"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="block w-full text-center py-2 px-4 text-sm rounded-md text-white bg-primary hover:bg-primary-dark"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
