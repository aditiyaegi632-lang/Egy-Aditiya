import React, { useState } from 'react';
import { X, Users, UserPlus, Shield, Mail, Phone, Check } from 'lucide-react';

interface UsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UsersModal: React.FC<UsersModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [staffList, setStaffList] = useState([
    {
      id: 1,
      nama: 'Hj. Ratna Sari, S.H., M.Kn.',
      peran: 'Notaris & PPAT (Pemilik Kantor)',
      email: 'notaris.ratna@kantor.id',
      telepon: '0812-3344-5566',
      status: 'Aktif',
      akses: 'Super Admin / Penandatangan Akta'
    },
    {
      id: 2,
      nama: 'Rizky Pratama, S.H.',
      peran: 'Staf Legal & Drafting Akta',
      email: 'rizky.legal@kantor.id',
      telepon: '0813-7788-9900',
      status: 'Aktif',
      akses: 'Penyusun Draf & Verifikator Berkas'
    },
    {
      id: 3,
      nama: 'Dewi Anggraini',
      peran: 'Asisten Notaris & SABU/AHU',
      email: 'dewi.asisten@kantor.id',
      telepon: '0857-1122-3344',
      status: 'Aktif',
      akses: 'Operator SABU, Waarmerking & Legalisasi'
    },
    {
      id: 4,
      nama: 'Budi Santoso',
      peran: 'Staff Administrasi & Repertorium',
      email: 'budi.admin@kantor.id',
      telepon: '0878-5566-7788',
      status: 'Aktif',
      akses: 'Pencatatan Buku Repertorium & Klapper'
    }
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#701424] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Manajemen Pengguna & Staf Notariat</h3>
              <p className="text-xs text-slate-500">Daftar akun pejabat dan asisten dengan hak akses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          {staffList.map((staff) => (
            <div
              key={staff.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#701424] font-bold text-xs flex items-center justify-center ring-1 ring-slate-200 shrink-0">
                  {staff.nama.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{staff.nama}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {staff.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#701424] font-medium">{staff.peran}</p>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1">
                    <span>{staff.email}</span>
                    <span>·</span>
                    <span className="font-mono">{staff.telepon}</span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:self-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Hak Akses
                </span>
                <span className="text-xs font-semibold text-slate-700">{staff.akses}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
          <span className="text-xs text-slate-500">Total {staffList.length} Staf Terverifikasi</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#701424] text-white text-xs font-semibold hover:bg-[#85192c]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
