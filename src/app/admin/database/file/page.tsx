"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

export default function DatabaseFilePage() {
  const [namaFile, setNamaFile] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dokumen')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!namaFile) setNamaFile(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !namaFile) {
      toast.error('Mohon pilih file dan isi nama file.');
      return;
    }

    setIsSubmitting(true);
    try {
      let fileToUpload = selectedFile;
      
      // Jika file adalah gambar, kompres otomatis
      if (selectedFile.type.startsWith('image/')) {
        const options = {
          maxSizeMB: 1, // maksimal 1MB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        fileToUpload = await imageCompression(selectedFile, options);
      }
      
      // Format ukuran otomatis
      const bytes = fileToUpload.size;
      let ukuranFormatted = (bytes / (1024 * 1024)).toFixed(2) + ' MB';
      if (bytes < 1024 * 1024) {
        ukuranFormatted = (bytes / 1024).toFixed(2) + ' KB';
      }

      // 1. Upload ke Supabase Storage (bucket 'uploads')
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `dokumen/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, fileToUpload);

      if (uploadError) throw uploadError;

      // 2. Dapatkan URL publik
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      // 3. Insert ke tabel dokumen
      const { error } = await supabase
        .from('dokumen')
        .insert([{ 
          nama_file: namaFile, 
          url_file: publicUrl, 
          ukuran: ukuranFormatted 
        }]);
        
      if (error) throw error;

      // 4. Catat di log aktivitas
      await supabase
        .from('log_aktivitas')
        .insert([{ teks_aktivitas: `Admin mengunggah file ${namaFile}`, tipe: 'file' }]);

      // 5. Reset form & refresh data
      setNamaFile('');
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast.success('File berhasil ditambahkan!');
      fetchFiles();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error('Gagal menambahkan file: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Hapus file ${name}?`)) {
      try {
        await supabase.from('dokumen').delete().eq('id', id);
        
        // Log delete activity
        await supabase
          .from('log_aktivitas')
          .insert([{ teks_aktivitas: `Admin menghapus file ${name}`, tipe: 'file' }]);
          
        fetchFiles();
        toast.success('File berhasil dihapus');
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error('Gagal menghapus file');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Database File</h1>
          <p className="text-gray-500 text-sm mt-1">Unggah dan kelola file dokumen atau arsip penting IKADHA 25.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Upload */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tambah File Baru</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama File</label>
                <input 
                  type="text" 
                  value={namaFile}
                  onChange={(e) => setNamaFile(e.target.value)}
                  placeholder="Contoh: Laporan_Keuangan.pdf" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih File (Gambar otomatis dikompres)</label>
                <input 
                  type="file" 
                  id="file-upload"
                  onChange={handleFileChange}
                  className="w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              <button 
                onClick={handleUpload}
                disabled={isSubmitting}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Tambahkan File'}
              </button>
            </div>
          </div>
        </div>

        {/* Daftar File */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">File Tersimpan</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {files.length} File
              </span>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-blue-600 text-sm font-medium">Memuat file dari database...</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                      <th className="px-6 py-3 font-semibold">Nama File</th>
                      <th className="px-6 py-3 font-semibold">Ukuran</th>
                      <th className="px-6 py-3 font-semibold">Tgl Unggah</th>
                      <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {files.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                          Belum ada file yang ditambahkan.
                        </td>
                      </tr>
                    ) : (
                      files.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                              </div>
                              <span className="font-medium text-gray-900 text-sm truncate max-w-37.5 sm:max-w-62.5" title={file.nama_file}>
                                {file.nama_file}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                            {file.ukuran}
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                            {new Date(file.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <a 
                              href={file.url_file} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex text-gray-400 hover:text-blue-600 transition-colors p-1" 
                              title="Buka/Unduh"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                            </a>
                            <button 
                              onClick={() => handleDelete(file.id, file.nama_file)}
                              className="inline-flex text-gray-400 hover:text-red-600 transition-colors p-1 ml-2" 
                              title="Hapus"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
