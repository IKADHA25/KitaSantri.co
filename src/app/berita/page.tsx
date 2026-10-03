import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: 'Berita & Artikel',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BeritaPage() {
  const { data: beritaData } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kabar IKADHA</h1>
          <p className="text-gray-600">Berita, kegiatan, dan artikel terbaru dari keluarga besar IKADHA 25.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {beritaData && beritaData.length > 0 ? (
          beritaData.map((item) => (
            <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group flex flex-col">
              <div className="w-full h-56 relative overflow-hidden bg-gray-100">
                {item.url_foto ? (
                  <Image 
                    src={item.url_foto} 
                    alt={item.judul} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {item.kategori || 'Berita'}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-sm text-gray-400 font-medium mb-3">
                  {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                  {item.judul}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                  {item.deskripsi}
                </p>
                <Link href={`/berita/${item.slug}`} className="text-left font-semibold text-green-600 hover:text-green-700 flex items-center group/btn w-fit">
                  Baca Selengkapnya 
                  <svg className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            Belum ada berita yang dipublikasikan.
          </div>
        )}
      </div>
    </main>
  );
}

