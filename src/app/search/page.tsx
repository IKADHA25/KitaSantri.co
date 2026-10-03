"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [loading, setLoading] = useState(false);
  const [alumniResults, setAlumniResults] = useState<any[]>([]);
  const [beritaResults, setBeritaResults] = useState<any[]>([]);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setAlumniResults([]);
        setBeritaResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const searchTerm = `%${query}%`;
        
        // Search alumni putra
        const { data: putra } = await supabase
          .from('alumni_putra')
          .select('id, nama, domisili, instansi_pendidikan')
          .or(`nama.ilike.${searchTerm},domisili.ilike.${searchTerm}`);
          
        // Search alumni putri
        const { data: putri } = await supabase
          .from('alumni_putri')
          .select('id, nama, domisili, instansi_pendidikan')
          .or(`nama.ilike.${searchTerm},domisili.ilike.${searchTerm}`);
          
        // Combine alumni
        const combinedAlumni = [...(putra || []).map(p => ({...p, gender: 'Putra'})), ...(putri || []).map(p => ({...p, gender: 'Putri'}))];
        setAlumniResults(combinedAlumni);

        // Search berita
        const { data: berita } = await supabase
          .from('berita')
          .select('id, judul, slug, deskripsi, created_at')
          .or(`judul.ilike.${searchTerm},deskripsi.ilike.${searchTerm}`);
          
        setBeritaResults(berita || []);
        
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    performSearch();
  }, [query]);

  const hasResults = alumniResults.length > 0 || beritaResults.length > 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hasil Pencarian</h1>
        {query ? (
          <p className="text-gray-600">
            Menampilkan hasil pencarian untuk: <span className="font-semibold italic text-emerald-700">"{query}"</span>
          </p>
        ) : (
          <p className="text-gray-600">Silakan masukkan kata kunci pencarian pada kolom di atas.</p>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : query && !hasResults ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Pencarian Tidak Ditemukan</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Maaf, kami tidak menemukan alumni atau berita yang cocok dengan kata kunci <strong>"{query}"</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {alumniResults.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Data Alumni ({alumniResults.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alumniResults.map((alumni) => (
                  <div key={`${alumni.gender}-${alumni.id}`} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${alumni.gender === 'Putra' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight mb-1">{alumni.nama}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          {alumni.domisili || '-'}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium line-clamp-1">{alumni.instansi_pendidikan}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {beritaResults.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Berita & Artikel ({beritaResults.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beritaResults.map((item) => (
                  <Link href={`/berita/${item.slug}`} key={item.id} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <span className="text-xs text-gray-400 font-medium mb-2 block">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">{item.judul}</h3>
                    <p className="text-sm text-gray-500 line-clamp-3">{item.deskripsi}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
      <Suspense fallback={<div className="text-center py-20 text-gray-500 font-medium animate-pulse">Memuat...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}
