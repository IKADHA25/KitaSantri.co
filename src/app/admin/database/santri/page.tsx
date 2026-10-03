"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function DatabaseSantriPage() {
  const [kategori, setKategori] = useState<'Putra' | 'Putri'>('Putra');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk search
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk Modal Tambah Data
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    korwil: '',
    aktivitas: 'Kuliah',
    keterangan_aktivitas: ''
  });

  // Fetch data dari Supabase
  const fetchAlumni = async () => {
    setLoading(true);
    const tableName = kategori === 'Putra' ? 'alumni_putra' : 'alumni_putri';
    
    try {
      const { data: alumniData, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setData(alumniData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal mengambil data dari database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [kategori]);

  const filteredData = data.filter(item => 
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.korwil?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tableName = kategori === 'Putra' ? 'alumni_putra' : 'alumni_putri';

    try {
      const { error } = await supabase
        .from(tableName)
        .insert([formData]);

      if (error) throw error;
      
      // Reset form dan tutup modal
      setFormData({
        nama: '',
        alamat: '',
        korwil: '',
        aktivitas: 'Kuliah',
        keterangan_aktivitas: ''
      });
      setIsAddModalOpen(false);
      
      // Refresh data
      fetchAlumni();
      toast.success('Data berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding data:', error);
      toast.error('Gagal menambahkan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['nama', 'alamat', 'korwil', 'aktivitas', 'keterangan_aktivitas'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(field => `"${(row[field] || '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data_alumni_${kategori.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTemplate = () => {
    const headers = ['nama', 'alamat', 'korwil', 'aktivitas', 'keterangan_aktivitas'];
    const example = ['Ahmad Syaifulloh', 'Jl. Sudirman No 1', 'Madiun', 'Kuliah', 'Universitas Brawijaya'];
    const csvContent = [headers.join(','), example.map(v => `"${v}"`).join(',')].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `template_alumni.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      
      if (lines.length <= 1) {
        toast.error('File CSV kosong atau tidak ada data.');
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
      
      const rowsToInsert = [];
      for (let i = 1; i < lines.length; i++) {
        // Simple CSV parser that handles basic quotes
        const rowString = lines[i];
        const cols = [];
        let cur = '';
        let inQuotes = false;
        
        for (let j = 0; j < rowString.length; j++) {
          const char = rowString[j];
          if (char === '"' && rowString[j+1] === '"') {
            cur += '"';
            j++; // skip next quote
          } else if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            cols.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        cols.push(cur.trim()); // push last col
        
        rowsToInsert.push({
          nama: cols[headers.indexOf('nama')] || '',
          alamat: cols[headers.indexOf('alamat')] || '',
          korwil: cols[headers.indexOf('korwil')] || '',
          aktivitas: cols[headers.indexOf('aktivitas')] || 'Kuliah',
          keterangan_aktivitas: cols[headers.indexOf('keterangan_aktivitas')] || ''
        });
      }

      const validRows = rowsToInsert.filter(r => r.nama); // minimal ada nama
      if (validRows.length > 0) {
        setLoading(true);
        const tableName = kategori === 'Putra' ? 'alumni_putra' : 'alumni_putri';
        const { error } = await supabase.from(tableName).insert(validRows);
        
        if (error) {
          toast.error('Gagal mengimpor data: ' + error.message);
        } else {
          toast.success(`${validRows.length} data berhasil diimpor!`);
          fetchAlumni();
        }
        setLoading(false);
      } else {
        toast.error('Tidak ada data valid yang ditemukan (kolom nama wajib).');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Alumni Angkatan 25</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola informasi alumni angkatan 25 berdasarkan kategori Putra dan Putri.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden file input */}
          <input 
            type="file" 
            accept=".csv" 
            id="csvUpload" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          
          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Template
          </button>

          <label 
            htmlFor="csvUpload"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Import
          </label>

          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
            Export
          </button>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Tambah Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Fitur Tab dan Filter */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Tabs Putra / Putri */}
          <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setKategori('Putra')}
              className={`flex-1 sm:w-32 py-1.5 px-3 text-sm font-medium rounded-md transition-all ${
                kategori === 'Putra' 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Putra
            </button>
            <button
              onClick={() => setKategori('Putri')}
              className={`flex-1 sm:w-32 py-1.5 px-3 text-sm font-medium rounded-md transition-all ${
                kategori === 'Putri' 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Putri
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari nama atau korwil..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Nama</th>
                <th className="px-6 py-4 font-semibold">Alamat</th>
                <th className="px-6 py-4 font-semibold">Korwil</th>
                <th className="px-6 py-4 font-semibold">Aktivitas</th>
                <th className="px-6 py-4 font-semibold">Nama Kampus / Tempat Kerja</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-emerald-600 font-medium">
                    Memuat data dari database...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data {kategori.toLowerCase()} yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.nama}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm max-w-50 truncate" title={item.alamat}>
                      {item.alamat}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {item.korwil}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.aktivitas === 'Kuliah' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {item.aktivitas}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {item.keterangan_aktivitas || '-'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button className="text-gray-400 hover:text-emerald-600 transition-colors p-1" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm(`Hapus data ${item.nama}?`)) {
                            const table = kategori === 'Putra' ? 'alumni_putra' : 'alumni_putri';
                            await supabase.from(table).delete().eq('id', item.id);
                            fetchAlumni();
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1 ml-2" 
                        title="Hapus"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Data */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tambah Data Alumni {kategori}</h2>
            <p className="text-sm text-gray-500 mb-6">Lengkapi form di bawah ini untuk menambahkan data alumni baru.</p>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Domisili</label>
                <textarea 
                  required
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Koordinator Wilayah (Korwil)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.korwil}
                    onChange={(e) => setFormData({...formData, korwil: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    placeholder="Contoh: Madiun"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aktivitas Saat Ini</label>
                  <select 
                    value={formData.aktivitas}
                    onChange={(e) => setFormData({...formData, aktivitas: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  >
                    <option value="Kuliah">Kuliah</option>
                    <option value="Kerja">Kerja</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kampus / Tempat Kerja</label>
                <input 
                  type="text" 
                  value={formData.keterangan_aktivitas}
                  onChange={(e) => setFormData({...formData, keterangan_aktivitas: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="Opsional"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Menyimpan...
                    </>
                  ) : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
