import React from 'react';
import { Home, PencilLine, Gauge, Wallet, Star } from 'lucide-react';

const links = [
  { href: '#/', label: 'Home', Icon: Home },
  { href: '#/log', label: 'Log', Icon: PencilLine },
  { href: '#/thermometer', label: 'Thermometer', Icon: Gauge },
  { href: '#/envelopes', label: 'Envelopes', Icon: Wallet },
  { href: '#/pricing', label: 'Pricing', Icon: Star },
];

export default function NavBar({ current }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#/" className="text-sm font-semibold text-white">
          Quick Log
        </a>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, Icon }) => {
            const active = current === href.replace('#', '');
            return (
              <a
                key={href}
                href={href}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
