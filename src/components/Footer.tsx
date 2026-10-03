"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoPondok from "@/assets/logoHD.png";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-green-500 flex items-center">
              IKADHA 25
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Wadah silaturahmi resmi Ikatan Alumni Darul Huda Mayak Angkatan 2025. Menjaga persaudaraan, berbagi manfaat, dan mengabdi untuk umat.
            </p>
            <div className="pt-4 flex items-center space-x-3">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Berafiliasi dengan:</span>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                <Image src={logoPondok} alt="Logo Darul Huda Mayak" className="w-10 h-10 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
              </div>
            </div>
          </div>
          
          {/* Tautan Cepat */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link href="/berita" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Berita & Kegiatan</Link>
              </li>
              <li>
                <Link href="/kontak" className="text-gray-400 hover:text-green-400 text-sm transition-colors">Hubungi Kami</Link>
              </li>
            </ul>
          </div>
          
          {/* Sosial & Kontak */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Sekretariat</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Jl. Ulujami Raya No.86, Pesanggrahan, Jakarta Selatan</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:info@ikadha25.co" className="hover:text-green-400 transition-colors">info@ikadha25.co</a>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} IKADHA 25. Hak cipta dilindungi.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-gray-500">
            <span>Berdiri sejak 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

