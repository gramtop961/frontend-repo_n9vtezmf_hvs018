import React, { useMemo, useState } from 'react';
import Hero3D from './components/Hero3D';
import TurboInput from './components/TurboInput';
import BudgetThermometer from './components/BudgetThermometer';
import EnvelopesGrid from './components/EnvelopesGrid';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [totalLimit, setTotalLimit] = useState(2000);
  const [envelopes, setEnvelopes] = useState({
    groceries: 400,
    coffee: 60,
    transport: 120,
    dining: 200,
    fun: 150,
  });

  const totalsByEnvelope = useMemo(() => {
    const t = {};
    for (const tx of transactions) {
      const key = tx.category.toLowerCase();
      t[key] = (t[key] || 0) + tx.amount;
    }
    return t;
  }, [transactions]);

  const totalSpent = useMemo(() => transactions.reduce((sum, t) => sum + t.amount, 0), [transactions]);

  function handleAdd({ amount, category, description }) {
    const tx = {
      id: crypto.randomUUID(),
      amount,
      category,
      description,
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);
    setEnvelopes((prev) => (prev[category] == null ? { ...prev, [category]: 0 } : prev));
  }

  function setEnvelopeLimit(name, value) {
    setEnvelopes((prev) => ({ ...prev, [name]: value }));
  }

  function addEnvelope(name, limit) {
    setEnvelopes((prev) => ({ ...prev, [name]: limit }));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl space-y-8 p-6">
        <Hero3D />

        <section className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <TurboInput onAdd={handleAdd} />
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <h3 className="mb-2 text-sm font-medium text-white/80">Recent</h3>
              {transactions.length === 0 ? (
                <p className="text-sm text-white/60">No entries yet. Try typing "15.50 coffee starbucks".</p>
              ) : (
                <ul className="divide-y divide-white/10">
                  {transactions.map((t) => (
                    <li key={t.id} className="flex items-center justify-between py-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm">
                          <span className="font-medium capitalize text-white/90">{t.category}</span>
                          <span className="text-white/50"> • {t.description}</span>
                        </p>
                        <p className="text-xs text-white/50">{new Date(t.date).toLocaleString()}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold">${t.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <BudgetThermometer totalSpent={totalSpent} totalLimit={totalLimit} onChangeLimit={setTotalLimit} />
            <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 p-4 text-sm text-white/70">
              <p className="font-medium text-white">Freemium</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Free: core logging, thermometer, 5 envelopes</li>
                <li>Pro: unlimited envelopes, advanced filters, export, shared budgets</li>
              </ul>
            </div>
          </div>
        </section>

        <EnvelopesGrid
          envelopes={envelopes}
          totals={totalsByEnvelope}
          onSetLimit={setEnvelopeLimit}
          onAddEnvelope={addEnvelope}
        />

        <footer className="py-8 text-center text-xs text-white/50">
          Built for speed — your data stays in your control.
        </footer>
      </div>
    </div>
  );
}
