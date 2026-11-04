import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  User,
  Pencil,
  Camera,
  Key,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  Shield,
  Check,
  X,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { NOTARY_PROFILE } from '../data/mockData';

interface ProfilePageProps {
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  // State for user profile data
  const [profileData, setProfileData] = useState({
    namaLengkap: 'Admin',
    username: 'Administrator',
    email: 'kantornotaris.sam@gmail.com',
    role: 'Admin',
    status: 'Aktif',
    noHp: '081123456780',
    tanggalDibuat: '2026-07-02 19:15:50',
    avatarUrl: NOTARY_PROFILE.avatarUrl
  });

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    namaLengkap: profileData.namaLengkap,
    username: profileData.username,
    email: profileData.email,
    noHp: profileData.noHp
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // File input ref for photo upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handle Edit Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.namaLengkap.trim() || !editForm.email.trim()) {
      return;
    }
    setProfileData((prev) => ({
      ...prev,
      namaLengkap: editForm.namaLengkap,
      username: editForm.username,
      email: editForm.email,
      noHp: editForm.noHp
    }));
    setIsEditProfileOpen(false);
    showToast('Profil Administrator berhasil diperbarui!');
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProfileData((prev) => ({
            ...prev,
            avatarUrl: reader.result as string
          }));
          showToast('Foto profil baru berhasil diunggah!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Password Change
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.oldPassword) {
      setPasswordError('Password lama wajib diisi.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password baru minimal 6 karakter.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok.');
      return;
    }

    setPasswordError('');
    setIsChangePasswordOpen(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password akun berhasil diperbarui!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-sm animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER HALAMAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profile Administrator
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Informasi akun administrator
          </p>
        </div>

        {/* Tombol Kanan Atas: "← Kembali" (Warna Abu-abu/Slate) */}
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all border border-slate-200/80 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Kembali</span>
          </button>
        </div>
      </div>

      {/* 2. LAYOUT 2 KOLOM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (Kartu Profil Pengguna) - 4 cols on large screen */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col items-center text-center">
          {/* Foto Profil Berbentuk Lingkaran */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-slate-100 shadow-md bg-slate-100 flex items-center justify-center">
              <img
                src={profileData.avatarUrl}
                alt={profileData.namaLengkap}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML =
                      '<div class="w-full h-full flex items-center justify-center bg-[#701424] text-white font-bold text-3xl">AD</div>';
                  }
                }}
              />
            </div>

            {/* Quick Upload Hover overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-2xs"
              title="Ganti foto profil"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[11px] font-semibold">Ganti Foto</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Nama Lengkap & Badge Role */}
          <h2 className="text-xl font-bold text-slate-900 mt-4 tracking-tight">
            {profileData.namaLengkap}
          </h2>
          <div className="mt-1.5">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Administrator
            </span>
          </div>

          {/* Garis Pembatas Tipis */}
          <div className="w-full border-t border-slate-200/80 my-5" />

          {/* 3 Tombol Aksi Disusun Vertikal */}
          <div className="w-full space-y-2.5">
            {/* 1. "Edit Profile" (Tombol isi warna Merah Marun/Primary dengan icon pensil) */}
            <button
              type="button"
              onClick={() => {
                setEditForm({
                  namaLengkap: profileData.namaLengkap,
                  username: profileData.username,
                  email: profileData.email,
                  noHp: profileData.noHp
                });
                setIsEditProfileOpen(true);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#701424] hover:bg-[#59101c] text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            {/* 2. "Upload Foto" (Tombol outline biru dengan icon kamera) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-50 text-sm font-semibold transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Upload Foto</span>
            </button>

            {/* 3. "Ganti Password" (Tombol outline abu-abu/dark dengan icon kunci) */}
            <button
              type="button"
              onClick={() => {
                setPasswordError('');
                setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setIsChangePasswordOpen(true);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-all cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Ganti Password</span>
            </button>
          </div>
        </div>

        {/* KOLOM KANAN (Informasi Akun) - 8 cols on large screen */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Header Card: Berwarna Merah Marun bertuliskan "Informasi Akun" dengan icon user */}
          <div className="bg-[#701424] text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-rose-200" />
              <h2 className="text-base font-bold tracking-wide">Informasi Akun</h2>
            </div>
            <span className="text-xs bg-white/15 px-2.5 py-1 rounded-lg text-rose-100 font-medium">
              Data Resmi Notariat
            </span>
          </div>

          {/* Tabel / List Informasi Detail */}
          <div className="p-6">
            <div className="divide-y divide-slate-100">
              {/* Row 1: Nama Lengkap */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-sm font-medium text-slate-500 w-44">
                  Nama Lengkap
                </span>
                <span className="text-sm font-bold text-slate-900 flex-1">
                  {profileData.namaLengkap}
                </span>
              </div>

              {/* Row 2: Username */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-sm font-medium text-slate-500 w-44">
                  Username
                </span>
                <span className="text-sm font-semibold font-mono text-slate-800 flex-1">
                  {profileData.username}
                </span>
              </div>

              {/* Row 3: Email */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-sm font-medium text-slate-500 w-44">
                  Email
                </span>
                <span className="text-sm font-medium text-slate-800 flex-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {profileData.email}
                </span>
              </div>

              {/* Row 4: Role (Badge Merah "Admin") */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-sm font-medium text-slate-500 w-44">
                  Role
                </span>
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-[#701424] border border-rose-200">
                    <Shield className="w-3.5 h-3.5 text-[#701424]" />
                    {profileData.role}
                  </span>
                </div>
              </div>

              {/* Row 5: Status (Badge Hijau "Aktif") */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-sm font-medium text-slate-500 w-44">
                  Status
                </span>
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {profileData.status}
                  </span>
                </div>
              </div>

              {/* Row 6: No HP */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-sm font-medium text-slate-500 w-44">
                  No HP
                </span>
                <span className="text-sm font-medium text-slate-800 flex-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {profileData.noHp}
                </span>
              </div>

              {/* Row 7: Tanggal Dibuat */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-sm font-medium text-slate-500 w-44">
                  Tanggal Dibuat
                </span>
                <span className="text-sm font-mono text-slate-700 flex-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {profileData.tanggalDibuat}
                </span>
              </div>
            </div>

            {/* Quick summary box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600">
              <Shield className="w-5 h-5 text-[#701424] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Hak Akses Penuh Sistem:</span> Akun Administrator memiliki kewenangan penuh untuk mengelola berkas notaris, menyetujui tahapan legalisasi, mengekspor laporan, serta mengelola akun staf.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: EDIT PROFILE */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#701424] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Pencil className="w-5 h-5 text-rose-200" />
                <h3 className="font-bold text-base">Edit Profil Administrator</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.namaLengkap}
                  onChange={(e) =>
                    setEditForm({ ...editForm, namaLengkap: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  No HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={editForm.noHp}
                  onChange={(e) =>
                    setEditForm({ ...editForm, noHp: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#701424] hover:bg-[#59101c] text-white text-xs font-semibold shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GANTI PASSWORD */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#701424] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-rose-200" />
                <h3 className="font-bold text-base">Ganti Password Akun</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password Lama <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    required
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value
                      })
                    }
                    placeholder="Masukkan password saat ini"
                    className="w-full pl-3.5 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showOldPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value
                      })
                    }
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-3.5 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Konfirmasi Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value
                      })
                    }
                    placeholder="Ketik ulang password baru"
                    className="w-full pl-3.5 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#701424]/20 focus:border-[#701424]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#701424] hover:bg-[#59101c] text-white text-xs font-semibold shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  Perbarui Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
