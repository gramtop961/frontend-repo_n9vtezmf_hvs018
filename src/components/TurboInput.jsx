import React, { useState } from 'react';
import { Receipt, Plus } from 'lucide-react';

function parseQuickLog(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/\s+/);
  // find first numeric (allow leading $)
  let amount = NaN;
  let amountIndex = -1;
  for (let i = 0; i < parts.length; i++) {
    const cleaned = parts[i].replace(/^[^0-9-.]*/g, '');
    const val = parseFloat(cleaned);
    if (!Number.isNaN(val)) {
      amount = Math.abs(val);
      amountIndex = i;
      break;
    }
  }
  if (Number.isNaN(amount)) return null;
  const rest = parts.filter((_, i) => i !== amountIndex);
  const category = (rest[0] || 'general').toLowerCase();
  const description = rest.slice(1).join(' ');
  return {
    amount,
    category,
    description: description || category,
  };
}

export default function TurboInput({ onAdd }) {
  const [value, setValue] = useState('');
  const [hint, setHint] = useState('15.50 coffee starbucks');

  const examples = [
    '12 lunch tacos',
    '3.99 coffee starbucks',
    '48.20 groceries trader-joes',
    '25 transport metro',
  ];

  function cycleHint() {
    const idx = Math.floor(Math.random() * examples.length);
    setHint(examples[idx]);
  }

  function submit(e) {
    e.preventDefault();
    const parsed = parseQuickLog(value);
    if (parsed) {
      onAdd(parsed);
      setValue('');
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2">
            <Receipt className="h-5 w-5 text-white/70" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={cycleHint}
              className="w-full bg-transparent text-white placeholder-white/40 outline-none"
              placeholder={hint}
              aria-label="Quick log input"
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 shadow hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>
      <p className="mt-2 text-xs text-white/60">
        Tip: first number is the amount, first word after that is the category.
      </p>
    </div>
  );
}
