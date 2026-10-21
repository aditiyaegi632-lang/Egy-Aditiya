import React, { useState } from 'react';
import { X, Plus, FileText, Check } from 'lucide-react';
import { BerkasItem, BerkasJenis, BerkasStatus, KategoriSubmenu } from '../types/notary';

interface AddFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newBerkas: BerkasItem) => void;
  defaultJenis?: BerkasJenis;
  defaultSubmenu?: KategoriSubmenu;
}

export const AddFileModal: React.FC<AddFileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultJenis = 'PT',
  defaultSubmenu = 'Pendirian'
}) => {
  if (!isOpen) return null;

  const [jenis, setJenis] = useState<BerkasJenis>(defaultJenis);
  const [kategoriSubmenu, setKategoriSubmenu] = useState<KategoriSubmenu>(defaultSubmenu);
  const [subJenis, setSubJenis] = useState(
    `${defaultSubmenu} ${defaultJenis} Baru`
  );
  const [klien, setKlien] = useState('');
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  const [biaya, setBiaya] = useState('Rp 7.500.000');
  const [keterangan, setKeterangan] = useState('Penerimaan berkas persyaratan baru dari klien.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!klien) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = jenis.substring(0, 3).toUpperCase();
    const noBerkas = `NOT-${prefix}-2026-${randomNum}`;

    const isLegalService = jenis === 'Waarmerking' || jenis === 'Legalisasi';
    const newBerkas: BerkasItem = {
      id: `b-${Date.now()}`,
      noBerkas,
      jenis,
      kategoriSubmenu: isLegalService ? undefined : kategoriSubmenu,
      subJenis: subJenis || (isLegalService ? `${jenis} Surat` : `${kategoriSubmenu} ${jenis}`),
      klien,
      pemohon: klien,
      namaPenghadap: [`1. ${klien}`],
      pekerjaan: ['1. Wiraswasta'],
      namaPerusahaan: isLegalService ? undefined : (namaPerusahaan || undefined),
      status: 'Pending' as BerkasStatus,
      waktu: 'Baru saja',
      tanggalLengkap: '22 September 2026, Baru saja',
      penanggungJawab: 'Hj. Ratna Sari, S.H.',
      keterangan,
      biaya,
      kelengkapanSyarat: {
        ktpDireksi: true,
        npwp: true,
        buktiModal: false,
        persetujuanNama: false
      }
    };

    onSave(newBerkas);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#701424] flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Tambah Berkas Notariat Baru</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jenis Berkas</label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value as BerkasJenis)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              >
                <option value="PT">PT (Perseroan Terbatas)</option>
                <option value="CV">CV (Commanditaire Vennootschap)</option>
                <option value="Yayasan">Yayasan</option>
                <option value="Koperasi">Koperasi</option>
                <option value="Firma">Firma</option>
                <option value="Waarmerking">Waarmerking</option>
                <option value="Legalisasi">Legalisasi</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Layanan / Sub-Jenis</label>
              <input
                type="text"
                value={subJenis}
                onChange={(e) => setSubJenis(e.target.value)}
                placeholder="Contoh: Pendirian PT PMDN"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nama Pemohon / Klien</label>
            <input
              type="text"
              value={klien}
              onChange={(e) => setKlien(e.target.value)}
              placeholder="Contoh: Muhammad Firdaus, S.E."
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nama Perusahaan / Subjek Akta</label>
            <input
              type="text"
              value={namaPerusahaan}
              onChange={(e) => setNamaPerusahaan(e.target.value)}
              placeholder="Contoh: PT Surya Gemilang Nusantara"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estimasi Biaya</label>
              <input
                type="text"
                value={biaya}
                onChange={(e) => setBiaya(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Notaris Bertugas</label>
              <input
                type="text"
                disabled
                value="Hj. Ratna Sari, S.H."
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Catatan Berkas</label>
            <textarea
              rows={2}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#701424] hover:bg-[#85192c] text-white font-semibold text-xs shadow-xs"
            >
              Simpan & Daftarkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
