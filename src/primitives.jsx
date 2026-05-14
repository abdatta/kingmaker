// Reusable UI atoms (Pill, Avatar, Card, Button, etc.).
import React from 'react';
import { Icon } from './icons.jsx';
import { STATUS_TONES, TEAM_BY_ID, PRODUCT_LINES } from './data.js';

const TONE_BG = {
  cyan:    'bg-cyan-500/10 text-cyan-300 ring-cyan-400/20',
  violet:  'bg-violet-500/10 text-violet-300 ring-violet-400/20',
  emerald: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/20',
  amber:   'bg-amber-500/10 text-amber-300 ring-amber-400/20',
  rose:    'bg-rose-500/10 text-rose-300 ring-rose-400/20',
  sky:     'bg-sky-500/10 text-sky-300 ring-sky-400/20',
  slate:   'bg-slate-700/40 text-slate-300 ring-slate-600/40',
};
const TONE_DOT = {
  cyan: 'bg-cyan-400', violet: 'bg-violet-400', emerald: 'bg-emerald-400',
  amber: 'bg-amber-400', rose: 'bg-rose-400', sky: 'bg-sky-400', slate: 'bg-slate-400',
};
const TONE_TEXT = {
  cyan: 'text-cyan-400', violet: 'text-violet-400', emerald: 'text-emerald-400',
  amber: 'text-amber-400', rose: 'text-rose-400', sky: 'text-sky-400', slate: 'text-slate-400',
};
const TONE_BORDER = {
  cyan: 'border-cyan-500/40', violet: 'border-violet-500/40', emerald: 'border-emerald-500/40',
  amber: 'border-amber-500/40', rose: 'border-rose-500/40', sky: 'border-sky-500/40', slate: 'border-slate-700',
};
const TONE_AVATAR = {
  cyan: 'bg-cyan-500/15 text-cyan-200 ring-cyan-400/30',
  violet: 'bg-violet-500/15 text-violet-200 ring-violet-400/30',
  emerald: 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/30',
  amber: 'bg-amber-500/15 text-amber-200 ring-amber-400/30',
  rose: 'bg-rose-500/15 text-rose-200 ring-rose-400/30',
  sky: 'bg-sky-500/15 text-sky-200 ring-sky-400/30',
  slate: 'bg-slate-700/40 text-slate-200 ring-slate-600/40',
};

