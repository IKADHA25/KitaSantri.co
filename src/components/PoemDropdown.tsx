"use client";

import { useState } from "react";

export default function PoemDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Narasi Puisi Perpisahan
        </h3>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 focus:outline-none flex items-center bg-emerald-50 px-4 py-2 rounded-full transition-colors shadow-sm"
        >
          {isOpen ? "Tutup" : "Baca Selengkapnya"}
          <svg className={`w-4 h-4 ml-1.5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-linear-to-b from-emerald-50/80 to-white p-6 rounded-2xl border border-emerald-100 italic text-gray-700 space-y-4 shadow-sm relative">
          <div className="absolute top-2 left-3 text-5xl text-emerald-200 opacity-40 font-serif leading-none">"</div>
          <p className="relative z-10 text-base md:text-lg">
            Bertahun lamanya kita bernaung di bawah atap Darul Huda,<br />
            Menghabiskan waktu dengan kitab kuning dan lantunan doa.<br />
            Kini tiba saatnya langkah ini harus berpisah,<br />
            Meninggalkan asrama yang menyimpan sejuta kisah.
          </p>
          <p className="relative z-10 text-base md:text-lg">
            Terima kasih wahai Kyai dan para Asatidz tercinta,<br />
            Ilmu yang engkau beri adalah cahaya bagi gulita.<br />
            Maafkan kenakalan kami yang sering membuat kecewa,<br />
            Nasihatmu akan selalu hidup di dalam jiwa.
          </p>
          <p className="relative z-10 text-base md:text-lg">
            Sahabat...<br />
            Jangan lupakan tawa di bilik kamar yang sempit,<br />
            Jangan lupakan tangis saat hafalan terasa rumit.<br />
            Kita masuk sebagai orang asing yang tak saling kenal,<br />
            Kini kita keluar sebagai keluarga yang kekal.
          </p>
          <p className="relative z-10 text-base md:text-lg">
            Selamat jalan kawan, selamat berjuang di luar sana,<br />
            Tebarkanlah ilmu pesantren ke seluruh penjuru buana.<br />
            Darul Huda Mayak akan selalu menjadi rumah kita,<br />
            Sampai jumpa lagi di puncak kesuksesan dan cita-cita.
          </p>
        </div>
      </div>
    </div>
  );
}
