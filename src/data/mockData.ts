import { BerkasItem, AktivitasItem, AgendaItem, MonthlyChartData, UserAccount } from '../types/notary';
import notaryAvatar from '../assets/images/avatar_notaris_1792553433780.jpg';

// 18 Berkas sesuai spesifikasi: 1 Pending, 15 Diproses, 2 Selesai
export const INITIAL_BERKAS: BerkasItem[] = [
  {
    id: 'b-00',
    noBerkas: 'PT - 001',
    jenis: 'PT',
    kategoriSubmenu: 'Pendirian',
    subJenis: 'Pendirian PT Medika',
    klien: 'Aditiya',
    pemohon: 'Aditiya',
    namaPerusahaan: 'PT Medika',
    namaPenghadap: ['1. Aditiya'],
    pekerjaan: ['1. Manajer'],
    status: 'Selesai',
    waktu: '08-08-2026, 10:38 WIB',
    tanggalLengkap: '08 Agustus 2026, 10:38 WIB',
    penanggungJawab: 'Hj. Ratna Sari, S.H.',
    keterangan: 'Akta pendirian perseroan terbatas PT Medika telah disahkan AHU Kemenkumham.',
    biaya: 'Rp 8.000.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-01',
    noBerkas: 'NOT-PT-2026-0041',
    jenis: 'PT',
    kategoriSubmenu: 'Pendirian',
    subJenis: 'Pendirian PT PMDN',
    klien: 'Bambang Sudiro',
    pemohon: 'Bambang Sudiro',
    namaPerusahaan: 'PT Nusantara Solusi Mandiri',
    namaPenghadap: ['1. Bambang Sudiro', '2. Hendra Kusuma'],
    pekerjaan: ['1. Direktur Utama', '2. Komisaris'],
    status: 'Diproses',
    waktu: '22-09-2026, 09:45 WIB',
    tanggalLengkap: '22 September 2026, 09:45 WIB',
    penanggungJawab: 'Hj. Ratna Sari, S.H.',
    keterangan: 'Pengecekan dan pemesanan nama PT di SABH Kemenkumham.',
    biaya: 'Rp 8.500.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-02',
    noBerkas: 'NOT-CV-2026-0038',
    jenis: 'CV',
    kategoriSubmenu: 'Perubahan',
    subJenis: 'Perubahan Pengurus & Modal',
    klien: 'Dewi Kartika & Partner',
    pemohon: 'Dewi Kartika',
    namaPerusahaan: 'CV Makmur Bersama Sukses',
    namaPenghadap: ['1. Dewi Kartika', '2. Rudi Gunawan'],
    pekerjaan: ['1. Direktur', '2. Sekutu Komanditer'],
    status: 'Diproses',
    waktu: '22-09-2026, 09:15 WIB',
    tanggalLengkap: '22 September 2026, 09:15 WIB',
    penanggungJawab: 'Rizky Pratama, S.H.',
    keterangan: 'Penyusunan akta perubahan sekutu aktif dan pemasukan modal baru.',
    biaya: 'Rp 4.200.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-03',
    noBerkas: 'NOT-YYS-2026-0012',
    jenis: 'Yayasan',
    kategoriSubmenu: 'Pendirian',
    subJenis: 'Akta Pendirian Yayasan Sosial',
    klien: 'Prof. Dr. Hendra Gunawan',
    pemohon: 'Prof. Dr. Hendra Gunawan',
    namaPerusahaan: 'Yayasan Lentera Pendidikan Mandiri',
    namaPenghadap: ['1. Hendra Gunawan', '2. Siti Halimah'],
    pekerjaan: ['1. Dosen', '2. Wiraswasta'],
    status: 'Pending',
    waktu: '22-09-2026, 08:30 WIB',
    tanggalLengkap: '22 September 2026, 08:30 WIB',
    penanggungJawab: 'Hj. Ratna Sari, S.H.',
    keterangan: 'Menunggu konfirmasi susunan dewan pembina dan bukti setoran awal bank.',
    biaya: 'Rp 6.000.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: false,
      persetujuanNama: true
    }
  },
  {
    id: 'b-04',
    noBerkas: 'NOT-PT-2026-0039',
    jenis: 'PT',
    kategoriSubmenu: 'Perubahan',
    subJenis: 'Perubahan Anggaran Dasar (AD/ART)',
    klien: 'Ir. Hendro Wijaya',
    namaPerusahaan: 'PT Graha Cipta Makmur',
    status: 'Selesai',
    waktu: '2 jam lalu',
    tanggalLengkap: '22 September 2026, 07:45 WIB',
    penanggungJawab: 'Hj. Ratna Sari, S.H.',
    keterangan: 'Akta RUPSLB telah disahkan AHU Kemenkumham & salinan akta telah diambil.',
    biaya: 'Rp 7.000.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-05',
    noBerkas: 'NOT-WM-2026-0105',
    jenis: 'Waarmerking',
    subJenis: 'Pendaftaran Surat Perjanjian Sewa',
    klien: 'Farhan Aulia & PT Sentra Logistik',
    pemohon: 'Farhan Aulia',
    namaPenghadap: ['1. Farhan Aulia', '2. Budi Darmawan'],
    pekerjaan: ['1. Wiraswasta', '2. Direktur Operasional'],
    status: 'Selesai',
    waktu: '22-09-2026, 06:30 WIB',
    tanggalLengkap: '22 September 2026, 06:30 WIB',
    penanggungJawab: 'Dewi Anggraini (Staf Notariat)',
    keterangan: 'Buku daftar waarmerking No. 105/WM/IX/2026 telah ditandatangani dan dicap resmi.',
    biaya: 'Rp 1.500.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-06',
    noBerkas: 'NOT-KOP-2026-0007',
    jenis: 'Koperasi',
    kategoriSubmenu: 'Pendirian',
    subJenis: 'Pendirian Koperasi Simpan Pinjam',
    klien: 'Agus Subagyo (Ketua Koperasi)',
    pemohon: 'Agus Subagyo',
    namaPerusahaan: 'Koperasi Sejahtera Pegawai Utama',
    namaPenghadap: ['1. Agus Subagyo', '2. Joko Susilo'],
    pekerjaan: ['1. Ketua Koperasi', '2. Bendahara'],
    status: 'Diproses',
    waktu: '21-09-2026, 16:40 WIB',
    tanggalLengkap: '21 September 2026, 16:40 WIB',
    penanggungJawab: 'Hj. Ratna Sari, S.H.',
    keterangan: 'Berita acara rapat pendirian dan kelengkapan daftar 20 anggota pendiri.',
    biaya: 'Rp 7.500.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-07',
    noBerkas: 'NOT-LEG-2026-0219',
    jenis: 'Legalisasi',
    subJenis: 'Legalisasi Surat Kuasa Menjual Saham',
    klien: 'Silvia Renata, S.E.',
    pemohon: 'Silvia Renata, S.E.',
    namaPenghadap: ['1. Silvia Renata, S.E.'],
    pekerjaan: ['1. Karyawan Swasta'],
    status: 'Diproses',
    waktu: '21-09-2026, 15:20 WIB',
    tanggalLengkap: '21 September 2026, 15:20 WIB',
    penanggungJawab: 'Hj. Ratna Sari, S.H.',
    keterangan: 'Para pihak telah menandatangani dihadapan notaris, proses penomoran buku repertorium.',
    biaya: 'Rp 1.250.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-08',
    noBerkas: 'NOT-FRM-2026-0004',
    jenis: 'Firma',
    kategoriSubmenu: 'Pendirian',
    subJenis: 'Pendirian Persekutuan Perdata / Firma',
    klien: 'Aditya Surya & Rekan',
    namaPerusahaan: 'Firma Konsultan Surya & Rekan',
    status: 'Diproses',
    waktu: 'Kemarin, 14:10',
    tanggalLengkap: '21 September 2026, 14:10 WIB',
    penanggungJawab: 'Rizky Pratama, S.H.',
    keterangan: 'Drafting anggaran dasar firma dan pengaturan bagi hasil sekutu.',
    biaya: 'Rp 5.000.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-09',
    noBerkas: 'NOT-PT-2026-0042',
    jenis: 'PT',
    kategoriSubmenu: 'Pendirian',
    subJenis: 'Pendirian PT Perorangan (UMKM)',
    klien: 'Nadia Salsabila',
    namaPerusahaan: 'PT Kopi Nusantara Berkah',
    status: 'Diproses',
    waktu: 'Kemarin, 11:30',
    tanggalLengkap: '21 September 2026, 11:30 WIB',
    penanggungJawab: 'Rizky Pratama, S.H.',
    keterangan: 'Verifikasi NIB dan pernyataan pendirian PT Perorangan OSS RBA.',
    biaya: 'Rp 3.500.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-10',
    noBerkas: 'NOT-PT-2026-0043',
    jenis: 'PT',
    kategoriSubmenu: 'Perubahan',
    subJenis: 'Perubahan Susunan Direksi & Modal',
    klien: 'Michael Jonathan',
    namaPerusahaan: 'PT Teknologi Digital Asia',
    status: 'Diproses',
    waktu: '20 Sep 2026',
    tanggalLengkap: '20 September 2026, 16:15 WIB',
    penanggungJawab: 'Hj. Ratna Sari, S.H.',
    keterangan: 'Pengambilan keputusan sirkuler pemegang saham untuk penerbitan saham seri B.',
    biaya: 'Rp 9.000.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-11',
    noBerkas: 'NOT-CV-2026-0039',
    jenis: 'CV',
    kategoriSubmenu: 'Pendirian',
    subJenis: 'Pendirian CV Konstruksi',
    klien: 'Wawan Setiawan',
    namaPerusahaan: 'CV Karya Pratama Mandiri',
    status: 'Diproses',
    waktu: '20 Sep 2026',
    tanggalLengkap: '20 September 2026, 14:00 WIB',
    penanggungJawab: 'Dewi Anggraini (Staf Notariat)',
    keterangan: 'Pendaftaran berkas ke Sistem Administrasi Badan Usaha (SABU).',
    biaya: 'Rp 4.000.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-12',
    noBerkas: 'NOT-WM-2026-0106',
    jenis: 'Waarmerking',
    subJenis: 'Waarmerking Perjanjian Kerja Bersama',
    klien: 'HRD PT Sentosa Abadi',
    pemohon: 'Dian Permana, S.T.',
    namaPenghadap: ['1. Dian Permana, S.T.', '2. Hendra Kusnadi'],
    pekerjaan: ['1. HR Director', '2. Ketua Serikat Pekerja'],
    status: 'Diproses',
    waktu: '19-09-2026, 11:20 WIB',
    tanggalLengkap: '19 September 2026, 11:20 WIB',
    penanggungJawab: 'Dewi Anggraini (Staf Notariat)',
    keterangan: 'Pencatatan surat dalam buku khusus surat di bawah tangan.',
    biaya: 'Rp 1.000.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-13',
    noBerkas: 'NOT-LEG-2026-0220',
    jenis: 'Legalisasi',
    subJenis: 'Legalisasi Surat Persetujuan Suami/Istri',
    klien: 'Drs. Tri Wahyudi & Ny. Indah',
    pemohon: 'Drs. Tri Wahyudi',
    namaPenghadap: ['1. Drs. Tri Wahyudi', '2. Ny. Indah Permatasari'],
    pekerjaan: ['1. Pensiunan PNS', '2. Ibu Rumah Tangga'],
    status: 'Diproses',
    waktu: '19-09-2026, 09:40 WIB',
    tanggalLengkap: '19 September 2026, 09:40 WIB',
    penanggungJawab: 'Hj. Ratna Sari, S.H.',
    keterangan: 'Penandatanganan langsung di hadapan Notaris & verifikasi identitas fisik.',
    biaya: 'Rp 1.200.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-14',
    noBerkas: 'NOT-YYS-2026-0013',
    jenis: 'Yayasan',
    kategoriSubmenu: 'Perubahan',
    subJenis: 'Perubahan Pengurus & Anggaran Dasar',
    klien: 'K.H. Ahmad Dahlan Al-Fikri',
    namaPerusahaan: 'Yayasan Bina Umat Insani',
    status: 'Diproses',
    waktu: '18 Sep 2026',
    tanggalLengkap: '18 September 2026, 15:30 WIB',
    penanggungJawab: 'Hj. Ratna Sari, S.H.',
    keterangan: 'Proses pelaporan perubahan organ yayasan ke Ditjen AHU Kemenkumham.',
    biaya: 'Rp 5.500.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-15',
    noBerkas: 'NOT-KOP-2026-0008',
    jenis: 'Koperasi',
    kategoriSubmenu: 'Perubahan',
    subJenis: 'Perubahan Anggaran Dasar Koperasi',
    klien: 'Siti Aminah, M.Pd.',
    namaPerusahaan: 'Koperasi Wanita Mandiri Berdikari',
    status: 'Diproses',
    waktu: '18 Sep 2026',
    tanggalLengkap: '18 September 2026, 13:10 WIB',
    penanggungJawab: 'Rizky Pratama, S.H.',
    keterangan: 'Penyesuaian permodalan dengan Permenkop UKM terbaru.',
    biaya: 'Rp 6.500.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-16',
    noBerkas: 'NOT-FRM-2026-0005',
    jenis: 'Firma',
    kategoriSubmenu: 'Pembubaran',
    subJenis: 'Pembubaran Firma & Likuidasi Sekutu',
    klien: 'Bagus Prakoso & Rekan',
    namaPerusahaan: 'Firma Hukum Prakoso & Associates',
    status: 'Diproses',
    waktu: '17 Sep 2026',
    tanggalLengkap: '17 September 2026, 16:50 WIB',
    penanggungJawab: 'Rizky Pratama, S.H.',
    keterangan: 'Akta pembubaran firma dan kesepakatan pembagian piutang bersama.',
    biaya: 'Rp 4.500.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-17',
    noBerkas: 'NOT-PT-2026-0044',
    jenis: 'PT',
    kategoriSubmenu: 'Pembubaran',
    subJenis: 'Pembubaran PT & Penunjukan Likuidator',
    klien: 'David Chen & Rekan',
    namaPerusahaan: 'PT Global Tech Logistics',
    status: 'Diproses',
    waktu: '17 Sep 2026',
    tanggalLengkap: '17 September 2026, 10:15 WIB',
    penanggungJawab: 'Hj. Ratna Sari, S.H.',
    keterangan: 'Akta pembubaran perseroan berdasarkan putusan RUPSLB dan pengumuman koran.',
    biaya: 'Rp 12.000.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  },
  {
    id: 'b-18',
    noBerkas: 'NOT-CV-2026-0040',
    jenis: 'CV',
    kategoriSubmenu: 'Pembubaran',
    subJenis: 'Pembubaran CV & Berakhirnya Usaha',
    klien: 'Eko Prasetyo & Mitra',
    namaPerusahaan: 'CV Berkah Tirta Nusantara',
    status: 'Diproses',
    waktu: '16 Sep 2026',
    tanggalLengkap: '16 September 2026, 14:45 WIB',
    penanggungJawab: 'Dewi Anggraini (Staf Notariat)',
    keterangan: 'Akta pembubaran CV dan pemberitahuan penghapusan pada SABU.',
    biaya: 'Rp 3.800.000',
    kelengkapanSyarat: {
      ktpDireksi: true,
      npwp: true,
      buktiModal: true,
      persetujuanNama: true
    }
  }
];