function Pill({ tone = 'slate', children, dot = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${TONE_BG[tone]} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`} />}
      {children}
    </span>
  );
}

function StatusPill({ status }) {
  const tone = STATUS_TONES[status] || 'slate';
  return <Pill tone={tone} dot>{status}</Pill>;
}

function Avatar({ id, size = 24, ring = true }) {
  const t = TEAM_BY_ID[id];
  if (!t) return (
    <span style={{ width: size, height: size, fontSize: size * 0.42 }}
      className={`inline-flex items-center justify-center rounded-full bg-slate-800 text-slate-300 ${ring ? 'ring-1 ring-slate-700' : ''}`}>?</span>
  );
  return (
    <span title={t.name}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      className={`inline-flex items-center justify-center rounded-full font-medium ${TONE_AVATAR[t.tone]} ${ring ? 'ring-1 ring-inset' : ''}`}>
      {t.initials}
    </span>
  );
}

function AvatarStack({ ids, size = 22, max = 4 }) {
  const visible = ids.slice(0, max);
  const extra = ids.length - visible.length;
  return (
    <div className="inline-flex items-center -space-x-1.5">
      {visible.map((id) => (
        <span key={id} className="ring-2 ring-slate-950 rounded-full"><Avatar id={id} size={size} /></span>
      ))}
      {extra > 0 && (
        <span style={{ width: size, height: size, fontSize: size * 0.4 }}
          className="ring-2 ring-slate-950 rounded-full bg-slate-800 text-slate-300 inline-flex items-center justify-center">+{extra}</span>
      )}
    </div>
  );
}

function Card({ className = '', children, as = 'div' }) {
  const Tag = as;
  return (
    <Tag className={`bg-slate-900 border border-slate-800 rounded-md ${className}`}>{children}</Tag>
  );
}

function CardHeader({ title, eyebrow, right, className = '' }) {
  return (
    <div className={`flex items-start justify-between border-b border-slate-800 px-4 py-3 ${className}`}>
      <div>
        {eyebrow && <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{eyebrow}</div>}
        <div className="text-[13px] font-semibold text-slate-100">{title}</div>
      </div>
      {right}
    </div>
  );
}

function Button({ variant = 'ghost', size = 'sm', children, className = '', icon, onClick, disabled, type = 'button', title }) {
  const sizeCls = size === 'xs' ? 'h-6 px-2 text-[11px] gap-1' :
                   size === 'sm' ? 'h-7 px-2.5 text-[12px] gap-1.5' :
                   size === 'md' ? 'h-8 px-3 text-[13px] gap-1.5' : 'h-9 px-4 text-[13px] gap-2';
  const variants = {
    primary: 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 ring-1 ring-cyan-300/60 font-medium',
    accept:  'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30 hover:bg-emerald-500/25',
    reject:  'bg-rose-500/10 text-rose-300 ring-1 ring-rose-400/30 hover:bg-rose-500/20',
    modify:  'bg-slate-800 text-slate-200 ring-1 ring-slate-700 hover:bg-slate-700',
    ghost:   'text-slate-300 hover:bg-slate-800/80 ring-1 ring-transparent hover:ring-slate-700',
    outline: 'text-slate-200 ring-1 ring-slate-700 hover:bg-slate-800',
    danger:  'bg-rose-500 text-white hover:bg-rose-400',
    ai:      'bg-violet-500/10 text-violet-200 ring-1 ring-violet-400/30 hover:bg-violet-500/20',
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} title={title}
      className={`inline-flex items-center justify-center rounded transition-colors disabled:opacity-40 disabled:pointer-events-none ${sizeCls} ${variants[variant]} ${className}`}>
      {icon}
      {children}
    </button>
  );
}

function MoneyMono({ value, className = '' }) {
  return <span className={`font-mono tabular-nums ${className}`}>${value.toLocaleString()}</span>;
}

function Mono({ children, className = '' }) {
  return <span className={`font-mono ${className}`}>{children}</span>;
}

function ProductPill({ name }) {
  const p = PRODUCT_LINES[name];
  if (!p) return null;
  return <Pill tone={p.tone}>{p.label}</Pill>;
}

function StageDots({ stage = 0, total = 9 }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < stage ? 'bg-cyan-400' : i === stage ? 'bg-cyan-400/40 ring-1 ring-cyan-400' : 'bg-slate-700'}`} />
      ))}
    </div>
  );
}

function DeadlineChip({ days }) {
  if (days < 0) return <Pill tone="slate"><Icon.Check size={11} />submitted</Pill>;
  const tone = days <= 14 ? 'rose' : days <= 30 ? 'amber' : 'sky';
  return <Pill tone={tone}><Icon.Clock size={11} />{days}d</Pill>;
}

function AICell({ children, className = '' }) {
  return (
    <div className={`relative pl-3 ${className}`}>
      <span className="absolute left-0 top-0 bottom-0 w-px bg-violet-400/70" />
      {children}
    </div>
  );
}

function AIBadge({ size = 'xs' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded ${size === 'xs' ? 'px-1 py-0 text-[9px]' : 'px-1.5 py-0.5 text-[10px]'} bg-violet-500/15 text-violet-300 ring-1 ring-inset ring-violet-400/30 font-medium uppercase tracking-wider`}>
      <span className="h-1 w-1 rounded-full bg-violet-300" />AI
    </span>
  );
}

function ProgressBar({ value, max = 100, tone = 'cyan', className = '', height = 4 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`relative w-full overflow-hidden rounded-full bg-slate-800 ${className}`} style={{ height }}>
      <div className={`absolute inset-y-0 left-0 ${TONE_DOT[tone]} rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function KBD({ children }) {
  return <span className="rounded border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">{children}</span>;
}

function SectionHeading({ children, className = '' }) {
  return <div className={`text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 ${className}`}>{children}</div>;
}

export {
  Pill,
  StatusPill,
  Avatar,
  AvatarStack,
  Card,
  CardHeader,
  Button,
  MoneyMono,
  Mono,
  ProductPill,
  StageDots,
  DeadlineChip,
  AICell,
  AIBadge,
  ProgressBar,
  KBD,
  SectionHeading,
  TONE_BG,
  TONE_DOT,
  TONE_TEXT,
  TONE_BORDER,
  TONE_AVATAR,
};
