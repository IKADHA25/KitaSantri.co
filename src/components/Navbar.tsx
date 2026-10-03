"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logoIkadha from "@/assets/logoikadha.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profilOpen, setProfilOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  return (
    <nav className="bg-linear-to-r from-emerald-400 to-green-500 sticky top-0 z-50 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              {/* Logo Asli */}
              <div className="bg-white p-1 rounded-full shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                <Image src={logoIkadha} alt="Logo IKADHA 25" className="w-10 h-10 object-contain" priority />
              </div>
              
              {/* Teks Logo */}
              <div className="flex flex-col group-hover:opacity-90 transition-opacity">
                <span className="text-xl md:text-2xl font-black tracking-tighter text-white drop-shadow-sm leading-none">
                  IKADHA 25
                </span>
                <span className="text-[0.55rem] md:text-[0.65rem] font-bold text-emerald-100 uppercase tracking-widest mt-1">
                  Ikatan Alumni Darul Huda Angkatan 2025
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-end items-center space-x-2">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${pathname === '/' ? 'text-green-700 bg-white shadow-sm' : 'text-white hover:bg-white/20'}`}
            >
              Home
            </Link>
            
            {/* Dropdown Profil */}
            <div 
              className="relative"
              onMouseEnter={() => setProfilOpen(true)}
              onMouseLeave={() => setProfilOpen(false)}
            >
              <button 
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none ${profilOpen ? 'text-green-700 bg-white shadow-sm' : 'text-white hover:bg-white/20'}`}
              >
                Profil
                <svg className={`ml-1 h-4 w-4 transition-transform duration-200 ${profilOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {profilOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black/5 divide-y divide-gray-50 focus:outline-none overflow-hidden transition-all duration-200 origin-top-left">
                  <div className="py-2">
                    <Link href="/profil-pondok" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                      Profil Pondok Pesantren
                    </Link>
                    <Link href="/about" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                      About IKADHA
                    </Link>
                    <Link href="/visi-misi" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                      Visi & Misi
                    </Link>
                    <Link href="/struktur-pengurus" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                      Struktur Kepengurusan
                    </Link>                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/berita" 
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Berita
            </Link>
            <Link 
              href="/kontak" 
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/20 transition-colors mr-2"
            >
              Kontak
            </Link>

            {/* Desktop Search */}
            <form className="flex items-center ml-2 relative" onSubmit={handleSearch}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari informasi..." 
                className="w-40 xl:w-56 pl-9 pr-4 py-1.5 rounded-l-full border border-white/40 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-r-full border border-l-0 border-white/40 bg-white text-green-600 hover:bg-gray-100 transition-all font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-green-500"
              >
                Cari
              </button>
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-white hover:bg-white/20 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Buka menu utama</span>
              <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-green-400 transition-all duration-300 ease-in-out`}>
        <div className="px-4 pt-4 pb-6 space-y-2 shadow-inner">
          {/* Mobile Search */}
          <form className="flex w-full mb-5 relative" onSubmit={handleSearch}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari informasi..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-l-xl border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-r-xl border border-transparent bg-green-600 text-white hover:bg-green-700 transition-colors font-bold shadow-md flex items-center"
            >
              Cari
            </button>
          </form>

          <Link href="/" className="block px-3 py-3 rounded-lg text-base font-semibold text-green-700 bg-green-50">
            Home
          </Link>
          
          <div className="px-3 py-2">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Profil</div>
            <div className="pl-4 border-l-2 border-green-100 space-y-1">
              <Link href="/profil-pondok" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors">
                Profil Pondok Pesantren
              </Link>
              <Link href="/about" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors">
                About IKADHA
              </Link>
              <Link href="/visi-misi" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors">
                Visi & Misi
              </Link>
              <Link href="/struktur-pengurus" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors">
                Struktur Kepengurusan
              </Link>            </div>
          </div>

          <Link href="/berita" className="block px-3 py-3 rounded-lg text-base font-semibold text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors">
            Berita
          </Link>
          <Link href="/kontak" className="block px-3 py-3 rounded-lg text-base font-semibold text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors">
            Kontak
          </Link>
        </div>
      </div>
    </nav>
  );
}