// Tabel Aktivitas Terbaru: Pengguna, Aktivitas, Waktu
export const RECENT_ACTIVITIES: AktivitasItem[] = [
  {
    id: 'act-01',
    pengguna: {
      nama: 'Hj. Ratna Sari, S.H.',
      peran: 'Notaris & PPAT'
    },
    aktivitas: 'Menyetujui draft akhir Akta Pendirian PT Nusantara Solusi Mandiri',
    detailBerkas: 'NOT-PT-2026-0041',
    waktu: '5 menit lalu',
    tipe: 'approval'
  },
  {
    id: 'act-02',
    pengguna: {
      nama: 'Rizky Pratama, S.H.',
      peran: 'Staf Legal Notariat'
    },
    aktivitas: 'Mengunggah verifikasi KTP & NPWP Direksi CV Makmur Bersama',
    detailBerkas: 'NOT-CV-2026-0038',
    waktu: '22 menit lalu',
    tipe: 'upload'
  },
  {
    id: 'act-03',
    pengguna: {
      nama: 'Dewi Anggraini',
      peran: 'Asisten Notaris'
    },
    aktivitas: 'Memperbarui status pendaftaran Kemenkumham Koperasi Sejahtera',
    detailBerkas: 'NOT-KOP-2026-0007',
    waktu: '1 jam lalu',
    tipe: 'update'
  },
  {
    id: 'act-04',
    pengguna: {
      nama: 'Budi Santoso',
      peran: 'Staff Administrasi'
    },
    aktivitas: 'Mendaftarkan berkas baru Akta Pendirian Yayasan Lentera Mandiri',
    detailBerkas: 'NOT-YYS-2026-0012',
    waktu: '2 jam lalu',
    tipe: 'create'
  },
  {
    id: 'act-05',
    pengguna: {
      nama: 'Hj. Ratna Sari, S.H.',
      peran: 'Notaris & PPAT'
    },
    aktivitas: 'Menandatangani legalisasi dan penomoran buku repertorium',
    detailBerkas: 'NOT-LEG-2026-0219',
    waktu: 'Kemarin, 16:30',
    tipe: 'approval'
  },
  {
    id: 'act-06',
    pengguna: {
      nama: 'Rizky Pratama, S.H.',
      peran: 'Staf Legal Notariat'
    },
    aktivitas: 'Melakukan input berkas Firma Konsultan Surya & Rekan',
    detailBerkas: 'NOT-FRM-2026-0004',
    waktu: 'Kemarin, 14:20',
    tipe: 'create'
  }
];

