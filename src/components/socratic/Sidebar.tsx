import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Brain, BadgeCheck, ScrollText, Settings } from 'lucide-react';
import { useLearningState } from '@/lib/learning-state-context';

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/engine', label: 'Engine', icon: Brain },
  { to: '/skill-passport', label: 'Skill Passport', icon: BadgeCheck },
  { to: '/architecture-log', label: 'Architecture Log', icon: ScrollText },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { state } = useLearningState();

  return (
    <aside className="hidden lg:flex h-screen w-64 shrink-0 flex-col border-r border-glass-border bg-[oklch(0.10_0.03_270/0.6)] backdrop-blur-xl px-5 py-7 transition-colors duration-700">
      <div className="mb-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Socratic // OS
        </div>
        <div className="mt-1 text-xl font-semibold tracking-tight">
          The Socratic <span className="text-state-accent transition-colors duration-700">Engine</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ${
                active
                  ? 'bg-white/5 text-foreground'
                  : 'text-muted-foreground hover:bg-white/[0.03] hover:text-foreground'
              }`}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full transition-colors duration-700"
                  style={{ background: 'var(--state-accent)', boxShadow: '0 0 12px var(--state-glow)' }}
                />
              )}
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              <span className={active ? 'font-medium' : ''}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-glass-border bg-white/[0.02] p-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          AI Status
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full transition-colors duration-700"
            style={{ background: 'var(--state-accent)', boxShadow: '0 0 10px var(--state-glow)' }}
          />
          <span className="text-sm font-medium tracking-wide">{state}</span>
        </div>
      </div>
    </aside>
  );
}
