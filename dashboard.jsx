// dashboard.jsx — Dashboard screen.

function Dashboard({ onOpenOpp, onNavigate }) {
  const Recharts = window.Recharts;
  const { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } = Recharts;

  const kpis = [
    { label: 'Active Opportunities', value: '11', delta: '+3 USDOT pursue',  tone: 'cyan' },
    { label: 'In Review',            value: '3', delta: '2 awaiting Ryan', tone: 'amber' },
    { label: 'Drafts in Progress',   value: '2', delta: 'ALIAS-Texas, EXPAND',  tone: 'cyan' },
    { label: 'Next Deadline',        value: '9d', delta: 'DARPA ALIAS · May 13', tone: 'rose' },
    { label: 'Pipeline Value',       value: '$14.2M', delta: '$3.5M weighted', tone: 'violet' },
  ];

  const upcoming = [
    { id: 'alias-tx',    days: 9,  risk: 'rose'   },
    { id: 'expand',      days: 17, risk: 'amber'  },
    { id: 'nsf-p1',      days: 19, risk: 'amber'  },
    { id: 'afwerx-d2p2', days: 33, risk: 'sky'    },
    { id: 'spwx',        days: 41, risk: 'sky'    },
  ];

  return (
    <div className="px-6 py-5 space-y-5 max-w-[1180px]">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Mission control</div>
          <h1 className="text-[22px] font-semibold text-slate-100 mt-0.5">Good morning, Ryan</h1>
          <p className="text-[12.5px] text-slate-400 mt-1">2 active proposals · DARPA ALIAS due in 9 days, NASA EXPAND due in 17 days.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" icon={<Icon.Refresh size={13} />}>Sync now</Button>
          <Button variant="primary" size="md" icon={<Icon.Plus size={13} />}>Add opportunity</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-5 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <div className="text-[10.5px] uppercase tracking-wider text-slate-500">{k.label}</div>
            <div className={`mt-1.5 text-[26px] font-semibold tabular-nums ${TONE_TEXT[k.tone]}`}>{k.value}</div>
            <div className="mt-0.5 text-[11px] text-slate-400">{k.delta}</div>
          </Card>
        ))}
      </div>

      {/* Discovery Agent Activity */}
      <DiscoveryAgentPanel />

      {/* Two-col: needs attention + funnel */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader
            eyebrow="Approval queue"
            title="Needs your attention"
            right={<Pill tone="amber" dot>{window.NEEDS.length}</Pill>}
          />
          <ul className="divide-y divide-slate-800">
            {window.NEEDS.map((n) => {
              const opp = window.OPPS_BY_ID[n.oppId];
              return (
                <li key={n.id}>
                  <button onClick={() => onOpenOpp(n.oppId, n.routeStep || (n.text.includes('Budget') ? 'budget' : n.text.includes('Triage') ? 'triage' : n.text.includes('Volume') || n.text.includes('OSDMP') || n.text.includes('letters') ? 'submission' : 'draft'))}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/40 transition-colors text-left">
                    <span className={`h-1.5 w-1.5 rounded-full ${n.urgency === 'high' ? 'bg-rose-400' : n.urgency === 'review' ? 'bg-amber-400' : n.urgency === 'medium' ? 'bg-amber-400' : 'bg-sky-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] text-slate-100 truncate">
                        <span className="font-medium">{opp.shortTitle || opp.title}:</span> <span className="text-slate-300">{n.text}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[10.5px] text-slate-500">
                        <Mono>{opp.sol}</Mono>
                        <span>·</span>
                        <span>{n.ago}</span>
                        <span>·</span>
                        <span>owner</span>
                        <Avatar id={n.ownerOverride || opp.owner} size={14} ring={false} />
                      </div>
                    </div>
                    <DeadlineChip days={opp.deadlineDays} />
                    <Icon.Chevron size={13} className="text-slate-600" />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader eyebrow="By stage" title="Pipeline funnel" />
          <div className="px-4 pt-3 pb-4 h-[228px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={window.FUNNEL} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                <XAxis type="number" hide domain={[0, 14]} />
                <YAxis type="category" dataKey="stage" width={62}
                  tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(15,23,42,0.6)' }}
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 6, fontSize: 11 }} />
                <Bar dataKey="count" radius={[0, 3, 3, 0]} barSize={14}>
                  {window.FUNNEL.map((d, i) => (
                    <Cell key={i} fill={i === 0 ? '#0ea5e9' : i === 1 ? '#f59e0b' : i === 2 ? '#0ea5e9' : i === 3 ? '#22d3ee' : i === 4 ? '#a78bfa' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Three-col bottom: deadlines, ai feed, snapshot */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader eyebrow="Next 30 days" title="Upcoming deadlines"
            right={<button onClick={() => onNavigate('pipeline')} className="text-[11px] text-cyan-400 hover:underline">View all</button>} />
          <ul className="divide-y divide-slate-800">
            {upcoming.map((u) => {
              const o = window.OPPS_BY_ID[u.id];
              return (
                <li key={u.id}>
                  <button onClick={() => onOpenOpp(u.id)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/40 text-left">
                    <DeadlineChip days={u.days} />
                    <ProductPill name={o.productLine} />
                    <div className="flex-1 text-[12.5px] text-slate-200 truncate">{o.title}</div>
                    <span className="text-[11px] text-slate-500"><Mono>{o.sol}</Mono></span>
                    <StatusPill status={o.status} />
                    {o.owner && <Avatar id={o.owner} size={18} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader eyebrow="Last 6h" title="Kingmaker activity"
            right={<Pill tone="violet" dot>AI</Pill>} />
          <ul className="px-4 py-3 space-y-3">
            {window.AI_FEED.map((a, i) => (
              <li key={i} className="text-[11.5px] text-slate-300 leading-relaxed">
                <div className="text-[10px] text-slate-500 mb-0.5">{a.at}</div>
                <AICell>{a.text}</AICell>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;

// ─── Discovery Agent Activity panel ──────────────────────────────────────
function DiscoveryAgentPanel() {
  const [open, setOpen] = React.useState(false);
  const da = window.DISCOVERY_AGENT;
  return (
    <Card>
      <CardHeader
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Discovery Agent · {da.window}</span>
          </span>
        }
        title="Solicitation discovery & filtering"
        right={<Pill tone="emerald" dot>active</Pill>}
      />
      <div className="grid grid-cols-3 divide-x divide-slate-800">
        <Stat n={da.scanned} label="Sources scanned" tone="text-slate-100" />
        <Stat n={da.surfaced} label="Surfaced to Kingmaker" tone="text-emerald-300" />
        <Stat n={da.filtered} label="Filtered out" tone="text-slate-400" />
      </div>
      <div className="border-t border-slate-800">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] text-slate-300 hover:bg-slate-800/40 transition-colors"
        >
          <span className="inline-flex items-center gap-1.5">
            <Icon.ChevronDown size={13} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
            <span>{open ? 'Hide filter log' : 'View filter log'}</span>
            <span className="text-slate-500">· {da.log.length + da.hidden} decisions</span>
          </span>
          <span className="text-[10.5px] uppercase tracking-wider text-slate-500">Configure filter rules →</span>
        </button>
        {open && (
          <ul className="divide-y divide-slate-800 border-t border-slate-800">
            {da.log.map((l) => (
              <li key={l.id} className="px-4 py-2.5 flex items-start gap-3 text-[12px]">
                <Icon.X size={12} className="text-slate-500 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200">
                    <Mono className="text-slate-300">{l.source}</Mono>
                    <span className="text-slate-500"> · </span>
                    <span>{l.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    <span className="text-rose-300/80 font-medium">Filtered:</span> {l.reason}
                  </div>
                </div>
              </li>
            ))}
            <li className="px-4 py-2 text-center text-[11px] text-slate-500 hover:bg-slate-800/40 cursor-pointer">
              Show {da.hidden} more
            </li>
          </ul>
        )}
      </div>
    </Card>
  );
}

function Stat({ n, label, tone }) {
  return (
    <div className="px-4 py-3.5">
      <div className={`text-[28px] font-semibold tabular-nums leading-none ${tone}`}>{n}</div>
      <div className="text-[10.5px] uppercase tracking-wider text-slate-500 mt-1.5">{label}</div>
    </div>
  );
}
