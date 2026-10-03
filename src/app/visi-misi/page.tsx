export const metadata = {
  title: 'Visi & Misi',
};

export default function VisiMisiPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Visi & Misi IKADHA 25</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-linear-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-lg text-white">
          <div className="bg-white/20 w-14 h-14 flex items-center justify-center rounded-full mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Visi</h2>
          <p className="text-lg leading-relaxed text-green-50">
            Menjadi organisasi alumni yang solid, inovatif, dan bermanfaat nyata bagi seluruh anggota, almamater, serta masyarakat luas dengan berlandaskan nilai-nilai Islami.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-blue-50 text-blue-600 w-14 h-14 flex items-center justify-center rounded-full mb-6">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Misi</h2>
          <ul className="space-y-4 text-gray-700 text-lg">
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-2xl leading-none">&bull;</span>
              Mempererat tali silaturahmi antar sesama alumni IKADHA 25 di manapun berada.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-2xl leading-none">&bull;</span>
              Mengembangkan potensi, kreativitas, dan kesejahteraan anggota melalui program-program kolaboratif.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 text-2xl leading-none">&bull;</span>
              Berkontribusi aktif dalam mendukung kemajuan almamater Pondok Pesantren Darul Huda Mayak.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

