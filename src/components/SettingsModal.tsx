import React, { useState } from 'react';
import { X, Settings, Check, Bell, Shield, Printer, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [notifSound, setNotifSound] = useState(true);
  const [autoNumber, setAutoNumber] = useState(true);
  const [ahuIntegration, setAhuIntegration] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#701424] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Pengaturan Sistem Notariat</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-slate-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">Notifikasi Berkas Masuk</span>
                  <span className="text-[11px] text-slate-500">Pemberitahuan saat staf mengunggah berkas</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifSound}
                onChange={(e) => setNotifSound(e.target.checked)}
                className="w-4 h-4 accent-[#701424]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-slate-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">Penomoran Otomatis Repertorium</span>
                  <span className="text-[11px] text-slate-500">Format: NOT-[JENIS]-[TAHUN]-[NO]</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoNumber}
                onChange={(e) => setAutoNumber(e.target.checked)}
                className="w-4 h-4 accent-[#701424]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">Sinkronisasi AHU Online Kemenkumham</span>
                  <span className="text-[11px] text-slate-500">Cek status pengesahan badan usaha</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ahuIntegration}
                onChange={(e) => setAhuIntegration(e.target.checked)}
                className="w-4 h-4 accent-[#701424]"
              />
            </label>
          </div>

          {saved && (
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan berhasil disimpan!</span>
            </div>
          )}

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
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