// Data tren berkas per bulan (Tahun 2026, 2025, 2024)
export const MONTHLY_STATS_2026: MonthlyChartData[] = [
  { bulan: 'Januari', singkatan: 'Jan', total: 12, selesai: 10, diproses: 2, pending: 0 },
  { bulan: 'Februari', singkatan: 'Feb', total: 14, selesai: 12, diproses: 2, pending: 0 },
  { bulan: 'Maret', singkatan: 'Mar', total: 19, selesai: 17, diproses: 2, pending: 0 },
  { bulan: 'April', singkatan: 'Apr', total: 16, selesai: 14, diproses: 2, pending: 0 },
  { bulan: 'Mei', singkatan: 'Mei', total: 22, selesai: 20, diproses: 2, pending: 0 },
  { bulan: 'Juni', singkatan: 'Jun', total: 25, selesai: 23, diproses: 2, pending: 0 },
  { bulan: 'Juli', singkatan: 'Jul', total: 20, selesai: 18, diproses: 2, pending: 0 },
  { bulan: 'Agustus', singkatan: 'Agu', total: 24, selesai: 22, diproses: 2, pending: 0 },
  { bulan: 'September', singkatan: 'Sep', total: 18, selesai: 2, diproses: 15, pending: 1 },
  { bulan: 'Oktober', singkatan: 'Okt', total: 6, selesai: 0, diproses: 6, pending: 0 },
  { bulan: 'November', singkatan: 'Nov', total: 0, selesai: 0, diproses: 0, pending: 0 },
  { bulan: 'Desember', singkatan: 'Des', total: 0, selesai: 0, diproses: 0, pending: 0 }
];

