import React, { useState } from 'react';
import { X, Printer, CheckCircle, Clock, AlertTriangle, ShieldCheck, FileText, UserCheck, Calendar } from 'lucide-react';
import { BerkasItem, BerkasStatus } from '../types/notary';

interface FileDetailModalProps {
  berkas: BerkasItem | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: BerkasStatus) => void;
}

export const FileDetailModal: React.FC<FileDetailModalProps> = ({
  berkas,
  onClose,
  onUpdateStatus
}) => {
  if (!berkas) return null;

  const [printSuccess, setPrintSuccess] = useState(false);

  const handlePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#701424] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-900">{berkas.noBerkas}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#701424] text-white">
                  {berkas.jenis}
                </span>
              </div>
              <p className="text-xs text-slate-500">{berkas.subJenis}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Status Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Status Berkas Saat Ini
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  berkas.status === 'Selesai'
                    ? 'bg-emerald-100 text-emerald-800'
                    : berkas.status === 'Diproses'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {berkas.status}
                </span>
                <span className="text-xs text-slate-500 font-mono">Diterima: {berkas.tanggalLengkap}</span>
              </div>
            </div>

            {/* Change Status Fast Buttons */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-xs text-slate-500 mr-1 font-medium">Ubah Status:</span>
              {(['Pending', 'Diproses', 'Selesai'] as BerkasStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onUpdateStatus(berkas.id, st)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                    berkas.status === st
                      ? 'bg-[#701424] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Client & Document Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pemohon / Klien</span>
              <p className="font-bold text-sm text-slate-900 mt-1">{berkas.klien}</p>
              {berkas.namaPerusahaan && (
                <p className="text-slate-600 mt-0.5 font-medium">{berkas.namaPerusahaan}</p>
              )}
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Penanggung Jawab / Notaris</span>
              <p className="font-bold text-sm text-slate-900 mt-1">{berkas.penanggungJawab}</p>
              <p className="text-slate-500 mt-0.5">Biaya Repertorium: <strong className="text-slate-800 font-mono">{berkas.biaya}</strong></p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-1.5">Keterangan & Catatan Berkas</h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {berkas.keterangan}
            </div>
          </div>

          {/* Checklist Kelengkapan Persyaratan */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2">Checklist Verifikasi Dokumen Syarat</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                <CheckCircle className={`w-4 h-4 ${berkas.kelengkapanSyarat.ktpDireksi ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span className="text-slate-700">KTP Para Pendiri / Direksi</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                <CheckCircle className={`w-4 h-4 ${berkas.kelengkapanSyarat.npwp ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span className="text-slate-700">NPWP Pribadi & Badan</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                <CheckCircle className={`w-4 h-4 ${berkas.kelengkapanSyarat.buktiModal ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span className="text-slate-700">Bukti Penyetoran Modal / Bank</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                <CheckCircle className={`w-4 h-4 ${berkas.kelengkapanSyarat.persetujuanNama ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span className="text-slate-700">Persetujuan Nama AHU Kemenkumham</span>
              </div>
            </div>
          </div>

          {/* Print Feedback Notification */}
          {printSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tanda terima berkas <strong>{berkas.noBerkas}</strong> siap dicetak / diunduh ke PDF resmi.</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Tanda Terima</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#701424] hover:bg-[#85192c] text-white text-xs font-semibold transition-colors shadow-xs"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
};
