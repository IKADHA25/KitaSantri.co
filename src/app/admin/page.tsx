"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    alumni: 0,
    dokumen: 0,
    dokumenSizeMB: 0,
    galeri: 0,
    galeriSizeMB: 0,
    berita: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch counts
        const { count: alumniPutra } = await supabase.from('alumni_putra').select('*', { count: 'exact', head: true });
        const { count: alumniPutri } = await supabase.from('alumni_putri').select('*', { count: 'exact', head: true });
        const { count: berita } = await supabase.from('berita').select('*', { count: 'exact', head: true });
        const { count: galeri } = await supabase.from('galeri').select('*', { count: 'exact', head: true });
        
        // Fetch documents to calculate size
        const { data: dokumenData } = await supabase.from('dokumen').select('ukuran');
        let dokSize = 0;
        if (dokumenData) {
          dokumenData.forEach(d => {
            const sizeStr = d.ukuran?.toLowerCase() || '';
            if (sizeStr.includes('mb')) dokSize += parseFloat(sizeStr) || 0;
            else if (sizeStr.includes('kb')) dokSize += (parseFloat(sizeStr) || 0) / 1024;
          });
        }

        // Fetch logs
        const { data: logs } = await supabase
          .from('log_aktivitas')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          alumni: (alumniPutra || 0) + (alumniPutri || 0),
          dokumen: dokumenData?.length || 0,
          dokumenSizeMB: parseFloat(dokSize.toFixed(1)),
          galeri: galeri || 0,
          galeriSizeMB: parseFloat(((galeri || 0) * 2.5).toFixed(1)), // Estimasi 2.5 MB per foto jika pakai URL
          berita: berita || 0,
        });

        setActivities(logs || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalStorage = stats.dokumenSizeMB + stats.galeriSizeMB;
  const storagePercentage = Math.min((totalStorage / 1024) * 100, 100);

  // Fungsi untuk format waktu yang lalu (time ago)
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 172800) return 'Kemarin';
    return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Ringkasan statistik dan aktivitas terbaru IKADHA 25.</p>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/database/santri" className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 className="font-semibold text-gray-900">Data Alumni</h3>
          <p className="text-sm text-gray-500">Kelola {loading ? '...' : stats.alumni} data alumni</p>
        </Link>
        <Link href="/admin/database/file" className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 className="font-semibold text-gray-900">Data File</h3>
          <p className="text-sm text-gray-500">Kelola {loading ? '...' : stats.dokumen} dokumen</p>
        </Link>
        <Link href="/admin/berita" className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
          </div>
          <h3 className="font-semibold text-gray-900">Berita</h3>
          <p className="text-sm text-gray-500">Kelola {loading ? '...' : stats.berita} artikel</p>
        </Link>
        <Link href="/admin/gallery" className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <h3 className="font-semibold text-gray-900">Galeri</h3>
          <p className="text-sm text-gray-500">Kelola {loading ? '...' : stats.galeri} foto</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Penggunaan Storage</h2>
              <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">Paket Gratis (Batas 1 GB)</span>
            </div>
            
            {/* Visualisasi Kapasitas Total */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 font-medium">Kapasitas Terpakai</span>
                <span className="font-bold text-gray-900">
                  {loading ? '...' : totalStorage.toFixed(1)} MB <span className="text-gray-400 font-normal">/ 1024 MB</span>
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${storagePercentage}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-700 mb-4">Grafik Unggah Harian (Minggu Ini)</h3>
            <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 mt-auto min-h-30">
              {/* Dummy chart bars for aesthetics since we don't have historical data structure yet */}
              {[15, 25, 20, 10, 30, 45, 10].map((height, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <div className="relative w-full h-32 bg-gray-50 rounded-t-sm flex items-end">
                    <div 
                      className={`w-full transition-colors rounded-t-sm relative ${totalStorage === 0 ? 'bg-gray-200' : 'bg-blue-400 group-hover:bg-blue-500'}`}
                      style={{ height: totalStorage === 0 ? '0%' : `${height}%` }}
                    >
                      {totalStorage > 0 && (
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg transition-opacity pointer-events-none whitespace-nowrap">
                          {((height / 100) * totalStorage).toFixed(1)} MB
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 mt-2 font-medium">H{i+1}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-gray-600">File Dokumen ({loading ? '...' : stats.dokumenSizeMB.toFixed(1)} MB)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-gray-600">Foto Galeri ({loading ? '...' : stats.galeriSizeMB.toFixed(1)} MB)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Log Aktivitas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Log Aktivitas Terbaru</h2>
            
            {loading ? (
              <div className="text-center py-10 text-emerald-600 text-sm font-medium">Memuat log...</div>
            ) : activities.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">Belum ada aktivitas.</div>
            ) : (
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                {activities.map((act) => (
                  <div key={act.id} className="relative pl-6">
                    {/* Dot */}
                    <div className={`absolute -left-2.25 top-1 w-4 h-4 rounded-full border-2 border-white ${
                      act.tipe === 'file' ? 'bg-blue-500' :
                      act.tipe === 'user' ? 'bg-emerald-500' :
                      act.tipe === 'news' ? 'bg-orange-500' : 'bg-purple-500'
                    }`}></div>
                    
                    <div className="mb-1 text-sm font-medium text-gray-900 leading-snug">
                      {act.teks_aktivitas}
                    </div>
                    <div className="text-xs text-gray-500">
                      {timeAgo(act.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="w-full mt-6 py-2 text-sm text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100">
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
