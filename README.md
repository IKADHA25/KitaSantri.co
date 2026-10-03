<div align="center">
  <img src="https://ikadha25.co/icon.png" alt="IKADHA 25 Logo" width="120" height="120" />
  <h1>Portal Web IKADHA 25 (KitaSantri.co)</h1>
  <p>
    <em>Sistem Informasi Digital & Manajemen Alumni Pondok Pesantren Darul Huda Mayak Angkatan 2025</em>
  </p>
  
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  </p>
</div>

---

## 🚀 Fitur Unggulan

Proyek ini dibangun dengan standar arsitektur web modern yang menekankan kecepatan, skalabilitas, dan pengalaman pengguna (*User Experience*) terbaik.

### 🌐 Frontend (Area Publik)
*   **Beranda Dinamis:** Menampilkan statistik persebaran alumni secara *real-time* langsung dari database, berita terbaru, galeri, dan testimoni.
*   **Portal Berita & Artikel:** Sistem publikasi berita terintegrasi dengan pembuatan tautan (slug) otomatis.
*   **Mesin Pencari Universal:** Sistem pencarian (Search Engine) yang mampu mencari data alumni (putra/putri) berdasarkan nama/kota dan mencari berita berdasarkan kata kunci secara instan.
*   **Galeri & Testimoni:** Katalog dokumentasi kegiatan dan ulasan alumni yang di-*render* secara responsif.
*   **Animasi & UI Modern:** Menggunakan *micro-interactions*, efek *Scroll Reveal*, dan *Glassmorphism* untuk desain tingkat premium.

### 🔒 Backend & Admin Panel (Area Terbatas)
*   **Manajemen Database Santri (CRUD):** Sistem pengelolaan ratusan data alumni (Putra & Putri) secara efisien.
*   **Impor & Ekspor CSV:** Kemampuan untuk memasukkan *(import)* data alumni massal via Excel/CSV dan mengunduhnya *(export)* untuk rekapitulasi data.
*   **Kompresi Gambar Otomatis (Client-Side):** Setiap file foto yang diunggah akan otomatis dikompres menjadi **maksimal 1 MB** di *browser* sebelum dikirim ke *server*, menghemat 90% kapasitas *storage* tanpa mengorbankan kualitas visual (mendukung hingga 1080p/1920px).
*   **Pengaturan Website (Settings):** Admin dapat mengubah teks statistik beranda (Kota, Program Kerja, Solidaritas) langsung dari dasbor.
*   **Manajemen Aset (Storage):** Pengelolaan file PDF, dokumen program kerja, dan media gambar melalui bucket Supabase Storage.

---

## 🛠️ Tech Stack & Arsitektur

*   **Framework Utama:** [Next.js (App Router)](https://nextjs.org/docs) - Untuk perenderan *Server-Side* (SSR) dan *Static Site Generation* (SSG).
*   **Database & Autentikasi:** [Supabase](https://supabase.com/) - PostgreSQL Database, Supabase Auth, dan Supabase Storage.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) - *Utility-first CSS framework*.
*   **Notifikasi & UI State:** `react-hot-toast` untuk manajemen notifikasi sistem (*toast alert*).
*   **Utilitas Optimalisasi:** `browser-image-compression` untuk optimasi gambar lokal tingkat berat.

---

## ⚙️ Panduan Instalasi Lokal (Local Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan *source code* ini di komputer Anda:

### 1. Kloning Repositori
```bash
git clone https://github.com/IKADHA25/KitaSantri.co.git
cd KitaSantri.co
```

### 2. Instalasi Dependensi
Pastikan Anda menggunakan Node.js versi 18.17 atau lebih tinggi.
```bash
npm install
# atau
yarn install
```

### 3. Konfigurasi Environment (Variabel Lingkungan)
Buat sebuah file bernama `.env.local` di *root folder* (sejajar dengan `package.json`), dan masukkan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[KUNCI-ANON-ANDA]
```
*(Ingat: File `.env` tidak pernah ikut di-push ke GitHub demi keamanan).*

### 4. Menjalankan Development Server
```bash
npm run dev
# atau
yarn dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

---

## 🛡️ Standar Keamanan & Panduan Produksi (Deployment)

Aplikasi ini siap untuk dipublikasikan (*Production-Ready*) ke *platform* seperti **Vercel** atau **Netlify**. Namun, sebelum *deployment*, **WAJIB** menerapkan kebijakan *Row Level Security* (RLS) di Supabase.

1.  Buka **Supabase Dashboard** > **SQL Editor**.
2.  Jalankan *script* berikut untuk mengunci database dari akses publik dan hanya mengizinkan *Read-Only* bagi tamu, sementara Admin memegang akses penuh:

```sql
```bash
# Pastikan konfigurasi policy database Supabase telah disesuaikan dengan benar:
# 1. Aktifkan RLS untuk seluruh tabel
# 2. Set 'Select' policy untuk publik
# 3. Set 'All' policy khusus untuk peran 'authenticated' (Admin)
```

---

<div align="center">
  <p>Dikembangkan dengan ❤️ untuk keluarga besar IKADHA 25</p>
</div>
