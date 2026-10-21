import React from 'react';
import { FolderKanban, Hourglass, RefreshCw, CheckCircle2 } from 'lucide-react';
import { BerkasStatus } from '../types/notary';

interface StatCardsProps {
  total: number;
  pending: number;
  diproses: number;
  selesai: number;
  selectedFilter: BerkasStatus | 'All';
  onFilterChange: (status: BerkasStatus | 'All') => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  total,
  pending,
  diproses,
  selesai,
  selectedFilter,
  onFilterChange
}) => {
  const cards = [
    {
      id: 'All',
      label: 'Total Berkas',
      count: total,
      subtext: 'Seluruh berkas terdaftar',
      icon: FolderKanban,
      // Ikon folder biru dengan latar belakang biru terang
      iconBg: 'bg-blue-50 text-blue-600',
      activeRing: 'ring-2 ring-blue-500/50 bg-blue-50/20'
    },
    {
      id: 'Pending',
      label: 'Pending',
      count: pending,
      subtext: 'Menunggu kelengkapan syarat',
      icon: Hourglass,
      // Ikon jam pasir oranye/kuning dengan latar belakang oranye/kuning terang
      iconBg: 'bg-amber-50 text-amber-600',
      activeRing: 'ring-2 ring-amber-500/50 bg-amber-50/20'
    },
    {
      id: 'Diproses',
      label: 'Diproses',
      count: diproses,
      subtext: 'Dalam pengerjaan & review',
      icon: RefreshCw,
      // Ikon sync/refresh biru muda dengan latar belakang biru muda terang
      iconBg: 'bg-sky-50 text-sky-600',
      activeRing: 'ring-2 ring-sky-500/50 bg-sky-50/20'
    },
    {
      id: 'Selesai',
      label: 'Selesai',
      count: selesai,
      subtext: 'Akta disahkan & diambil',
      icon: CheckCircle2,
      // Ikon centang hijau dengan latar belakang hijau terang
      iconBg: 'bg-emerald-50 text-emerald-600',
      activeRing: 'ring-2 ring-emerald-500/50 bg-emerald-50/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => {
              if (isSelected && card.id !== 'All') {
                onFilterChange('All');
              } else {
                onFilterChange(card.id as BerkasStatus | 'All');
              }
            }}
            className={`w-full text-left bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
              isSelected ? card.activeRing : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">{card.label}</span>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                {card.count}
              </span>
              <span className="text-xs text-slate-500 font-medium">berkas</span>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate">{card.subtext}</span>
              {isSelected && card.id !== 'All' && (
                <span className="text-[#701424] font-bold shrink-0">Aktif</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
