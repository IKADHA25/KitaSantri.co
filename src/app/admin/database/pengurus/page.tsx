"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function DatabasePengurusPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk search dan filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State untuk Modal Tambah Data
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    divisi: 'Pengurus Harian',
    kategori: 'Putra',
    urutan: 0,
    is_published: true
  });

  const divisiOptions = [
    'Dewan Masyayikh',
    'Dewan Pembina',
    'Dewan Pembimbing',
    'Pengurus Harian',
    'Pendidikan Dakwah & Kemasyarakatan',
    'Perekonomian',
    'Informasi & Jaringan',
    'Koordinator Wilayah'
  ];

  const fetchPengurus = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    
    try {
      const { data: pengurusData, error } = await supabase
        .from('struktur_organisasi')
        .select('*')
        .order('urutan', { ascending: true })
        .order('nama', { ascending: true });
        
      if (error) throw error;
      setData(pengurusData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (!isBackground) toast.error('Gagal mengambil data struktur organisasi.');
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengurus();

    // Setup Supabase Realtime Subscription
    const channel = supabase
      .channel('realtime-struktur')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'struktur_organisasi' },
        () => {
          fetchPengurus(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredData = data.filter(item => {
    const matchSearch = item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.jabatan?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDivisi = filterDivisi === 'Semua' || item.divisi === filterDivisi;
    return matchSearch && matchDivisi;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDivisi]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('struktur_organisasi')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('struktur_organisasi')
          .insert([formData]);
        if (error) throw error;
      }
      
      setFormData({
        nama: '',
        jabatan: '',
        divisi: 'Pengurus Harian',
        kategori: 'Putra',
        urutan: 0,
        is_published: true
      });
      setIsAddModalOpen(false);
      setEditingId(null);
      
      fetchPengurus(true);
      toast.success(`Data kepengurusan berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!`);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(`Gagal ${editingId ? 'memperbarui' : 'menambahkan'} data.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${nama} dari struktur organisasi?`)) {
      try {
        const { error } = await supabase
          .from('struktur_organisasi')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        fetchPengurus(true);
        toast.success('Data berhasil dihapus');
      } catch (error) {
        console.error('Error deleting data:', error);
        toast.error('Gagal menghapus data');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Database Kepengurusan</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data struktur organisasi IKADHA Mayak</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({
                nama: '',
                jabatan: '',
                divisi: 'Pengurus Harian',
                kategori: 'Putra',
                urutan: 0,
                is_published: true
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Tambah Pengurus
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari nama atau jabatan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="w-full sm:w-64">
            <select
              value={filterDivisi}
              onChange={(e) => setFilterDivisi(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Semua">Semua Divisi</option>
              {divisiOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-50">Nama & Kategori</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-30">Jabatan</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-30">Divisi</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Urutan</th>
                <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Publish</th>
                <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-emerald-600 font-medium">
                    Memuat data struktur organisasi...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data pengurus yang ditemukan.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 whitespace-nowrap">{item.nama}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.kategori}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        {item.jabatan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.divisi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                      {item.urutan}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button 
                        onClick={async () => {
                          await supabase.from('struktur_organisasi').update({ is_published: !item.is_published }).eq('id', item.id);
                        }}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${item.is_published ? 'bg-emerald-600' : 'bg-gray-200'}`}
                        role="switch"
                        aria-checked={item.is_published}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.is_published ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => {
                          setEditingId(item.id);
                          setFormData({
                            nama: item.nama || '',
                            jabatan: item.jabatan || '',
                            divisi: item.divisi || 'Pengurus Harian',
                            kategori: item.kategori || 'Putra',
                            urutan: item.urutan || 0,
                            is_published: !!item.is_published
                          });
                          setIsAddModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-emerald-600 transition-colors p-1" 
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id, item.nama)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1" 
                        title="Hapus"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> hingga <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> dari <span className="font-medium">{filteredData.length}</span> data
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          aria-current={currentPage === page ? 'page' : undefined}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                            currentPage === page 
                              ? 'z-10 bg-emerald-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-emerald-600' 
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsAddModalOpen(false)}></div>

            <div className="relative inline-block w-full max-w-lg p-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingId(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{editingId ? 'Edit Data Pengurus' : 'Tambah Data Pengurus'}</h2>
              <p className="text-sm text-gray-500 mb-6">Lengkapi form di bawah ini untuk struktur organisasi IKADHA Mayak.</p>
              
              <form onSubmit={handleSaveSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                    <input 
                      type="text" 
                      required
                      value={formData.jabatan}
                      onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                      placeholder="Contoh: Ketua, Anggota..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select 
                      value={formData.kategori}
                      onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    >
                      <option value="Umum">Umum (Dewan)</option>
                      <option value="Putra">Putra</option>
                      <option value="Putri">Putri</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Divisi / Bidang</label>
                    <select 
                      value={formData.divisi}
                      onChange={(e) => setFormData({...formData, divisi: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    >
                      {divisiOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Urut Tampil</label>
                    <input 
                      type="number" 
                      required
                      value={formData.urutan}
                      onChange={(e) => setFormData({...formData, urutan: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                      placeholder="1, 2, 3..."
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer mt-4">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${formData.is_published ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_published ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Publish (Tampilkan di web)</span>
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingId(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
