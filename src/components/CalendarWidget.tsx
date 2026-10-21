import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { NOTARY_AGENDA } from '../data/mockData';

interface CalendarWidgetProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  selectedDate,
  onSelectDate
}) => {
  // Default to September 2026 as per specification
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 is September (0-indexed: 0=Jan, 8=Sep)

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Calculate days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      month: currentMonth - 1,
      year: currentMonth === 0 ? currentYear - 1 : currentYear,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true
    });
  }

  // Next month leading days to complete 35 or 42 cells
  const remaining = 35 - calendarDays.length;
  const targetTotal = remaining >= 0 ? 35 : 42;
  const toAdd = targetTotal - calendarDays.length;
  for (let i = 1; i <= toAdd; i++) {
    calendarDays.push({
      day: i,
      month: currentMonth + 1,
      year: currentMonth === 11 ? currentYear + 1 : currentYear,
      isCurrentMonth: false
    });
  }

  // Format date string YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Find agenda for selected date
  const selectedAgenda = NOTARY_AGENDA.filter(a => a.tanggal === selectedDate);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between h-full">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#701424]" />
          <h3 className="font-bold text-base text-slate-900 tracking-tight">
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Bulan sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentYear(2026);
              setCurrentMonth(8); // Reset to Sep 2026
              onSelectDate('2026-09-22');
            }}
            className="px-2 py-1 text-[11px] font-semibold text-[#701424] hover:bg-rose-50 rounded-md"
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Bulan berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center py-2 text-xs font-semibold text-slate-400">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className={idx === 0 ? 'text-rose-400' : ''}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dateObj, idx) => {
          const dateStr = formatDateString(dateObj.year, dateObj.month, dateObj.day);
          const isSelected = dateStr === selectedDate;
          // Prompt explicitly marks "22 September 2026" as active/example
          const isToday = dateStr === '2026-09-22';
          const hasAgenda = NOTARY_AGENDA.some(a => a.tanggal === dateStr);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(dateStr)}
              className={`h-8 sm:h-9 w-full rounded-xl flex flex-col items-center justify-center relative text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#701424] text-white font-bold shadow-sm'
                  : isToday
                  ? 'bg-rose-100/70 text-[#701424] font-bold ring-1 ring-[#701424]/30'
                  : dateObj.isCurrentMonth
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{dateObj.day}</span>
              {/* Event indicator dot */}
              {hasAgenda && (
                <span
                  className={`w-1 h-1 rounded-full absolute bottom-1 ${
                    isSelected ? 'bg-white' : 'bg-[#701424]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Agenda / Notary Schedule */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-800">
            Agenda: {selectedDate === '2026-09-22' ? '22 September 2026 (Hari Ini)' : selectedDate}
          </span>
          <span className="text-[10px] text-slate-400">{selectedAgenda.length} Jadwal</span>
        </div>

        {selectedAgenda.length > 0 ? (
          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {selectedAgenda.map((ag) => (
              <div
                key={ag.id}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50/40 border border-slate-100 text-xs transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 truncate">{ag.judul}</span>
                  <span className="text-[10px] font-bold text-[#701424] shrink-0 font-mono">
                    {ag.jam}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Klien: {ag.klien}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-2 text-center">
            Tidak ada jadwal penandatanganan pada tanggal ini.
          </p>
        )}
      </div>
    </div>
  );
};
