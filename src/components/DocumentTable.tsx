import React, { useState } from 'react';
import { FileText, Eye, ChevronRight, Clock, Plus, ExternalLink, ArrowUpDown } from 'lucide-react';
import { BerkasItem, BerkasStatus } from '../types/notary';

interface DocumentTableProps {
  berkasList: BerkasItem[];
  onViewDetail: (item: BerkasItem) => void;
  onAddNew: () => void;
  activeFilter: BerkasStatus | 'All';
  onFilterChange: (status: BerkasStatus | 'All') => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  berkasList,
  onViewDetail,
  onAddNew,
  activeFilter,
  onFilterChange
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(berkasList.length / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = berkasList.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: BerkasStatus) => {
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

  const getJenisBadge = (jenis: string) => {
    switch (jenis) {
      case 'PT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CV':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Yayasan':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Koperasi':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Firma':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between h-full">
      {/* Table Header with Quick Filters & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base text-slate-900 tracking-tight">
            Berkas Terbaru
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar permohonan akta & legalisasi masuk
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick status tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            {(['All', 'Pending', 'Diproses', 'Selesai'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  onFilterChange(filter);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === filter
                    ? 'bg-white text-[#701424] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter === 'All' ? 'Semua' : filter}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#701424] hover:bg-[#85192c] text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tambah Berkas</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto mt-2 flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Kolom tabel terdiri dari "Jenis", "No Berkas", "Klien", "Status", dan "Waktu" */}
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Jenis</th>
              <th className="py-2.5 px-3">No Berkas</th>
              <th className="py-2.5 px-3">Klien</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Waktu</th>
              <th className="py-2.5 px-2 text-center w-10">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onViewDetail(item)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Kolom 1: Jenis */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getJenisBadge(
                        item.jenis
                      )}`}
                    >
                      {item.jenis}
                    </span>
                  </td>

                  {/* Kolom 2: No Berkas */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-slate-900 group-hover:text-[#701424] transition-colors">
                      {item.noBerkas}
                    </span>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                      {item.subJenis}
                    </div>
                  </td>

                  {/* Kolom 3: Klien */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 text-xs truncate max-w-[170px]">
                      {item.klien}
                    </div>
                    {item.namaPerusahaan && (
                      <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                        {item.namaPerusahaan}
                      </div>
                    )}
                  </td>

                  {/* Kolom 4: Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Kolom 5: Waktu */}
                  <td className="py-3 px-3 text-right whitespace-nowrap text-[11px] text-slate-500 font-mono tabular-nums">
                    <div className="flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.waktu}</span>
                    </div>
                  </td>

                  {/* Aksi */}
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(item);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-[#701424] hover:bg-rose-50 transition-colors"
                      title="Lihat Detail Berkas"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                  Tidak ada berkas yang sesuai dengan filter pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Menampilkan {berkasList.length > 0 ? startIndex + 1 : 0} -{' '}
          {Math.min(startIndex + itemsPerPage, berkasList.length)} dari {berkasList.length} berkas
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
          >
            Sebelumnya
          </button>
          <span className="font-semibold text-slate-800 px-1 font-mono">{page} / {totalPages}</span>
          <button
            type="button"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
};
