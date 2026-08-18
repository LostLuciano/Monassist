import { useEffect, useMemo, useRef, useState } from 'react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface TransactionCalendarProps {
  transactions: Transaction[];
  month: Date;
  onMonthChange: (month: Date) => void;
}

interface DayStats {
  income: number;
  expense: number;
  transactions: Transaction[];
}

const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTransactionDateKey = (transaction: Transaction) => {
  const rawDate = transaction.transaction_date || (transaction as any).date || '';
  return rawDate ? rawDate.split('T')[0] : '';
};

const getMonthRange = (month: Date) => {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  return { start: toDateKey(start), end: toDateKey(end) };
};

export const getTransactionCalendarRange = getMonthRange;

const getCalendarDays = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
};

export default function TransactionCalendar({ transactions, month, onMonthChange }: TransactionCalendarProps) {
  const todayKey = toDateKey(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  const statsByDay = useMemo(() => {
    return transactions.reduce<Record<string, DayStats>>((acc, transaction) => {
      const dateKey = getTransactionDateKey(transaction);
      if (!dateKey) return acc;

      if (!acc[dateKey]) {
        acc[dateKey] = { income: 0, expense: 0, transactions: [] };
      }

      const amount = Number(transaction.amount) || 0;
      if (transaction.type === 'income') {
        acc[dateKey].income += amount;
      } else {
        acc[dateKey].expense += amount;
      }
      acc[dateKey].transactions.push(transaction);

      return acc;
    }, {});
  }, [transactions]);

  const calendarDays = useMemo(() => getCalendarDays(month), [month]);
  const selectedStats = selectedDateKey ? statsByDay[selectedDateKey] || { income: 0, expense: 0, transactions: [] } : null;
  const selectedDate = selectedDateKey ? new Date(`${selectedDateKey}T00:00:00`) : null;
  const selectedNet = selectedStats ? selectedStats.income - selectedStats.expense : 0;
  const monthTitle = `${monthLabels[month.getMonth()]} ${month.getFullYear()}`;

  useEffect(() => {
    if (!selectedDateKey) return;
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, [selectedDateKey]);

  const goToMonth = (offset: number) => {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    onMonthChange(nextMonth);
    setSelectedDateKey(null);
  };

  const getDaySignal = (stats?: DayStats) => {
    const income = stats?.income || 0;
    const expense = stats?.expense || 0;
    const total = income + expense;

    if (!total) {
      return null;
    }

    const isIncomeDominant = income >= expense;
    const dominant = isIncomeDominant ? income : expense;
    return {
      percent: Math.round((dominant / total) * 100),
      isIncomeDominant
    };
  };

  return (
    <section className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-white">Kalender</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-slate-300 transition-colors hover:text-white"
            aria-label="Bulan sebelumnya"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="min-w-20 text-center text-xs font-black text-slate-200">{monthTitle}</span>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-slate-300 transition-colors hover:text-white"
            aria-label="Bulan berikutnya"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {dayLabels.map((day) => (
          <div key={day} className="pb-2 text-[10px] font-bold text-slate-500">
            {day}
          </div>
        ))}

        {calendarDays.map((date) => {
          const dateKey = toDateKey(date);
          const stats = statsByDay[dateKey];
          const signal = getDaySignal(stats);
          const isSelected = selectedDateKey === dateKey;
          const isCurrentMonth = date.getMonth() === month.getMonth();
          const isToday = todayKey === dateKey;
          const toneClass = signal?.isIncomeDominant ? 'text-emerald-300' : 'text-rose-300';
          const barClass = signal?.isIncomeDominant ? 'bg-emerald-400' : 'bg-rose-400';

          return (
            <button
              type="button"
              key={dateKey}
              onClick={() => setSelectedDateKey(dateKey)}
              className={`relative flex min-h-[58px] flex-col items-center justify-center rounded-xl border px-1 transition-all ${
                isSelected
                  ? 'border-slate-400 bg-slate-800/80 text-white'
                  : 'border-transparent text-slate-300 md:hover:border-slate-700 md:hover:bg-slate-800/50'
              } ${isCurrentMonth ? '' : 'opacity-35'}`}
            >
              <span className={`text-xs font-black ${isToday && !isSelected ? 'text-teal-300' : ''}`}>
                {date.getDate()}
              </span>

              {signal && (
                <span className="mt-1 flex w-full flex-col items-center gap-1">
                  <span className={`text-[10px] font-black leading-none ${toneClass}`}>
                    {signal.percent}%
                  </span>
                  <span className="h-1 w-8 overflow-hidden rounded-full bg-slate-950">
                    <span className={`block h-full rounded-full ${barClass}`} style={{ width: `${signal.percent}%` }} />
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && selectedStats && (
      <div ref={detailRef} className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-400">
              {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className={`mt-1 text-lg font-black ${selectedNet >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {formatCurrency(selectedNet)}
            </p>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold text-slate-300">
            {selectedStats.transactions.length} transaksi
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-3">
            <p className="text-[10px] font-bold text-emerald-300">Pemasukan</p>
            <p className="mt-1 text-sm font-black text-white">{formatCurrency(selectedStats.income)}</p>
          </div>
          <div className="rounded-xl bg-rose-500/10 p-3">
            <p className="text-[10px] font-bold text-rose-300">Pengeluaran</p>
            <p className="mt-1 text-sm font-black text-white">{formatCurrency(selectedStats.expense)}</p>
          </div>
        </div>

        {selectedStats.transactions.length > 0 ? (
          <div className="mt-4 divide-y divide-slate-800">
            {selectedStats.transactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white">
                    {transaction.description || transaction.category?.name || 'Transaksi'}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {transaction.category?.name || 'Lainnya'}
                  </p>
                </div>
                <p className={`shrink-0 text-xs font-black ${transaction.type === 'income' ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount) || 0)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-slate-800 px-3 py-4 text-center text-xs text-slate-500">
            Belum ada transaksi di tanggal ini.
          </p>
        )}
      </div>
      )}
    </section>
  );
}
