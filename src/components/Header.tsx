import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Clock, Menu, Check, ExternalLink, ChevronDown, User, ShieldCheck } from 'lucide-react';
import { NOTARY_PROFILE } from '../data/mockData';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebarMobile: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onToggleSidebarMobile,
  onOpenProfile
}) => {
  // Real-time Clock (HH:mm:ss)
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Persetujuan Akta PT Nusantara',
      desc: 'Draft akta telah diverifikasi, siap penandatanganan klien.',
      time: '10 mnt lalu',
      unread: true
    },
    {
      id: 2,
      title: 'Validasi Berkas CV Makmur Bersama',
      desc: 'NPWP dan bukti setor modal telah diunggah oleh staf.',
      time: '35 mnt lalu',
      unread: true
    },
    {
      id: 3,
      title: 'Jadwal Agenda Legalisasi Hari Ini',
      desc: 'Konsultasi surat kuasa waris pukul 14:00 WIB.',
      time: '1 jam lalu',
      unread: true
    },
    {
      id: 4,
      title: 'Pengesahan AHU Kemenkumham Selesai',
      desc: 'SK PT Graha Cipta Makmur telah terbit resmi.',
      time: '3 jam lalu',
      unread: false
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebarMobile}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Buka navigasi sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar with Magnifying Glass on Left */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nomor berkas, nama klien, atau jenis akta..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200/90 rounded-xl placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Notification Bell, Real-time Clock, User Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Real-time Clock: HH:mm:ss */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/60 text-slate-700 shadow-2xs">
            <Clock className="w-4 h-4 text-[#701424]" />
            <span className="font-mono text-sm font-semibold tracking-wider tabular-nums text-slate-800">
              {currentTime || '00:00:00'}
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase">WIB</span>
          </div>

          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#701424]/20"
              title="Notifikasi Berkas"
              aria-label="Lihat notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#701424] ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">Notifikasi Kantor</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-50 text-[#701424] border border-rose-200">
                        {unreadCount} Baru
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="text-xs text-slate-500 hover:text-[#701424] font-medium transition-colors"
                    >
                      Tandai sudah dibaca
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 hover:bg-slate-50/80 transition-colors ${
                        item.unread ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                        <span className="text-[10px] text-slate-400 tabular-nums shrink-0">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="px-4 pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-[#701424] hover:underline"
                  >
                    Tutup Panel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Popover */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#701424]/20"
              aria-label="Profil Pengguna"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-[#701424]/30 shadow-xs bg-slate-200">
                <img
                  src={NOTARY_PROFILE.avatarUrl}
                  alt={NOTARY_PROFILE.nama}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback container in case image fails to load
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-[#701424] text-white font-bold text-xs">RS</div>';
                    }
                  }}
                />
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{NOTARY_PROFILE.nama}</p>
                  <p className="text-[11px] text-[#701424] font-semibold mt-0.5">{NOTARY_PROFILE.jabatan}</p>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">{NOTARY_PROFILE.skMenkeh}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenProfile();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Lihat Biodata & SK Notaris</span>
                  </button>
                  <div className="px-4 py-1.5 text-[11px] text-slate-500 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wilayah: {NOTARY_PROFILE.wilayahKerja}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
