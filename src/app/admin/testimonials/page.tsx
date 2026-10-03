"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbError, setDbError] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    peran: '',
    isi: '',
    status: 'Aktif'
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('id', { ascending: false });
        
      if (error) throw error;
      setTestimonials(data || []);
      setDbError(false);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setDbError(true);
      toast.error('Gagal mengambil data testimoni. Pastikan tabel sudah dibuat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenModal = (testimoni: any = null) => {
    if (testimoni) {
      setEditId(testimoni.id);
      setFormData({
        nama: testimoni.nama || '',
        peran: testimoni.peran || '',
        isi: testimoni.isi || '',
        status: testimoni.status || 'Aktif'
      });
    } else {
      setEditId(null);
      setFormData({ nama: '', peran: '', isi: '', status: 'Aktif' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ nama: '', peran: '', isi: '', status: 'Aktif' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        // Update
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editId);
        if (error) throw error;
        toast.success('Testimoni berhasil diperbarui!');
      } else {
        // Insert
        const { error } = await supabase
          .from('testimonials')
          .insert([formData]);
        if (error) throw error;
        toast.success('Testimoni baru berhasil ditambahkan!');
      }
      
      handleCloseModal();
      fetchTestimonials();
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error('Gagal menyimpan testimoni: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) return;
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Testimoni berhasil dihapus!');
      fetchTestimonials();
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast.error('Gagal menghapus testimoni.');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Testimoni</h1>
          <p className="text-gray-500 mt-1">Kelola dan moderasi testimoni dari alumni dan tokoh masyarakat.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-5 py-2 gap-2 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Tambah Testimoni
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Nama Tokoh / Alumni</th>
                <th scope="col" className="px-6 py-4 font-semibold">Peran / Angkatan</th>
                <th scope="col" className="px-6 py-4 font-semibold">Isi Testimoni</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-emerald-600 font-medium">Memuat data testimoni...</td>
                </tr>
              ) : dbError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-500 bg-red-50">
                    <p className="font-bold mb-2">Tabel "testimonials" Belum Dibuat di Supabase!</p>
                    <p className="text-sm text-red-600 max-w-lg mx-auto">Silakan buka Supabase SQL Editor Anda dan jalankan perintah SQL berikut untuk membuat tabel: <br/><br/> <code className="bg-red-100 p-2 block mt-2 text-left rounded">CREATE TABLE testimonials (<br/>  id bigint generated by default as identity primary key,<br/>  nama text not null,<br/>  peran text not null,<br/>  isi text not null,<br/>  status text not null default 'Aktif'<br/>);</code></p>
                  </td>
                </tr>
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Belum ada testimoni. Klik tombol Tambah Testimoni untuk membuat baru.</td>
                </tr>
              ) : (
                testimonials.map((item) => (
                  <tr key={item.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {item.nama}
                    </td>
                    <td className="px-6 py-4">
                      {item.peran}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={item.isi}>
                      "{item.isi}"
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${item.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL POP UP YANG KEREN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {editId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Tokoh / Alumni</label>
                <input 
                  type="text" 
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                  placeholder="Contoh: K.H. Fulan bin Fulan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Peran / Angkatan</label>
                <input 
                  type="text" 
                  required
                  value={formData.peran}
                  onChange={(e) => setFormData({...formData, peran: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                  placeholder="Contoh: Pengasuh Pondok / Alumni 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Isi Testimoni</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.isi}
                  onChange={(e) => setFormData({...formData, isi: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow resize-none"
                  placeholder="Tuliskan testimoni yang berkesan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status Penayangan</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                >
                  <option value="Aktif">Aktif (Ditampilkan)</option>
                  <option value="Nonaktif">Nonaktif (Disembunyikan)</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 mt-2 flex gap-3 justify-end border-t border-gray-100">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    'Simpan Testimoni'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
