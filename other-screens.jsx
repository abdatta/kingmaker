// other-screens.jsx — Budget, Assembly, Submission, Team, KB, Reviews, Settings.

function BudgetPanel({ lines, indirect, total, onTrim, trimmed, ceiling }) {
  const groups = [...new Set(lines.map((l) => l.category))];
  const directs = lines.reduce((s, l) => s + l.amount, 0);
  const pct = (total / ceiling) * 100;

  return (
    <Card>
      <CardHeader eyebrow={`Vol. II · Cost · 67% G&A applied`} title="Budget builder"
        right={<div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Ceiling: <MoneyMono value={ceiling} className="text-slate-200" /></span>
          <Pill tone={pct > 99 ? 'amber' : pct > 95 ? 'cyan' : 'sky'} dot>
            {pct.toFixed(1)}% of ceiling
          </Pill>
        </div>} />

      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead className="text-[10px] uppercase tracking-wider text-slate-500">
            <tr className="border-b border-slate-800">
              <th className="px-4 py-2.5 text-left">Category</th>
              <th className="px-2 py-2.5 text-left">Item</th>
              <th className="px-2 py-2.5 text-right">Amount</th>
              <th className="px-2 py-2.5 text-left">Justification / AI rationale</th>
              <th className="px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const grpLines = lines.filter((l) => l.category === g);
              const grpTotal = grpLines.reduce((s, l) => s + l.amount, 0);
              return (
                <React.Fragment key={g}>
                  <tr className="bg-slate-950/60">
                    <td colSpan={5} className="px-4 py-1.5 text-[10.5px] uppercase tracking-wider text-slate-500 border-y border-slate-800">
                      {g} <span className="ml-2 text-slate-400 normal-case font-normal tracking-normal">subtotal <MoneyMono value={grpTotal} className="text-slate-300 ml-1" /></span>
                    </td>
                  </tr>
                  {grpLines.map((l) => (
                    <tr key={l.id} className="border-b border-slate-800 hover:bg-slate-800/30 group">
                      <td className="px-4 py-2 text-slate-500"></td>
                      <td className="px-2 py-2 text-slate-100">
                        <div className="flex items-center gap-1.5">
                          {l.item}
                          {l.ai && <AIBadge />}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-right">
                        <MoneyMono value={l.amount} className={`text-slate-100 ${l.trimmed ? 'text-emerald-300' : ''}`} />
                        {l.trimmed && <div className="text-[10px] text-emerald-400/80 tabular-nums">−2%</div>}
                      </td>
                      <td className="px-2 py-2 text-[11.5px] text-slate-400">
                        {l.rationale ? <AICell>{l.rationale}</AICell> : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-3 py-2 text-right opacity-0 group-hover:opacity-100">
                        <Button variant="ghost" size="xs" icon={<Icon.Edit size={11} />}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}

            <tr className="bg-slate-950/60 border-y border-slate-800">
              <td colSpan={2} className="px-4 py-2 text-[12.5px] text-slate-300">
                Indirect / G&A <span className="text-[10.5px] text-slate-500 ml-1.5 font-mono">({(indirect * 100).toFixed(0)}% rate · calculated)</span>
              </td>
              <td className="px-2 py-2 text-right"><MoneyMono value={Math.round(directs * indirect)} className="text-slate-200" /></td>
              <td colSpan={2} className="px-2 py-2 text-[11px] text-slate-500">Applied to direct costs · standard OpalAI rate</td>
            </tr>

            <tr className="bg-slate-900">
              <td colSpan={2} className="px-4 py-3 text-[13px] font-semibold text-slate-100">Total</td>
              <td className="px-2 py-3 text-right">
                <MoneyMono value={total} className="text-[14px] font-semibold text-cyan-300" />
              </td>
              <td colSpan={2} className="px-2 py-3 text-[11px] text-slate-400">{pct.toFixed(1)}% of <MoneyMono value={ceiling} className="text-slate-300" /> ceiling</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer: AI suggestion + approval */}
      <div className="border-t border-slate-800 px-4 py-3 flex items-center gap-3">
        {!trimmed ? (
          <div className="flex-1 flex items-center gap-2 rounded border border-violet-400/30 bg-violet-500/5 px-3 py-2 text-[12px] text-violet-200">
            <AIBadge />
            <span>Budget is at <span className="font-medium tabular-nums">100.0%</span> of ceiling. Recommend trimming 2% across direct costs for unexpected costs (typical DARPA reviewer feedback).</span>
            <span className="flex-1" />
            <Button variant="accept" size="xs" icon={<Icon.Check size={11} />} onClick={onTrim}>Accept · trim 2%</Button>
            <Button variant="reject" size="xs" icon={<Icon.X size={11} />}>Reject</Button>
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-2 rounded border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-[12px] text-emerald-200">
            <Icon.CheckCircle size={13} />
            <span>2% buffer applied across direct costs. Status flipped to <span className="font-medium">In Review</span>.</span>
          </div>
        )}
        <Button variant="modify" size="md" icon={<Icon.Edit size={13} />}>Request changes</Button>
        <Button variant="primary" size="md" icon={<Icon.Check size={13} />}>Approve budget</Button>
      </div>
    </Card>
  );
}

// Status pill helper for assembly sections
function asmStatusTone(s) {
  return { approved: 'emerald', review: 'amber', draft: 'cyan', todo: 'slate' }[s] || 'slate';
}
function asmStatusLabel(s) {
  return { approved: 'Approved', review: 'In review', draft: 'Draft', todo: 'Not started' }[s] || s;
}

function AssemblyPanel({ opp }) {
  const fmt = window.ASSEMBLY_FORMAT[opp?.id] || window.ASSEMBLY_FORMAT['alias-tx'];
  if (fmt.kind === 'wp_deck') return <AssemblyWpDeck opp={opp} fmt={fmt} />;
  return <AssemblyNasaStandard opp={opp} fmt={fmt} />;
}

function AssemblyWpDeck({ opp, fmt }) {
  const wpPct = Math.round((fmt.whitePaper.pages / fmt.whitePaper.pageLimit) * 100);
  const deckPct = Math.round((fmt.deck.slides / fmt.deck.slideLimit) * 100);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Volume 2 · Format</div>
          <div className="text-[18px] font-semibold text-slate-100 mt-0.5">White Paper + Slide Deck</div>
          <div className="text-[12px] text-slate-400 mt-0.5">DARPA SBIR XL · {opp.sol}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Icon.FileText size={12} />}>DARPA Quad templates</Button>
          <Button variant="primary" size="sm" icon={<Icon.FileText size={12} />}>Compile PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* White Paper */}
        <Card>
          <CardHeader
            eyebrow={`${fmt.whitePaper.pages} of ${fmt.whitePaper.pageLimit} pages`}
            title="White Paper outline"
            right={<Pill tone={wpPct > 95 ? 'rose' : wpPct > 75 ? 'amber' : 'cyan'}>{wpPct}%</Pill>} />
          <div className="px-4 pt-2 pb-3">
            <ProgressBar value={wpPct} tone={wpPct > 95 ? 'rose' : 'cyan'} height={4} />
          </div>
          <ul className="divide-y divide-slate-800">
            {fmt.whitePaper.sections.map((s) => (
              <li key={s.id} className="px-4 py-3 flex items-start gap-3 hover:bg-slate-900/40 cursor-pointer">
                <Mono className="text-[10.5px] text-slate-500 mt-0.5 w-7 tabular-nums">{s.pages}pg</Mono>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-slate-100">{s.label}</div>
                  {s.note && <div className="text-[10.5px] text-slate-500 mt-0.5">{s.note}</div>}
                </div>
                <Pill tone={asmStatusTone(s.status)} dot>{asmStatusLabel(s.status)}</Pill>
              </li>
            ))}
          </ul>
        </Card>

        {/* Slide Deck */}
        <Card>
          <CardHeader
            eyebrow={`${fmt.deck.slides} of ${fmt.deck.slideLimit} slides`}
            title="Slide Deck outline"
            right={<Pill tone="cyan">{deckPct}%</Pill>} />
          <ul className="divide-y divide-slate-800">
            {fmt.deck.mandatory.map((sl) => (
              <li key={sl.n} className="px-4 py-2.5 flex items-start gap-3 hover:bg-slate-900/40 cursor-pointer">
                <Mono className="text-[10.5px] text-slate-500 mt-0.5 w-5 tabular-nums">{sl.n}.</Mono>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-slate-100 leading-snug">{sl.label}</div>
                  {sl.template && <div className="text-[10.5px] text-amber-300 mt-0.5 flex items-center gap-1"><Icon.AlertTriangle size={10} />{sl.template}</div>}
                </div>
                <Pill tone={asmStatusTone(sl.status)} dot>{asmStatusLabel(sl.status)}</Pill>
              </li>
            ))}
          </ul>
          {/* deck thumbnail strip */}
          <div className="border-t border-slate-800 p-3">
            <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500 mb-2">Deck preview</div>
            <div className="flex gap-1.5 overflow-x-auto">
              {Array.from({ length: 15 }).map((_, i) => {
                const s = fmt.deck.mandatory[i];
                const filled = i < fmt.deck.slides;
                return (
                  <div key={i} className={`flex-shrink-0 w-14 h-9 rounded border ${filled ? 'border-slate-700 bg-slate-900' : 'border-dashed border-slate-800 bg-slate-950'} flex items-end p-1`}>
                    <Mono className="text-[9px] text-slate-500">{i + 1}</Mono>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader eyebrow="Format rules · enforced on compile" title="DARPA SBIR XL format requirements" />
        <ul className="px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] text-slate-300">
          {window.COMPLIANCE['alias-tx'].format.map((f, i) => (
            <li key={i} className="flex items-start gap-2"><Icon.CheckCircle size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />{f}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function AssemblyNasaStandard({ opp, fmt }) {
  const done = fmt.sections.filter((s) => s.status === 'approved').length;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Volume 2 · Format</div>
          <div className="text-[18px] font-semibold text-slate-100 mt-0.5">NASA Standard · 5-page Technical Volume</div>
          <div className="text-[12px] text-slate-400 mt-0.5">NASA SBIR · {opp.sol}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Icon.FileText size={12} />}>NSPIRES forms</Button>
          <Button variant="primary" size="sm" icon={<Icon.FileText size={12} />}>Compile PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader
            eyebrow={`${done} of ${fmt.sections.length} approved`}
            title="Technical Volume outline"
            right={<Pill tone="amber">5.3 / 5.0 pp</Pill>} />
          <div className="px-4 pt-2 pb-3 flex items-center gap-2 text-[11.5px] text-amber-300">
            <Icon.AlertTriangle size={12} />
            <span>Currently 0.3 pages over the NASA hard cap. Trim before compile.</span>
          </div>
          <ul className="divide-y divide-slate-800">
            {fmt.sections.map((s, i) => (
              <li key={s.id} className="px-4 py-3 flex items-start gap-3 hover:bg-slate-900/40 cursor-pointer">
                <Mono className="text-[10.5px] text-slate-500 mt-0.5 w-5 tabular-nums">{i + 1}.</Mono>
                <div className="flex-1 min-w-0 text-[12.5px] text-slate-100">{s.label}</div>
                <Pill tone={asmStatusTone(s.status)} dot>{asmStatusLabel(s.status)}</Pill>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader eyebrow="Format rules · enforced on compile" title="NASA SBIR format" />
          <ul className="px-4 py-3 space-y-2 text-[12px] text-slate-300">
            {window.COMPLIANCE['expand'].format.map((f, i) => (
              <li key={i} className="flex items-start gap-2"><Icon.CheckCircle size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />{f}</li>
            ))}
          </ul>
          <div className="border-t border-slate-800 p-3 text-[11.5px] text-slate-400">
            <span className="font-medium text-slate-200">Compile PDF</span> validates page count, margins, and font size — flagging any violations in red before allowing submission.
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Compliance & Documents (replaces Submission Readiness) ──────────────────

const VOLUME_STATUS = {
  complete:   { tone: 'emerald', label: 'Complete',     icon: 'check' },
  progress:   { tone: 'cyan',    label: 'In progress',  icon: 'progress' },
  partial:    { tone: 'amber',   label: 'Partial',      icon: 'progress' },
  notstarted: { tone: 'rose',    label: 'Not started',  icon: 'x' },
  na:         { tone: 'slate',   label: '—',            icon: 'dot' },
};

function CompliancePanel({ opp }) {
  const C = window.COMPLIANCE[opp?.id] || window.COMPLIANCE['alias-tx'];
  const [checks, setChecks] = React.useState(() => {
    const init = {};
    Object.values(C.checklist).forEach((items) => items.forEach((it) => { init[it.id] = it.ok; }));
    return init;
  });
  React.useEffect(() => {
    const init = {};
    Object.values(C.checklist).forEach((items) => items.forEach((it) => { init[it.id] = it.ok; }));
    setChecks(init);
  }, [opp?.id]);

  const toggle = (id) => setChecks((p) => ({ ...p, [id]: !p[id] }));

  const allItems = Object.values(C.checklist).flat();
  const completed = allItems.filter((i) => checks[i.id]).length;
  const totalItems = allItems.length;
  const pct = Math.round((completed / totalItems) * 100);
  const ready = pct === 100;

  const isDarpa = opp?.id === 'alias-tx';
  const deadlineTone = opp.deadlineDays < 10 ? 'rose' : opp.deadlineDays < 30 ? 'amber' : 'sky';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Final pre-submission gate</div>
          <h2 className="text-[20px] font-semibold text-slate-100 mt-0.5">Compliance & Documents</h2>
          <div className="text-[12.5px] text-slate-400 mt-0.5">
            {isDarpa ? 'DARPA DP2 · 7-volume structure' : 'NASA SBIR Phase I · NSPIRES'} · {opp.sol}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-slate-500">Submission readiness</div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-40"><ProgressBar value={pct} tone={ready ? 'emerald' : pct > 70 ? 'cyan' : 'amber'} height={6} /></div>
              <Mono className="text-[13px] text-slate-200 tabular-nums">{pct}%</Mono>
            </div>
          </div>
          <div className={`rounded border border-${deadlineTone}-400/30 bg-${deadlineTone}-500/10 px-3 py-2 text-center`}>
            <Mono className={`text-[20px] font-semibold tabular-nums text-${deadlineTone}-200 leading-none`}>{opp.deadlineDays}</Mono>
            <div className={`text-[9.5px] uppercase tracking-[0.12em] text-${deadlineTone}-300 mt-1`}>days left</div>
          </div>
        </div>
      </div>

      {/* Region A: Volume Structure (full width) */}
      <Card>
        <CardHeader
          eyebrow={isDarpa ? 'DARPA DP2 · Required volumes' : 'NASA SBIR Phase I · Required sections'}
          title="Volume structure"
          right={<Pill tone="slate">{C.volumes.filter((v) => v.status === 'complete').length} / {C.volumes.length} complete</Pill>} />
        <div className="grid grid-cols-7 gap-2 p-3" style={{ gridTemplateColumns: `repeat(${C.volumes.length}, minmax(0, 1fr))` }}>
          {C.volumes.map((v) => {
            const vs = VOLUME_STATUS[v.status];
            return (
              <button key={v.n} className={`text-left rounded border border-slate-800 bg-slate-950/40 p-3 hover:border-${vs.tone}-500/40 hover:bg-slate-900/60 transition`}>
                <div className="flex items-center justify-between mb-2">
                  <Mono className="text-[10.5px] text-slate-500 uppercase tracking-wider">Vol {v.n}</Mono>
                  <Pill tone={vs.tone} dot>{vs.label}</Pill>
                </div>
                <div className="text-[12px] font-medium text-slate-100 leading-tight">{v.title}</div>
                {v.subtitle && <div className="text-[10.5px] text-slate-400 mt-0.5">{v.subtitle}</div>}
                <div className="text-[10.5px] text-slate-500 mt-2 leading-snug">{v.meta}</div>
                {v.webform && <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-amber-300"><Icon.AlertTriangle size={10} />DSIP webform — not a PDF</div>}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {/* Region B: Format requirements (left) */}
        <div className="space-y-4">
          <Card>
            <CardHeader eyebrow="Solicitation rules · enforced on compile" title="Format requirements" />
            <ul className="px-4 py-3 space-y-2 text-[12px] text-slate-300">
              {C.format.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Icon.CheckCircle size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader eyebrow="Read-only · color-coded by proximity" title="Key dates" />
            <ul className="px-4 py-3 space-y-2 text-[12px]">
              {C.keyDates.map((d, i) => (
                <li key={i} className="flex items-start justify-between gap-3">
                  <div className="text-slate-300">{d.label}</div>
                  <Mono className="text-[11px] text-slate-400 text-right flex-shrink-0">{d.when}</Mono>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Region C: Operational checklist (right, 2/3 width) */}
        <div className="col-span-2 space-y-4">
          {Object.entries(C.checklist).map(([groupName, items]) => {
            const groupDone = items.filter((i) => checks[i.id]).length;
            return (
              <Card key={groupName}>
                <CardHeader
                  eyebrow={groupName === 'Letters of Support' ? 'Required attachments' : groupName === 'Registration & Admin' ? 'Annual & per-proposal' : 'Pre-submission gates'}
                  title={groupName}
                  right={<Pill tone={groupDone === items.length ? 'emerald' : 'amber'} dot>{groupDone}/{items.length}</Pill>} />
                <ul className="divide-y divide-slate-800">
                  {items.map((it) => {
                    const on = checks[it.id];
                    return (
                      <li key={it.id} className="px-4 py-2.5 flex items-start gap-3 text-[12.5px] hover:bg-slate-900/40">
                        <button onClick={() => toggle(it.id)}
                          className={`mt-0.5 w-4 h-4 rounded border ${on ? 'bg-emerald-500/20 border-emerald-400' : 'border-slate-600 bg-slate-900 hover:border-slate-400'} flex items-center justify-center flex-shrink-0`}>
                          {on && <Icon.Check size={10} className="text-emerald-300" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={on ? 'text-slate-300 line-through decoration-slate-600' : 'text-slate-100'}>{it.label}</div>
                          {it.meta && <div className="text-[10.5px] text-slate-500 mt-0.5">{it.meta}</div>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            );
          })}

          {/* Submit button card */}
          <Card>
            <div className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="text-[12.5px] text-slate-100 font-medium">
                  {ready ? 'All required items complete' : `${totalItems - completed} required items remaining`}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {ready ? 'You can mark this proposal ready for submission.' : 'Complete all checks to enable submission.'}
                </div>
              </div>
              <Button variant="primary" size="lg" disabled={!ready}
                icon={<Icon.Send size={14} />}>
                {ready ? 'Mark Ready for Submission' : 'Resolve all checks to enable'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


// ─── Team & Capabilities ─────────────────────────────────────────────────────

function TeamScreen({ onBack }) {
  const [active, setActive] = React.useState(null);
  if (active) return <PersonDetail person={active} onBack={() => setActive(null)} />;
  return (
    <div className="px-6 py-5 max-w-[1180px]">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Capacity & capability</div>
          <h1 className="text-[22px] font-semibold text-slate-100 mt-0.5">Team & Capabilities</h1>
          <p className="text-[12.5px] text-slate-400 mt-1">9 contributors · {window.TEAM.filter((t) => t.availability < 0.5).length} at high load</p>
        </div>
        <Button variant="outline" size="md" icon={<Icon.Plus size={13} />}>Invite teammate</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {window.TEAM.map((p) => (
          <Card key={p.id} className="p-4 hover:ring-1 hover:ring-slate-700 cursor-pointer transition" as="button" onClick={() => setActive(p)}>
            <div className="flex items-start gap-3 text-left w-full">
              <Avatar id={p.id} size={40} />
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold text-slate-100 truncate">{p.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{p.role}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.skills.slice(0, 3).map((s) => (
                    <span key={s} className="rounded bg-slate-800/60 px-1.5 py-0.5 text-[10px] text-slate-300">{s}</span>
                  ))}
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    <span>Availability</span><span className="tabular-nums">{Math.round(p.availability * 100)}%</span>
                  </div>
                  <ProgressBar value={p.availability * 100} tone={p.availability > 0.5 ? 'emerald' : p.availability > 0.3 ? 'amber' : 'rose'} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PersonDetail({ person, onBack }) {
  return (
    <div className="px-6 py-5 max-w-[1180px]">
      <button onClick={onBack} className="text-[12px] text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 mb-3"><Icon.ArrowLeft size={12} />Back to team</button>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 col-span-1">
          <Avatar id={person.id} size={64} />
          <div className="mt-3 text-[18px] font-semibold text-slate-100">{person.name}</div>
          <div className="text-[12px] text-slate-400">{person.role}</div>
          <p className="mt-3 text-[12.5px] text-slate-300 leading-relaxed">{person.bio}</p>
          <div className="mt-4 flex flex-wrap gap-1">
            {person.skills.map((s) => (
              <span key={s} className="rounded bg-slate-800/60 px-1.5 py-0.5 text-[11px] text-slate-200">{s}</span>
            ))}
          </div>
        </Card>
        <Card className="col-span-2">
          <CardHeader eyebrow="Right now" title="Current load & assignments" />
          <div className="px-4 py-3 space-y-3 text-[12.5px]">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>Total allocation</span><span className="tabular-nums">{Math.round((1 - person.availability) * 100)}% used</span>
              </div>
              <ProgressBar value={(1 - person.availability) * 100} tone={person.availability > 0.5 ? 'emerald' : person.availability > 0.3 ? 'amber' : 'rose'} height={6} />
            </div>
            <div className="space-y-2 pt-2">
              {window.OPPORTUNITIES.filter((o) => o.owner === person.id).map((o) => (
                <div key={o.id} className="flex items-center gap-2 rounded border border-slate-800 bg-slate-950/40 px-3 py-2">
                  <ProductPill name={o.productLine} />
                  <div className="flex-1 text-slate-200">{o.title}</div>
                  <Mono className="text-[11px] text-slate-500">{o.sol}</Mono>
                  <StatusPill status={o.status} />
                </div>
              ))}
              {window.OPPORTUNITIES.filter((o) => o.owner === person.id).length === 0 && (
                <div className="text-[11.5px] text-slate-500 italic">Not currently leading an active proposal.</div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Knowledge Base ──────────────────────────────────────────────────────────

function KBScreen() {
  const [q, setQ] = React.useState('');
  const filtered = window.KB.filter((k) => k.title.toLowerCase().includes(q.toLowerCase()) || k.tags.some((t) => t.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="px-6 py-5 max-w-[1180px]">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Past proposals · indexed for RAG</div>
          <h1 className="text-[22px] font-semibold text-slate-100 mt-0.5">Knowledge Base</h1>
          <p className="text-[12.5px] text-slate-400 mt-1">8 indexed documents · 33 reusable section markers · used by Kingmaker for drafting</p>
        </div>
        <Button variant="outline" size="md" icon={<Icon.Plus size={13} />}>Upload proposal</Button>
      </div>

      <div className="relative mb-3">
        <Icon.Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, tag, agency…"
          className="h-9 w-full rounded bg-slate-900 border border-slate-800 pl-7 pr-3 text-[13px] text-slate-200 focus:border-cyan-500/50 focus:outline-none" />
      </div>

      <Card>
        <table className="w-full text-[12.5px]">
          <thead className="text-[10px] uppercase tracking-wider text-slate-500">
            <tr className="border-b border-slate-800">
              <th className="px-4 py-2.5 text-left">Title</th>
              <th className="px-2 py-2.5 text-left">Agency</th>
              <th className="px-2 py-2.5 text-left">Year</th>
              <th className="px-2 py-2.5 text-left">Tags</th>
              <th className="px-2 py-2.5 text-left">Outcome</th>
              <th className="px-2 py-2.5 text-right">Reusable sections</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((k) => (
              <tr key={k.id} className="hover:bg-slate-800/30">
                <td className="px-4 py-2.5 text-slate-100 font-medium">{k.title}</td>
                <td className="px-2 py-2.5 text-slate-300">{k.agency}</td>
                <td className="px-2 py-2.5 text-slate-400 tabular-nums">{k.year}</td>
                <td className="px-2 py-2.5"><div className="flex flex-wrap gap-1">{k.tags.map((t) => <span key={t} className="rounded bg-slate-800/60 px-1.5 py-0.5 text-[10px] text-slate-300">{t}</span>)}</div></td>
                <td className="px-2 py-2.5">
                  <Pill tone={k.status === 'Won' ? 'emerald' : k.status === 'Lost' ? 'rose' : 'sky'}>{k.status}</Pill>
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-slate-300">{k.reuse}</td>
                <td className="px-4 py-2.5 text-right">
                  <Button variant="ghost" size="xs" icon={<Icon.Eye size={11} />}>Open</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Reviews queue ───────────────────────────────────────────────────────────

function ReviewsScreen({ onOpenOpp }) {
  return (
    <div className="px-6 py-5 max-w-[900px]">
      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Awaiting your decision</div>
        <h1 className="text-[22px] font-semibold text-slate-100 mt-0.5">My Reviews</h1>
      </div>
      <Card>
        <ul className="divide-y divide-slate-800">
          {window.NEEDS.map((n) => {
            const o = window.OPPS_BY_ID[n.oppId];
            return (
              <li key={n.id}>
                <button onClick={() => onOpenOpp(n.oppId)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/30 text-left">
                  <span className={`h-1.5 w-1.5 rounded-full ${n.urgency === 'high' ? 'bg-rose-400' : n.urgency === 'medium' ? 'bg-amber-400' : 'bg-sky-400'}`} />
                  <div className="flex-1">
                    <div className="text-[13px] text-slate-100"><span className="font-medium">{o.title}</span> · <span className="text-slate-300">{n.text}</span></div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10.5px] text-slate-500">
                      <Mono>{o.sol}</Mono><span>·</span><span>{n.ago}</span>
                    </div>
                  </div>
                  <DeadlineChip days={o.deadlineDays} />
                  <StatusPill status={o.status} />
                  <Icon.Chevron size={13} className="text-slate-600" />
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

// ─── Settings (minimal but real) ─────────────────────────────────────────────

function SettingsScreen() {
  return (
    <div className="px-6 py-5 max-w-[820px]">
      <h1 className="text-[22px] font-semibold text-slate-100 mb-4">Settings</h1>
      <div className="space-y-4">
        <Card>
          <CardHeader eyebrow="Org" title="OpalAI" />
          <div className="px-4 py-3 space-y-2.5 text-[12.5px]">
            <Row k="Org name">OpalAI, Inc.</Row>
            <Row k="CAGE / UEI"><Mono>9X4LM · MJP3K9YT4LK4</Mono></Row>
            <Row k="DUNS"><Mono>118-294-771</Mono></Row>
            <Row k="Indirect rate (G&A)">67.0% · Approved Apr 2025</Row>
            <Row k="ITAR registration">DDTC · M-12834</Row>
          </div>
        </Card>
        <Card>
          <CardHeader eyebrow="Discovery agent" title="Source feeds" />
          <ul className="px-4 py-3 space-y-2 text-[12px]">
            {[
              { src: 'SAM.gov', last: '8 min ago', items: 47, ok: true },
              { src: 'SBIR.gov', last: '8 min ago', items: 12, ok: true },
              { src: 'DARPA program portal', last: '32 min ago', items: 3, ok: true },
              { src: 'NASA NSPIRES', last: '4h ago', items: 9, ok: true },
              { src: 'AFWERX challenge feed', last: '1d ago', items: 0, ok: false },
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2.5">
                {f.ok ? <Icon.CheckCircle size={13} className="text-emerald-400" /> : <Icon.AlertTriangle size={13} className="text-amber-400" />}
                <span className="text-slate-200 flex-1">{f.src}</span>
                <span className="text-slate-500">{f.items} items · last sync {f.last}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

window.OtherScreens = { BudgetPanel, AssemblyPanel, CompliancePanel, TeamScreen, KBScreen, ReviewsScreen, SettingsScreen };
