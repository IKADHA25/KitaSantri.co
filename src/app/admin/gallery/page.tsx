"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

export default function AdminGallery() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [linkDrive, setLinkDrive] = useState('');
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !caption) {
      toast.error('Mohon pilih foto dan isi keterangan.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Kompres gambar otomatis
      const options = {
        maxSizeMB: 1, // maksimal 1MB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(selectedFile, options);
      
      // 2. Upload ke Supabase Storage (bucket 'uploads')
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `galeri/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      // 3. Dapatkan URL publik
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      // 4. Insert ke tabel galeri
      const { error } = await supabase
        .from('galeri')
        .insert([{ url_foto: publicUrl, caption, link_drive: linkDrive }]);
        
      if (error) throw error;

      // 5. Catat di log aktivitas
      await supabase
        .from('log_aktivitas')
        .insert([{ teks_aktivitas: `Foto baru ditambahkan ke Galeri`, tipe: 'gallery' }]);

      // 6. Reset form & refresh data
      setSelectedFile(null);
      setPreviewUrl('');
      setCaption('');
      setLinkDrive('');
      const fileInput = document.getElementById('gallery-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast.success('Foto berhasil ditambahkan ke Galeri!');
      fetchPhotos();
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast.error('Gagal menambahkan foto: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Galeri Kegiatan</h1>
          <p className="text-gray-500 mt-1">Unggah dan kelola foto-foto dokumentasi kegiatan alumni.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Upload */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tambah Foto Baru</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Foto (Otomatis dikompres)</label>
                <input 
                  type="file" 
                  id="gallery-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              {/* Preview Foto */}
              {previewUrl && (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-40 w-auto object-contain rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Foto</label>
                <input 
                  type="text" 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Contoh: Bukber Ramadhan 2026" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Drive (Opsional)</label>
                <input 
                  type="url" 
                  value={linkDrive}
                  onChange={(e) => setLinkDrive(e.target.value)}
                  placeholder="https://drive.google.com/..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <button 
                onClick={handleUpload}
                disabled={isSubmitting}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Tambahkan ke Galeri'}
              </button>
            </div>
          </div>
        </div>

        {/* Daftar Foto */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Koleksi Foto</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {photos.length} Foto
              </span>
            </div>
            
            <div className="p-4">
              {loading ? (
                <div className="text-center py-12 text-emerald-600 font-medium">
                  Memuat foto dari database...
                </div>
              ) : photos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Belum ada foto yang diunggah.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <div className="aspect-4/3 w-full overflow-hidden bg-gray-100">
                        <img 
                          src={photo.url_foto} 
                          alt={photo.caption} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Overlay Edit/Hapus saat hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <button className="p-2 bg-white text-gray-700 rounded-full hover:text-emerald-600 hover:scale-110 transition-all shadow-lg" title="Edit Keterangan">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm('Hapus foto ini?')) {
                              await supabase.from('galeri').delete().eq('id', photo.id);
                              fetchPhotos();
                            }
                          }}
                          className="p-2 bg-white text-gray-700 rounded-full hover:text-red-600 hover:scale-110 transition-all shadow-lg" 
                          title="Hapus Foto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </div>

                      <div className="p-3 bg-white">
                        <p className="font-medium text-gray-900 text-sm truncate" title={photo.caption}>{photo.caption}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">{new Date(photo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          {photo.link_drive && (
                            <a href={photo.link_drive} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 font-medium transition-colors" title="Buka Link Google Drive">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                              Drive
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
