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
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-black/5' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo - Bold & Editorial */}
          <Link href="/" className="text-xl font-black uppercase tracking-[0.2em] hover:opacity-70 transition">
            VANKEA<span className="text-gray-400">.</span>
          </Link>

          {/* Desktop Navigation - Minimalist spacing */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative group ${
                  pathname === link.href ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-full ${pathname === link.href ? 'w-full' : ''}`}></span>
              </Link>
            ))}
          </div>

          {/* Right Side - Auth & Admin */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center gap-6">
                <span className="text-[10px] uppercase tracking-widest font-mono text-gray-500 italic">
                   {user.name}
                </span>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="border border-black px-5 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <Link
                  href="/login"
                  className="text-[11px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-black text-white px-6 py-2.5 text-[11px] uppercase font-bold tracking-widest hover:bg-zinc-800 transition-all duration-300"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-black"
          >
            <div className="w-6 flex flex-col items-end gap-1.5">
              <span className={`h-[1.5px] bg-black transition-all ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`h-[1.5px] bg-black transition-all ${isMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
              <span className={`h-[1.5px] bg-black transition-all ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-1' : 'w-5'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu - Full Screen Slide */}
        <div className={`fixed inset-0 bg-white z-40 transition-transform duration-500 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ top: '80px' }}>
          <div className="flex flex-col p-8 space-y-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-black uppercase tracking-tighter hover:text-gray-500"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-[1px] bg-black/5 my-4"></div>
            {!user ? (
               <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest">Login</Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold uppercase tracking-widest text-zinc-400">Sign Up</Link>
               </>
            ) : (
              <button onClick={handleLogout} className="text-left text-xl font-bold uppercase tracking-widest text-red-500">Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}