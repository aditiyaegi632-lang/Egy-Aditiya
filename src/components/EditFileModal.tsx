import React, { useState, useEffect } from 'react';
import { X, Edit3, Check } from 'lucide-react';
import { BerkasItem, BerkasStatus } from '../types/notary';

interface EditFileModalProps {
  berkas: BerkasItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: BerkasItem) => void;
}

export const EditFileModal: React.FC<EditFileModalProps> = ({
  berkas,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !berkas) return null;

  const [noBerkas, setNoBerkas] = useState(berkas.noBerkas);
  const [namaPerusahaan, setNamaPerusahaan] = useState(berkas.namaPerusahaan || '');
  const [pemohon, setPemohon] = useState(berkas.pemohon || berkas.klien);
  const [penghadap, setPenghadap] = useState((berkas.namaPenghadap || []).join('\n'));
  const [pekerjaan, setPekerjaan] = useState((berkas.pekerjaan || []).join('\n'));
  const [status, setStatus] = useState<BerkasStatus>(berkas.status);
  const [keterangan, setKeterangan] = useState(berkas.keterangan);

  useEffect(() => {
    if (berkas) {
      setNoBerkas(berkas.noBerkas);
      setNamaPerusahaan(berkas.namaPerusahaan || '');
      setPemohon(berkas.pemohon || berkas.klien);
      setPenghadap((berkas.namaPenghadap || [berkas.klien]).join('\n'));
      setPekerjaan((berkas.pekerjaan || ['Wiraswasta']).join('\n'));
      setStatus(berkas.status);
      setKeterangan(berkas.keterangan);
    }
  }, [berkas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BerkasItem = {
      ...berkas,
      noBerkas,
      namaPerusahaan,
      klien: pemohon,
      pemohon,
      namaPenghadap: penghadap.split('\n').filter(Boolean),
      pekerjaan: pekerjaan.split('\n').filter(Boolean),
      status,
      keterangan
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Edit Data Berkas</h3>
              <p className="text-xs text-slate-500 font-mono">{berkas.noBerkas}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">No Berkas</label>
              <input
                type="text"
                value={noBerkas}
                onChange={(e) => setNoBerkas(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status Berkas</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BerkasStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              >
                <option value="Pending">Pending</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nama Entitas / Perusahaan</label>
            <input
              type="text"
              value={namaPerusahaan}
              onChange={(e) => setNamaPerusahaan(e.target.value)}
              placeholder="Contoh: PT Medika"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nama Pemohon</label>
            <input
              type="text"
              value={pemohon}
              onChange={(e) => setPemohon(e.target.value)}
              placeholder="Contoh: Aditiya"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Penghadap (per baris)</label>
              <textarea
                rows={2}
                value={penghadap}
                onChange={(e) => setPenghadap(e.target.value)}
                placeholder="1. Aditiya"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pekerjaan (per baris)</label>
              <textarea
                rows={2}
                value={pekerjaan}
                onChange={(e) => setPekerjaan(e.target.value)}
                placeholder="1. Manajer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Keterangan / Progres</label>
            <textarea
              rows={2}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#701424] hover:bg-[#85192c] text-white font-semibold shadow-xs"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
