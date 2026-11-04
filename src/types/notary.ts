export type BerkasStatus = 'Pending' | 'Diproses' | 'Selesai';

export type BerkasJenis = 
  | 'PT' 
  | 'CV' 
  | 'Yayasan' 
  | 'Koperasi' 
  | 'Firma' 
  | 'Waarmerking' 
  | 'Legalisasi';

export type KategoriSubmenu = 'Pendirian' | 'Perubahan' | 'Pembubaran';

export interface RiwayatCatatanTahapan {
  id: string;
  tanggal: string;
  jam: string;
  petugas: string;
  catatan: string;
}

export interface ChecklistItemTahapan {
  id: string;
  nomor: number;
  nama: string;
  petugas?: string;
  jam?: string;
  checked: boolean;
}

export interface TahapanPekerjaanItem {
  id: string;
  nomor: number;
  judul: string;
  deskripsi: string;
  status: BerkasStatus;
  tipeTahapan: 'khusus' | 'checklist';
  tanggalMasuk?: string;
  catatan?: string;
  riwayatCatatan?: RiwayatCatatanTahapan[];
  checklistItems?: ChecklistItemTahapan[];
  tanggalSelesai?: string;
  pic?: string;
}

export interface BerkasItem {
  id: string;
  noBerkas: string;
  jenis: BerkasJenis;
  subJenis: string;
  kategoriSubmenu?: KategoriSubmenu;
  klien: string;
  pemohon?: string;
  namaPerusahaan?: string;
  namaPenghadap?: string[];
  pekerjaan?: string[];
  status: BerkasStatus;
  waktu: string;
  tanggalLengkap: string;
  penanggungJawab: string;
  keterangan: string;
  biaya: string;
  isArchived?: boolean;
  tahapan?: TahapanPekerjaanItem[];
  kelengkapanSyarat: {
    ktpDireksi: boolean;
    npwp: boolean;
    buktiModal: boolean;
    persetujuanNama: boolean;
    suratKuasa?: boolean;
  };
}

export interface AktivitasItem {
  id: string;
  pengguna: {
    nama: string;
    peran: string;
    avatar?: string;
  };
  aktivitas: string;
  detailBerkas?: string;
  waktu: string;
  tipe: 'update' | 'upload' | 'approval' | 'create';
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  passwordDisplay: string;
  role: 'Admin' | 'Karyawan';
  dibuat: string;
}

export interface AgendaItem {
  id: string;
  tanggal: string; // YYYY-MM-DD
  jam: string;
  judul: string;
  klien: string;
  tipe: 'ttd' | 'verifikasi' | 'konsultasi';
}

export interface MonthlyChartData {
  bulan: string;
  singkatan: string;
  total: number;
  selesai: number;
  diproses: number;
  pending: number;
}