export const MONTHLY_STATS_2025: MonthlyChartData[] = [
  { bulan: 'Januari', singkatan: 'Jan', total: 11, selesai: 11, diproses: 0, pending: 0 },
  { bulan: 'Februari', singkatan: 'Feb', total: 13, selesai: 13, diproses: 0, pending: 0 },
  { bulan: 'Maret', singkatan: 'Mar', total: 16, selesai: 16, diproses: 0, pending: 0 },
  { bulan: 'April', singkatan: 'Apr', total: 18, selesai: 18, diproses: 0, pending: 0 },
  { bulan: 'Mei', singkatan: 'Mei', total: 17, selesai: 17, diproses: 0, pending: 0 },
  { bulan: 'Juni', singkatan: 'Jun', total: 21, selesai: 21, diproses: 0, pending: 0 },
  { bulan: 'Juli', singkatan: 'Jul', total: 19, selesai: 19, diproses: 0, pending: 0 },
  { bulan: 'Agustus', singkatan: 'Agu', total: 23, selesai: 23, diproses: 0, pending: 0 },
  { bulan: 'September', singkatan: 'Sep', total: 22, selesai: 22, diproses: 0, pending: 0 },
  { bulan: 'Oktober', singkatan: 'Okt', total: 20, selesai: 20, diproses: 0, pending: 0 },
  { bulan: 'November', singkatan: 'Nov', total: 19, selesai: 19, diproses: 0, pending: 0 },
  { bulan: 'Desember', singkatan: 'Des', total: 26, selesai: 26, diproses: 0, pending: 0 }
];

