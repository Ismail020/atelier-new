'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface MenuItem {
  page?: {
    slug?: { current?: string };
    name?: string;
  };
  mobileImage?: {
    asset: {
      _ref: string;
    };
  };
}

interface NavbarData {
  navbarStructure: {
    brandText: string;
    logo?: {
      asset: {
        _ref: string;
      };
    };
    menuItems: {
      menuItemsEN: MenuItem[];
      menuItemsFR: MenuItem[];
    };
  };
}

interface NavbarProps {
  data: NavbarData;
  currentLanguage?: 'en' | 'fr';
}

export default function Navbar({ data, currentLanguage = 'en' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = currentLanguage === 'en' 
    ? data.navbarStructure.menuItems.menuItemsEN 
    : data.navbarStructure.menuItems.menuItemsFR;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3">
            {isScrolled && data.navbarStructure.logo ? (
              <Image
                src={urlFor(data.navbarStructure.logo).width(120).height(40).url()}
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            ) : (
              <span className="text-xl font-bold text-gray-900">
                {data.navbarStructure.brandText}
              </span>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems?.filter(item => item.page?.slug?.current).map((item, index) => (
              <Link
                key={index}
                href={`/${item.page.slug.current}`}
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
              >
                {item.page.name || 'Page'}
              </Link>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              className={`px-3 py-1 rounded ${
                currentLanguage === 'en' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              EN
            </button>
            <button
              className={`px-3 py-1 rounded ${
                currentLanguage === 'fr' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              FR
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="grid grid-cols-1 gap-4">
              {menuItems?.filter(item => item.page?.slug?.current).map((item, index) => (
                <Link
                  key={index}
                  href={`/${item.page.slug.current}`}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.mobileImage && (
                    <Image
                      src={urlFor(item.mobileImage).width(48).height(48).url()}
                      alt={item.page.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  )}
                  <span className="text-gray-900 font-medium">{item.page.name || 'Page'}</span>
                </Link>
              ))}
            </div>
            
            {/* Mobile Language Switcher */}
            <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
              <button
                className={`flex-1 py-2 px-3 rounded ${
                  currentLanguage === 'en' ? 'bg-gray-900 text-white' : 'text-gray-700 bg-gray-100'
                }`}
              >
                English
              </button>
              <button
                className={`flex-1 py-2 px-3 rounded ${
                  currentLanguage === 'fr' ? 'bg-gray-900 text-white' : 'text-gray-700 bg-gray-100'
                }`}
              >
                Français
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}