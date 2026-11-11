import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Building2,
  Calendar,
  Check,
  Save,
  ShieldCheck,
  Sparkles,
  Edit2,
  Trash2,
  Plus,
  CheckSquare,
  ClipboardList
} from 'lucide-react';
import {
  BerkasItem,
  BerkasStatus,
  TahapanPekerjaanItem,
  RiwayatCatatanTahapan,
  ChecklistItemTahapan
} from '../types/notary';
import { generateInitialTahapan } from '../utils/tahapanWorkflow';

interface DetailBerkasPageProps {
  berkas: BerkasItem;
  onBack: () => void;
  onUpdateBerkas?: (updated: BerkasItem) => void;
  currentPetugas?: string;
}

export const DetailBerkasPage: React.FC<DetailBerkasPageProps> = ({
  berkas,
  onBack,
  onUpdateBerkas,
  currentPetugas = 'Egi'
}) => {
  // Check if legal service (Waarmerking or Legalisasi)
  const isLegalService = berkas.jenis === 'Waarmerking' || berkas.jenis === 'Legalisasi';

  // Dynamic Page Title
  // e.g., "Detail Pendirian PT", "Detail Legalisasi", "Detail Perubahan CV"
  const dynamicTitle = isLegalService
    ? `Detail ${berkas.jenis}`
    : `Detail ${berkas.kategoriSubmenu || 'Pendirian'} ${berkas.jenis}`;

  // Initialize stages from berkas or generator
  const [stages, setStages] = useState<TahapanPekerjaanItem[]>(() => {
    if (berkas.tahapan && berkas.tahapan.length > 0) {
      return berkas.tahapan;
    }
    return generateInitialTahapan(berkas, currentPetugas);
  });

  // Track expanded accordion item IDs (initially open the first stage)
  const [expandedIds, setExpandedIds] = useState<string[]>(() => {
    return [stages[0]?.id || ''];
  });

  // State for Tahapan Khusus (Form Input Tanggal dan Catatan)
  // Mapped by stage.id
  const [formTanggal, setFormTanggal] = useState<Record<string, string>>({});
  const [formCatatan, setFormCatatan] = useState<Record<string, string>>({});

  // State for Editing an existing Riwayat entry
  const [editingRiwayat, setEditingRiwayat] = useState<{
    stageId: string;
    riwayatId: string;
    tanggal: string;
    jam: string;
    petugas: string;
    catatan: string;
  } | null>(null);

  // Notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper: Get real-time clock HH:mm:ss
  const getRealtimeClock = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`; // e.g. "10:38:36"
  };

  // Helper: Get formatted date DD-MM-YYYY
  const getFormattedDate = (): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Helper: Get real-time full datetime DD-MM-YYYY HH:mm
  const getRealtimeDateTime = (): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`; // e.g. "01-09-2026 19:26"
  };

  // Toggle single accordion item
  const toggleAccordion = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle all accordion items
  const toggleAllAccordions = () => {
    if (expandedIds.length === stages.length) {
      setExpandedIds([]);
    } else {
      setExpandedIds(stages.map((s) => s.id));
    }
  };

  // Automated progress calculations: (Jumlah tahapan "Selesai" / Total tahapan) * 100%
  const totalStages = stages.length;
  const completedStages = useMemo(() => {
    return stages.filter((s) => s.status === 'Selesai').length;
  }, [stages]);

  const percentage = useMemo(() => {
    if (totalStages === 0) return 0;
    return Math.round((completedStages / totalStages) * 100);
  }, [completedStages, totalStages]);

  // Sync stages update with parent berkas
  const syncBerkasUpdates = (newStages: TahapanPekerjaanItem[]) => {
    const allDone = newStages.every((s) => s.status === 'Selesai');
    const allPending = newStages.every((s) => s.status === 'Pending');
    let newDocStatus: BerkasStatus = 'Diproses';

    if (allDone) {
      newDocStatus = 'Selesai';
    } else if (allPending) {
      newDocStatus = 'Pending';
    }

    const updatedBerkas: BerkasItem = {
      ...berkas,
      status: newDocStatus,
      tahapan: newStages
    };

    if (onUpdateBerkas) {
      onUpdateBerkas(updatedBerkas);
    }
  };

  // ==========================================
  // HANDLERS FOR TAHAPAN KHUSUS (Tanggal & Catatan)
  // ==========================================
  const handleSaveRiwayatKhusus = (stageId: string) => {
    const tanggal = formTanggal[stageId] || getFormattedDate();
    const catatan = formCatatan[stageId]?.trim();

    if (!catatan) {
      showToast('Harap masukkan catatan terlebih dahulu.');
      return;
    }

    const newEntry: RiwayatCatatanTahapan = {
      id: `rc-${Date.now()}`,
      tanggal,
      jam: getRealtimeClock(),
      petugas: currentPetugas,
      catatan
    };

    const updatedStages = stages.map((s) => {
      if (s.id === stageId) {
        const nextRiwayat = [...(s.riwayatCatatan || []), newEntry];
        // Tahapan khusus automatically marked as Selesai when confirmed, or Diproses
        return {
          ...s,
          status: 'Selesai' as BerkasStatus,
          tanggalSelesai: tanggal,
          riwayatCatatan: nextRiwayat,
          catatan
        };
      }
      return s;
    });

    setStages(updatedStages);
    setFormCatatan((prev) => ({ ...prev, [stageId]: '' }));
    syncBerkasUpdates(updatedStages);
    showToast('Catatan riwayat tahapan berhasil disimpan!');
  };

  // Delete history entry in Tahapan Khusus
  const handleDeleteRiwayat = (stageId: string, riwayatId: string) => {
    const updatedStages = stages.map((s) => {
      if (s.id === stageId) {
        const nextRiwayat = (s.riwayatCatatan || []).filter((r) => r.id !== riwayatId);
        return {
          ...s,
          riwayatCatatan: nextRiwayat,
          status: nextRiwayat.length > 0 ? s.status : ('Pending' as BerkasStatus)
        };
      }
      return s;
    });

    setStages(updatedStages);
    syncBerkasUpdates(updatedStages);
    showToast('Riwayat catatan berhasil dihapus.');
  };

  // Update existing history entry
  const handleSaveEditRiwayat = () => {
    if (!editingRiwayat) return;

    const { stageId, riwayatId, tanggal, jam, catatan } = editingRiwayat;

    const updatedStages = stages.map((s) => {
      if (s.id === stageId) {
        const nextRiwayat = (s.riwayatCatatan || []).map((r) =>
          r.id === riwayatId ? { ...r, tanggal, jam, catatan } : r
        );
        return {
          ...s,
          riwayatCatatan: nextRiwayat
        };
      }
      return s;
    });

    setStages(updatedStages);
    setEditingRiwayat(null);
    syncBerkasUpdates(updatedStages);
    showToast('Perubahan riwayat berhasil diperbarui.');
  };

  // ==========================================
  // HANDLERS FOR TAHAPAN UTAMA / CHECKLIST
  // ==========================================
  const handleToggleChecklist = (stageId: string, itemId: string, isChecked: boolean) => {
    const realtimeTime = getRealtimeDateTime(); // e.g. "01-09-2026 19:26"

    const updatedStages = stages.map((s) => {
      if (s.id === stageId && s.checklistItems) {
        const nextItems = s.checklistItems.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              checked: isChecked,
              petugas: isChecked ? currentPetugas : undefined,
              jam: isChecked ? realtimeTime : undefined
            };
          }
          return item;
        });

        return {
          ...s,
          checklistItems: nextItems
        };
      }
      return s;
    });

    setStages(updatedStages);
  };

  // Save button in Checklist stage table footer
  const handleSaveChecklistTahapan = (stageId: string) => {
    const targetStage = stages.find((s) => s.id === stageId);
    if (!targetStage || !targetStage.checklistItems) return;

    const items = targetStage.checklistItems;
    const checkedCount = items.filter((i) => i.checked).length;
    const allChecked = checkedCount === items.length && items.length > 0;

    let newStatus: BerkasStatus = 'Pending';
    if (allChecked) {
      newStatus = 'Selesai';
    } else if (checkedCount > 0) {
      newStatus = 'Diproses';
    }

    const updatedStages = stages.map((s) => {
      if (s.id === stageId) {
        return {
          ...s,
          status: newStatus,
          tanggalSelesai: allChecked ? getFormattedDate() : undefined
        };
      }
      return s;
    });

    setStages(updatedStages);
    syncBerkasUpdates(updatedStages);
    showToast(
      allChecked
        ? `Seluruh item checklist terverifikasi! Tahapan "${targetStage.judul}" dinyatakan Selesai.`
        : `Perubahan checklist tahapan "${targetStage.judul}" berhasil disimpan.`
    );
  };

  // Status Badge Helper
  const renderStatusBadge = (status: BerkasStatus, size: 'sm' | 'md' = 'sm') => {
    switch (status) {
      case 'Pending':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200 ${
              size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case 'Diproses':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-sky-50 text-sky-700 border border-sky-200 ${
              size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Diproses
          </span>
        );
      case 'Selesai':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${
              size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Selesai
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Judul Utama Dinamis */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {dynamicTitle}
          </h1>
          {/* Sub-judul */}
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Monitoring pekerjaan berkas
          </p>
        </div>

        {/* Tombol Kanan Atas: "← Kembali" (Warna Abu-abu/Slate) */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-200" />
          <span>← Kembali</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. LAYOUT BAGIAN ATAS (2 KOLOM) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* KOLOM KIRI - Card "Informasi [Entitas]" */}
        <div className="flex flex-col bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
          {/* Header Card: Warna Merah Marun/Primary */}
          <div className="bg-[#701424] text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-rose-200" />
              <h2 className="font-bold text-sm tracking-wide">
                Informasi {isLegalService ? berkas.jenis : berkas.jenis}
              </h2>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/15 text-rose-100">
              {berkas.noBerkas}
            </span>
          </div>

          {/* Isi Detail: Nomor Berkas, Nama [Entitas] (ditiadakan jika legal service), Pemohon, Status */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              {/* Nomor Berkas */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs text-slate-500 font-medium">Nomor Berkas</span>
                <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {berkas.noBerkas}
                </span>
              </div>

              {/* Nama [Entitas] - DITIADAKAN UNTUK WAARMERKING / LEGALISASI */}
              {!isLegalService && (
                <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs text-slate-500 font-medium">Nama {berkas.jenis}</span>
                  <span className="text-xs font-bold text-slate-900 text-right max-w-[220px]">
                    {berkas.namaPerusahaan || berkas.subJenis}
                  </span>
                </div>
              )}

              {/* Pemohon */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs text-slate-500 font-medium">Pemohon</span>
                <span className="text-xs font-semibold text-slate-800 text-right">
                  {berkas.pemohon || berkas.klien}
                </span>
              </div>

              {/* Status dengan Badge Warna */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs text-slate-500 font-medium">Status Berkas</span>
                <div>{renderStatusBadge(berkas.status, 'md')}</div>
              </div>

              {/* Sub-jenis / Pelayanan */}
              <div className="flex items-start justify-between">
                <span className="text-xs text-slate-500 font-medium">Jenis Pekerjaan</span>
                <span className="text-xs font-semibold text-slate-700 text-right">
                  {berkas.subJenis}
                </span>
              </div>
            </div>

            {/* Catatan / Tanggal Masuk & Akun Login */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Tanggal: {berkas.tanggalLengkap}</span>
              </span>
              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Akun Aktif: {currentPetugas}
              </span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN - Card "Progress Pekerjaan" */}
        <div className="flex flex-col bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
          {/* Header Card: Warna Hijau */}
          <div className="bg-emerald-600 text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <h2 className="font-bold text-sm tracking-wide">Progress Pekerjaan</h2>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/15 text-emerald-100 font-medium">
              Real-time
            </span>
          </div>

          {/* Isi Progress: Presentase Besar, Progress Bar Hijau, Keterangan Teks */}
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Status Kelulusan Tahapan
                </span>
                {/* Presentase Besar */}
                <div className="text-5xl font-extrabold text-emerald-600 font-mono tracking-tight mt-1.5">
                  {percentage}%
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {percentage === 100
                    ? 'Selesai Sempurna'
                    : percentage > 0
                    ? 'Sedang Berjalan'
                    : 'Belum Dimulai'}
                </span>
              </div>
            </div>

            {/* Progress Bar Warna Hijau */}
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden mt-5 mb-2.5 p-0.5 border border-slate-200/60">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Keterangan Teks: "[X] dari [Total] tahapan selesai" */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mt-1">
              <span>
                <strong className="text-slate-900 font-bold">{completedStages}</strong> dari{' '}
                <strong className="text-slate-900 font-bold">{totalStages}</strong> tahapan selesai
              </span>
              <span className="text-slate-400 text-[11px] font-normal">
                {totalStages - completedStages > 0
                  ? `${totalStages - completedStages} tahapan tersisa`
                  : 'Seluruh tahapan rampung'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CARD UTAMA "TAHAPAN PEKERJAAN" (DYNAMIC ACCORDION) */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        {/* Header Card: Warna Biru bertuliskan "Tahapan Pekerjaan" */}
        <div className="bg-blue-600 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-200" />
            <h2 className="font-bold text-sm tracking-wide">Tahapan Pekerjaan</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-100 font-medium hidden sm:inline">
              Alur SOP & Monitoring Berkas Notariat
            </span>
            <button
              type="button"
              onClick={toggleAllAccordions}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium transition-colors cursor-pointer"
            >
              {expandedIds.length === stages.length ? 'Tutup Semua' : 'Buka Semua'}
            </button>
          </div>
        </div>

        {/* Daftar Tahapan Pekerjaan (Accordion List) yang Fleksibel & Dinamis */}
        <div className="p-4 sm:p-6 space-y-4">
          {stages.map((stage) => {
            const isExpanded = expandedIds.includes(stage.id);
            const isCompleted = stage.status === 'Selesai';
            const isInProgress = stage.status === 'Diproses';
            const isKhusus = stage.tipeTahapan === 'khusus';

            // Styling number circle based on status
            const circleBg = isCompleted
              ? 'bg-emerald-600 text-white shadow-xs'
              : isInProgress
              ? 'bg-sky-600 text-white shadow-xs animate-pulse'
              : 'bg-slate-200 text-slate-600';

            return (
              <div
                key={stage.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-blue-300/80 bg-slate-50/50 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                }`}
              >
                {/* Accordion Header (Clickable) */}
                <div
                  onClick={() => toggleAccordion(stage.id)}
                  className="px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer select-none bg-white hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Circle Indicator */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${circleBg}`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : stage.nomor}
                    </div>

                    {/* Judul Tahapan & Badges */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-xs sm:text-sm font-bold tracking-tight ${
                            isCompleted
                              ? 'text-slate-900'
                              : isInProgress
                              ? 'text-sky-900'
                              : 'text-slate-700'
                          }`}
                        >
                          {stage.judul}
                        </h4>

                        {/* Format Indicator Badge */}
                        {isKhusus ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <ClipboardList className="w-3 h-3 text-indigo-500" />
                            Form Tanggal & Catatan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                            <CheckSquare className="w-3 h-3 text-sky-500" />
                            Tabel Checklist
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 truncate max-w-xl mt-0.5 hidden sm:block">
                        {stage.deskripsi}
                      </p>
                    </div>
                  </div>

                  {/* Right Header items: Status Badge & Chevron */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    {renderStatusBadge(stage.status, 'sm')}
                    <div className="text-slate-400 p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Accordion Content (Expanded Form / Table) */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-slate-200/80 bg-white space-y-6 text-xs animate-in slide-in-from-top-1 duration-150">
                    {/* ========================================================= */}
                    {/* FORMAT 1: TAHAPAN KHUSUS (Penerimaan Berkas & Pengambilan) */}
                    {/* ========================================================= */}
                    {isKhusus ? (
                      <div className="space-y-6">
                        {/* 1. Form Input Tanggal dan Catatan */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span>
                                Form Input {stage.nomor === 1 ? 'Tanggal Masuk & Catatan' : 'Tanggal Pengambilan & Catatan'}
                              </span>
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Petugas Aktif: <strong className="text-blue-700">{currentPetugas}</strong>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                            {/* Input Tanggal Masuk dengan ikon kalender */}
                            <div className="sm:col-span-4 space-y-1.5">
                              <label className="block text-xs font-semibold text-slate-700">
                                {stage.nomor === 1 ? 'Tanggal Masuk' : 'Tanggal Selesai / Ambil'}
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                  <Calendar className="w-4 h-4 text-slate-500" />
                                </div>
                                <input
                                  type="date"
                                  value={formTanggal[stage.id] || getFormattedDate()}
                                  onChange={(e) =>
                                    setFormTanggal((prev) => ({
                                      ...prev,
                                      [stage.id]: e.target.value
                                    }))
                                  }
                                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                              </div>
                            </div>

                            {/* Textarea Catatan */}
                            <div className="sm:col-span-8 space-y-1.5">
                              <label className="block text-xs font-semibold text-slate-700">
                                Catatan
                              </label>
                              <textarea
                                value={formCatatan[stage.id] || ''}
                                onChange={(e) =>
                                  setFormCatatan((prev) => ({
                                    ...prev,
                                    [stage.id]: e.target.value
                                  }))
                                }
                                placeholder="Masukkan catatan..."
                                rows={2}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>

                          {/* Tombol Simpan (Warna Biru dengan ikon simpan di pojok kanan bawah form) */}
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveRiwayatKhusus(stage.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5 text-white" />
                              <span>Simpan</span>
                            </button>
                          </div>
                        </div>

                        {/* 2. Tabel Riwayat di Bawah Form */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-xs text-slate-800 tracking-tight">
                              Tabel Riwayat {stage.nomor === 1 ? 'Penerimaan Berkas' : 'Pengambilan Berkas'}
                            </h5>
                            <span className="text-[11px] text-slate-400">
                              {(stage.riwayatCatatan || []).length} riwayat tercatat
                            </span>
                          </div>

                          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                  <th className="py-2.5 px-3 whitespace-nowrap w-28">Tanggal</th>
                                  <th className="py-2.5 px-3 whitespace-nowrap w-24">Jam</th>
                                  <th className="py-2.5 px-3 whitespace-nowrap w-28">Petugas</th>
                                  <th className="py-2.5 px-4">Catatan</th>
                                  <th className="py-2.5 px-3 text-center whitespace-nowrap w-20">Aksi</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-xs">
                                {(stage.riwayatCatatan || []).length > 0 ? (
                                  stage.riwayatCatatan!.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                      {/* Kolom Tanggal */}
                                      <td className="py-2.5 px-3 font-mono text-slate-800 whitespace-nowrap font-medium">
                                        {item.tanggal}
                                      </td>

                                      {/* Kolom Jam: badge waktu real-time, misal: 10:38:36 */}
                                      <td className="py-2.5 px-3 whitespace-nowrap">
                                        <span className="inline-block px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                          {item.jam}
                                        </span>
                                      </td>

                                      {/* Kolom Petugas: badge nama akun yang menginput */}
                                      <td className="py-2.5 px-3 whitespace-nowrap">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                          {item.petugas}
                                        </span>
                                      </td>

                                      {/* Kolom Catatan */}
                                      <td className="py-2.5 px-4 text-slate-700 leading-relaxed">
                                        {item.catatan}
                                      </td>

                                      {/* Kolom Aksi: Tombol Edit ikon pensil & Tombol Hapus ikon tempat sampah */}
                                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                        <div className="inline-flex items-center justify-center gap-1.5">
                                          {/* Tombol Edit */}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setEditingRiwayat({
                                                stageId: stage.id,
                                                riwayatId: item.id,
                                                tanggal: item.tanggal,
                                                jam: item.jam,
                                                petugas: item.petugas,
                                                catatan: item.catatan
                                              })
                                            }
                                            className="p-1 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                            title="Edit Catatan Riwayat"
                                          >
                                            <Edit2 className="w-3.5 h-3.5" />
                                          </button>

                                          {/* Tombol Hapus */}
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRiwayat(stage.id, item.id)}
                                            className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Hapus Catatan Riwayat"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                                      Belum ada riwayat catatan untuk tahapan ini. Gunakan formulir di atas untuk menambahkan catatan baru.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ========================================================= */
                      /* FORMAT 2: TAHAPAN UTAMA / PROSES LAINNYA (Tabel CheckList) */
                      /* ========================================================= */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xs text-slate-800">
                              Daftar Pemeriksaan Dokumen & Persyaratan SOP
                            </span>
                            <p className="text-[11px] text-slate-500">
                              Beri tanda centang pada dokumen/persyaratan yang telah selesai diverifikasi.
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {(stage.checklistItems || []).filter((i) => i.checked).length} dari{' '}
                            {(stage.checklistItems || []).length} Selesai
                          </span>
                        </div>

                        {/* Tabel CheckList Daftar Dokumen/Persyaratan:
                            Column Headers: "No", "Daftar", "Petugas", "Jam", dan "Checklist"
                        */}
                        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                <th className="py-2.5 px-3 w-12 text-center">No</th>
                                <th className="py-2.5 px-4">Daftar</th>
                                <th className="py-2.5 px-3 whitespace-nowrap w-32">Petugas</th>
                                <th className="py-2.5 px-3 whitespace-nowrap w-40">Jam</th>
                                <th className="py-2.5 px-3 text-center whitespace-nowrap w-24">Checklist</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                              {(stage.checklistItems || []).map((item, itemIdx) => (
                                <tr
                                  key={item.id}
                                  className={`transition-colors ${
                                    item.checked ? 'bg-sky-50/30 hover:bg-sky-50/50' : 'hover:bg-slate-50/70'
                                  }`}
                                >
                                  {/* Kolom No */}
                                  <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-500">
                                    {itemIdx + 1}
                                  </td>

                                  {/* Kolom Daftar Item */}
                                  <td className="py-2.5 px-4">
                                    <span
                                      className={`font-medium ${
                                        item.checked ? 'text-slate-900 font-semibold' : 'text-slate-700'
                                      }`}
                                    >
                                      {item.nama}
                                    </span>
                                  </td>

                                  {/* Kolom Petugas: Otomatis terisi badge nama akun yang sedang login saat dicentang */}
                                  <td className="py-2.5 px-3 whitespace-nowrap">
                                    {item.checked && item.petugas ? (
                                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 animate-in fade-in">
                                        {item.petugas}
                                      </span>
                                    ) : (
                                      <span className="text-slate-300 font-mono text-xs">-</span>
                                    )}
                                  </td>

                                  {/* Kolom Jam: Otomatis terisi badge waktu real-time saat dicentang */}
                                  <td className="py-2.5 px-3 whitespace-nowrap">
                                    {item.checked && item.jam ? (
                                      <span className="inline-block px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 animate-in fade-in">
                                        {item.jam}
                                      </span>
                                    ) : (
                                      <span className="text-slate-300 font-mono text-xs">-</span>
                                    )}
                                  </td>

                                  {/* Kolom Checklist: Kotak centang (Checkbox) interaktif */}
                                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(item.checked)}
                                      onChange={(e) =>
                                        handleToggleChecklist(stage.id, item.id, e.target.checked)
                                      }
                                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer transition-all"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Tombol Aksi Bawah: Tombol "Simpan" (Warna Biru di sudut kanan bawah tabel) */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-slate-500 italic">
                            * Klik simpan untuk memperbarui status tahapan dan kemajuan berkas.
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSaveChecklistTahapan(stage.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5 text-white" />
                            <span>Simpan Checklist</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>
              Sistem Alur Kerja Standar Notaris & PPAT Republik Indonesia
            </span>
          </span>
          <span className="font-semibold text-slate-700">
            Total {totalStages} Tahapan SOP
          </span>
        </div>
      </div>

      {/* Modal Dialog: Edit History Entry in Tahapan Khusus */}
      {editingRiwayat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-sm text-slate-900">
                Edit Catatan Riwayat
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {editingRiwayat.jam}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={editingRiwayat.tanggal}
                  onChange={(e) =>
                    setEditingRiwayat((prev) =>
                      prev ? { ...prev, tanggal: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan
                </label>
                <textarea
                  value={editingRiwayat.catatan}
                  onChange={(e) =>
                    setEditingRiwayat((prev) =>
                      prev ? { ...prev, catatan: e.target.value } : null
                    )
                  }
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingRiwayat(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEditRiwayat}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
