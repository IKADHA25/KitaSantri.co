"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

export default function AdminBeritaPage() {
  const [uploadMethod, setUploadMethod] = useState<'local' | 'url'>('local');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewLocalUrl, setPreviewLocalUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [linkEksternal, setLinkEksternal] = useState('');
  const [berita, setBerita] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fungsi sederhana untuk membuat slug dari judul
  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const fetchBerita = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setBerita(data || []);
    } catch (error) {
      console.error('Error fetching berita:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewLocalUrl(URL.createObjectURL(file));
    }
  };

  const handleTerbitkan = async () => {
    if (!judul || !deskripsi) {
      toast.error('Mohon isi judul dan deskripsi berita.');
      return;
    }

    let finalImageUrl = imageUrl;
    setIsSubmitting(true);
    try {
      if (uploadMethod === 'local' && selectedFile) {
        // Kompres gambar otomatis
        const options = {
          maxSizeMB: 1, // maksimal 1MB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        
        const compressedFile = await imageCompression(selectedFile, options);
        
        // Upload ke Supabase Storage (bucket 'uploads')
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `berita/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(fileName, compressedFile);

        if (uploadError) throw uploadError;

        // Dapatkan URL publik
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrl;
      }

      const slug = generateSlug(judul);
      
      // 1. Insert ke tabel berita
      const { error } = await supabase
        .from('berita')
        .insert([{ 
          judul, 
          slug, 
          deskripsi, 
          url_foto: finalImageUrl || null, 
          link_eksternal: linkEksternal || null 
        }]);
        
      if (error) {
        if (error.code === '23505') {
          throw new Error('Judul ini menghasilkan link yang sudah dipakai berita lain. Silakan ubah judul.');
        }
        throw error;
      }

      // 2. Catat di log aktivitas
      await supabase
        .from('log_aktivitas')
        .insert([{ teks_aktivitas: `Berita "${judul}" telah diterbitkan`, tipe: 'news' }]);

      // 3. Reset form & refresh data
      setJudul('');
      setDeskripsi('');
      setImageUrl('');
      setLinkEksternal('');
      setSelectedFile(null);
      setPreviewLocalUrl('');
      const fileInput = document.getElementById('berita-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      toast.success('Berita berhasil diterbitkan!');
      fetchBerita();
    } catch (error: any) {
      console.error('Error adding berita:', error);
      toast.error('Gagal menerbitkan berita: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Berita</h1>
          <p className="text-gray-500 mt-1">Buat dan kelola berita, artikel, atau pengumuman penting.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Berita */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Buat Berita Baru</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Sampul</label>
                
                <div className="flex bg-gray-100 p-1 rounded-lg mb-3">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('local')}
                    className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${uploadMethod === 'local' ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Upload dari Perangkat
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${uploadMethod === 'url' ? 'bg-white shadow text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Gunakan URL Link
                  </button>
                </div>

                {uploadMethod === 'local' ? (
                  <input 
                    key="local-upload"
                    type="file" 
                    id="berita-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                ) : (
                  <input 
                    key="url-upload"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://contoh.com/foto.jpg" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>

              {/* Preview Foto */}
              {((uploadMethod === 'local' && previewLocalUrl) || (uploadMethod === 'url' && imageUrl)) && (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={uploadMethod === 'local' ? previewLocalUrl : imageUrl} 
                    alt="Preview" 
                    onError={(e) => {
                      if (uploadMethod === 'url') {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).alt = 'Link gambar tidak valid';
                      }
                    }}
                    className="max-h-40 w-auto object-contain rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Berita</label>
                <input 
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Reuni Akbar IKADHA" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {judul && (
                  <p className="text-xs text-emerald-600 mt-1">
                    URL Otomatis: /berita/<strong>{generateSlug(judul)}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Isi Berita Lengkap</label>
                <textarea 
                  rows={4}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Tuliskan isi berita secara detail..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Terkait Tambahan <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <input 
                  type="url" 
                  value={linkEksternal}
                  onChange={(e) => setLinkEksternal(e.target.value)}
                  placeholder="https://sumber-eksternal.com" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <button 
                onClick={handleTerbitkan}
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                {isSubmitting ? 'Menerbitkan...' : 'Terbitkan Berita'}
              </button>
            </div>
          </div>
        </div>

        {/* Daftar Berita */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Daftar Berita</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {berita.length} Berita
              </span>
            </div>
            
            <div className="p-4">
              {loading ? (
                <div className="text-center py-12 text-emerald-600 font-medium">
                  Memuat berita dari database...
                </div>
              ) : berita.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Belum ada berita yang diterbitkan.
                </div>
              ) : (
                <div className="space-y-4">
                  {berita.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all bg-white group">
                      {/* Thumbnail */}
                      <div className="w-full sm:w-32 h-32 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {item.url_foto ? (
                          <img 
                            src={item.url_foto} 
                            alt={item.judul} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-base truncate" title={item.judul}>{item.judul}</h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-md">
                              {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                            {item.deskripsi}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                          {/* Generated Public Link */}
                          <div className="flex items-center gap-2">
                            <Link href={`/berita/${item.slug}`} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                              Lihat
                            </Link>
                            
                            <button 
                              onClick={() => {
                                const url = `${window.location.origin}/berita/${item.slug}`;
                                navigator.clipboard.writeText(url);
                                toast.success('Link berhasil disalin: ' + url);
                              }}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
                              title="Salin link publik untuk dibagikan"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                              Salin
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.link_eksternal && (
                              <a href={item.link_eksternal} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors p-1" title="Link Sumber Eksternal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                              </a>
                            )}
                            <button className="text-gray-400 hover:text-emerald-600 transition-colors p-1" title="Edit Berita">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button 
                              onClick={async () => {
                                if (confirm('Hapus berita ini?')) {
                                  await supabase.from('berita').delete().eq('id', item.id);
                                  fetchBerita();
                                }
                              }}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1" 
                              title="Hapus Berita"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                          </div>
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
