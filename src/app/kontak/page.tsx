import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak | IKADHA 25",
  description: "Hubungi IKADHA 25 - Ikatan Alumni Darul Huda Mayak Angkatan 2025",
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-gray-950 to-emerald-950 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-10 md:left-1/3 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 md:right-1/3 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto w-full relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 mb-4 drop-shadow-sm">
            Hubungi Kami
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Kami senang mendengar dari Anda. Silakan hubungi kami melalui media di bawah ini.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-emerald-900/20">
          <div className="space-y-8">
            {/* Email */}
            <div className="flex items-start">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 shrink-0">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                <p className="text-gray-400 mb-2">Kirimkan pertanyaan atau masukan Anda ke email kami.</p>
                <a href="mailto:ikadha25@gmail.com" className="text-emerald-400 hover:text-green-300 font-medium transition-colors">
                  ikadha25@gmail.com
                </a>
              </div>
            </div>

            <div className="w-full h-px bg-gray-800"></div>

            {/* Instagram */}
            <div className="flex items-start">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 shrink-0">
                <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-white mb-2">Instagram</h3>
                <p className="text-gray-400 mb-2">Ikuti aktivitas dan kegiatan terbaru kami.</p>
                <a href="https://instagram.com/kitasantri.co" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-green-300 font-medium transition-colors">
                  @kitasantri.co
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
