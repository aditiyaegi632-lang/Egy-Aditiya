import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Check, X, Building2, User, Briefcase, FileText } from 'lucide-react';
import { BerkasItem, BerkasJenis, BerkasStatus, KategoriSubmenu } from '../types/notary';

interface AddBerkasPageProps {
  jenis: BerkasJenis;
  kategoriSubmenu?: KategoriSubmenu | null;
  onBack: () => void;
  onSave: (newBerkas: BerkasItem) => void;
  existingCount?: number;
}

interface PenghadapRow {
  id: string;
  nama: string;
  pekerjaan: string;
}

export const AddBerkasPage: React.FC<AddBerkasPageProps> = ({
  jenis,
  kategoriSubmenu,
  onBack,
  onSave,
  existingCount = 1
}) => {
  const isLegalService = jenis === 'Waarmerking' || jenis === 'Legalisasi';

  // Dynamic Page Title: "Tambah [Submenu] [Entitas]" (contoh: "Tambah Pendirian PT", "Tambah Perubahan CV", "Tambah Waarmerking")
  const dynamicTitle = isLegalService
    ? `Tambah ${jenis}`
    : `Tambah ${kategoriSubmenu || 'Pendirian'} ${jenis}`;

  // Generate suggested file number
  const prefix = isLegalService
    ? jenis.substring(0, 3).toUpperCase()
    : `${jenis.substring(0, 2).toUpperCase()}${kategoriSubmenu ? kategoriSubmenu[0] : 'P'}`;
  const autoNoBerkas = `${prefix}-${String(existingCount + 1).padStart(3, '0')}`;

  // Form states
  const [noBerkas, setNoBerkas] = useState(autoNoBerkas);
  const [namaEntitas, setNamaEntitas] = useState('');
  const [pemohon, setPemohon] = useState('');

  // Dynamic Penghadap Rows (starts with 1 row)
  const [penghadapList, setPenghadapList] = useState<PenghadapRow[]>([
    { id: `ph-${Date.now()}-1`, nama: '', pekerjaan: '' }
  ]);

  // Validation error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Add new penghadap row
  const handleAddPenghadap = () => {
    setPenghadapList((prev) => [
      ...prev,
      { id: `ph-${Date.now()}-${prev.length + 1}`, nama: '', pekerjaan: '' }
    ]);
  };

  // Remove penghadap row
  const handleRemovePenghadap = (id: string) => {
    if (penghadapList.length <= 1) {
      setErrorMessage('Minimal harus ada satu data penghadap.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    setPenghadapList((prev) => prev.filter((p) => p.id !== id));
  };

  // Update penghadap row field
  const handleUpdatePenghadap = (id: string, field: 'nama' | 'pekerjaan', value: string) => {
    setPenghadapList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Handle submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!noBerkas.trim()) {
      setErrorMessage('Nomor berkas wajib diisi.');
      return;
    }

    if (!isLegalService && !namaEntitas.trim()) {
      setErrorMessage(`Nama ${jenis} wajib diisi.`);
      return;
    }

    if (!pemohon.trim()) {
      setErrorMessage('Nama pemohon wajib diisi.');
      return;
    }

    // Filter valid penghadap or fallback to pemohon
    const validPenghadap = penghadapList.filter((p) => p.nama.trim() !== '');
    const finalPenghadap =
      validPenghadap.length > 0
        ? validPenghadap.map((p, idx) => `${idx + 1}. ${p.nama.trim()}`)
        : [`1. ${pemohon.trim()}`];

    const finalPekerjaan =
      validPenghadap.length > 0
        ? validPenghadap.map((p, idx) => `${idx + 1}. ${p.pekerjaan.trim() || 'Wiraswasta'}`)
        : ['1. Wiraswasta'];

    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newBerkas: BerkasItem = {
      id: `b-${Date.now()}`,
      noBerkas: noBerkas.trim(),
      jenis,
      subJenis: isLegalService ? `${jenis} Surat di Bawah Tangan` : `${kategoriSubmenu || 'Pendirian'} ${jenis}`,
      kategoriSubmenu: isLegalService ? undefined : (kategoriSubmenu || 'Pendirian'),
      klien: pemohon.trim(),
      pemohon: pemohon.trim(),
      namaPerusahaan: !isLegalService ? namaEntitas.trim() : undefined,
      namaPenghadap: finalPenghadap,
      pekerjaan: finalPekerjaan,
      status: 'Pending' as BerkasStatus,
      waktu: 'Baru saja',
      tanggalLengkap: `${formattedDate}, Baru saja`,
      penanggungJawab: 'Hj. Ratna Sari, S.H.',
      keterangan: `Pendaftaran berkas baru ${dynamicTitle} oleh ${pemohon.trim()}.`,
      biaya: isLegalService ? 'Rp 500.000' : 'Rp 7.500.000',
      isArchived: false,
      kelengkapanSyarat: {
        ktpDireksi: true,
        npwp: true,
        buktiModal: true,
        persetujuanNama: true
      }
    };

    onSave(newBerkas);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Judul Utama Dinamis */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {dynamicTitle}
          </h1>
          {/* Sub-judul */}
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Tambahkan data berkas baru
          </p>
        </div>

        {/* Tombol Kanan Atas: "← Kembali" (Warna Abu-abu/Slate) */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-200" />
          <span>← Kembali</span>
        </button>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center justify-between animate-in fade-in">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. FORM UTAMA (KARTU PUTIH) */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 space-y-6">
        {/* Row 1: Input "Nomor Berkas" & Input "Nama [Entitas]" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Input Nomor Berkas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Nomor Berkas <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={noBerkas}
                onChange={(e) => setNoBerkas(e.target.value)}
                placeholder="Contoh : PT-001"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424] transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400">Nomor berkas arsip register kenotariatan.</p>
          </div>

          {/* Input Nama [Entitas] (Ditiadakan untuk Waarmerking & Legalisasi) */}
          {!isLegalService ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Nama {jenis} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={namaEntitas}
                  onChange={(e) => setNamaEntitas(e.target.value)}
                  placeholder={`Contoh : PT Maju Bersama Sukses`}
                  required={!isLegalService}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424] transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400">Nama resmi badan {jenis} yang didaftarkan.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Kategori Layanan
              </label>
              <div className="py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                {jenis} (Pendaftaran / Legalisasi Surat di Bawah Tangan)
              </div>
              <p className="text-[11px] text-slate-400">Surat terdaftar dalam buku repertorium khusus notaris.</p>
            </div>
          )}
        </div>

        {/* Row 2: Input "Pemohon" */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Pemohon <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={pemohon}
              onChange={(e) => setPemohon(e.target.value)}
              placeholder="Nama lengkap pihak pemohon..."
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424] transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-400">Pihak pemohon atau perwakilan penanggung jawab berkas.</p>
        </div>

        {/* Garis Pembatas (Divider) */}
        <hr className="border-slate-200 my-6" />

        {/* Section "Data Penghadap" (Dynamic Input Row) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                Data Penghadap
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar para penghadap yang hadir dan memberikan keterangan di hadapan Notaris.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {penghadapList.length} Orang
            </span>
          </div>

          {/* Rows of Penghadap */}
          <div className="space-y-3">
            {penghadapList.map((row, index) => (
              <div
                key={row.id}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center animate-in fade-in"
              >
                {/* Index badge */}
                <div className="sm:col-span-1 flex items-center justify-center">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center font-mono">
                    {index + 1}
                  </span>
                </div>

                {/* Input Nama Penghadap */}
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 sm:hidden">
                    Nama Penghadap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={row.nama}
                      onChange={(e) => handleUpdatePenghadap(row.id, 'nama', e.target.value)}
                      placeholder="Nama Penghadap (contoh: Budi Santoso)"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
                    />
                  </div>
                </div>

                {/* Input Pekerjaan */}
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 sm:hidden">
                    Pekerjaan / Jabatan
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={row.pekerjaan}
                      onChange={(e) => handleUpdatePenghadap(row.id, 'pekerjaan', e.target.value)}
                      placeholder="Pekerjaan / Jabatan (contoh: Direktur Utama)"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
                    />
                  </div>
                </div>

                {/* Tombol "Hapus" (Warna Merah) di sebelah kanan */}
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemovePenghadap(row.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-xs w-full sm:w-auto cursor-pointer"
                    title="Hapus baris penghadap ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol "+ Tambah Penghadap" (Warna Hijau) di bawah row untuk menambah baris input baru secara dinamis */}
          <div>
            <button
              type="button"
              onClick={handleAddPenghadap}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>+ Tambah Penghadap</span>
            </button>
          </div>
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          {/* Tombol "Batal" (Warna Abu-abu/Slate) */}
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Batal
          </button>

          {/* Tombol "Simpan" (Warna Merah Marun/Primary dengan icon simpan/check) */}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#701424] hover:bg-[#85192c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Check className="w-4 h-4 text-white" />
            <span>Simpan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
