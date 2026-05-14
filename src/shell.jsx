// Global app shell: Sidebar, TopBar, AIRail.
import React from 'react';
import { Icon } from './icons.jsx';
import {
  Pill,
  Avatar,
  Button,
  AIBadge,
  KBD,
  Mono,
  DeadlineChip,
  SectionHeading,
  StatusPill,
} from './primitives.jsx';
import { OPPS_BY_ID, AI_FEED } from './data.js';

function Sidebar({ route, onNavigate, collapsed, onToggleCollapse, reviewBadge }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard',          icon: <Icon.Home size={15} /> },
    { id: 'pipeline',  label: 'Pipeline',           icon: <Icon.Pipeline size={15} /> },
    { id: 'reviews',   label: 'My Reviews',         icon: <Icon.Inbox size={15} />, badge: reviewBadge },
    { id: 'team',      label: 'Team & Capabilities',icon: <Icon.Users size={15} /> },
    { id: 'kb',        label: 'Knowledge Base',     icon: <Icon.Book size={15} /> },
    { id: 'settings',  label: 'Settings',           icon: <Icon.Settings size={15} /> },
  ];

  return (
    <aside className={`shrink-0 flex flex-col border-r border-slate-800 bg-slate-950 transition-[width] duration-200 ${collapsed ? 'w-[64px]' : 'w-[240px]'}`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} h-14 border-b border-slate-800`}>
        <button onClick={onToggleCollapse} className="flex items-center gap-2.5 group" title={collapsed ? 'Expand' : 'Collapse'}>
          <span className="relative inline-flex h-6 w-6 items-center justify-center">
            {/* OpalAI mark — abstract gemstone */}
            <svg viewBox="0 0 24 24" className="h-6 w-6">
              <defs>
                <linearGradient id="opalg" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#22d3ee" />
                  <stop offset="0.5" stopColor="#a78bfa" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <path d="M12 2 22 9l-4 12H6L2 9z" fill="none" stroke="url(#opalg)" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M12 2v19M2 9h20M6 21l6-12 6 12M12 9l-5 12M12 9l5 12" fill="none" stroke="url(#opalg)" strokeWidth="0.6" opacity="0.5" />
            </svg>
          </span>
          {!collapsed && (
            <span className="text-[13px] font-bold tracking-[0.18em] text-slate-100">KINGMAKER</span>
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {items.map((it) => {
          const active = route.screen === it.id;
          return (
            <button key={it.id} onClick={() => onNavigate(it.id)}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-2.5'} h-8 rounded text-[12.5px] gap-2.5 transition-colors
                ${active ? 'bg-slate-800/80 text-slate-100 ring-1 ring-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}>
              <span className={active ? 'text-cyan-400' : 'text-slate-500'}>{it.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{it.label}</span>
                  {it.badge ? (
                    <span className="inline-flex h-4 min-w-[18px] items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300 text-[10px] font-medium px-1 ring-1 ring-inset ring-cyan-400/30">{it.badge}</span>
                  ) : null}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-3">
        {collapsed ? (
          <div className="flex justify-center"><Avatar id="ryan" size={28} /></div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <Avatar id="ryan" size={28} />
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-slate-200 truncate">Ryan Alimo</div>
                <div className="text-[10.5px] text-slate-500 truncate">CEO · OpalAI</div>
              </div>
            </div>
            <div className="text-[10px] tracking-wider text-slate-600 italic">
              Built for Mars.<br />Deployed on Earth.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function Breadcrumbs({ route, onNavigate }) {
  const crumbs = [];
  const labels = {
    dashboard: 'Dashboard', pipeline: 'Pipeline', reviews: 'My Reviews',
    team: 'Team & Capabilities', kb: 'Knowledge Base', settings: 'Settings', opportunity: 'Pipeline',
  };
  if (route.screen === 'opportunity') {
    crumbs.push({ key: 'pipeline', label: 'Pipeline' });
    const o = OPPS_BY_ID[route.oppId];
    if (o) crumbs.push({ key: 'opp', label: o.title });
  } else {
    crumbs.push({ key: route.screen, label: labels[route.screen] || route.screen });
  }
  return (
    <div className="flex items-center gap-1.5 text-[12px]">
      {crumbs.map((c, i) => (
        <React.Fragment key={c.key}>
          {i > 0 && <Icon.Chevron size={12} className="text-slate-600" />}
          {i === crumbs.length - 1 ? (
            <span className="text-slate-200 font-medium truncate max-w-[420px]">{c.label}</span>
          ) : (
            <button onClick={() => onNavigate(c.key)} className="text-slate-400 hover:text-slate-200">{c.label}</button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function TopBar({ route, onNavigate, syncedAgo }) {
  const opp = route.screen === 'opportunity' ? OPPS_BY_ID[route.oppId] : null;

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20 flex items-center px-5 gap-4">
      <Breadcrumbs route={route} onNavigate={onNavigate} />

      {opp && (
        <>
          <span className="h-4 w-px bg-slate-800" />
          <Mono className="text-[11.5px] text-slate-400">{opp.sol}</Mono>
          <StatusPill status={opp.status} />
          <DeadlineChip days={opp.deadlineDays} />
        </>
      )}

      <div className="flex-1" />

      {/* Search */}
      <div className="relative w-[280px]">
        <Icon.Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text" placeholder="Search opportunities, sections, people…"
          className="h-8 w-full rounded bg-slate-900 border border-slate-800 pl-7 pr-12 text-[12px] text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2"><KBD>⌘K</KBD></span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[10.5px] text-slate-500 hidden lg:inline-flex items-center gap-1.5">
          <span className="relative h-1.5 w-1.5"><span className="absolute inset-0 rounded-full bg-emerald-400" /><span className="absolute inset-0 rounded-full bg-emerald-400 km-pulse" /></span>
          Discovery agent · synced {syncedAgo}
        </span>
        <button className="h-8 w-8 inline-flex items-center justify-center rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 relative">
          <Icon.Bell size={15} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-400" />
        </button>
      </div>
    </header>
  );
}

// ─── AI Right Rail ───────────────────────────────────────────────────────────

function AISuggestionCard({ s, onAccept, onReject, onModify, accepted, rejected }) {
  const kindMeta = {
    enhance:  { tone: 'cyan',    icon: <Icon.Sparkles size={12} />, label: 'Enhancement' },
    risk:     { tone: 'amber',   icon: <Icon.AlertTriangle size={12} />, label: 'Risk' },
    reuse:    { tone: 'violet',  icon: <Icon.Layers size={12} />, label: 'Reuse' },
    decision: { tone: 'cyan',    icon: <Icon.Brain size={12} />, label: 'Decision' },
    partner:  { tone: 'violet',  icon: <Icon.Link size={12} />, label: 'Partner' },
    schedule: { tone: 'sky',     icon: <Icon.Calendar size={12} />, label: 'Schedule' },
    budget:   { tone: 'amber',   icon: <Icon.Dollar size={12} />, label: 'Budget' },
    note:     { tone: 'slate',   icon: <Icon.Activity size={12} />, label: 'Note' },
  }[s.kind] || { tone: 'cyan', icon: <Icon.Sparkles size={12} />, label: 'AI' };

  return (
    <div className={`relative rounded border bg-slate-950/40 ${accepted ? 'border-emerald-500/40' : rejected ? 'border-rose-500/40 opacity-60' : 'border-slate-800'}`}>
      <span className={`absolute left-0 top-0 bottom-0 w-px ${accepted ? 'bg-emerald-400' : rejected ? 'bg-rose-400' : 'bg-violet-400/70'}`} />
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Pill tone={kindMeta.tone}>{kindMeta.icon}{kindMeta.label}</Pill>
          {accepted && <Pill tone="emerald" dot>accepted</Pill>}
          {rejected && <Pill tone="rose" dot>rejected</Pill>}
        </div>
        <div className="text-[12px] font-medium text-slate-100 leading-snug">{s.title}</div>
        <div className="mt-1 text-[11.5px] text-slate-400 leading-relaxed">{s.body}</div>
        {!accepted && !rejected && (
          <div className="mt-2.5 flex gap-1.5">
            <Button size="xs" variant="accept" icon={<Icon.Check size={11} />} onClick={() => onAccept && onAccept(s)}>Accept</Button>
            <Button size="xs" variant="reject" icon={<Icon.X size={11} />} onClick={() => onReject && onReject(s)}>Reject</Button>
            <Button size="xs" variant="modify" icon={<Icon.Edit size={11} />} onClick={() => onModify && onModify(s)}>Modify</Button>
          </div>
        )}
        {accepted && s.acceptedNote && (
          <div className="mt-2 text-[10.5px] text-emerald-300/80">{s.acceptedNote}</div>
        )}
      </div>
    </div>
  );
}

function AIRail({ collapsed, onToggle, suggestions = [], decisions = {}, onDecide, contextLabel = 'overview' }) {
  if (collapsed) {
    return (
      <aside className="w-12 shrink-0 border-l border-slate-800 bg-slate-950 flex flex-col items-center py-3 gap-3">
        <button onClick={onToggle} title="Open Kingmaker AI"
          className="h-8 w-8 inline-flex items-center justify-center rounded text-violet-300 hover:bg-slate-900 relative ring-1 ring-violet-400/30 bg-violet-500/10">
          <Icon.Sparkles size={14} />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-cyan-400 km-pulse" />
        </button>
        <div className="text-[10px] text-slate-500 [writing-mode:vertical-rl] tracking-[0.15em] mt-1">KINGMAKER AI</div>
      </aside>
    );
  }
  return (
    <aside className="w-[320px] shrink-0 border-l border-slate-800 bg-slate-950 flex flex-col">
      <div className="px-4 h-14 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="relative h-2 w-2"><span className="absolute inset-0 rounded-full bg-cyan-400" /><span className="absolute inset-0 rounded-full bg-cyan-400 km-pulse" /></span>
          <div>
            <div className="text-[12.5px] font-semibold text-slate-100">Kingmaker</div>
            <div className="text-[10px] text-slate-500 -mt-0.5">context · {contextLabel}</div>
          </div>
        </div>
        <button onClick={onToggle} className="text-slate-500 hover:text-slate-300" title="Collapse">
          <Icon.Chevron size={14} />
        </button>
      </div>

      {/* Suggestions */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2.5">
        <SectionHeading>Suggestions for this view</SectionHeading>
        {suggestions.length === 0 ? (
          <div className="rounded border border-dashed border-slate-800 bg-slate-950/50 px-3 py-6 text-center text-[11px] text-slate-500">
            No suggestions for this view.
          </div>
        ) : suggestions.map((s) => (
          <AISuggestionCard
            key={s.id} s={s}
            accepted={decisions[s.id] === 'accepted'}
            rejected={decisions[s.id] === 'rejected'}
            onAccept={() => onDecide(s.id, 'accepted', s)}
            onReject={() => onDecide(s.id, 'rejected', s)}
            onModify={() => onDecide(s.id, 'modify', s)}
          />
        ))}

        {/* Composer */}
        <div className="mt-4 rounded border border-slate-800 bg-slate-900/40">
          <div className="flex items-end gap-1.5 px-2.5 py-2">
            <div className="flex-1 text-[11.5px] text-slate-500">Ask Kingmaker about this view…</div>
            <Button variant="ai" size="xs" icon={<Icon.Send size={11} />}>Ask</Button>
          </div>
        </div>

        {/* Activity feed */}
        <div className="pt-4">
          <SectionHeading className="mb-2">Recent activity</SectionHeading>
          <ul className="space-y-2.5">
            {AI_FEED.slice(0, 5).map((a, i) => (
              <li key={i} className="text-[11.5px] text-slate-400 leading-relaxed">
                <span className="block text-[10px] text-slate-500 mb-0.5">{a.at}</span>
                {a.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export { Sidebar, TopBar, Breadcrumbs, AIRail, AISuggestionCard };