// Agenda Notariat untuk Kalender
export const NOTARY_AGENDA: AgendaItem[] = [
  {
    id: 'ag-1',
    tanggal: '2026-09-22',
    jam: '10:00 WIB',
    judul: 'Penandatanganan Akta Pendirian PT Nusantara',
    klien: 'Bambang Sudiro & Para Pendiri',
    tipe: 'ttd'
  },
  {
    id: 'ag-2',
    tanggal: '2026-09-22',
    jam: '13:30 WIB',
    judul: 'Verifikasi Dokumen Yayasan Lentera Kasih',
    klien: 'Prof. Dr. Hendra Gunawan',
    tipe: 'verifikasi'
  },
  {
    id: 'ag-3',
    tanggal: '2026-09-24',
    jam: '09:00 WIB',
    judul: 'Konsultasi Perubahan Anggaran Dasar Koperasi',
    klien: 'Pengurus Koperasi Sejahtera',
    tipe: 'konsultasi'
  },
  {
    id: 'ag-4',
    tanggal: '2026-09-26',
    jam: '11:00 WIB',
    judul: 'Penandatanganan Akta Perjanjian Sewa (Waarmerking)',
    klien: 'Direksi PT Sentra Logistik',
    tipe: 'ttd'
  },
  {
    id: 'ag-5',
    tanggal: '2026-09-28',
    jam: '14:00 WIB',
    judul: 'Pengesahan & Legalisasi Surat Kuasa Menjual',
    klien: 'Silvia Renata & Keluarga',
    tipe: 'ttd'
  }
];

