'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: '󰕒' }, // Square icon placeholder
    { href: '/admin/products', label: 'Products', icon: '󰆧' },
    { href: '/admin/categories', label: 'Categories', icon: '󰉙' },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#f8fafc] flex">

      {/* Sidebar - Your bigbeartheme style */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-black/5 transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarHovered ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header / Logo area */}
        <div className="h-16 flex items-center px-6 border-b border-black/5">
          <div className="w-8 h-8 bg-black flex-shrink-0"></div>
          <span className={`ml-4 font-black uppercase tracking-tighter transition-opacity duration-300 ${
            isSidebarHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            Vankea Admin
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 mt-6 space-y-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center h-12 rounded-none transition-all duration-200 group ${
                pathname === item.href ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
              }`}
            >
              <div className="w-12 flex-shrink-0 flex items-center justify-center text-lg">
                <span className="group-hover:scale-110 transition-transform tracking-normal">
                    {/* Yahan icons ki jagah text symbol use kiye hain, aap Lucide/HeroIcons use kar sakte hain */}
                    {item.label[0]}
                </span>
              </div>
              <span className={`whitespace-nowrap font-bold text-[11px] uppercase tracking-widest transition-opacity duration-200 ${
                isSidebarHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom Logout */}
        <div className="p-4 border-t border-black/5">
          <button
            onClick={handleLogout}
            className="flex items-center w-full h-12 text-gray-400 hover:text-red-500 transition-colors"
          >
            <div className="w-12 flex-shrink-0 flex items-center justify-center">○</div>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-opacity ${
              isSidebarHovered ? 'opacity-100' : 'opacity-0'
            }`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarHovered ? 'pl-64' : 'pl-20'}`}>

        {/* Header - Fixed */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="text-[10px] font-mono text-gray-400 tracking-widest uppercase italic">
            // Admin Panel / {pathname.split('/').pop() || 'overview'}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-[10px] font-black uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition">
              Live Site
            </Link>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold border border-black/5">
                 {user?.name?.[0]}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}