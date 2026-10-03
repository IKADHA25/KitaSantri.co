"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbError, setDbError] = useState(false);
  
  const [formData, setFormData] = useState({
    kota_asal: '45+',
    program_kerja: '12',
    solidaritas: '100%'
  });

  const fetchSettings = async () => {
    setLoading(true);
    setDbError(false);
    try {
      const { data, error } = await supabase
        .from('pengaturan_website')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // Row not found, that's fine, we will create it on save
        } else {
          throw error;
        }
      } else if (data) {
        setFormData({
          kota_asal: data.kota_asal || '45+',
          program_kerja: data.program_kerja || '12',
          solidaritas: data.solidaritas || '100%'
        });
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setDbError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Upsert data (Update if id=1 exists, insert if not)
      const { error } = await supabase
        .from('pengaturan_website')
        .upsert({ 
          id: 1, 
          kota_asal: formData.kota_asal, 
          program_kerja: formData.program_kerja, 
          solidaritas: formData.solidaritas 
        });
        
      if (error) throw error;
      toast.success('Pengaturan website berhasil diperbarui!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan. Pastikan tabel sudah dibuat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pengaturan Website</h1>
        <p className="text-gray-500 mt-1">Ubah konten statistik dan teks yang muncul di halaman beranda (Homepage).</p>
      </div>

      {dbError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="font-bold text-red-700 mb-2">Tabel "pengaturan_website" Belum Dibuat!</p>
          <p className="text-sm text-red-600 mb-4">Agar pengaturan ini berfungsi, silakan jalankan SQL berikut di Supabase SQL Editor Anda:</p>
          <div className="bg-white p-4 rounded-lg overflow-x-auto text-left border border-red-100 shadow-sm mx-auto max-w-2xl">
            <pre className="text-xs font-mono text-gray-800">
{`CREATE TABLE pengaturan_website (
  id integer primary key,
  kota_asal text,
  program_kerja text,
  solidaritas text
);

ALTER TABLE pengaturan_website DISABLE ROW LEVEL SECURITY;

INSERT INTO pengaturan_website (id, kota_asal, program_kerja, solidaritas) 
VALUES (1, '45+', '12', '100%');`}
            </pre>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Statistik Angkatan (Beranda)</h2>
          <p className="text-sm text-gray-500 mt-1">Total Alumni dihitung otomatis dari database santri putra & putri.</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-emerald-600 font-medium">
            Memuat pengaturan...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kota Asal (Teks)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.kota_asal}
                    onChange={(e) => setFormData({...formData, kota_asal: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                    placeholder="Contoh: 45+"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Contoh: 45+</p>
              </div>

              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Program Kerja (Teks)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.program_kerja}
                    onChange={(e) => setFormData({...formData, program_kerja: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                    placeholder="Contoh: 12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="14.01"/><line x1="12" x2="12" y1="14" y2="14.01"/><line x1="8" x2="8" y1="14" y2="14.01"/><line x1="16" x2="16" y1="10" y2="10.01"/><line x1="12" x2="12" y1="10" y2="10.01"/><line x1="8" x2="8" y1="10" y2="10.01"/></svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Contoh: 12</p>
              </div>

              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Solidaritas (Teks)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.solidaritas}
                    onChange={(e) => setFormData({...formData, solidaritas: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                    placeholder="Contoh: 100%"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M12 8v4l3 3"/></svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Contoh: 100%</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Pengaturan'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
