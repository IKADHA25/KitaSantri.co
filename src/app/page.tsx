import Carousel from "@/components/Carousel";
import PoemDropdown from "@/components/PoemDropdown";
import Link from "next/link";
import Image from "next/image";
import logoPondok from "@/assets/logoHD.png";
import logoIkadha from "@/assets/logoikadha.png";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import GallerySection from "@/components/GallerySection";
import TestimonialSection from "@/components/TestimonialSection";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch actual stats
  const { count: alumniPutraCount } = await supabase.from('alumni_putra').select('*', { count: 'exact', head: true });
  const { count: alumniPutriCount } = await supabase.from('alumni_putri').select('*', { count: 'exact', head: true });
  const totalAlumni = (alumniPutraCount || 0) + (alumniPutriCount || 0);
  
  // Fetch latest 3 news
  const { data: latestBerita } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);
    
  // Fetch website settings
  const { data: settings } = await supabase
    .from('pengaturan_website')
    .select('*')
    .eq('id', 1)
    .single();

  return (
    <main className="bg-gray-50 pb-20">
      {/* Banner / Slider */}
      <Carousel />

      {/* Tentang Kami / Pengantar IKADHA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ScrollReveal className="w-full" direction="right">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Selamat Datang di <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-green-600">IKADHA 25</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              <strong>IKADHA</strong> adalah singkatan dari <strong>Ikatan Alumni Darul Huda Mayak</strong>. Website ini secara khusus didedikasikan sebagai pusat informasi, komunikasi, dan wadah silaturahmi bagi seluruh keluarga besar alumni Pondok Pesantren Darul Huda Mayak <strong>Angkatan Tahun 2025</strong>.
            </p>
            <Link href="/about" className="inline-flex items-center bg-emerald-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 group mb-8">
              Pelajari Lebih Lanjut
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>

            {/* Dual Logos (Pondok & IKADHA) */}
            <div className="flex items-center space-x-6 pb-2">
              <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:rotate-3 transition-all duration-400 ease-out cursor-pointer">
                <Image src={logoPondok} alt="Logo Pondok Pesantren Darul Huda Mayak" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm" />
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:-rotate-3 transition-all duration-400 ease-out cursor-pointer">
                <Image src={logoIkadha} alt="Logo IKADHA 25" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm" />
              </div>
            </div>

            {/* Puisi Perpisahan (Dropdown) */}
            <PoemDropdown />
          </ScrollReveal>
          <ScrollReveal className="w-full flex flex-col items-center" direction="left" delay={0.2}>
             <div className="w-full relative pt-[56.25%] rounded-2xl overflow-hidden shadow-xl border-4 border-emerald-50 bg-gray-900">
               <iframe 
                 className="absolute top-0 left-0 w-full h-full"
                 src="https://www.youtube.com/embed/MQfvb1byUWg?autoplay=1&mute=1&loop=1&playlist=MQfvb1byUWg&si=CEqvI8NG-GEI52kR" 
                 title="YouTube video player" 
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                 allowFullScreen
               ></iframe>
             </div>
             <p className="text-sm font-semibold text-emerald-700 mt-4 px-5 py-2.5 bg-emerald-50 rounded-full shadow-sm text-center w-full md:w-auto animate-pulse">
               🎥 Memori Perpisahan Angkatan 2025
             </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Statistik Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-linear-to-r from-emerald-600 to-green-500 rounded-3xl p-8 md:p-12 shadow-xl text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                <AnimatedCounter value={totalAlumni > 0 ? totalAlumni : 520} />
              </div>
              <div className="text-emerald-100 font-medium">Total Alumni</div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                {settings?.kota_asal || "45+"}
              </div>
              <div className="text-emerald-100 font-medium">Kota Asal</div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                {settings?.program_kerja || "12"}
              </div>
              <div className="text-emerald-100 font-medium">Program Kerja</div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.4}>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                {settings?.solidaritas || "100%"}
              </div>
              <div className="text-emerald-100 font-medium">Solidaritas</div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Profil Pondok Pesantren Video Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <ScrollReveal className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Profil Pondok Pesantren</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Mengenal lebih dekat lingkungan, kegiatan, dan sistem pendidikan di Pondok Pesantren Darul Huda Mayak.</p>
        </ScrollReveal>
        
        <ScrollReveal className="max-w-4xl mx-auto bg-white rounded-3xl p-4 shadow-xl border border-gray-100" delay={0.2}>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner bg-gray-900">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/CJbjaWLzdJ8?autoplay=1&mute=1&loop=1&playlist=CJbjaWLzdJ8&si=j9ERpgfXnsvprbvo" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </ScrollReveal>
      </section>

      {/* Berita Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <ScrollReveal className="flex justify-between items-end mb-8" direction="up">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Berita Terbaru</h2>
            <p className="text-gray-600">Kabar terkini dan kegiatan seputar IKADHA 25.</p>
          </div>
          <Link href="/berita" className="hidden sm:inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors">
            Lihat Semua
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestBerita && latestBerita.length > 0 ? (
            latestBerita.map((item, idx) => (
              <ScrollReveal key={item.id} direction="up" delay={0.1 * idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="aspect-4/3 w-full relative overflow-hidden bg-gray-100">
                  {item.url_foto ? (
                    <Image src={item.url_foto} alt={item.judul} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 grow">
                    {item.deskripsi}
                  </p>
                  <Link href={`/berita/${item.slug}`} className="mt-auto inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group/link">
                    Baca Selengkapnya
                    <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              Belum ada berita yang dipublikasikan.
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/berita" className="inline-flex items-center justify-center w-full border-2 border-emerald-500 text-emerald-600 font-semibold px-4 py-3 rounded-xl hover:bg-emerald-50 hover:-translate-y-1 active:scale-95 transition-all duration-300">
            Lihat Semua Berita
          </Link>
        </div>
      </section>

      {/* Galeri Kenangan Section */}
      <GallerySection />

      {/* Testimoni / Kata Sambutan Section */}
      <TestimonialSection />

    </main>
  );
}

