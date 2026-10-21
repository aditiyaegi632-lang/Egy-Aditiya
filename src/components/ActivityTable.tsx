import React from 'react';
import { Clock, History, CheckCircle2, Upload, FileEdit, PlusCircle } from 'lucide-react';
import { AktivitasItem } from '../types/notary';

interface ActivityTableProps {
  activities: AktivitasItem[];
  onSelectBerkasNo?: (noBerkas: string) => void;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  onSelectBerkasNo
}) => {
  const getIcon = (type: AktivitasItem['tipe']) => {
    switch (type) {
      case 'approval':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'upload':
        return <Upload className="w-3.5 h-3.5 text-blue-600" />;
      case 'create':
        return <PlusCircle className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <FileEdit className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between h-full">
      {/* Table Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base text-slate-900 tracking-tight">
            Aktivitas Terbaru
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Log tindakan staf dan pengesahan notaris
          </p>
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <History className="w-3.5 h-3.5" />
          <span>Real-time</span>
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto mt-2 flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Pengguna</th>
              <th className="py-2.5 px-3">Aktivitas</th>
              <th className="py-2.5 px-3 text-right">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {activities.map((act) => (
              <tr key={act.id} className="hover:bg-slate-50/70 transition-colors group">
                {/* Kolom 1: Pengguna */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-rose-50 text-[#701424] font-bold text-[11px] flex items-center justify-center ring-1 ring-rose-200/60 shrink-0">
                      {act.pengguna.nama.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">
                        {act.pengguna.nama}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {act.pengguna.peran}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Kolom 2: Aktivitas */}
                <td className="py-3 px-3">
                  <div className="flex items-start gap-1.5">
                    <span className="mt-0.5 shrink-0">{getIcon(act.tipe)}</span>
                    <div>
                      <p className="text-xs text-slate-700 leading-snug">
                        {act.aktivitas}
                      </p>
                      {act.detailBerkas && (
                        <button
                          type="button"
                          onClick={() => onSelectBerkasNo && onSelectBerkasNo(act.detailBerkas!)}
                          className="mt-0.5 inline-block text-[11px] font-mono text-[#701424] hover:underline font-medium"
                        >
                          {act.detailBerkas}
                        </button>
                      )}
                    </div>
                  </div>
                </td>

                {/* Kolom 3: Waktu */}
                <td className="py-3 px-3 text-right whitespace-nowrap text-[11px] text-slate-500 font-mono tabular-nums">
                  <div className="flex items-center justify-end gap-1 text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{act.waktu}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
