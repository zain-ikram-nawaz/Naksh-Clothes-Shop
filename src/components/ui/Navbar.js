'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    // Scroll Handler
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'bg-white border-b border-black/5' : 'bg-white md:bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="relative z-[110] text-xl font-black uppercase tracking-[0.2em]">
            Naksh<span className="text-gray-400">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-all relative group ${
                  pathname === link.href ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-black transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center gap-6">
                <span className="text-[10px] uppercase font-mono text-gray-500">{user.name}</span>
                <button onClick={handleLogout} className="text-[10px] uppercase font-bold text-red-500">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="text-[11px] font-bold uppercase">Login</Link>
            )}
          </div>

          {/* Mobile Toggle - Higher Z-Index */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative z-[110] p-2"
            aria-label="Toggle Menu"
          >
            <div className="w-6 flex flex-col items-end gap-1.5">
              <span className={`h-[1.5px] bg-black transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`h-[1.5px] bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
              <span className={`h-[1.5px] bg-black transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-1' : 'w-5'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Full Screen Fix */}
      <div
        className={`fixed inset-0 bg-white z-[105] transition-transform duration-500 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col justify-center h-full p-8 space-y-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-5xl font-black uppercase tracking-tighter"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-[1px] bg-black/10 my-4 w-12"></div>
          {!user ? (
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest">Login</Link>
          ) : (
            <button onClick={handleLogout} className="text-left text-xl font-bold uppercase text-red-500">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}