export const NOTARY_PROFILE = {
  nama: 'Hj. Ratna Sari, S.H., M.Kn.',
  jabatan: 'Notaris & Pejabat Pembuat Akta Tanah (PPAT)',
  skMenkeh: 'SK Menkumham RI No. AHU-00192.AH.02.01.Tahun 2014',
  skBpn: 'SK Kepala BPN RI No. 8-XVII-PPAT-2015',
  wilayahKerja: 'Kota Bandung & Seluruh Wilayah Jawa Barat',
  alamat: 'Jl. LLRE Martadinata (Riau) No. 128, Cihapit, Bandung',
  telepon: '(022) 723-8890',
  email: 'sekretariat@notaris-ratnasari.id',
  avatarUrl: notaryAvatar
};

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'u-1',
    username: 'Administrator',
    email: 'kantornotaris.sam@gmail.com',
    passwordDisplay: '@Semangat123',
    role: 'Admin',
    dibuat: '2026-07-02 19:15:50'
  },
  {
    id: 'u-2',
    username: 'RizkyPratama',
    email: 'rizky.legal@kantor.id',
    passwordDisplay: '@RizkyNotar26',
    role: 'Karyawan',
    dibuat: '2026-07-15 10:22:14'
  },
  {
    id: 'u-3',
    username: 'DewiAnggraini',
    email: 'dewi.asisten@kantor.id',
    passwordDisplay: '@DewiAkte2026',
    role: 'Karyawan',
    dibuat: '2026-08-01 14:05:30'
  },
  {
    id: 'u-4',
    username: 'BudiSantoso',
    email: 'budi.admin@kantor.id',
    passwordDisplay: '@BudiArsip26',
    role: 'Karyawan',
    dibuat: '2026-08-10 09:30:00'
  }
];
