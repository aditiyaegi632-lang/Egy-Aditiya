# Sistem Manajemen Berkas Kantor Notaris & PPAT

Aplikasi web dashboard modern, bersih, dan responsif untuk pengelolaan berkas legalitas, akta badan usaha/hukum, waarmerking, dan legalisasi kantor Notaris & PPAT.

## Fitur Utama

- **Navigasi Sidebar Permanen**: Berada di sebelah kiri layar dengan skema warna Merah Marun (*Burgundy* `#701424`), teks putih, dan logo Kantor Notaris.
- **Dropdown Accordion Interaktif**: Memiliki 3 submenu terstruktur (*"Pendirian"*, *"Perubahan"*, *"Pembubaran"*) untuk PT, CV, Yayasan, Koperasi, dan Firma.
- **Header Multifungsi**: Pencarian live (*real-time search*), jam real-time berdetak (HH:mm:ss WIB), lonceng notifikasi, dan avatar profil pengguna.
- **Ringkasan Statistik (Summary Cards)**:
  - Total Berkas: 18
  - Pending: 1
  - Diproses: 15
  - Selesai: 2
- **Grafik & Kalender**: Bar chart tren bulanan berkas dengan pemilih tahun 2026, dan kalender bulanan interaktif dengan penanda tanggal aktif serta agenda acara.
- **Tabel Berkas & Aktivitas**: Kolom data lengkap, filter status, pengubahan status langsung, pencatatan aktivitas, dan cetak tanda terima berkas.

## Konfigurasi Vercel

Proyek ini telah dikonfigurasi penuh untuk siap di-*deploy* langsung di Vercel:

1. **`vercel.json`**:
   - Framework: `vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Rewrites: `/(.*)` diarahkan ke `/index.html` untuk mendukung Client-Side Routing (SPA).
   - Cache-Control headers untuk aset statis di `/assets/*`.

2. **`.vercelignore`**:
   - Mengabaikan dependensi lokal dan file environment yang tidak diperlukan selama proses build Vercel.

## Cara Deploy ke Vercel

### Opsi 1: Menggunakan Git Repository (Disarankan)
1. Push repositori ini ke GitHub / GitLab / Bitbucket.
2. Buka dashboard [Vercel](https://vercel.com) dan pilih **Add New Project**.
3. Import repositori Anda. Vercel akan secara otomatis mendeteksi preset **Vite** dan file konfigurasi `vercel.json`.
4. Klik **Deploy**.

### Opsi 2: Menggunakan Vercel CLI
```bash
npm install -g vercel
vercel
```
Untuk deploy ke production:
```bash
vercel --prod
```

## Menjalankan di Lokal

```bash
# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev

# Build untuk produksi
npm run build

# Pratinjau build produksi
npm run preview
```
