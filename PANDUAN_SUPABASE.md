# 🚀 Panduan Setup & Koneksi Supabase

Dokumen ini berisi panduan langkah demi langkah untuk menyambungkan proyek website Next.js Anda (IKADHA 25) dengan backend dari **Supabase**.

---

## Tahap 1: Mendapatkan Kredensial API dari Supabase

1. Kunjungi website [Supabase](https://supabase.com/) dan pastikan Anda sudah login atau membuat akun.
2. Buat proyek baru (*New Project*) jika belum memiliki proyek. Tunggu hingga proses penyiapan database selesai (biasanya beberapa menit).
3. Setelah masuk ke *Dashboard* proyek Anda:
   - Lihat ke **Sidebar Kiri**, arahkan kursor ke bagian bawah, lalu klik ikon **⚙️ Settings (Project Settings)**.
   - Di menu Settings yang terbuka, klik opsi **API**.
4. Di halaman API ini, Anda memerlukan dua nilai penting:
   - **Project URL:** Terletak di bagian *URL*. Bentuknya seperti `https://<id-acak>.supabase.co`.
   - **Project API Keys (anon / public):** Terletak di bawah tulisan *Project API keys*. Cari *key* yang memiliki label `anon` dan `public`. String karakter panjang ini adalah kunci akses untuk sisi klien (Next.js) Anda.

---

## Tahap 2: Menambahkan Kunci ke Website (File `.env`)

1. Buka *code editor* Anda (VS Code) di proyek website Anda.
2. Di folder paling luar (sejajar dengan file `package.json`), pastikan ada file bernama **`.env`** (atau `.env.local`). Jika tidak ada, buat secara manual.
3. Buka file `.env` tersebut dan tambahkan dua variabel ini:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_project_url_anda_di_sini
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_anon_public_key_anda_di_sini
```

> **⚠️ PENTING:** 
> - Jangan ada spasi sebelum atau sesudah tanda sama dengan `=`.
> - Jangan membungkus nilai dengan tanda kutip (`"` atau `'`).

---

## Tahap 3: Menjalankan Ulang Server Website

Perubahan pada file `.env` tidak akan terdeteksi otomatis oleh server Next.js yang sedang berjalan.

1. Buka *Terminal* (tepat di mana Anda menjalankan `npm run dev`).
2. Tekan **`Ctrl + C`** pada keyboard Anda untuk mematikan *local server*.
3. Setelah server mati, nyalakan kembali dengan mengetik:
   ```bash
   npm run dev
   ```

---

## Tahap 4: Menyiapkan Akun Admin (Untuk Login)

Supaya form login di `/login` bisa berfungsi, Anda harus mendaftarkan kredensial admin tersebut di database Supabase:

1. Kembali ke Dashboard **Supabase** Anda di browser web.
2. Pada *Sidebar Kiri*, klik menu **Authentication** (ikon dua orang / gembok).
3. Di halaman *Users*, klik tombol **Add User** (di kanan atas), lalu pilih **Create new user**.
4. Masukkan **Email** (misal: `admin@ikadha25.co`) dan **Password** yang kuat.
5. Klik **Create User**.

*(Tips: Secara bawaan, Supabase mewajibkan konfirmasi email. Jika Anda ingin akun tersebut langsung aktif tanpa verifikasi email, Anda harus mematikan fitur verifikasi email dengan cara masuk ke menu **Authentication > Providers > Email**, matikan toggle **"Confirm email"**, lalu **Save**).*

---

## Selesai! 🎉

Sekarang Anda sudah bisa mengunjungi halaman [http://localhost:3000/login](http://localhost:3000/login) di website Anda, dan mencoba masuk menggunakan Email dan Password yang baru saja Anda daftarkan di Tahap 4!
