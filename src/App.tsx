/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Filter, RefreshCcw, CheckCircle, ChevronRight, X } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { BarChartWidget } from './components/BarChartWidget';
import { CalendarWidget } from './components/CalendarWidget';
import { ActivityTable } from './components/ActivityTable';
import { DocumentTable } from './components/DocumentTable';
import { FileDetailModal } from './components/FileDetailModal';
import { DetailBerkasPage } from './components/DetailBerkasPage';
import { AddBerkasPage } from './components/AddBerkasPage';
import { EditBerkasPage } from './components/EditBerkasPage';
import { AddFileModal } from './components/AddFileModal';
import { EditFileModal } from './components/EditFileModal';
import { EntitySubmenuPage } from './components/EntitySubmenuPage';
import { UsersPage } from './components/UsersPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { UserProfileModal } from './components/UserProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { INITIAL_BERKAS, RECENT_ACTIVITIES, INITIAL_USERS } from './data/mockData';
import { BerkasItem, BerkasStatus, BerkasJenis, KategoriSubmenu, UserAccount } from './types/notary';

export default function App() {
  // Navigation & UI states
  const [activeMenu, setActiveMenu] = useState<string>('Dashboard');
  const [activeJenisFilter, setActiveJenisFilter] = useState<BerkasJenis | null>(null);
  const [activeSubmenuFilter, setActiveSubmenuFilter] = useState<KategoriSubmenu | null>(null);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BerkasStatus | 'All'>('All');
  const [selectedDate, setSelectedDate] = useState('2026-09-22'); // Prompt example: 22 September 2026

  // Data states
  const [berkasList, setBerkasList] = useState<BerkasItem[]>(INITIAL_BERKAS);
  const [activities, setActivities] = useState(RECENT_ACTIVITIES);

  // Detail page state (Monitoring Pekerjaan)
  const [viewingDetailBerkas, setViewingDetailBerkas] = useState<BerkasItem | null>(null);

  // Modal dialog states
  const [selectedBerkas, setSelectedBerkas] = useState<BerkasItem | null>(null);
  const [editingBerkas, setEditingBerkas] = useState<BerkasItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [logoutNotice, setLogoutNotice] = useState(false);

  // User management handlers
  const handleAddUser = (newUser: UserAccount) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleEditUser = (updatedUser: UserAccount) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Filtered documents
  const filteredBerkas = useMemo(() => {
    return berkasList.filter((item) => {
      // 1. Status Filter
      if (statusFilter !== 'All' && item.status !== statusFilter) {
        return false;
      }

      // 2. Jenis Filter from Sidebar
      if (activeJenisFilter && item.jenis !== activeJenisFilter) {
        return false;
      }

      // 3. Submenu Filter (Pendirian, Perubahan, Pembubaran)
      if (activeSubmenuFilter) {
        const matchesCategory = item.kategoriSubmenu === activeSubmenuFilter;
        const matchesSubJenis = item.subJenis.toLowerCase().includes(activeSubmenuFilter.toLowerCase());
        if (!matchesCategory && !matchesSubJenis) {
          return false;
        }
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNo = item.noBerkas.toLowerCase().includes(query);
        const matchKlien = item.klien.toLowerCase().includes(query);
        const matchJenis = item.jenis.toLowerCase().includes(query);
        const matchSub = item.subJenis.toLowerCase().includes(query);
        const matchPerusahaan = item.namaPerusahaan?.toLowerCase().includes(query);
        return matchNo || matchKlien || matchJenis || matchSub || matchPerusahaan;
      }

      return true;
    });
  }, [berkasList, statusFilter, activeJenisFilter, activeSubmenuFilter, searchQuery]);

  // Statistics calculation
  const totalCount = berkasList.length;
  const pendingCount = berkasList.filter((b) => b.status === 'Pending').length;
  const diprosesCount = berkasList.filter((b) => b.status === 'Diproses').length;
  const selesaiCount = berkasList.filter((b) => b.status === 'Selesai').length;

  // Handle menu selection
  const handleSelectMenu = (
    menu: string,
    jenisFilter?: BerkasJenis | null,
    subFilter?: KategoriSubmenu | null
  ) => {
    setViewingDetailBerkas(null);
    setIsAddModalOpen(false);
    setEditingBerkas(null);
    setActiveMenu(menu);
    if (
      menu === 'Dashboard' ||
      menu === 'Pengguna' ||
      menu === 'Profile' ||
      menu === 'Settings'
    ) {
      setActiveJenisFilter(null);
      setActiveSubmenuFilter(null);
    } else if (menu === 'Waarmerking' || menu === 'Legalisasi') {
      setActiveJenisFilter(menu as BerkasJenis);
      setActiveSubmenuFilter(null);
    } else {
      setActiveJenisFilter(jenisFilter || null);
      setActiveSubmenuFilter(subFilter || (jenisFilter ? 'Pendirian' : null));
    }
  };

  // Update berkas from Detail Berkas / Monitoring Pekerjaan
  const handleUpdateBerkasFromDetail = (updated: BerkasItem) => {
    setBerkasList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setViewingDetailBerkas(updated);

    const oldItem = berkasList.find((b) => b.id === updated.id);
    if (oldItem && oldItem.status !== updated.status) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          pengguna: {
            nama: 'Hj. Ratna Sari, S.H.',
            peran: 'Notaris & PPAT'
          },
          aktivitas: `Memperbarui status berkas ${updated.noBerkas} menjadi "${updated.status}" melalui Monitoring Tahapan Pekerjaan`,
          detailBerkas: updated.noBerkas,
          waktu: 'Baru saja',
          tipe: 'update'
        },
        ...prev
      ]);
    }
  };

  // Edit document handler
  const handleSaveEdit = (updated: BerkasItem) => {
    setBerkasList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        pengguna: {
          nama: 'Hj. Ratna Sari, S.H.',
          peran: 'Notaris & PPAT'
        },
        aktivitas: `Memperbarui data berkas ${updated.noBerkas} (${updated.namaPerusahaan || updated.pemohon || updated.klien})`,
        detailBerkas: updated.noBerkas,
        waktu: 'Baru saja',
        tipe: 'update'
      },
      ...prev
    ]);
  };

  // Delete document handler
  const handleDeleteBerkas = (id: string) => {
    const target = berkasList.find((b) => b.id === id);
    setBerkasList((prev) => prev.filter((b) => b.id !== id));
    if (target) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          pengguna: {
            nama: 'Budi Santoso',
            peran: 'Staff Administrasi'
          },
          aktivitas: `Menghapus berkas ${target.noBerkas} dari daftar`,
          detailBerkas: target.noBerkas,
          waktu: 'Baru saja',
          tipe: 'update'
        },
        ...prev
      ]);
    }
  };

  // Archive toggle handler
  const handleToggleArchive = (id: string) => {
    setBerkasList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextArchived = !item.isArchived;
          return { ...item, isArchived: nextArchived };
        }
        return item;
      })
    );
  };

  // Status update
  const handleUpdateStatus = (id: string, newStatus: BerkasStatus) => {
    setBerkasList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    // Update selected berkas if open
    if (selectedBerkas && selectedBerkas.id === id) {
      setSelectedBerkas((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    // Add activity log
    const updatedItem = berkasList.find((b) => b.id === id);
    if (updatedItem) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          pengguna: {
            nama: 'Hj. Ratna Sari, S.H.',
            peran: 'Notaris & PPAT'
          },
          aktivitas: `Mengubah status berkas ${updatedItem.noBerkas} menjadi "${newStatus}"`,
          detailBerkas: updatedItem.noBerkas,
          waktu: 'Baru saja',
          tipe: 'update'
        },
        ...prev
      ]);
    }
  };

  // Add new document
  const handleAddNewBerkas = (newBerkas: BerkasItem) => {
    setBerkasList((prev) => [newBerkas, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        pengguna: {
          nama: 'Budi Santoso',
          peran: 'Staff Administrasi'
        },
        aktivitas: `Mendaftarkan berkas baru: ${newBerkas.subJenis} (${newBerkas.klien})`,
        detailBerkas: newBerkas.noBerkas,
        waktu: 'Baru saja',
        tipe: 'create'
      },
      ...prev
    ]);
  };

  // Handle click on file number from Activity Table
  const handleSelectBerkasByNo = (noBerkas: string) => {
    const item = berkasList.find((b) => b.noBerkas === noBerkas);
    if (item) {
      setViewingDetailBerkas(item);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. SIDEBAR (NAVIGASI KIRI) */}
      <Sidebar
        activeMenu={activeMenu}
        activeJenisFilter={activeJenisFilter}
        activeSubmenuFilter={activeSubmenuFilter}
        onSelectMenu={handleSelectMenu}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
        onOpenProfile={() => handleSelectMenu('Profile')}
        onOpenSettings={() => handleSelectMenu('Settings')}
        onLogout={() => {
          setLogoutNotice(true);
          setTimeout(() => setLogoutNotice(false), 4000);
        }}
      />

      {/* MAIN CONTAINER: Spans to the right of Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* 2. HEADER (BAGIAN ATAS): Membentang di atas area konten utama */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebarMobile={() => setIsOpenMobileSidebar(true)}
          onOpenProfile={() => handleSelectMenu('Profile')}
        />

        {/* KONTEN UTAMA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {isAddModalOpen ? (
            /* TEMPLATE HALAMAN TAMBAH BERKAS (Dari Dashboard / Global) */
            <AddBerkasPage
              jenis={activeJenisFilter || 'PT'}
              kategoriSubmenu={activeSubmenuFilter || 'Pendirian'}
              onBack={() => setIsAddModalOpen(false)}
              onSave={(newBerkas) => {
                handleAddNewBerkas(newBerkas);
                setIsAddModalOpen(false);
              }}
              existingCount={berkasList.length}
            />
          ) : editingBerkas ? (
            /* TEMPLATE HALAMAN EDIT BERKAS */
            <EditBerkasPage
              berkas={editingBerkas}
              onBack={() => setEditingBerkas(null)}
              onSave={(updated) => {
                handleSaveEdit(updated);
                setEditingBerkas(null);
              }}
            />
          ) : viewingDetailBerkas ? (
            /* TEMPLATE HALAMAN DETAIL BERKAS / MONITORING PEKERJAAN (Akses saat klik ikon Mata di kolom aksi) */
            <DetailBerkasPage
              berkas={viewingDetailBerkas}
              onBack={() => setViewingDetailBerkas(null)}
              onUpdateBerkas={handleUpdateBerkasFromDetail}
              currentPetugas="nurul"
            />
          ) : activeMenu === 'Profile' ? (
            /* TEMPLATE HALAMAN PROFILE ADMINISTRATOR */
            <ProfilePage
              onBack={() => {
                setActiveMenu('Dashboard');
                setActiveJenisFilter(null);
                setActiveSubmenuFilter(null);
              }}
            />
          ) : activeMenu === 'Settings' ? (
            /* TEMPLATE HALAMAN SETTINGS / PENGATURAN SISTEM */
            <SettingsPage
              onBack={() => {
                setActiveMenu('Dashboard');
                setActiveJenisFilter(null);
                setActiveSubmenuFilter(null);
              }}
            />
          ) : activeMenu === 'Pengguna' ? (
            /* TEMPLATE HALAMAN PENGGUNA (Halaman Penuh Sesuai Spesifikasi) */
            <UsersPage
              users={users}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onBackToDashboard={() => {
                setActiveMenu('Dashboard');
                setActiveJenisFilter(null);
                setActiveSubmenuFilter(null);
              }}
            />
          ) : activeJenisFilter ? (
            /* TEMPLATE HALAMAN DINAMIS BERKAS (PT/CV/Yayasan/Koperasi/Firma serta Waarmerking & Legalisasi) */
            <EntitySubmenuPage
              jenis={activeJenisFilter}
              kategoriSubmenu={activeSubmenuFilter}
              berkasList={berkasList}
              onAddNew={handleAddNewBerkas}
              onViewDetail={setViewingDetailBerkas}
              onEdit={handleSaveEdit}
              onDelete={handleDeleteBerkas}
              onToggleArchive={handleToggleArchive}
              onBackToDashboard={() => {
                setActiveMenu('Dashboard');
                setActiveJenisFilter(null);
                setActiveSubmenuFilter(null);
              }}
            />
          ) : (
            /* TAMPILAN DASHBOARD UTAMA */
            <>
              {/* Salam Sapaan & Tanggal Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    Selamat datang kembali <span className="font-semibold text-slate-700">Admin</span>
                  </p>
                </div>

                {/* Tombol badge tanggal di sudut kanan atas (contoh: "22 September 2026") */}
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedDate('2026-09-22')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:border-[#701424] hover:text-[#701424] text-xs font-bold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
                    title="Pilih tanggal kerja"
                  >
                    <CalendarIcon className="w-4 h-4 text-[#701424]" />
                    <span>22 September 2026</span>
                  </button>
                </div>
              </div>

              {/* 4 Ringkasan Kartu Statistik (Summary Cards) */}
              {/* 1. Total Berkas: 18 | 2. Pending: 1 | 3. Diproses: 15 | 4. Selesai: 2 */}
              <StatCards
                total={totalCount}
                pending={pendingCount}
                diproses={diprosesCount}
                selesai={selesaiCount}
                selectedFilter={statusFilter}
                onFilterChange={setStatusFilter}
              />

              {/* Tata Letak Tengah (2 Kolom):
                  1. Kolom Kiri: Grafik Statistik Berkas (Bar chart tren berkas per bulan, badge tahun "2026")
                  2. Kolom Kanan: Widget Kalender (Kalender bulanan September 2026 dengan penanda tanggal aktif)
              */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Kolom Kiri - Grafik Statistik Berkas (7 cols on large desktop) */}
                <div className="lg:col-span-7 h-full">
                  <BarChartWidget
                    onSelectMonth={(monthName) => {
                      // Interactive filter
                    }}
                  />
                </div>

                {/* Kolom Kanan - Widget Kalender (5 cols on large desktop) */}
                <div className="lg:col-span-5 h-full">
                  <CalendarWidget
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                </div>
              </div>

              {/* Tata Letak Bawah (2 Kolom):
                  1. Kolom Kiri: Tabel Aktivitas Terbaru (Pengguna, Aktivitas, Waktu)
                  2. Kolom Kanan: Tabel Berkas Terbaru (Jenis, No Berkas, Klien, Status, Waktu)
              */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Kolom 1 - Tabel Aktivitas Terbaru (5 cols) */}
                <div className="lg:col-span-5 h-full">
                  <ActivityTable
                    activities={activities}
                    onSelectBerkasNo={handleSelectBerkasByNo}
                  />
                </div>

                {/* Kolom 2 - Tabel Berkas Terbaru (7 cols) */}
                <div className="lg:col-span-7 h-full">
                  <DocumentTable
                    berkasList={filteredBerkas}
                    onViewDetail={setViewingDetailBerkas}
                    onAddNew={() => setIsAddModalOpen(true)}
                    activeFilter={statusFilter}
                    onFilterChange={setStatusFilter}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* File Detail Modal */}
      <FileDetailModal
        berkas={selectedBerkas}
        onClose={() => setSelectedBerkas(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Edit File Modal */}
      <EditFileModal
        berkas={editingBerkas}
        isOpen={Boolean(editingBerkas)}
        onClose={() => setEditingBerkas(null)}
        onSave={handleSaveEdit}
      />

      {/* Add File Modal */}
      <AddFileModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNewBerkas}
        defaultJenis={activeJenisFilter || 'PT'}
        defaultSubmenu={activeSubmenuFilter || 'Pendirian'}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Logout Notice Toast */}
      {logoutNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#701424] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold">Sesi Pengguna Berhasil Keluar</p>
            <p className="text-[11px] text-rose-200">Data repertorium tersimpan aman di sistem.</p>
          </div>
          <button
            onClick={() => setLogoutNotice(false)}
            className="ml-2 text-rose-200 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
