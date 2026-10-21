import React, { useState } from 'react';
import {
  Building2,
  LayoutDashboard,
  Building,
  Briefcase,
  HeartHandshake,
  Users2,
  Scale,
  FileCheck2,
  Stamp,
  Users,
  User,
  Settings,
  LogOut,
  ChevronDown,
  X,
  FileText
} from 'lucide-react';
import { BerkasJenis, KategoriSubmenu } from '../types/notary';

interface SidebarProps {
  activeMenu: string;
  activeJenisFilter: BerkasJenis | null;
  activeSubmenuFilter?: KategoriSubmenu | null;
  onSelectMenu: (
    menu: string,
    jenisFilter?: BerkasJenis | null,
    subFilter?: KategoriSubmenu | null
  ) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  activeJenisFilter,
  activeSubmenuFilter,
  onSelectMenu,
  isOpenMobile,
  onCloseMobile,
  onOpenProfile,
  onOpenSettings,
  onLogout
}) => {
  // State for which dropdown accordions are open
  // Default PT is open so user immediately sees the 3 submenus
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    PT: true,
    CV: false,
    Yayasan: false,
    Koperasi: false,
    Firma: false
  });

  const toggleAccordion = (name: string, jenis: BerkasJenis) => {
    setOpenAccordions((prev) => {
      const willBeOpen = !prev[name];
      return {
        ...prev,
        [name]: willBeOpen
      };
    });
  };

  // 5 Accordion Menus with EXACTLY 3 Submenus: "Pendirian", "Perubahan", "Pembubaran"
  const accordionMenus: Array<{
    id: BerkasJenis;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    submenus: KategoriSubmenu[];
  }> = [
    {
      id: 'PT',
      title: 'PT',
      icon: Building,
      submenus: ['Pendirian', 'Perubahan', 'Pembubaran']
    },
    {
      id: 'CV',
      title: 'CV',
      icon: Briefcase,
      submenus: ['Pendirian', 'Perubahan', 'Pembubaran']
    },
    {
      id: 'Yayasan',
      title: 'Yayasan',
      icon: HeartHandshake,
      submenus: ['Pendirian', 'Perubahan', 'Pembubaran']
    },
    {
      id: 'Koperasi',
      title: 'Koperasi',
      icon: Users2,
      submenus: ['Pendirian', 'Perubahan', 'Pembubaran']
    },
    {
      id: 'Firma',
      title: 'Firma',
      icon: Scale,
      submenus: ['Pendirian', 'Perubahan', 'Pembubaran']
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container: Persistent on desktop (w-[264px], sticky full-height), drawer on mobile */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 md:z-20 w-[264px] h-screen bg-[#701424] text-white flex flex-col shrink-0 transition-transform duration-300 ease-in-out select-none shadow-xl md:shadow-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Bagian Paling Atas Sidebar: Judul/Logo "Kantor Notaris" dilengkapi dengan icon gedung/kantor */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white ring-1 ring-white/20 shadow-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white leading-tight">
                Kantor Notaris
              </span>
              <span className="text-[11px] text-rose-200/80 font-medium">
                PPAT & Notariat
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/10"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar text-sm">
          {/* Dashboard (Aktif / highlighted dengan warna latar putih dan teks merah marun) */}
          <button
            type="button"
            onClick={() => {
              onSelectMenu('Dashboard', null, null);
              if (isOpenMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              activeMenu === 'Dashboard' && !activeJenisFilter
                ? 'bg-white text-[#701424] font-bold shadow-md'
                : 'text-rose-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard
              className={`w-4.5 h-4.5 shrink-0 ${
                activeMenu === 'Dashboard' && !activeJenisFilter
                  ? 'text-[#701424]'
                  : 'text-rose-200'
              }`}
            />
            <span>Dashboard</span>
          </button>

          {/* Group Label */}
          <div className="pt-3 pb-1 px-3">
            <span className="text-[10px] uppercase tracking-wider text-rose-200/70 font-bold">
              Badan Hukum & Usaha
            </span>
          </div>

          {/* PT, CV, Yayasan, Koperasi, Firma with Dropdown Accordion */}
          {accordionMenus.map((acc) => {
            const isOpen = !!openAccordions[acc.id];
            const Icon = acc.icon;
            const isCurrentJenisActive = activeJenisFilter === acc.id;

            return (
              <div key={acc.id} className="rounded-xl overflow-hidden">
                {/* Main Accordion Menu Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(acc.id, acc.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isCurrentJenisActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-rose-100 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5 text-rose-200 shrink-0" />
                    <span>{acc.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-rose-300 transition-transform duration-200 ease-in-out shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Submenu Container with Smooth Accordion Transition */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 mt-1 mb-1.5' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="ml-4 pl-3.5 border-l-2 border-white/20 space-y-1 py-1">
                      {acc.submenus.map((subName) => {
                        const isSubActive =
                          activeJenisFilter === acc.id && activeSubmenuFilter === subName;

                        return (
                          <button
                            key={subName}
                            type="button"
                            onClick={() => {
                              onSelectMenu(`${acc.id}-${subName}`, acc.id, subName);
                              if (isOpenMobile) onCloseMobile();
                            }}
                            className={`w-full text-left py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-between ${
                              isSubActive
                                ? 'bg-white text-[#701424] font-bold shadow-xs'
                                : 'text-rose-100 hover:text-white hover:bg-white/10 font-medium'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  isSubActive ? 'bg-[#701424]' : 'bg-rose-300/60'
                                }`}
                              />
                              <span>{subName}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Group Label: Pelayanan Hukum */}
          <div className="pt-3 pb-1 px-3">
            <span className="text-[10px] uppercase tracking-wider text-rose-200/70 font-bold">
              Pelayanan Hukum
            </span>
          </div>

          {/* Waarmerking */}
          <button
            type="button"
            onClick={() => {
              onSelectMenu('Waarmerking', 'Waarmerking', null);
              if (isOpenMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeMenu === 'Waarmerking'
                ? 'bg-white text-[#701424] font-bold shadow-md'
                : 'text-rose-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileCheck2
              className={`w-4.5 h-4.5 shrink-0 ${
                activeMenu === 'Waarmerking' ? 'text-[#701424]' : 'text-rose-200'
              }`}
            />
            <span>Waarmerking</span>
          </button>

          {/* Legalisasi */}
          <button
            type="button"
            onClick={() => {
              onSelectMenu('Legalisasi', 'Legalisasi', null);
              if (isOpenMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeMenu === 'Legalisasi'
                ? 'bg-white text-[#701424] font-bold shadow-md'
                : 'text-rose-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Stamp
              className={`w-4.5 h-4.5 shrink-0 ${
                activeMenu === 'Legalisasi' ? 'text-[#701424]' : 'text-rose-200'
              }`}
            />
            <span>Legalisasi</span>
          </button>

          {/* Pengguna */}
          <button
            type="button"
            onClick={() => {
              onSelectMenu('Pengguna');
              if (isOpenMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeMenu === 'Pengguna'
                ? 'bg-white text-[#701424] font-bold shadow-md'
                : 'text-rose-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users
              className={`w-4.5 h-4.5 shrink-0 ${
                activeMenu === 'Pengguna' ? 'text-[#701424]' : 'text-rose-200'
              }`}
            />
            <span>Pengguna</span>
          </button>
        </div>

        {/* Bagian Bawah Sidebar (Terpisah oleh garis tipis/divider): Profile, Setting, Logout */}
        <div className="p-3 border-t border-white/15 bg-black/10 shrink-0 space-y-1">
          {/* Profile */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-100 hover:bg-white/10 hover:text-white transition-colors"
          >
            <User className="w-4 h-4 text-rose-200" />
            <span>Profile Notaris</span>
          </button>

          {/* Setting */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-100 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 text-rose-200" />
            <span>Setting Kantor</span>
          </button>

          {/* Logout (Tombol keluar dengan icon logout) */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-200 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-300" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
