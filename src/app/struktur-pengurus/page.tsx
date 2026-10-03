export const dynamic = 'force-dynamic';

import React from 'react';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Struktur Kepengurusan IKADHA 25',
  description: 'Struktur Organisasi Ikatan Alumni Darul Huda Angkatan 25',
};

async function getPengurus() {
  const { data, error } = await supabase
    .from('struktur_organisasi')
    .select('*')
    .eq('is_published', true)
    .order('urutan', { ascending: true });

  if (error) {
    console.error('Error fetching pengurus:', error);
    return [];
  }
  return data || [];
}

export default async function StrukturPengurusPage() {
  const allPengurus = await getPengurus();

  // Helper function to render a hierarchy block
  const renderDivisi = (title: string, data: any[], bgGradient: string, textColor: string) => {
    if (!data || data.length === 0) return null;
    return (
      <div className="mb-12" key={title}>
        <div className="flex justify-center mb-8">
          <h3 className={`text-xl md:text-2xl font-bold px-8 py-3 rounded-full shadow-md text-white bg-linear-to-r ${bgGradient}`}>
            {title}
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {data.map((p) => (
            <div key={p.id} className="bg-white w-64 rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-full h-2 bg-linear-to-r ${bgGradient}`}></div>
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-inner ring-4 ring-white relative z-10 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={textColor}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{p.nama}</h4>
              <p className={`text-sm font-semibold ${textColor}`}>{p.jabatan}</p>
              {p.kategori !== 'Umum' && (
                <span className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500">
                  {p.kategori}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Groupings
  const dewanMasyayikh = allPengurus.filter(p => p.divisi === 'Dewan Masyayikh');
  const dewanPembina = allPengurus.filter(p => p.divisi === 'Dewan Pembina');
  const dewanPembimbing = allPengurus.filter(p => p.divisi === 'Dewan Pembimbing');
  
  const harianPutra = allPengurus.filter(p => p.divisi === 'Pengurus Harian' && p.kategori === 'Putra');
  const harianPutri = allPengurus.filter(p => p.divisi === 'Pengurus Harian' && p.kategori === 'Putri');

  const bidangPutra = allPengurus.filter(p => p.kategori === 'Putra' && ['Pendidikan Dakwah & Kemasyarakatan', 'Perekonomian', 'Informasi & Jaringan'].includes(p.divisi));
  const bidangPutri = allPengurus.filter(p => p.kategori === 'Putri' && ['Pendidikan Dakwah & Kemasyarakatan', 'Perekonomian', 'Informasi & Jaringan'].includes(p.divisi));

  const korwilPutra = allPengurus.filter(p => p.kategori === 'Putra' && p.divisi === 'Koordinator Wilayah');
  const korwilPutri = allPengurus.filter(p => p.kategori === 'Putri' && p.divisi === 'Koordinator Wilayah');

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Banner */}
      <div className="bg-emerald-700 text-white pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-emerald-600/50 to-emerald-900/90"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
            Struktur <span className="text-yellow-400">Organisasi</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 font-medium max-w-2xl mx-auto leading-relaxed">
            Susunan kepengurusan Ikatan Alumni Darul Huda (IKADHA) Angkatan 2025 periode masa khidmat.
          </p>
        </div>
        
        {/* Curved Bottom Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-px">
          <svg className="relative block w-full h-12 md:h-24" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#f9fafb"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* Dewan-Dewan Section */}
        <div className="mb-20">
          {renderDivisi('Dewan Masyayikh', dewanMasyayikh, 'from-amber-500 to-yellow-600', 'text-amber-600')}
          {renderDivisi('Dewan Pembina', dewanPembina, 'from-blue-600 to-indigo-700', 'text-blue-600')}
          {renderDivisi('Dewan Pembimbing', dewanPembimbing, 'from-purple-600 to-fuchsia-700', 'text-purple-600')}
        </div>

        {/* Putra & Putri Tabs or Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8">
          
          {/* BAGIAN PUTRA */}
          <div className="bg-white/60 p-4 sm:p-8 rounded-3xl border border-emerald-100 shadow-xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white px-8 py-2 rounded-full font-black text-xl shadow-lg border-4 border-gray-50">
              PENGURUS PUTRA
            </div>
            
            <div className="mt-8">
              {renderDivisi('Pengurus Harian', harianPutra, 'from-emerald-500 to-green-600', 'text-emerald-600')}
              {renderDivisi('Bidang-Bidang', bidangPutra, 'from-emerald-400 to-teal-500', 'text-teal-600')}
              {renderDivisi('Koordinator Wilayah', korwilPutra, 'from-slate-600 to-slate-800', 'text-slate-600')}
            </div>
          </div>

          {/* BAGIAN PUTRI */}
          <div className="bg-white/60 p-4 sm:p-8 rounded-3xl border border-rose-100 shadow-xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-500 text-white px-8 py-2 rounded-full font-black text-xl shadow-lg border-4 border-gray-50">
              PENGURUS PUTRI
            </div>
            
            <div className="mt-8">
              {renderDivisi('Pengurus Harian', harianPutri, 'from-rose-400 to-pink-600', 'text-rose-600')}
              {renderDivisi('Bidang-Bidang', bidangPutri, 'from-pink-400 to-fuchsia-500', 'text-pink-600')}
              {renderDivisi('Koordinator Wilayah', korwilPutri, 'from-slate-600 to-slate-800', 'text-slate-600')}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
