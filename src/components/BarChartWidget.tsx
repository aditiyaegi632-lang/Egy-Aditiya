import React, { useState } from 'react';
import { ChevronDown, BarChart3, TrendingUp, Info } from 'lucide-react';
import { MONTHLY_STATS_2026, MONTHLY_STATS_2025 } from '../data/mockData';
import { MonthlyChartData } from '../types/notary';

interface BarChartWidgetProps {
  onSelectMonth?: (monthName: string) => void;
}

export const BarChartWidget: React.FC<BarChartWidgetProps> = ({ onSelectMonth }) => {
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025'>('2026');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(8); // default hover to September (index 8)

  const data: MonthlyChartData[] = selectedYear === '2026' ? MONTHLY_STATS_2026 : MONTHLY_STATS_2025;
  const maxVal = Math.max(...data.map(d => d.total), 30);

  const activeMonthData = hoveredIndex !== null ? data[hoveredIndex] : data[8];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between h-full">
      {/* Header with Title and Year Badge Selector */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              Statistik Berkas
            </h3>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Tren bulanan akta & legalisasi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Menampilkan volume berkas masuk per bulan
          </p>
        </div>

        {/* Pilihan badge tahun "2026" di pojok kanan atas grafik */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-[#701424] hover:bg-rose-100/80 font-bold text-xs border border-rose-200 transition-colors shadow-2xs"
          >
            <span>{selectedYear}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showYearDropdown && (
            <div className="absolute right-0 mt-1.5 w-28 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30">
              <button
                type="button"
                onClick={() => {
                  setSelectedYear('2026');
                  setShowYearDropdown(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${
                  selectedYear === '2026' ? 'text-[#701424] bg-rose-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Tahun 2026
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedYear('2025');
                  setShowYearDropdown(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${
                  selectedYear === '2025' ? 'text-[#701424] bg-rose-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Tahun 2025
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="mt-4 flex-1 min-h-[220px] flex flex-col justify-end">
        {/* Tooltip info banner */}
        {activeMonthData && (
          <div className="mb-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800">
              {activeMonthData.bulan} {selectedYear}: <span className="font-bold text-[#701424]">{activeMonthData.total} Berkas</span>
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Selesai: <strong>{activeMonthData.selesai}</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                Diproses: <strong>{activeMonthData.diproses}</strong>
              </span>
              {activeMonthData.pending > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Pending: <strong>{activeMonthData.pending}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Interactive Bars */}
        <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2.5 px-1 pt-6 pb-2 border-b border-slate-100">
          {data.map((item, index) => {
            const heightPercent = Math.max((item.total / maxVal) * 100, item.total > 0 ? 10 : 3);
            const isHovered = hoveredIndex === index;
            // Highlight Agu & Sep 2026 as mentioned in prompt
            const isFocusMonth = item.singkatan === 'Agu' || item.singkatan === 'Sep';

            return (
              <div
                key={item.singkatan}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => onSelectMonth && onSelectMonth(item.bulan)}
              >
                {/* Bar */}
                <div className="w-full max-w-[28px] relative flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-200 relative overflow-hidden ${
                      isFocusMonth
                        ? isHovered
                          ? 'bg-[#701424] shadow-md'
                          : 'bg-[#8d1d32]'
                        : isHovered
                        ? 'bg-slate-400'
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                  >
                    {/* Top cap shine */}
                    <div className="w-full h-1 bg-white/30" />
                  </div>
                </div>

                {/* X Axis Label */}
                <span
                  className={`mt-2 text-[11px] font-semibold tracking-tight transition-colors ${
                    isFocusMonth ? 'text-[#701424] font-bold' : isHovered ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {item.singkatan}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#701424]" />
              <span className="font-medium text-[11px]">Bulan Aktif ({selectedYear})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-300" />
              <span className="font-medium text-[11px]">Bulan Lainnya</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Total Akta: {data.reduce((a, b) => a + b.total, 0)} Berkas</span>
        </div>
      </div>
    </div>
  );
};
