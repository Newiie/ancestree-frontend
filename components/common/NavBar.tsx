import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation'

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (pathname !== '/login' && pathname !== '/register' && pathname !== '/' && pathname !== '/about' && pathname !== '/contact') {
    return null;
  }

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

          <div className='hidden md:flex gap-4'>
            <Link 
                href="/about" 
                className="hidden md:flex text-nav hover:text-primary text-sm font-medium transition-colors relative group"
              >
                <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
                  About
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                </span>
              </Link>
              <Link 
                href="/contact" 
                className="hidden md:flex text-nav hover:text-primary text-sm font-medium transition-colors relative group"
              >
                <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
                  Contact
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                </span>
              </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link 
              href="/about" 
              className="flex md:hidden text-nav hover:text-primary text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="flex md:hidden text-nav hover:text-primary text-sm font-medium transition-colors"
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
          <div className="md:hidden absolute inset-x-0 top-16 bg-white">
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <Link 
                href="/about" 
                className="text-nav hover:text-primary text-base font-medium"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-nav hover:text-primary text-base font-medium"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <div className="w-full flex flex-col items-center space-y-2 pt-4 border-t border-gray-200">
                <Link 
                  href="/login" 
                  className="w-3/4 text-center py-2 px-4 text-sm rounded-md text-primary bg-secondary-btn hover:bg-secondary-btn-hover"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="w-3/4 text-center py-2 px-4 text-sm rounded-md text-white bg-primary hover:bg-primary-dark"
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
