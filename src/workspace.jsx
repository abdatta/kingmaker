// Opportunity workspace: 10-step nav + all step panels.
import React from 'react';
import { Icon } from './icons.jsx';
import {
  Pill,
  Avatar,
  Button,
  Card,
  CardHeader,
  AIBadge,
  AICell,
  Mono,
  MoneyMono,
  ProgressBar,
  SectionHeading,
  TONE_TEXT,
  TONE_DOT,
} from './primitives.jsx';
import { ALIAS, TEAM_BY_ID } from './data.js';

function StepNav({ steps, activeId, statusMap, onClickStep }) {
  return (
    <div className="border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
      <div className="flex items-stretch overflow-x-auto px-5">
        {steps.map((s, i) => {
          const status = statusMap[s.id] || 'locked'; // done | active | locked
          const isLast = i === steps.length - 1;
          return (
            <React.Fragment key={s.id}>
              <button onClick={() => onClickStep(s.id)}
                disabled={status === 'locked'}
                className={`group flex items-center gap-2 px-3 py-3 text-[12px] whitespace-nowrap transition-colors
                  ${status === 'active' ? 'text-cyan-300' : status === 'done' ? 'text-slate-200 hover:text-cyan-300' : 'text-slate-600 cursor-not-allowed'}`}>
                <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-medium
                  ${status === 'done' ? 'bg-cyan-400 text-slate-950'
                    : status === 'active' ? 'ring-1 ring-cyan-400 text-cyan-300 bg-slate-950'
                    : 'bg-slate-800 text-slate-500'}`}>
                  {status === 'done' ? <Icon.Check size={11} /> : (i + 1)}
                </span>
                <span className={status === 'active' ? 'font-medium' : ''}>{s.label}</span>
              </button>
              {!isLast && <span className="self-center mx-0.5 text-slate-700"><Icon.Chevron size={12} /></span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step panels ─────────────────────────────────────────────────────────────

function IntakePanel({ opp }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-2">
        <CardHeader eyebrow="Source" title="Solicitation source" right={<Pill tone="emerald" dot>verified</Pill>} />
        <div className="px-4 py-4 space-y-3 text-[12.5px]">
          <Row k="Solicitation #"><Mono className="text-slate-200">{opp.sol}</Mono></Row>
          <Row k="Agency / Office">{opp.agency}{opp.id === 'alias-tx' ? ' / Defense Sciences Office' : opp.id === 'expand' ? ' / SBIR EXPAND' : ''}</Row>
          <Row k="Program">{opp.program || 'SBIR XL — Direct-to-Phase II'}</Row>
          <Row k="Topic">{opp.title}</Row>
          <Row k="Posted">{opp.id === 'expand' ? 'Apr 14, 2026 · 9:00 AM ET' : 'Mar 14, 2026 · 9:00 AM ET'}</Row>
          <Row k="Closes">{opp.deadlineDays} days · {opp.deadline || 'Apr 15, 2026 · 11:59 PM ET'}</Row>
          <Row k="Ceiling"><MoneyMono value={opp.ceiling} className="text-slate-100" /></Row>
          <Row k="Set-aside">Small Business · ITAR controlled</Row>
          <Row k="Captured by">Discovery Agent · 4d ago</Row>
        </div>
      </Card>
      <Card>
        <CardHeader eyebrow="At a glance" title="Context" />
        <div className="px-4 py-4 text-[12px] text-slate-300 leading-relaxed space-y-3">
          <p>OpalAI engaged DARPA DSO at the February 2026 Adaptive Autonomy program review. Program staff highlighted fire prediction as the FY26 priority and described FireVision's adaptive sensing loop as <em className="text-slate-100 not-italic font-medium">"part of the holy grail"</em>.</p>
          <p>This SBIR XL is the formal vehicle to advance that work to a multi-platform integration phase with Lockheed MATRIX and JPL swarm autonomy.</p>
          <div className="flex items-center gap-1.5 pt-1">
            <Pill tone="violet">FireVision</Pill>
            <Pill tone="cyan">SBIR XL</Pill>
            <Pill tone="amber">ITAR</Pill>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Row({ k, children }) {
  return (
    <div className="flex items-baseline gap-3">
      <div className="w-32 shrink-0 text-[10.5px] uppercase tracking-wider text-slate-500">{k}</div>
      <div className="text-slate-200 flex-1">{children}</div>
    </div>
  );
}

function TriagePanel({ opp, decided, onDecide }) {
  // USDOT (Pre-Solicitation) opportunities use a different triage rendering
  if (opp.triageDecision) return <UsdotTriagePanel opp={opp} />;
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-2">
        <CardHeader
          eyebrow="AI assessment"
          title="Why this is relevant"
          right={<AIBadge />}
        />
        <div className="p-4">
          <AICell className="pl-4">
            <p className="text-[13px] text-slate-200 leading-relaxed">{ALIAS.triage.rationale}</p>
          </AICell>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <FitMetric label="Capability fit" value="High" tone="emerald" detail="9 of 11 requirements internal or partial" />
            <FitMetric label="Win likelihood" value="62%" tone="cyan" detail="Based on prior DARPA DSO outcomes" />
            <FitMetric label="Strategic fit" value="Aligned" tone="violet" detail="FireVision flagship customer" />
          </div>

          <div className="mt-5">
            <SectionHeading className="mb-2">Decision</SectionHeading>
            {decided ? (
              <div className="rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-200 flex items-center gap-2">
                <Icon.CheckCircle size={14} />
                <span>Pursued by <span className="font-medium">Ryan Alimo</span> · {ALIAS.triage.decidedAt}</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="accept" icon={<Icon.Check size={13} />} onClick={() => onDecide('pursue')}>Pursue</Button>
                <Button variant="reject" icon={<Icon.X size={13} />} onClick={() => onDecide('reject')}>Reject</Button>
                <Button variant="modify" icon={<Icon.Star size={13} />} onClick={() => onDecide('save')}>Save for later</Button>
                <Button variant="ghost" icon={<Icon.Eye size={13} />}>Needs more review</Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader eyebrow="Discussion" title="Comments" />
        <ul className="px-4 py-4 space-y-3.5">
          {ALIAS.triage.comments.map((c, i) => (
            <li key={i} className="flex gap-2.5">
              <Avatar id={c.who} size={26} />
              <div className="min-w-0">
                <div className="text-[11.5px] text-slate-300">
                  <span className="font-medium text-slate-100">{TEAM_BY_ID[c.who].name}</span>
                  <span className="text-slate-500"> · {c.at}</span>
                </div>
                <p className="text-[12px] text-slate-300 mt-0.5 leading-relaxed">{c.text}</p>
              </div>
            </li>
          ))}
          <li className="pt-1">
            <input className="w-full h-8 px-2.5 bg-slate-950 border border-slate-800 rounded text-[12px] text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
              placeholder="Add a comment…" />
          </li>
        </ul>
      </Card>
    </div>
  );
}

function FitMetric({ label, value, tone, detail }) {
  return (
    <div className="rounded border border-slate-800 bg-slate-950/40 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`text-[18px] font-semibold tabular-nums mt-0.5 ${TONE_TEXT[tone]}`}>{value}</div>
      <div className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">{detail}</div>
    </div>
  );
}

// USDOT FY26 SBIR triage — Pre-Solicitation Q&A phase, three-axis Fit/Win/Strategic
function UsdotTriagePanel({ opp }) {
  const isPursue = opp.triageDecision === 'pursue';
  const fitTone = { Strong: 'emerald', Moderate: 'cyan', Stretch: 'amber' }[opp.fit] || 'slate';
  const winTone = { 'Mod-High': 'emerald', Moderate: 'cyan', 'Low-Mod': 'amber' }[opp.winProb] || 'slate';
  const stratTone = { High: 'emerald', Moderate: 'cyan' }[opp.stratValue] || 'slate';
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-2">
        <CardHeader eyebrow="AI assessment · 3-axis framework" title="Fit / Win / Strategic value" right={<AIBadge />} />
        <div className="p-4">
          <AICell className="pl-4">
            <p className="text-[13px] text-slate-200 leading-relaxed">{opp.triageRationale || opp.rejectReason}</p>
          </AICell>
          {isPursue && (
            <div className="mt-5 grid grid-cols-3 gap-2">
              <FitMetric label="Fit" value={opp.fit} tone={fitTone} detail="Capability overlap with current stack" />
              <FitMetric label="Win probability" value={opp.winProb} tone={winTone} detail="Based on competitive signal + relationships" />
              <FitMetric label="Strategic value" value={opp.stratValue} tone={stratTone} detail="Alignment with product roadmap" />
            </div>
          )}
          {isPursue && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <SectionHeading className="mb-2">Hit list</SectionHeading>
                <ul className="space-y-1.5">
                  {opp.hitList.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-slate-200">
                      <Icon.Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionHeading className="mb-2">Key risks</SectionHeading>
                <ul className="space-y-1.5">
                  {opp.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-amber-200">
                      <Icon.AlertTriangle size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="mt-5">
            <SectionHeading className="mb-2">Decision</SectionHeading>
            {isPursue ? (
              <div className="rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-200 flex items-center gap-2">
                <Icon.CheckCircle size={14} />
                <span>Pursued by <span className="font-medium">{opp.decidedBy}</span> · {opp.decidedAt}</span>
              </div>
            ) : (
              <div className="rounded border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] text-rose-200 flex items-center gap-2">
                <Icon.X size={14} />
                <span>Rejected · {opp.rejectReason}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
      <Card>
        <CardHeader eyebrow="Pre-Solicitation phase" title="Key dates" />
        <ul className="px-4 py-3 space-y-2.5 text-[12px]">
          <li className="flex justify-between"><span className="text-slate-400">Q&A deadline</span><Mono className="text-rose-300">{opp.qaDeadline}</Mono></li>
          <li className="flex justify-between"><span className="text-slate-400">Solicitation opens</span><Mono className="text-slate-200">{opp.solOpens}</Mono></li>
          <li className="flex justify-between"><span className="text-slate-400">Sub-agency</span><span className="text-slate-200">{opp.subAgency}</span></li>
          <li className="flex justify-between"><span className="text-slate-400">Phase I ceiling</span><MoneyMono value={opp.ceiling} className="text-slate-200" /></li>
        </ul>
        {isPursue && <QATaskCard opp={opp} />}
      </Card>
    </div>
  );
}

function QATaskCard({ opp }) {
  const [status, setStatus] = React.useState('Open');
  const next = { Open: 'Drafted', Drafted: 'Posted', Posted: 'Answered', Answered: 'Answered' };
  const tone = { Open: 'amber', Drafted: 'cyan', Posted: 'sky', Answered: 'emerald' }[status];
  return (
    <div className="border-t border-slate-800 p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Q&A Question · task</div>
        <Pill tone={tone} dot>{status}</Pill>
      </div>
      <div className="text-[12.5px] text-slate-100 font-medium leading-snug">Submit clarifying question to USDOT Q&A forum</div>
      <div className="flex items-center gap-2 text-[11px] text-slate-400">
        <Avatar id="atharv" size={16} ring={false} />
        <span>Atharv Arya</span>
        <span>·</span>
        <span className="text-rose-300 font-medium">Due May 29 (23d)</span>
      </div>
      <div className="rounded border border-amber-400/30 bg-amber-500/5 px-2.5 py-1.5 text-[10.5px] text-amber-200 flex items-start gap-1.5">
        <Icon.AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />
        <span>Questions become public — no proprietary content</span>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" size="xs" icon={<Icon.ExternalLink size={11} />}>Open Q&A forum</Button>
        {status !== 'Answered' && <Button variant="modify" size="xs" onClick={() => setStatus(next[status])}>Mark {next[status]}</Button>}
      </div>
    </div>
  );
}


function ScopePanel() {
  const groups = ['Technical', 'Compliance', 'Submission'];
  const covIcon = {
    internal: <Icon.CheckCircle size={13} className="text-emerald-400" />,
    partial:  <Icon.AlertTriangle size={13} className="text-amber-400" />,
    gap:      <Icon.XCircle size={13} className="text-rose-400" />,
  };
  const covLabel = { internal: 'Internal', partial: 'Partial', gap: 'Gap' };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader eyebrow="Parsed from solicitation" title="Requirements"
          right={<span className="text-[11px] text-slate-500">47 extracted · 11 mapped here</span>} />
        <div className="px-4 py-3 space-y-4">
          {groups.map((g) => (
            <div key={g}>
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{g}</div>
              <ul className="space-y-1">
                {ALIAS.scope.requirements.filter((r) => r.group === g).map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-slate-200 px-2 py-1.5 rounded hover:bg-slate-800/40">
                    <span className="mt-0.5">{covIcon[r.cov]}</span>
                    <span className="flex-1 leading-snug">{r.text}</span>
                    <span className={`text-[10px] uppercase tracking-wider ${r.cov === 'gap' ? 'text-rose-300' : r.cov === 'partial' ? 'text-amber-300' : 'text-emerald-300'}`}>{covLabel[r.cov]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader eyebrow="OpalAI · FireVision" title="Capability matrix" />
          <ul className="px-4 py-3 space-y-1.5">
            {ALIAS.scope.capabilities.map((c, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[12px] py-1">
                <span className={`h-2 w-2 rounded-full ${TONE_DOT[c.tone]}`} />
                <span className="text-slate-200 flex-1">{c.name}</span>
                <span className="text-slate-500 text-[11px]">→ {c.match}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader eyebrow="Identified" title="Capability gaps" right={<AIBadge />} />
          <ul className="px-4 py-3 space-y-2.5">
            {ALIAS.scope.gaps.map((g, i) => (
              <li key={i} className="rounded border border-slate-800 bg-slate-950/40 p-3">
                <div className="text-[12.5px] font-medium text-slate-100">{g.title}</div>
                <AICell className="mt-1.5">
                  <p className="text-[11.5px] text-slate-400 leading-relaxed">{g.recommendation}</p>
                </AICell>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function CollaboratorsPanel({ decisions, onDecide }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ALIAS.collaborators.map((c) => {
        const accepted = decisions[c.id] === 'accepted' || c.status === 'accepted';
        const rejected = decisions[c.id] === 'rejected';
        return (
          <Card key={c.id} className={accepted ? 'ring-1 ring-emerald-500/30' : rejected ? 'opacity-60' : ''}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[14px] font-semibold text-slate-100">{c.name}</div>
                  <div className="text-[11.5px] text-slate-400 mt-0.5">{c.kind}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10.5px] text-slate-500 uppercase tracking-wider">Fit</div>
                  <div className={`text-[18px] font-semibold tabular-nums ${c.fit >= 90 ? 'text-emerald-300' : c.fit >= 75 ? 'text-cyan-300' : 'text-amber-300'}`}>{c.fit}%</div>
                </div>
              </div>
              <div className="mt-3 rounded bg-slate-950/50 ring-1 ring-slate-800 px-3 py-2 text-[11.5px]">
                <span className="text-slate-500">Fills: </span>
                <span className="text-slate-200">{c.fills}</span>
              </div>
              <AICell className="mt-3">
                <p className="text-[11.5px] text-slate-400 leading-relaxed">{c.note}</p>
              </AICell>
              <div className="mt-3 flex items-center gap-1.5">
                {accepted ? (
                  <Pill tone="emerald" dot><Icon.Check size={11} />Accepted</Pill>
                ) : rejected ? (
                  <Pill tone="rose" dot><Icon.X size={11} />Rejected</Pill>
                ) : (
                  <>
                    <Button variant="accept" size="xs" icon={<Icon.Check size={11} />} onClick={() => onDecide(c.id, 'accepted')}>Accept</Button>
                    <Button variant="reject" size="xs" icon={<Icon.X size={11} />} onClick={() => onDecide(c.id, 'rejected')}>Reject</Button>
                    <Button variant="modify" size="xs" icon={<Icon.Edit size={11} />}>Add manually</Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// Drafting workspace
function DraftPanel({ activeSection, onSection, sectionApprovals, onApproveSection }) {
  const sections = ALIAS.sections;
  const cur = sections.find((s) => s.id === activeSection) || sections[1];

  return (
    <div className="grid grid-cols-[220px_1fr] gap-4">
      {/* Left: section nav */}
      <Card>
        <CardHeader eyebrow="Sections" title="Outline" />
        <ul className="py-2">
          {sections.map((s) => {
            const isActive = s.id === activeSection;
            const status = sectionApprovals[s.id] || s.status;
            return (
              <li key={s.id}>
                <button onClick={() => onSection(s.id)}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 ${isActive ? 'bg-slate-800/60' : 'hover:bg-slate-800/30'}`}>
                  <span className="flex-1 min-w-0">
                    <div className={`text-[12px] truncate ${isActive ? 'text-slate-100 font-medium' : 'text-slate-300'}`}>{s.label}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <ProgressBar value={s.pct} max={100} tone={status === 'approved' ? 'emerald' : 'cyan'} className="flex-1" />
                      <span className="text-[10px] tabular-nums text-slate-500 w-7 text-right">{s.pct}%</span>
                    </div>
                  </span>
                  {status === 'approved' && <Icon.CheckCircle size={13} className="text-emerald-400" />}
                  {status === 'review' && <Icon.Eye size={12} className="text-amber-400" />}
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Center: editor */}
      <Card>
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Section</div>
            <div className="text-[14px] font-semibold text-slate-100">{cur.label}</div>
            <Pill tone={(sectionApprovals[cur.id] || cur.status) === 'approved' ? 'emerald' : 'cyan'} dot>
              {(sectionApprovals[cur.id] || cur.status) === 'approved' ? 'approved' : 'in progress'}
            </Pill>
            <span className="text-[11px] text-slate-500 tabular-nums">{cur.pct}%</span>
          </div>
          <div className="flex gap-1.5">
            <Button variant="modify" size="sm" icon={<Icon.Edit size={12} />}>Request revisions</Button>
            <Button variant="accept" size="sm" icon={<Icon.Check size={12} />} onClick={() => onApproveSection(cur.id)}>
              {sectionApprovals[cur.id] === 'approved' ? 'Approved' : 'Approve section'}
            </Button>
          </div>
        </div>

        {/* Doc */}
        <div className="px-8 py-7 max-w-[820px] mx-auto">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">DARPA SBIR XL · Volume I</div>
          <h2 className="text-[20px] font-semibold text-slate-100 mb-5">{cur.id === 'tech' ? '3. Technical Approach' : cur.label}</h2>

          {cur.id === 'tech' ? (
            <div className="space-y-5 text-[13.5px] leading-[1.7] text-slate-200">
              {ALIAS.draft.paragraphs.map((p, i) => (
                <ParagraphBlock key={i} p={p} />
              ))}
              <div className="text-[11px] text-slate-500 italic pt-3 border-t border-slate-800">
                Draft continues — sections 3.4 (Risk reduction), 3.5 (Phase III transition) outlined…
              </div>
            </div>
          ) : (
            <div className="text-[13px] leading-[1.7] text-slate-300 space-y-4">
              <p className="text-slate-500 italic">Switch to <button onClick={() => onSection('tech')} className="text-cyan-400 hover:underline">Technical Approach</button> to see the populated draft. Other sections are at the indicated completion %.</p>
              <ProgressBar value={cur.pct} max={100} tone="cyan" height={6} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function ParagraphBlock({ p }) {
  if (p.kind === 'approved') {
    return (
      <div className="relative pl-4 border-l-2 border-emerald-500/40">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Pill tone="emerald" dot><Icon.Check size={11} />approved</Pill>
          <span className="text-[10.5px] text-slate-500">by {TEAM_BY_ID[p.author].name} · {p.when}</span>
        </div>
        <p>{p.text}</p>
      </div>
    );
  }
  if (p.kind === 'edited') {
    return (
      <div className="relative pl-4 border-l-2 border-slate-700">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Pill tone="slate"><Icon.Edit size={10} />edited</Pill>
          <span className="text-[10.5px] text-slate-500">by {TEAM_BY_ID[p.author].name} · {p.when}</span>
        </div>
        <p>{p.text}</p>
      </div>
    );
  }
  // ai
  return (
    <div className="relative pl-4 border-l-2 border-violet-400/70">
      <div className="flex items-center gap-1.5 mb-1.5">
        <AIBadge />
        <span className="text-[10.5px] text-slate-500">drafted by Kingmaker</span>
      </div>
      <p>{p.text}</p>
    </div>
  );
}

// Tasks
function TasksPanel() {
  const total = ALIAS.tasks.reduce((s, t) => s + t.alloc, 0);
  return (
    <Card>
      <CardHeader eyebrow={`${ALIAS.tasks.length} contributors`} title="Team allocation"
        right={<span className="text-[11px] text-slate-500 tabular-nums">{Math.round(total * 100)}% total allocated</span>} />
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead className="text-[10px] uppercase tracking-wider text-slate-500">
            <tr className="border-b border-slate-800">
              <th className="px-4 py-2.5 text-left">Person</th>
              <th className="px-2 py-2.5 text-left">Role</th>
              <th className="px-2 py-2.5 text-left">Workstream</th>
              <th className="px-2 py-2.5 text-left">This proposal</th>
              <th className="px-2 py-2.5 text-left">Current load</th>
              <th className="px-2 py-2.5 text-left">Rationale</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {ALIAS.tasks.map((t) => {
              const p = TEAM_BY_ID[t.who];
              const after = Math.min(1, t.current + t.alloc);
              return (
                <tr key={t.who} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar id={t.who} size={26} />
                      <div>
                        <div className="text-slate-100 font-medium">{p.name}</div>
                        <div className="text-[10.5px] text-slate-500">{p.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-slate-300">{t.role}</td>
                  <td className="px-2 py-3 text-slate-300">{t.stream}</td>
                  <td className="px-2 py-3"><Pill tone="cyan">+{Math.round(t.alloc * 100)}%</Pill></td>
                  <td className="px-2 py-3">
                    <div className="w-36">
                      <div className="relative h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-slate-500/50" style={{ width: `${t.current * 100}%` }} />
                        <div className={`absolute inset-y-0 ${after > 0.9 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                          style={{ left: `${t.current * 100}%`, width: `${(after - t.current) * 100}%` }} />
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-500 tabular-nums">{Math.round(t.current * 100)}% → {Math.round(after * 100)}%</div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-[11.5px] text-slate-400">{t.rationale}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="xs" icon={<Icon.Refresh size={11} />}>Reassign</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="m-4 mt-2 rounded border border-amber-400/30 bg-amber-500/5 px-3 py-2.5 text-[12px] text-amber-200 flex items-center gap-2">
        <Icon.AlertTriangle size={14} />
        <span><span className="font-medium">Skill gap:</span> Consider external support for ITAR compliance review. Alison is at 78% load.</span>
        <span className="flex-1" />
        <Button variant="modify" size="xs">Add reviewer</Button>
      </div>
    </Card>
  );
}

// Timeline / Gantt
function TimelinePanel() {
  const t = ALIAS.timeline;
  const lanes = [...new Set(t.bands.map((b) => b.lane))].sort();
  const W = 1.0; // fractional
  const colWeek = 100 / t.weeks;
  const todayPct = (t.todayWeek / t.weeks) * 100;
  const phaseLabels = {
    cyan: 'bg-cyan-500/20 ring-cyan-400/40 text-cyan-200',
    sky: 'bg-sky-500/20 ring-sky-400/40 text-sky-200',
    violet: 'bg-violet-500/20 ring-violet-400/40 text-violet-200',
    amber: 'bg-amber-500/30 ring-amber-400/50 text-amber-100',
    emerald: 'bg-emerald-500/20 ring-emerald-400/40 text-emerald-200',
  };

  return (
    <Card>
      <CardHeader eyebrow="4-week response window · Mar 18 → Apr 15" title="Timeline"
        right={<div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 bg-cyan-400 rounded-sm" />Phase</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 bg-amber-400 rounded-sm" />Risk band</span>
          <span className="inline-flex items-center gap-1"><span className="h-3 w-px bg-cyan-400" />Today</span>
        </div>} />

      <div className="px-4 py-4 overflow-x-auto">
        <div className="min-w-[820px]">
          {/* Header weeks */}
          <div className="ml-32 grid grid-cols-4 gap-0 text-[11px] text-slate-500 border-b border-slate-800 pb-1.5">
            {Array.from({ length: t.weeks }).map((_, i) => (
              <div key={i} className="px-2">Week {i + 1}</div>
            ))}
          </div>

          {/* Lanes */}
          <div className="relative mt-2">
            {/* gridlines */}
            <div className="absolute inset-0 ml-32">
              {Array.from({ length: t.weeks + 1 }).map((_, i) => (
                <span key={i} className="absolute top-0 bottom-0 border-l border-slate-800" style={{ left: `${i * colWeek}%` }} />
              ))}
              {/* Today line */}
              <span className="absolute top-0 bottom-0 border-l-2 border-cyan-400/70" style={{ left: `${todayPct}%` }}>
                <span className="absolute -top-2 -translate-x-1/2 text-[10px] text-cyan-300 font-medium whitespace-nowrap bg-slate-950 px-1">today</span>
              </span>
            </div>

            <div className="space-y-1.5">
              {lanes.map((laneId) => {
                const bands = t.bands.filter((b) => b.lane === laneId);
                return (
                  <div key={laneId} className="relative h-9 flex items-center">
                    <div className="w-32 shrink-0 pr-3 text-[11px] text-slate-500">
                      Lane {laneId + 1}
                    </div>
                    <div className="flex-1 relative h-full">
                      {bands.map((b) => {
                        const left = (b.start / t.weeks) * 100;
                        const width = ((b.end - b.start) / t.weeks) * 100;
                        return (
                          <div key={b.id}
                            title={`${b.label} (week ${b.start.toFixed(1)} → ${b.end.toFixed(1)})`}
                            className={`absolute top-1 bottom-1 rounded ring-1 ${phaseLabels[b.tone]} px-2 flex items-center text-[11px] truncate cursor-grab`}
                            style={{ left: `${left}%`, width: `${width}%` }}>
                            <span className="truncate font-medium">{b.label}</span>
                            <Avatar id={b.owner} size={14} ring={false} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Milestones */}
          <div className="mt-4 ml-32 relative h-7">
            {[
              { at: 0.0, label: 'Kickoff' },
              { at: 1.4, label: 'Partner inputs due' },
              { at: 2.7, label: 'Internal review complete' },
              { at: 3.4, label: 'Compliance complete' },
              { at: 4.0, label: 'Submission' },
            ].map((m, i) => (
              <div key={i} className="absolute -translate-x-1/2 flex flex-col items-center" style={{ left: `${(m.at / t.weeks) * 100}%` }}>
                <Icon.Flag size={11} className="text-slate-400" />
                <div className="text-[9.5px] text-slate-500 mt-0.5 whitespace-nowrap">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded border border-amber-400/30 bg-amber-500/5 px-3 py-2.5 text-[12px] text-amber-200 flex items-center gap-2">
          <Icon.AlertTriangle size={14} />
          <span><span className="font-medium">Risk:</span> Compliance check has only a 3-day buffer to submission. Recommend pulling DSP-83 verification forward into Week 3.</span>
        </div>
      </div>
    </Card>
  );
}

export const WorkspaceParts = {
  StepNav,
  IntakePanel,
  TriagePanel,
  ScopePanel,
  CollaboratorsPanel,
  DraftPanel,
  TasksPanel,
  TimelinePanel,
};
