import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  X,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserAccount } from '../types/notary';

interface UsersPageProps {
  users: UserAccount[];
  onAddUser: (user: UserAccount) => void;
  onEditUser: (user: UserAccount) => void;
  onDeleteUser: (id: string) => void;
  onBackToDashboard: () => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onBackToDashboard
}) => {
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    passwordDisplay: '',
    role: 'Karyawan' as 'Admin' | 'Karyawan'
  });
  const [showPassword, setShowPassword] = useState(false);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleOpenAdd = () => {
    setFormData({
      username: '',
      email: '',
      passwordDisplay: '',
      role: 'Karyawan'
    });
    setShowPassword(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      passwordDisplay: user.passwordDisplay,
      role: user.role
    });
    setShowPassword(false);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.email.trim() || !formData.passwordDisplay.trim()) {
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      username: formData.username.trim(),
      email: formData.email.trim(),
      passwordDisplay: formData.passwordDisplay.trim(),
      role: formData.role,
      dibuat: formattedDate
    };

    onAddUser(newUser);
    setIsAddModalOpen(false);
    showNotification(`Pengguna "${newUser.username}" berhasil ditambahkan.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated: UserAccount = {
      ...editingUser,
      username: formData.username.trim(),
      email: formData.email.trim(),
      passwordDisplay: formData.passwordDisplay.trim(),
      role: formData.role
    };

    onEditUser(updated);
    setEditingUser(null);
    showNotification(`Data pengguna "${updated.username}" berhasil diperbarui.`);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    const target = users.find((u) => u.id === deletingId);
    onDeleteUser(deletingId);
    setDeletingId(null);
    showNotification(`Pengguna "${target?.username || ''}" berhasil dihapus.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="hover:text-[#701424] font-medium flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
        <span>/</span>
        <span className="text-[#701424] font-bold">Pengguna</span>
      </div>

      {/* 1. JUDUL HALAMAN & TOMBOL AKSI KANAN ATAS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Kelola data akun, peran pengguna, dan kredensial sistem kantor notaris
          </p>
        </div>

        {/* Tombol Aksi Kanan Atas: Hanya 1 tombol utama "+ Tambah Pengguna" (Warna Biru / Primary dengan icon tambah) */}
        <div className="self-start sm:self-auto">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(37,99,235,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* 2. TABEL DATA PENGGUNA (Tanpa Kartu Statistik & Tanpa Filter/Search Bar di atas tabel) */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            {/* Header Tabel (Rata Tengah / Bold) */}
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200/80 text-[12px] font-bold text-slate-700 tracking-wider">
                <th className="py-3.5 px-4 w-14 text-center font-bold">No</th>
                <th className="py-3.5 px-4 text-center font-bold">Username</th>
                <th className="py-3.5 px-4 text-center font-bold">Email</th>
                <th className="py-3.5 px-4 text-center font-bold">Password</th>
                <th className="py-3.5 px-4 text-center font-bold">Role</th>
                <th className="py-3.5 px-4 text-center font-bold">Dibuat</th>
                <th className="py-3.5 px-4 text-center font-bold w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* No */}
                    <td className="py-4 px-4 text-center font-mono font-semibold text-slate-500">
                      {index + 1}
                    </td>

                    {/* Username */}
                    <td className="py-4 px-4 text-center font-bold text-slate-900 whitespace-nowrap">
                      {user.username}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 text-center text-slate-600 whitespace-nowrap font-medium">
                      {user.email}
                    </td>

                    {/* Password: Tag/Badge abu-abu (contoh: "@Semangat123") */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="inline-block px-3 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-200/90 shadow-2xs">
                        {user.passwordDisplay}
                      </span>
                    </td>

                    {/* Role: Badge warna (Merah Marun untuk "Admin", Biru untuk "Karyawan") */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {user.role === 'Admin' ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#701424] text-white shadow-2xs">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-2xs">
                          Karyawan
                        </span>
                      )}
                    </td>

                    {/* Dibuat: Format Tanggal & Jam (contoh: 2026-07-02 19:15:50) */}
                    <td className="py-4 px-4 text-center font-mono text-slate-600 whitespace-nowrap text-xs">
                      {user.dibuat}
                    </td>

                    {/* Aksi: 2 Tombol Icon bersebelahan:
                        1. Icon Pensil (Warna Kuning/Emas) - Edit Pengguna
                        2. Icon Tempat Sampah (Warna Merah) - Hapus Pengguna
                    */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center justify-center gap-2">
                        {/* 1. Icon Pensil (Warna Kuning/Emas) - Edit Pengguna */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-500 hover:text-amber-600 border border-amber-200/80 transition-all cursor-pointer shadow-2xs"
                          title="Edit Pengguna"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* 2. Icon Tempat Sampah (Warna Merah) - Hapus Pengguna */}
                        <button
                          type="button"
                          onClick={() => setDeletingId(user.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-200/80 transition-all cursor-pointer shadow-2xs"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600 text-sm">
                      Belum ada data pengguna
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Klik tombol "+ Tambah Pengguna" untuk menambahkan pengguna baru.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total Pengguna Terdaftar: <strong className="text-slate-800 font-bold">{users.length}</strong>
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#701424]" />
              <span className="font-medium text-slate-600">Admin: {users.filter(u => u.role === 'Admin').length}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="font-medium text-slate-600">Karyawan: {users.filter(u => u.role === 'Karyawan').length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Modal Tambah Pengguna */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Tambah Pengguna Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Contoh: Administrator, StaffLegal"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contoh: kantornotaris.sam@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.passwordDisplay}
                    onChange={(e) => setFormData({ ...formData, passwordDisplay: e.target.value })}
                    placeholder="Contoh: @Semangat123"
                    className="w-full pl-9 pr-9 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Role / Peran <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formData.role === 'Admin'
                        ? 'border-[#701424] bg-rose-50/50 text-[#701424] font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="Admin"
                      checked={formData.role === 'Admin'}
                      onChange={() => setFormData({ ...formData, role: 'Admin' })}
                      className="text-[#701424]"
                    />
                    <span>Admin (Merah Marun)</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formData.role === 'Karyawan'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="Karyawan"
                      checked={formData.role === 'Karyawan'}
                      onChange={() => setFormData({ ...formData, role: 'Karyawan' })}
                      className="text-blue-600"
                    />
                    <span>Karyawan (Biru)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pengguna */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Edit Data Pengguna</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.passwordDisplay}
                    onChange={(e) => setFormData({ ...formData, passwordDisplay: e.target.value })}
                    className="w-full pl-3 pr-9 py-2 font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Role / Peran <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formData.role === 'Admin'
                        ? 'border-[#701424] bg-rose-50/50 text-[#701424] font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="edit-role"
                      value="Admin"
                      checked={formData.role === 'Admin'}
                      onChange={() => setFormData({ ...formData, role: 'Admin' })}
                      className="text-[#701424]"
                    />
                    <span>Admin (Merah Marun)</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      formData.role === 'Karyawan'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="edit-role"
                      value="Karyawan"
                      checked={formData.role === 'Karyawan'}
                      onChange={() => setFormData({ ...formData, role: 'Karyawan' })}
                      className="text-blue-600"
                    />
                    <span>Karyawan (Biru)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Hapus Pengguna?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun pengguna ini? Akses pengguna ke dalam sistem akan dinonaktifkan.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
