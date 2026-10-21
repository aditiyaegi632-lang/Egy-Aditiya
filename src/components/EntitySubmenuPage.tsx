import React, { useState, useMemo } from 'react';
import {
  Archive,
  FileSpreadsheet,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Package,
  Clock,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { BerkasItem, BerkasJenis, BerkasStatus, KategoriSubmenu } from '../types/notary';

interface EntitySubmenuPageProps {
  jenis: BerkasJenis;
  kategoriSubmenu?: KategoriSubmenu | null;
  berkasList: BerkasItem[];
  onAddNew: () => void;
  onViewDetail: (item: BerkasItem) => void;
  onEdit: (item: BerkasItem) => void;
  onDelete: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onBackToDashboard: () => void;
}

export const EntitySubmenuPage: React.FC<EntitySubmenuPageProps> = ({
  jenis,
  kategoriSubmenu,
  berkasList,
  onAddNew,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleArchive,
  onBackToDashboard
}) => {
  // State for search, status filter, archive mode, and delete confirmation
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BerkasStatus | 'All'>('All');
  const [viewArchived, setViewArchived] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Check if this is a Legal Service (Waarmerking / Legalisasi) without entity name
  const isLegalService = jenis === 'Waarmerking' || jenis === 'Legalisasi';
  const hasEntityColumn = !isLegalService;

  // Dynamic titles and labels
  const pageTitle = isLegalService ? jenis : `${kategoriSubmenu || ''} ${jenis}`.trim();
  const entityColumnLabel = `Nama ${jenis}`;
  const totalCardLabel = `Total ${jenis}`;
  const searchPlaceholder = isLegalService
    ? 'Cari nomor berkas / pemohon / nama penghadap...'
    : `Cari nomor berkas / nama ${jenis} / pemohon...`;

  // Filter items specifically for this entity and submenu
  const entityItems = useMemo(() => {
    return berkasList.filter((item) => {
      // 1. Must match Entity Jenis
      if (item.jenis !== jenis) return false;

      // 2. If not legal service, must match Kategori Submenu (Pendirian / Perubahan / Pembubaran)
      if (!isLegalService && kategoriSubmenu) {
        if (item.kategoriSubmenu) {
          if (item.kategoriSubmenu !== kategoriSubmenu) return false;
        } else {
          // Fallback matching in subJenis string
          const subLower = item.subJenis.toLowerCase();
          if (!subLower.includes(kategoriSubmenu.toLowerCase())) return false;
        }
      }

      // 3. Archive filter
      const isArchived = Boolean(item.isArchived);
      if (viewArchived !== isArchived) return false;

      // 4. Status filter
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;

      // 5. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNo = item.noBerkas.toLowerCase().includes(query);
        const matchName = (item.namaPerusahaan || '').toLowerCase().includes(query);
        const matchPemohon = (item.pemohon || item.klien).toLowerCase().includes(query);
        const matchPenghadap = (item.namaPenghadap || []).some(p => p.toLowerCase().includes(query));
        return matchNo || matchName || matchPemohon || matchPenghadap;
      }

      return true;
    });
  }, [berkasList, jenis, kategoriSubmenu, isLegalService, viewArchived, statusFilter, searchQuery]);

  // Summary statistics for this entity & category
  const allCategoryItems = useMemo(() => {
    return berkasList.filter((item) => {
      if (item.jenis !== jenis) return false;
      if (isLegalService) return true;
      if (kategoriSubmenu) {
        if (item.kategoriSubmenu) return item.kategoriSubmenu === kategoriSubmenu;
        return item.subJenis.toLowerCase().includes(kategoriSubmenu.toLowerCase());
      }
      return true;
    });
  }, [berkasList, jenis, kategoriSubmenu, isLegalService]);

  const countTotal = allCategoryItems.length;
  const countPending = allCategoryItems.filter((i) => i.status === 'Pending').length;
  const countDiproses = allCategoryItems.filter((i) => i.status === 'Diproses').length;
  const countSelesai = allCategoryItems.filter((i) => i.status === 'Selesai').length;

  // Handle Export to CSV
  const handleExportCSV = () => {
    if (entityItems.length === 0) {
      setExportNotice('Tidak ada data untuk diekspor.');
      setTimeout(() => setExportNotice(null), 3000);
      return;
    }

    const headers = hasEntityColumn
      ? ['No', 'No Berkas', entityColumnLabel, 'Pemohon', 'Nama Penghadap', 'Pekerjaan', 'Status', 'Waktu']
      : ['No', 'No Berkas', 'Pemohon', 'Nama Penghadap', 'Pekerjaan', 'Status', 'Waktu'];

    const rows = entityItems.map((item, idx) => {
      const baseRow = [
        idx + 1,
        `"${item.noBerkas}"`,
        ...(hasEntityColumn ? [`"${item.namaPerusahaan || item.subJenis}"`] : []),
        `"${item.pemohon || item.klien}"`,
        `"${(item.namaPenghadap || [item.klien]).join(', ')}"`,
        `"${(item.pekerjaan || ['Wiraswasta']).join(', ')}"`,
        `"${item.status}"`,
        `"${item.waktu}"`
      ];
      return baseRow;
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Berkas_${pageTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Berhasil mengekspor ${entityItems.length} berkas ${pageTitle} ke Excel/CSV!`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Status Badge Helper
  const renderStatusBadge = (status: BerkasStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case 'Diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Diproses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Selesai
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="hover:text-[#701424] font-medium flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
        <span>/</span>
        <span className="text-slate-700 font-semibold">{jenis}</span>
        {!isLegalService && kategoriSubmenu && (
          <>
            <span>/</span>
            <span className="text-[#701424] font-bold">{kategoriSubmenu}</span>
          </>
        )}
      </div>

      {/* 1. JUDUL HALAMAN & TOMBOL AKSI ATAS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {isLegalService
              ? `Manajemen pendaftaran dan pencatatan buku repertorium ${jenis}`
              : `Manajemen arsip, pendaftaran, dan akta permohonan ${(kategoriSubmenu || '').toLowerCase()} ${jenis}`}
          </p>
        </div>

        {/* 3 Tombol Aksi Kanan: Arsip, Ekspor, + Tambah Berkas */}
        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          {/* Tombol Arsip (Warna Abu-abu / Dark Slate) */}
          <button
            type="button"
            onClick={() => setViewArchived(!viewArchived)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer ${
              viewArchived
                ? 'bg-slate-900 text-white ring-2 ring-slate-800'
                : 'bg-slate-700 hover:bg-slate-800 text-white'
            }`}
            title="Lihat berkas yang telah diarsipkan"
          >
            <Archive className="w-4 h-4 text-slate-200" />
            <span>{viewArchived ? 'Berkas Aktif' : 'Arsip'}</span>
          </button>

          {/* Tombol Ekspor (Warna Hijau dengan icon Excel/file) */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            title="Ekspor daftar ke format Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>Ekspor</span>
          </button>

          {/* Tombol + Tambah Berkas (Warna Merah Marun/Primary) */}
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#701424] hover:bg-[#85192c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Tambah Berkas</span>
          </button>
        </div>
      </div>

      {/* Export / Notification Notice */}
      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 2. KARTU STATISTIK RINGKASAN (4 KARTU BERDERET) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kartu 1: Total [Entitas] (Angka teks hitam) */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {totalCardLabel}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {countTotal}
            </span>
            <span className="text-xs text-slate-400 font-medium">berkas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
            {isLegalService ? `Total pelayanan ${jenis}` : `Total permohonan ${(kategoriSubmenu || '').toLowerCase()}`}
          </p>
        </div>

        {/* Kartu 2: Pending (Angka teks warna Oranye/Kuning) */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Pending
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
              {countPending}
            </span>
            <span className="text-xs text-amber-600/70 font-medium">berkas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
            Menunggu kelengkapan syarat
          </p>
        </div>

        {/* Kartu 3: Diproses (Angka teks warna Biru) */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Diproses
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-sky-600 font-mono tabular-nums">
              {countDiproses}
            </span>
            <span className="text-xs text-sky-600/70 font-medium">berkas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
            Penyusunan akta & verifikasi
          </p>
        </div>

        {/* Kartu 4: Selesai (Angka teks warna Hijau) */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Selesai
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {countSelesai}
            </span>
            <span className="text-xs text-emerald-600/70 font-medium">berkas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
            Akta sah & telah diserahkan
          </p>
        </div>
      </div>

      {/* 3. AREA FILTER & PENCARIAN TABEL (Wadah Putih) */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Kolom Input Pencarian (Kiri) */}
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Dropdown Filter Status (Kanan) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BerkasStatus | 'All')}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424] transition-all cursor-pointer"
          >
            <option value="All">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* 4. STRUKTUR TABEL DATA UTAMA */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        {viewArchived && (
          <div className="px-6 py-2.5 bg-slate-800 text-white text-xs font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-amber-400" />
              <span>Menampilkan Berkas yang Diarsipkan ({entityItems.length})</span>
            </span>
            <button
              onClick={() => setViewArchived(false)}
              className="text-amber-400 underline hover:text-amber-300 font-bold"
            >
              Kembali ke Berkas Aktif
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Header Tabel (Latar belakang abu-abu terang) */}
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 whitespace-nowrap">No Berkas</th>
                {hasEntityColumn && (
                  <th className="py-3.5 px-4 whitespace-nowrap">{entityColumnLabel}</th>
                )}
                <th className="py-3.5 px-4 whitespace-nowrap">Pemohon</th>
                <th className="py-3.5 px-4">Nama Penghadap</th>
                <th className="py-3.5 px-4">Pekerjaan</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Waktu</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {entityItems.length > 0 ? (
                entityItems.map((item, index) => {
                  const penghadapList = item.namaPenghadap && item.namaPenghadap.length > 0
                    ? item.namaPenghadap
                    : [`1. ${item.pemohon || item.klien}`];

                  const pekerjaanList = item.pekerjaan && item.pekerjaan.length > 0
                    ? item.pekerjaan
                    : ['1. Wiraswasta'];

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* No */}
                      <td className="py-3 px-4 text-center font-mono text-slate-500 font-semibold">
                        {index + 1}
                      </td>

                      {/* No Berkas */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.noBerkas}
                      </td>

                      {/* Nama Entitas (PT/CV/Yayasan/dll - disembunyikan untuk Waarmerking & Legalisasi) */}
                      {hasEntityColumn && (
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {item.namaPerusahaan || item.subJenis}
                        </td>
                      )}

                      {/* Pemohon */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-800 font-medium">
                        {item.pemohon || item.klien}
                      </td>

                      {/* Nama Penghadap */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 max-w-[180px]">
                          {penghadapList.map((p, pIdx) => (
                            <div key={pIdx} className="text-slate-800 leading-tight truncate">
                              {p}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Pekerjaan */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 max-w-[160px]">
                          {pekerjaanList.map((j, jIdx) => (
                            <div key={jIdx} className="text-slate-600 leading-tight truncate">
                              {j}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* Waktu */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500 tabular-nums">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.waktu}</span>
                        </div>
                      </td>

                      {/* Tombol Aksi (Grup 4 Icon Button Grid/Flex di pojok kanan):
                          1. Icon Mata (Biru Cyan) - Lihat Detail
                          2. Icon Pensil (Kuning/Emas) - Edit
                          3. Icon Tempat Sampah (Merah) - Hapus
                          4. Icon Box/Archive (Abu-abu) - Arsip
                      */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          {/* 1. Icon Mata (Biru Cyan) */}
                          <button
                            type="button"
                            onClick={() => onViewDetail(item)}
                            className="p-1.5 rounded-lg text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 transition-colors"
                            title="Lihat Detail Berkas"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* 2. Icon Pensil (Kuning/Emas) */}
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="p-1.5 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit Data Berkas"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* 3. Icon Tempat Sampah (Merah) */}
                          <button
                            type="button"
                            onClick={() => setDeletingId(item.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Hapus Berkas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* 4. Icon Box/Archive (Abu-abu) */}
                          <button
                            type="button"
                            onClick={() => onToggleArchive(item.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              item.isArchived
                                ? 'text-slate-900 bg-slate-200 hover:bg-slate-300'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                            title={item.isArchived ? 'Batal Arsipkan' : 'Pindahkan ke Arsip'}
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={hasEntityColumn ? 9 : 8} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">
                      Belum ada berkas {pageTitle} {viewArchived ? 'di arsip' : ''}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery
                        ? 'Tidak ada berkas yang sesuai dengan kata kunci pencarian.'
                        : 'Klik tombol "+ Tambah Berkas" di atas untuk mendaftarkan berkas baru.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with summary counts */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan <strong className="text-slate-800">{entityItems.length}</strong> dari{' '}
            <strong className="text-slate-800">{allCategoryItems.length}</strong> total berkas {pageTitle}
          </span>
          {statusFilter !== 'All' && (
            <span className="text-[#701424] font-semibold">
              Filter aktif: {statusFilter}
            </span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Hapus Berkas Ini?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menghapus berkas ini dari sistem? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
