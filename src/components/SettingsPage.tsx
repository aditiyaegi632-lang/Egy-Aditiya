import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Settings,
  Palette,
  Building2,
  ShieldCheck,
  Check,
  Upload,
  CheckCircle2,
  Trash2,
  Sun,
  Moon,
  Type
} from 'lucide-react';
import { NOTARY_PROFILE } from '../data/mockData';

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  // Card 1: Pengaturan Tampilan
  const [fontSize, setFontSize] = useState<'kecil' | 'sedang' | 'besar'>('sedang');
  const [displayMode, setDisplayMode] = useState<'terang' | 'gelap'>('terang');
  const [accentColor, setAccentColor] = useState<'marun' | 'biru' | 'hijau'>('marun');

  // Card 2: Identitas Kantor Notaris
  const [namaNotaris, setNamaNotaris] = useState(
    'Hj. Ratna Sari, S.H., M.Kn.'
  );
  const [alamatKantor, setAlamatKantor] = useState(
    'Gedung Grha Notariat Lt. 3, Jl. MH Thamrin No. 88, Menteng, Jakarta Pusat, DKI Jakarta 10310'
  );
  const [kontakKantor, setKontakKantor] = useState('(021) 3918-2026 / 0811-2345-6780');
  const [logoPreview, setLogoPreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
  );

  // Card 3: Keamanan & Notifikasi
  const [emailNotification, setEmailNotification] = useState(true);
  const [autoLogoutTime, setAutoLogoutTime] = useState('30 menit');

  // Success Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogoPreview(reader.result);
          showToast('Logo / Kop Surat kantor berhasil diperbarui!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
    showToast('Logo / Kop Surat kantor telah dihapus.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Pengaturan sistem dan identitas kantor berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-sm animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pengaturan Sistem
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Kelola preferensi aplikasi dan informasi kantor
          </p>
        </div>

        {/* Tombol Kanan Atas: "← Kembali" (Warna Abu-abu/Slate) */}
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all border border-slate-200/80 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Kembali</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD 1: PENGATURAN TAMPILAN */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#701424] flex items-center justify-center">
                <Palette className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Pengaturan Tampilan
                </h2>
                <p className="text-xs text-slate-500">
                  Sesuaikan kenyamanan membaca dan skema warna antarmuka
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Pilihan Ukuran Font (Kecil, Sedang, Besar) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-400" />
                <span>Ukuran Font</span>
              </label>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {(
                  [
                    { id: 'kecil', label: 'Kecil', note: '12px Compact' },
                    { id: 'sedang', label: 'Sedang', note: '14px Default' },
                    { id: 'besar', label: 'Besar', note: '16px Nyaman' }
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFontSize(opt.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      fontSize === opt.id
                        ? 'border-[#701424] bg-rose-50/50 text-[#701424] font-bold ring-2 ring-[#701424]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="block text-sm font-semibold">{opt.label}</span>
                    <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                      {opt.note}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Tampilan (Terang / Gelap) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Sun className="w-4 h-4 text-slate-400" />
                <span>Mode Tampilan</span>
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setDisplayMode('terang')}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    displayMode === 'terang'
                      ? 'border-[#701424] bg-rose-50/50 text-[#701424] font-bold ring-2 ring-[#701424]/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-semibold">Mode Terang</span>
                    <span className="block text-[11px] text-slate-400 font-normal">
                      Aktif (Rekomendasi Kantor)
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDisplayMode('gelap')}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    displayMode === 'gelap'
                      ? 'border-[#701424] bg-rose-50/50 text-[#701424] font-bold ring-2 ring-[#701424]/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-semibold">Mode Gelap</span>
                    <span className="block text-[11px] text-slate-400 font-normal">
                      Pilihan Kontras Malam
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Warna Tema Accent (Merah Marun, Biru, Hijau) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Warna Tema Accent
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  {
                    id: 'marun',
                    name: 'Merah Marun (#701424)',
                    sub: 'Tema Resmi Kantor Notaris',
                    colorClass: 'bg-[#701424]'
                  },
                  {
                    id: 'biru',
                    name: 'Biru Notaris (#1e40af)',
                    sub: 'Aksen Korporat & PT',
                    colorClass: 'bg-[#1e40af]'
                  },
                  {
                    id: 'hijau',
                    name: 'Hijau Legalisasi (#047857)',
                    sub: 'Aksen Berkas Selesai',
                    colorClass: 'bg-[#047857]'
                  }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      setAccentColor(c.id as 'marun' | 'biru' | 'hijau')
                    }
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                      accentColor === c.id
                        ? 'border-slate-900 ring-2 ring-slate-900/20 bg-slate-50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full ${c.colorClass} shadow-xs shrink-0 flex items-center justify-center text-white text-[10px]`}
                    >
                      {accentColor === c.id && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-slate-800">
                        {c.name}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {c.sub}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: IDENTITAS KANTOR NOTARIS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#701424] flex items-center justify-center">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Identitas Kantor Notaris
                </h2>
                <p className="text-xs text-slate-500">
                  Data kantor yang tercetak pada kop surat akta dan kwitansi
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Input Teks: Nama Notaris & Gelar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Notaris & Gelar <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaNotaris}
                onChange={(e) => setNamaNotaris(e.target.value)}
                placeholder="Contoh: Hj. Ratna Sari, S.H., M.Kn."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              />
            </div>

            {/* Textarea: Alamat Kantor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Kantor <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={alamatKantor}
                onChange={(e) => setAlamatKantor(e.target.value)}
                placeholder="Alamat lengkap domisili kantor notaris..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              />
            </div>

            {/* Input Teks: No. Telepon / WhatsApp Kantor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                No. Telepon / WhatsApp Kantor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={kontakKantor}
                onChange={(e) => setKontakKantor(e.target.value)}
                placeholder="Contoh: (021) 3918-2026 / 0811-2345-6780"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              />
            </div>

            {/* Upload File: Logo / Kop Surat Kantor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Logo / Kop Surat Kantor
              </label>
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/70">
                {/* Logo Preview */}
                {logoPreview ? (
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-2xs flex items-center justify-center p-1">
                    <img
                      src={logoPreview}
                      alt="Logo Kantor"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-20 rounded-xl border border-dashed border-slate-300 bg-white shrink-0 flex flex-col items-center justify-center text-slate-400">
                    <Building2 className="w-6 h-6 mb-1 text-slate-300" />
                    <span className="text-[10px]">Belum ada logo</span>
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <p className="text-xs text-slate-600">
                    Format file disarankan: <span className="font-semibold">PNG, JPG, atau SVG</span> (Maksimal 2MB dengan latar transparan atau putih).
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-slate-300 text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>{logoPreview ? 'Ganti Logo' : 'Unggah Logo'}</span>
                    </button>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: KEAMANAN & NOTIFIKASI */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#701424] flex items-center justify-center">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Keamanan & Notifikasi
                </h2>
                <p className="text-xs text-slate-500">
                  Aturan sesi keamanan akun dan notifikasi otomatis berkas
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Toggle Switch (ON/OFF): Notifikasi Email saat Berkas Baru dibuat */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="block text-sm font-bold text-slate-900">
                  Notifikasi Email saat Berkas Baru dibuat
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  Kirimkan notifikasi ringkasan otomatis ke email administrator setiap kali staf menambahkan berkas pendaftaran baru
                </span>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setEmailNotification(!emailNotification)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  emailNotification ? 'bg-[#701424]' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={emailNotification}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    emailNotification ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Dropdown: Otomatis Logout Setelah Tidak Aktif */}
            <div className="max-w-md">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Otomatis Logout Setelah Tidak Aktif
              </label>
              <select
                value={autoLogoutTime}
                onChange={(e) => setAutoLogoutTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424] cursor-pointer"
              >
                <option value="15 menit">15 menit</option>
                <option value="30 menit">30 menit</option>
                <option value="1 jam">1 jam</option>
                <option value="Tidak Pernah">Tidak Pernah</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Melindungi data rahasia klien notaris jika komputer ditinggalkan tanpa pengawasan.
              </p>
            </div>
          </div>
        </div>

        {/* TOMBOL AKSI KANAN BAWAH */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#701424] hover:bg-[#59101c] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Check className="w-4.5 h-4.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
