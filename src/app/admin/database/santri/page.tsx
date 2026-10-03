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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State untuk Modal Tambah Data
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAutoIdModalOpen, setIsAutoIdModalOpen] = useState(false);
  const [autoIdPrefix, setAutoIdPrefix] = useState('IDA-25');
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_alumni: '',
    nama: '',
    alamat: '',
    korwil: '',
    aktivitas: 'Kuliah',
    keterangan_aktivitas: '',
    nomor_telpon: ''
  });

  // Fetch data dari Supabase
  const fetchAlumni = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    const tableName = kategori === 'Putra' ? 'alumni_putra' : 'alumni_putri';
    
    try {
      const { data: alumniData, error } = await supabase
        .from(tableName)
        .select('*')
        .order('nama', { ascending: true });
        
      if (error) throw error;
      setData(alumniData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (!isBackground) toast.error('Gagal mengambil data dari database.');
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();

    // Setup Supabase Realtime Subscription
    const tableName = kategori === 'Putra' ? 'alumni_putra' : 'alumni_putri';
    
    const channel = supabase
      .channel(`realtime-${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => {
          // Silent fetch on background so it doesn't flicker
          fetchAlumni(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [kategori]);

  const filteredData = data.filter(item => 
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.korwil?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [kategori, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tableName = kategori === 'Putra' ? 'alumni_putra' : 'alumni_putri';

    try {
      if (editingId) {
        // Edit mode
        const { error } = await supabase
          .from(tableName)
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        // Add mode
        const { error } = await supabase
          .from(tableName)
          .insert([formData]);
        if (error) throw error;
      }
      
      
      // Reset form dan tutup modal
      setFormData({
        id_alumni: '',
        nama: '',
        alamat: '',
        korwil: '',
        aktivitas: 'Kuliah',
        keterangan_aktivitas: '',
        nomor_telpon: ''
      });
      setIsAddModalOpen(false);
      setEditingId(null);
      
      // Refresh data
      fetchAlumni();
      toast.success(`Data berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!`);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(`Gagal ${editingId ? 'memperbarui' : 'menambahkan'} data.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['id_alumni', 'nama', 'alamat', 'korwil', 'nomor_telpon', 'aktivitas', 'keterangan_aktivitas'];
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
    const headers = ['id_alumni', 'nama', 'alamat', 'korwil', 'nomor_telpon', 'aktivitas', 'keterangan_aktivitas'];
    const example = ['REGIKADHA1', 'Ahmad Syaifulloh', 'Jl. Sudirman No 1', 'Madiun', '081234567890', 'Kuliah', 'Universitas Brawijaya'];
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
          id_alumni: cols[headers.indexOf('id_alumni')] || '',
          nama: cols[headers.indexOf('nama')] || '',
          alamat: cols[headers.indexOf('alamat')] || '',
          korwil: cols[headers.indexOf('korwil')] || '',
          nomor_telpon: cols[headers.indexOf('nomor_telpon')] || '',
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

  const handleFormatName = async (format: 'uppercase' | 'titlecase') => {
    if (!confirm(`Apakah Anda yakin ingin mengubah format nama seluruh data ${kategori} ke ${format === 'uppercase' ? 'KAPITAL SEMUA' : 'Awal Huruf Besar'}?`)) return;
    
    setLoading(true);
    setIsFormatMenuOpen(false);
    const tableName = kategori === 'Putra' ? 'alumni_putra' : 'alumni_putri';
    
    try {
      const updates = data.map(item => {
        let newName = item.nama || '';
        if (format === 'uppercase') {
          newName = newName.toUpperCase();
        } else {
          newName = newName.toLowerCase().replace(/\b\w/g, (s: string) => s.toUpperCase());
        }
        return { id: item.id, nama: newName };
      });
      
      // Update batch
      for (const update of updates) {
        await supabase.from(tableName).update({ nama: update.nama }).eq('id', update.id);
      }
      
      toast.success('Format nama berhasil diperbarui!');
      fetchAlumni();
    } catch (error) {
      console.error('Error formatting names:', error);
      toast.error('Gagal memformat nama.');
      setLoading(false);
    }
  };

  const executeGenerateID = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoIdPrefix) return;

    setLoading(true);
    setIsAutoIdModalOpen(false);
    try {
      // 1. Ambil semua data Putra urut abjad
      const { data: putraData, error: errPutra } = await supabase
        .from('alumni_putra')
        .select('id, nama')
        .order('nama', { ascending: true });
      if (errPutra) throw errPutra;

      // 2. Ambil semua data Putri urut abjad
      const { data: putriData, error: errPutri } = await supabase
        .from('alumni_putri')
        .select('id, nama')
        .order('nama', { ascending: true });
      if (errPutri) throw errPutri;

      let counter = 1;

      // 3. Update Putra (urutan 1 sampai N)
      for (const p of (putraData || [])) {
        const formattedCounter = String(counter).padStart(3, '0');
        await supabase
          .from('alumni_putra')
          .update({ id_alumni: `${autoIdPrefix}${formattedCounter}` })
          .eq('id', p.id);
        counter++;
      }

      // 4. Update Putri (urutan N+1 sampai selesai)
      for (const p of (putriData || [])) {
        const formattedCounter = String(counter).padStart(3, '0');
        await supabase
          .from('alumni_putri')
          .update({ id_alumni: `${autoIdPrefix}${formattedCounter}` })
          .eq('id', p.id);
        counter++;
      }

      toast.success('ID Alumni berhasil dibuat ulang untuk semua data!');
      fetchAlumni();
    } catch (error) {
      console.error('Error generating IDs:', error);
      toast.error('Gagal membuat ulang ID Alumni.');
      setLoading(false);
    }
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
            onClick={() => {
              setEditingId(null);
              setFormData({
                id_alumni: '',
                nama: '',
                alamat: '',
                korwil: '',
                aktivitas: 'Kuliah',
                keterangan_aktivitas: '',
                nomor_telpon: ''
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Tambah Data
          </button>
          
          <button 
            onClick={() => setIsAutoIdModalOpen(true)}
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm border border-amber-200"
            title="Buat ulang ID Alumni secara otomatis"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
            Auto ID
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsFormatMenuOpen(!isFormatMenuOpen)}
              className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm border border-purple-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 13 8-8 8 8"/><path d="M12 5v14"/></svg>
              Format Nama
            </button>
            
            {isFormatMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden">
                <div className="py-1">
                  <button 
                    onClick={() => handleFormatName('uppercase')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                  >
                    Ubah ke KAPITAL SEMUA
                  </button>
                  <button 
                    onClick={() => handleFormatName('titlecase')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                  >
                    Ubah ke Awal Huruf Besar
                  </button>
                </div>
              </div>
            )}
          </div>
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
                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-30">ID Alumni</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-50">Nama</th>
                <th className="px-6 py-4 font-semibold min-w-62.5">Alamat</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-30">Korwil</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">No. Telp</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap min-w-30">Aktivitas</th>
                <th className="px-6 py-4 font-semibold min-w-50">Nama Kampus / Tempat Kerja</th>
                <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Aksi</th>
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
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap text-sm">{item.id_alumni || '-'}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.nama}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm max-w-62.5 truncate" title={item.alamat}>
                      {item.alamat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {item.korwil}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap">
                      {item.nomor_telpon || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.aktivitas === 'Kuliah' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {item.aktivitas}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm min-w-50">
                      {item.keterangan_aktivitas || '-'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => {
                          setEditingId(item.id);
                          setFormData({
                            id_alumni: item.id_alumni || '',
                            nama: item.nama || '',
                            alamat: item.alamat || '',
                            korwil: item.korwil || '',
                            aktivitas: item.aktivitas || 'Kuliah',
                            keterangan_aktivitas: item.keterangan_aktivitas || '',
                            nomor_telpon: item.nomor_telpon || ''
                          });
                          setIsAddModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-emerald-600 transition-colors p-1" 
                        title="Edit"
                      >
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
        
        {/* Pagination UI */}
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
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Tampilkan maksimal 5 tombol halaman (logika sederhana)
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
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Tambah Data */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button 
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingId(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">{editingId ? 'Edit Data Alumni' : `Tambah Data Alumni ${kategori}`}</h2>
            <p className="text-sm text-gray-500 mb-6">Lengkapi form di bawah ini untuk {editingId ? 'memperbarui' : 'menambahkan'} data alumni.</p>
            
            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Alumni</label>
                <input 
                  type="text" 
                  value={formData.id_alumni}
                  onChange={(e) => setFormData({...formData, id_alumni: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="Contoh: REGIKADHA1"
                />
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input 
                  type="text" 
                  value={formData.nomor_telpon}
                  onChange={(e) => setFormData({...formData, nomor_telpon: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="Contoh: 081234567890"
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

      {/* Modal Auto ID */}
      {isAutoIdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsAutoIdModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Generate Auto ID</h2>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">Sistem akan menyinkronkan seluruh data Putra dan Putri secara alfabetis dengan penomoran otomatis berdigit 3 (contoh: 001, 002).</p>
            
            <form onSubmit={executeGenerateID} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prefix ID (Awalan)</label>
                <input 
                  type="text" 
                  value={autoIdPrefix}
                  onChange={(e) => setAutoIdPrefix(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono text-lg"
                  placeholder="Contoh: IDA-25"
                  required
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Preview (Pratinjau Hasil)</p>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>1. Putra Pertama</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{autoIdPrefix}001</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span>2. Putra Kedua</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{autoIdPrefix}002</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>...</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Putri Selanjutnya</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{autoIdPrefix}128</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAutoIdModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading || !autoIdPrefix}
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Sinkronisasi...' : 'Terapkan ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
