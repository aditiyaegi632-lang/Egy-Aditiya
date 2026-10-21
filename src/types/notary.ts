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
