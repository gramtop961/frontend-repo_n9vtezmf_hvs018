import React from 'react';
import { Gauge } from 'lucide-react';

export default function BudgetThermometer({ totalSpent, totalLimit, onChangeLimit }) {
  const pct = Math.min(100, totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0);
  const barColor = pct < 70 ? 'bg-emerald-500' : pct < 100 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-white/80" />
          <h3 className="text-sm font-medium text-white/80">Budget Thermometer</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span className="hidden sm:inline">Monthly limit</span>
          <input
            type="number"
            min={0}
            className="w-28 rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1 text-right text-white outline-none"
            value={Number.isFinite(totalLimit) ? totalLimit : 0}
            onChange={(e) => onChangeLimit(Math.max(0, Number(e.target.value)))}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="h-3 w-full rounded-full bg-white/10">
          <div
            className={`h-3 rounded-full ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-white/70">
          <span>Spent: ${totalSpent.toFixed(2)}</span>
          <span>Limit: ${totalLimit.toFixed(2)} • {pct}%</span>
        </div>
      </div>
    </div>
  );
}
