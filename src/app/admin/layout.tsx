"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-green-600">Memeriksa sesi...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white shadow-sm flex flex-col overflow-hidden
        transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 w-64 border-r border-gray-200' : '-translate-x-full w-64 border-r border-gray-200 md:translate-x-0'}
        ${isSidebarOpen ? 'md:w-64 md:border-r md:border-gray-200 md:static' : 'md:w-0 md:border-none md:-translate-x-full md:absolute'}
      `}>
        <div className="p-4 border-b border-gray-200 flex flex-col items-center justify-center relative min-h-35">
          <div className="flex gap-4 justify-center mb-3">
            <div className="w-16 h-16 flex items-center justify-center relative shrink-0">
              <Image src={require('@/assets/logoHD.png')} alt="Logo Pondok" fill className="object-contain drop-shadow-md" />
            </div>
            <div className="w-16 h-16 flex items-center justify-center relative shrink-0">
              <Image src={require('@/assets/logoikadha.png')} alt="Logo IKADHA" fill className="object-contain drop-shadow-md" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-[10px] sm:text-xs font-bold text-green-700 uppercase tracking-wider leading-tight">Yayasan Pondok Pesantren<br/>Darul Huda Mayak</h1>
            <h2 className="text-[10px] font-semibold text-yellow-600 uppercase leading-tight">Ikatan Alumni Darul Huda Mayak</h2>
            <p className="text-xs font-bold text-yellow-500 pt-1">Angkatan 2025</p>
          </div>
          
          <button 
            className="md:hidden text-gray-400 hover:text-gray-600 absolute top-2 right-2 p-1"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link 
            href="/admin" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-green-800 bg-green-50 hover:bg-green-100 border border-transparent hover:border-green-200 font-medium transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Overview
          </Link>

          {/* Menu Database (Dropdown) */}
          <div className="space-y-1">
            <button 
              onClick={() => setIsDatabaseOpen(!isDatabaseOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-green-50 hover:bg-green-100 border border-transparent hover:border-green-200 text-green-800 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
                Database
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isDatabaseOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
            </button>
            
            {/* Submenus */}
            {isDatabaseOpen && (
              <div className="pl-10 space-y-1 pt-1">
                <Link href="/admin/database/file" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm rounded-md text-gray-600 hover:text-green-700 hover:bg-yellow-50 transition-colors">
                  Data File
                </Link>
                <Link href="/admin/database/santri" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm rounded-md text-gray-600 hover:text-green-700 hover:bg-yellow-50 transition-colors">
                  Data Alumni Angkatan 25
                </Link>
                <Link href="/admin/database/pengurus" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm rounded-md text-gray-600 hover:text-green-700 hover:bg-yellow-50 transition-colors">
                  Data Kepengurusan
                </Link>
              </div>
            )}
          </div>
          
          <Link 
            href="/admin/gallery" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-yellow-50 hover:text-green-700 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            Galeri
          </Link>
          
          <Link 
            href="/admin/testimonials" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-yellow-50 hover:text-green-700 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            Testimoni
          </Link>
          
          <Link 
            href="/admin/berita" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-yellow-50 hover:text-green-700 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
            Berita
          </Link>
          
          <Link 
            href="/admin/settings" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-yellow-50 hover:text-green-700 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Pengaturan Web
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full relative transition-all duration-300">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-500 hover:text-green-600 p-2 -ml-2 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            
            {/* Desktop Sidebar Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:block text-gray-500 hover:text-green-600 p-2 -ml-2 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
            </button>
          </div>
          
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">Admin User</span>
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-green-700 font-bold border border-yellow-300 shadow-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 w-full bg-gray-50">
          <div className="max-w-6xl mx-auto pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
