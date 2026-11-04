import React, { useState, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Archive, Search, FileText, CheckCircle2 } from 'lucide-react';
import { BerkasItem, BerkasJenis, BerkasStatus, KategoriSubmenu } from '../types/notary';

interface ArsipBerkasPageProps {
  jenis: BerkasJenis;
  kategoriSubmenu?: KategoriSubmenu | null;
  berkasList: BerkasItem[];
  onBack: () => void;
  onRestore: (id: string) => void;
}

export const ArsipBerkasPage: React.FC<ArsipBerkasPageProps> = ({
  jenis,
  kategoriSubmenu,
  berkasList,
  onBack,
  onRestore
}) => {
  const isLegalService = jenis === 'Waarmerking' || jenis === 'Legalisasi';
  const hasEntityColumn = !isLegalService;

  // Dynamic Page Title: "Arsip [Submenu] [Entitas]" (contoh: "Arsip Pendirian PT")
  const dynamicTitle = isLegalService
    ? `Arsip ${jenis}`
    : `Arsip ${kategoriSubmenu || 'Pendirian'} ${jenis}`;

  const entityColumnLabel = `Nama ${jenis}`;

  // Filter only archived items for this entity and submenu
  const [searchQuery, setSearchQuery] = useState('');
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);

  const archivedItems = useMemo(() => {
    return berkasList.filter((item) => {
      // Must be marked as archived
      if (!item.isArchived) return false;

      // Must match entity jenis
      if (item.jenis !== jenis) return false;

      // If not legal service, must match kategoriSubmenu
      if (!isLegalService && kategoriSubmenu) {
        if (item.kategoriSubmenu) {
          if (item.kategoriSubmenu !== kategoriSubmenu) return false;
        } else {
          const subLower = item.subJenis.toLowerCase();
          if (!subLower.includes(kategoriSubmenu.toLowerCase())) return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNo = item.noBerkas.toLowerCase().includes(query);
        const matchName = (item.namaPerusahaan || '').toLowerCase().includes(query);
        const matchPemohon = (item.pemohon || item.klien).toLowerCase().includes(query);
        return matchNo || matchName || matchPemohon;
      }

      return true;
    });
  }, [berkasList, jenis, kategoriSubmenu, isLegalService, searchQuery]);

  const handleRestoreClick = (item: BerkasItem) => {
    onRestore(item.id);
    setRestoreNotice(`Berkas "${item.noBerkas}" berhasil dikembalikan ke tabel utama.`);
    setTimeout(() => setRestoreNotice(null), 3500);
  };

  const renderStatusBadge = (status: BerkasStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Diproses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Selesai
          </span>
        );
    }
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
            Daftar berkas yang telah dipindahkan ke arsip repertorium
          </p>
        </div>

        {/* Tombol Kanan Atas: "Kembali" (Warna Abu-abu/Slate) */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-200" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Restore Notice Toast */}
      {restoreNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{restoreNotice}</span>
        </div>
      )}

      {/* Search Bar filter in Archive */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor berkas / nama / pemohon di arsip..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424] transition-all"
          />
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl shrink-0">
          Total {archivedItems.length} Arsip
        </span>
      </div>

      {/* 2. TABEL DATA ARSIP (DALAM KARTU PUTIH) */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Column Headers: "No", "No Berkas", "Nama [Entitas]", "Pemohon", "Status", "Aksi" */}
              <tr className="bg-slate-100/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 whitespace-nowrap">No Berkas</th>
                {hasEntityColumn && (
                  <th className="py-3.5 px-4 whitespace-nowrap">{entityColumnLabel}</th>
                )}
                <th className="py-3.5 px-4 whitespace-nowrap">Pemohon</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {archivedItems.length > 0 ? (
                archivedItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* No */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500 font-semibold">
                      {index + 1}
                    </td>

                    {/* No Berkas */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.noBerkas}
                    </td>

                    {/* Nama [Entitas] (ditiadakan untuk Waarmerking & Legalisasi) */}
                    {hasEntityColumn && (
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {item.namaPerusahaan || item.subJenis}
                      </td>
                    )}

                    {/* Pemohon */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-800 font-medium">
                      {item.pemohon || item.klien}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Kolom Aksi: Tombol "Kembalikan" (Warna Hijau dengan icon restore/refresh) */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleRestoreClick(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                        title="Kembalikan berkas ke tabel utama"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Kembalikan</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={hasEntityColumn ? 6 : 5} className="py-12 text-center text-slate-400">
                    <Archive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">
                      Tidak ada berkas {dynamicTitle} di dalam arsip
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Berkas yang dipindahkan ke arsip akan muncul pada tabel ini.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan <strong className="text-slate-800">{archivedItems.length}</strong> berkas terarsip
          </span>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-[#701424] hover:underline"
          >
            ← Kembali ke Tabel Utama
          </button>
        </div>
      </div>
    </div>
  );
};
