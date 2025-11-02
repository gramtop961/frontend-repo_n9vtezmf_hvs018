import React, { useState } from 'react';
import { Wallet, Plus } from 'lucide-react';

export default function EnvelopesGrid({ envelopes, onSetLimit, onAddEnvelope, totals }) {
  const [newName, setNewName] = useState('');
  const [newLimit, setNewLimit] = useState('');

  function addEnvelope(e) {
    e.preventDefault();
    const name = newName.trim().toLowerCase();
    const limit = Number(newLimit) || 0;
    if (!name) return;
    onAddEnvelope(name, limit);
    setNewName('');
    setNewLimit('');
  }

  const sorted = Object.keys(envelopes).sort((a, b) => a.localeCompare(b));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-white/80" />
          <h3 className="text-sm font-medium text-white/80">Envelope Budgeting</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((key) => {
          const limit = envelopes[key] ?? 0;
          const spent = totals[key] ?? 0;
          const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
          const barColor = pct < 70 ? 'bg-emerald-500' : pct < 100 ? 'bg-amber-500' : 'bg-rose-500';
          return (
            <div key={key} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-white">
                <span className="capitalize">{key}</span>
                <span className="text-sm text-white/70">${spent.toFixed(2)}</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                <span>Limit</span>
                <input
                  type="number"
                  min={0}
                  className="w-24 rounded-lg border border-white/10 bg-slate-950/60 px-2 py-1 text-right text-white outline-none"
                  value={limit}
                  onChange={(e) => onSetLimit(key, Math.max(0, Number(e.target.value)))}
                />
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={addEnvelope} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white placeholder-white/40 outline-none"
            placeholder="Add envelope (e.g., subscriptions)"
          />
        </div>
        <input
          type="number"
          min={0}
          value={newLimit}
          onChange={(e) => setNewLimit(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white placeholder-white/40 outline-none sm:w-40"
          placeholder="Limit"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-slate-900 shadow hover:bg-white"
        >
          <Plus className="h-4 w-4" />
          Add Envelope
        </button>
      </form>
    </div>
  );
}
