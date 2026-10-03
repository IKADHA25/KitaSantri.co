import Image from "next/image";
import logoPondok from "@/assets/logoHD.png";

export const metadata = {
  title: 'Profil Pondok Pesantren Darul Huda Mayak',
};

export default function ProfilPondokPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-10">
          <Image 
            src={logoPondok} 
            alt="Logo Pondok Pesantren Darul Huda Mayak" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain mb-6 drop-shadow-lg hover:scale-105 transition-transform duration-500"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center tracking-tight">Profil Pondok Pesantren</h1>
          <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-green-600 text-center uppercase tracking-wider">
            Darul Huda Mayak Ponorogo
          </h2>
        </div>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 mb-12">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            
            {/* Highlights Section */}
            <div className="mb-12">
              <div className="bg-emerald-50 rounded-2xl p-6 md:p-8 border border-emerald-100 shadow-sm">
                <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Sekilas Pandang Darul Huda Mayak
                </h4>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold text-lg">•</span>
                    <div><strong>Sejarah & Perkembangan:</strong> Pondok Pesantren Darul Huda Mayak, Ponorogo terus berkembang pesat menjadi salah satu pusat pendidikan Islam terkemuka yang mencetak generasi unggul dengan akhlakul karimah.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold text-lg">•</span>
                    <div><strong>Sistem Pendidikan Integratif:</strong> Menggabungkan dengan sempurna antara kurikulum salafiyyah (pengkajian kitab kuning klasik secara mendalam) dengan pendidikan formal modern untuk menjawab tantangan zaman.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold text-lg">•</span>
                    <div><strong>Fasilitas & Lingkungan:</strong> Dilengkapi dengan sarana prasarana yang memadai, asrama yang rapi, serta lingkungan pesantren yang asri untuk menunjang kenyamanan kegiatan belajar mengajar para santri.</div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1 font-bold text-lg">•</span>
                    <div><strong>Pembentukan Karakter:</strong> Sangat menekankan pada kedisiplinan, kemandirian, dan kesederhanaan dalam setiap kegiatan harian santri selama 24 jam di dalam pondok.</div>
                  </li>
                </ul>
              </div>
            </div>

            <p className="mb-6">
              Pondok Pesantren Darul Huda Mayak adalah salah satu institusi pendidikan Islam terkemuka yang terletak di Mayak, Tonatan, Kabupaten Ponorogo, Jawa Timur. Didirikan dengan tujuan mulia untuk mencetak generasi muslim yang <em>tafaqquh fiddin</em> (paham secara mendalam akan ilmu agama), berakhlak mulia, dan siap mengabdi kepada masyarakat.
            </p>
            <p className="mb-6">
              Sistem pendidikan di Darul Huda Mayak sangat istimewa karena memadukan antara kurikulum salaf (pesantren tradisional) dengan sistem pendidikan modern (formal). Berkat perpaduan ini, para santri tidak hanya menguasai ilmu agama secara mendalam dan mahir mengkaji kitab kuning, tetapi juga dibekali dengan ilmu pengetahuan umum yang mumpuni agar mampu menjawab tantangan zaman.
            </p>
            <p className="mb-6">
              Berkat gemblengan para kyai dan asatidz, alumni Pondok Pesantren Darul Huda Mayak telah tersebar di berbagai penjuru nusantara bahkan dunia. Para alumni terus berusaha mengambil peran penting di berbagai lini kehidupan masyarakat, menjunjung tinggi nilai-nilai kesantrian, dan menyambung tali silaturahmi yang erat melalui ikatan keluarga besar alumni seperti IKADHA.
            </p>

            {/* Sejarah Berdirinya Pondok */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Awal Mula Berdirinya Pondok Pesantren</h3>
              <p className="mb-4">
                Pondok Pesantren Darul Huda adalah institusi pendidikan Islam yang didirikan oleh <strong>K.H. Hasyim Sholeh</strong> pada tahun 1968. Lalu, bagaimana kisah dan kejadian di balik berdirinya pesantren ini?
              </p>
              <p className="mb-4">
                Kisah bermula ketika Mbah Hasyim pulang dari menimba ilmu (mondok) ke Ponorogo. Sesampainya di kampung halaman, beliau melaksanakan tirakat yang berupa <em>puasa mutih</em> selama 7 hari. Pada hari terakhir tirakatnya, beliau lupa tidak makan sahur. Ketika waktu malam tiba, tubuh beliau tak lagi kuat menahan lapar hingga akhirnya beliau jatuh pingsan. Dalam kondisi antara sadar dan tidak sadar tersebut, beliau bermimpi melihat bumi Mayak tertimpa Ka'bah dari arah langit. Di saat yang sama, ada sebuah cahaya yang sangat terang melayang di atas beliau. Beliau berusaha keras untuk menangkap cahaya tersebut, namun tidak berhasil.
              </p>
              <div className="bg-gray-50 border-l-4 border-green-500 p-6 my-6 rounded-r-xl font-medium text-gray-800 italic">
                "Ka'bah yang jatuh di bumi Mayak tersebut adalah pertanda bahwa kelak bumi Mayak akan menjadi kiblatnya ilmu agama, sebagaimana Ka'bah menjadi kiblat bagi umat Islam dalam salat."
              </div>
              <p className="mb-4">
                Setelah sadar dari pingsannya, Mbah Hasyim langsung <em>sowan</em> (menghadap) kepada salah satu ulama besar, yaitu <strong>K.H. Hamim Jazuli</strong> (yang lebih akrab disapa <strong>Gus Miek</strong>) untuk menanyakan makna dari mimpi tersebut. Gus Miek pun memberikan jawaban seperti kutipan di atas. Namun mengenai cahaya terang yang melayang tersebut, Gus Miek memilih untuk merahasiakannya dan tidak menceritakannya. Setelah berpamitan, Mbah Hasyim pulang ke Ponorogo dengan semangat baja untuk berjuang demi agama.
              </p>
              <p className="mb-4">
                Perjuangan pun dimulai. Sekitar tahun 1966-1967, Mbah Hasyim mulai membuka pengajian untuk masyarakat pada malam hari. Seiring berjalannya waktu, antusiasme masyarakat semakin tinggi dan jumlah santri yang ingin mengaji pun terus bertambah. Mengakomodir hal ini, jadwal sekolah madrasah diniyah akhirnya dipindah ke sore hari.
              </p>
              <p className="mb-6">
                Selang beberapa waktu, ada seorang pekerja bernama Boiman yang turut serta mengikuti pengajian diniyah beliau. Karena kecintaannya pada ilmu dan tidak ingin menyia-nyiakan waktu ngajinya, Boiman akhirnya memutuskan untuk tinggal menetap (mukim) di Mayak. Langkah Boiman ini perlahan menginspirasi banyak orang lain untuk mengikuti jejaknya. Semakin banyaknya santri yang bermukim ini akhirnya mendorong Mbah Hasyim untuk mendirikan sebuah pondok kecil di sebelah selatan masjid Mayak. Dua bangunan awal tersebut diberi nama <strong>Zulfah</strong> dan <strong>Zulhulaifah</strong>, yang menjadi cikal bakal berdirinya bangunan-bangunan asrama Pondok Pesantren Darul Huda Mayak yang megah seperti sekarang ini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
