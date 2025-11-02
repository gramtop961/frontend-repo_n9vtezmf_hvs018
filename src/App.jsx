import React, { useEffect, useMemo, useState } from 'react';
import Hero3D from './components/Hero3D';
import TurboInput from './components/TurboInput';
import BudgetThermometer from './components/BudgetThermometer';
import EnvelopesGrid from './components/EnvelopesGrid';
import NavBar from './components/NavBar';

function useHashRoute() {
  const getPath = () => (window.location.hash.replace('#', '') || '/');
  const [route, setRoute] = useState(getPath());
  useEffect(() => {
    const onHash = () => setRoute(getPath());
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) window.location.hash = '#/';
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return [route, setRoute];
}

export default function App() {
  const [route] = useHashRoute();

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
      <NavBar current={route} />

      <main className="mx-auto max-w-6xl space-y-8 p-6">
        {route === '/' && (
          <>
            <Hero3D />
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Turbo-Input System</h3>
                <p className="mt-2 text-white/70">
                  Log expenses with a single line like "15.50 coffee starbucks". Pure arithmetic. Pure control.
                </p>
                <a href="#/log" className="mt-4 inline-block rounded-lg bg-emerald-500 px-4 py-2 text-emerald-950">Try it</a>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Visual Accountability</h3>
                <p className="mt-2 text-white/70">See impact instantly with a Budget Thermometer and Envelope System.</p>
                <div className="mt-4 flex gap-3">
                  <a href="#/thermometer" className="rounded-lg bg-white/10 px-4 py-2">Thermometer</a>
                  <a href="#/envelopes" className="rounded-lg bg-white/10 px-4 py-2">Envelopes</a>
                </div>
              </div>
            </section>
            <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 p-6">
              <h3 className="text-lg font-semibold">Freemium</h3>
              <p className="mt-2 text-white/70">Free: core logging, thermometer, 5 envelopes. Pro: unlimited envelopes, filters, export, shared budgets.</p>
              <a href="#/pricing" className="mt-4 inline-block rounded-lg bg-white/90 px-4 py-2 text-slate-900">See Pricing</a>
            </section>
          </>
        )}

        {route === '/log' && (
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
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 p-4 text-sm text-white/70">
                <p className="font-medium text-white">Tips</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>First number is amount, next word is category.</li>
                  <li>Short, memorable categories keep it fast.</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {route === '/thermometer' && (
          <section>
            <BudgetThermometer totalSpent={totalSpent} totalLimit={totalLimit} onChangeLimit={setTotalLimit} />
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70">
              <p>
                This view shows your total spend for the month against a limit. Colors shift from green to amber to red as you approach or exceed the budget.
              </p>
            </div>
          </section>
        )}

        {route === '/envelopes' && (
          <section>
            <EnvelopesGrid
              envelopes={envelopes}
              totals={totalsByEnvelope}
              onSetLimit={setEnvelopeLimit}
              onAddEnvelope={addEnvelope}
            />
          </section>
        )}

        {route === '/pricing' && (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Pricing</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5">
                <h3 className="text-lg font-medium">Free</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-white/70">
                  <li>Turbo-Input System</li>
                  <li>Budget Thermometer</li>
                  <li>Up to 5 Envelopes</li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                <h3 className="text-lg font-medium text-emerald-300">Pro</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
                  <li>Unlimited categories</li>
                  <li>Advanced filtering</li>
                  <li>Data export</li>
                  <li>Shared budget</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        <footer className="py-8 text-center text-xs text-white/50">
          Built for speed — your data stays in your control.
        </footer>
      </main>
    </div>
  );
}
