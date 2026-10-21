import React from 'react';
import { X, ShieldCheck, Mail, Phone, MapPin, Award, FileText } from 'lucide-react';
import { NOTARY_PROFILE } from '../data/mockData';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Banner with Burgundy Background */}
        <div className="h-24 bg-[#701424] relative flex items-center px-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="-mt-12 flex items-end gap-4 mb-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-slate-200 shrink-0">
              <img
                src={NOTARY_PROFILE.avatarUrl}
                alt={NOTARY_PROFILE.nama}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pt-2">
              <h3 className="font-bold text-lg text-slate-900">{NOTARY_PROFILE.nama}</h3>
              <p className="text-xs font-semibold text-[#701424]">{NOTARY_PROFILE.jabatan}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-[#701424] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">SK Pengangkatan Notaris:</span>
                  <p className="text-slate-600 font-mono text-[11px]">{NOTARY_PROFILE.skMenkeh}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">SK Pejabat Pembuat Akta Tanah (PPAT):</span>
                  <p className="text-slate-600 font-mono text-[11px]">{NOTARY_PROFILE.skBpn}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{NOTARY_PROFILE.wilayahKerja}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono">{NOTARY_PROFILE.telepon}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{NOTARY_PROFILE.email}</span>
            </div>

            <p className="text-[11px] text-slate-400 italic text-center pt-2">
              Kantor resmi terdaftar di Pengurus Daerah Ikatan Notaris Indonesia (INI) Kota Bandung.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#701424] text-white text-xs font-semibold hover:bg-[#85192c]"
            >
              Tutup Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
