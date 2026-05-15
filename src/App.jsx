// Root App — layout shell, workspace state, AI suggestions, Tweaks.
// React Router drives screen-level routing; workspace step lives in app state
// and is synced to the URL via /opp/:oppId/:step.
import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  Outlet,
} from 'react-router-dom';
import { Sidebar, TopBar, AIRail } from './shell.jsx';
import { RouteErrorBoundary } from './error-boundary.jsx';
import Welcome from './welcome.jsx';
import { Dashboard } from './dashboard.jsx';
import { Pipeline } from './pipeline.jsx';
import { WorkspaceParts } from './workspace.jsx';
import {
  BudgetPanel,
  AssemblyPanel,
  CompliancePanel,
  TeamScreen,
  KBScreen,
  ReviewsScreen,
  SettingsScreen,
} from './other-screens.jsx';
import {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakToggle,
  TweakRadio,
  TweakButton,
} from './tweaks-panel.jsx';
import {
  OPPS_BY_ID,
  STEPS,
  ALIAS,
  BUDGET_LINES_INITIAL,
  BUDGET_INDIRECT_RATE,
  READINESS_INITIAL,
  NEEDS,
  ASSEMBLY_FORMAT,
  COMPLIANCE,
} from './data.js';

const TWEAK_DEFAULTS = {
  accent: 'cyan',
  density: 'compact',
  showAIRail: true,
  headline: 'Good morning, Ryan',
};

// ─── Route helpers ───────────────────────────────────────────────────────────

const SCREEN_BY_PATH = {
  '/': 'dashboard',
  '/pipeline': 'pipeline',
  '/reviews': 'reviews',
  '/team': 'team',
  '/kb': 'kb',
  '/settings': 'settings',
};

function useDerivedRoute() {
  const location = useLocation();
  const path = location.pathname;
  if (path.startsWith('/opp/')) {
    const parts = path.split('/').filter(Boolean); // ['opp', ':id', ':step?']
    return { screen: 'opportunity', oppId: parts[1] || null, step: parts[2] || null };
  }
  return { screen: SCREEN_BY_PATH[path] || 'dashboard', oppId: null, step: null };
}

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const navigate = useNavigate();
  const route = useDerivedRoute();
  const location = useLocation();

  const [collapsedSidebar, setCollapsedSidebar] = React.useState(false);
  const [collapsedRail, setCollapsedRail] = React.useState(!t.showAIRail);
  React.useEffect(() => {
    setCollapsedRail(!t.showAIRail);
  }, [t.showAIRail]);

  // ── Workspace state ───────────────────────────────────────────────────────
  const [triageDecided, setTriageDecided] = React.useState(true);
  const [collabDecisions, setCollabDecisions] = React.useState({});
  const [sectionApprovals, setSectionApprovals] = React.useState({ execsum: 'approved' });
  const [budgetTrimmed, setBudgetTrimmed] = React.useState(false);
  const [readiness, setReadiness] = React.useState(READINESS_INITIAL);
  const [activeSection, setActiveSection] = React.useState('tech');
  const [aiDecisions, setAiDecisions] = React.useState({});

  // Active step is derived from URL when in opportunity; else default budget.
  const activeStep = route.step || 'budget';
  const setActiveStep = React.useCallback(
    (stepId) => {
      if (route.oppId) navigate(`/opp/${route.oppId}/${stepId}`);
    },
    [navigate, route.oppId]
  );

  // ── Budget calc ──────────────────────────────────────────────────────────
  const baseLines = BUDGET_LINES_INITIAL;
  const adjustedLines = budgetTrimmed
    ? baseLines.map((l) => ({ ...l, amount: Math.round(l.amount * 0.98), trimmed: true }))
    : baseLines;
  const adjustedDirects = adjustedLines.reduce((s, l) => s + l.amount, 0);
  const indirectAmt = Math.round(adjustedDirects * BUDGET_INDIRECT_RATE);
  const total = adjustedDirects + indirectAmt;
  const ceiling = 3500000;
  const aliasStatus = budgetTrimmed ? 'In Review' : 'Drafting';

  const decideAI = (id, kind) => {
    setAiDecisions((prev) => ({ ...prev, [id]: kind === 'modify' ? prev[id] : kind }));
    if (id === 'budget-trim' && kind === 'accepted') setBudgetTrimmed(true);
  };

  // ── Nav helpers (passed to screens) ───────────────────────────────────────
  const goNavigate = (screen) => {
    if (screen === 'dashboard') navigate('/');
    else navigate(`/${screen}`);
  };
  const openOpp = (oppId, step) => {
    navigate(`/opp/${oppId}/${step || 'budget'}`);
  };

  // ── Step status map ──────────────────────────────────────────────────────
  const stepOrder = STEPS.map((s) => s.id);
  const activeIdx = stepOrder.indexOf(activeStep);
  const baseDoneIdx = budgetTrimmed ? 7 : 6;
  const statusMap = {};
  stepOrder.forEach((id, i) => {
    if (i === activeIdx) statusMap[id] = 'active';
    else if (i < baseDoneIdx) statusMap[id] = 'done';
    else statusMap[id] = 'available';
  });

  // ── Per-screen AI suggestions ────────────────────────────────────────────
  const suggestionsForView = () => {
    if (route.screen === 'dashboard')
      return [
        {
          id: 'd0',
          kind: 'decision',
          title: 'Q&A forum closes May 29 (23 days)',
          body:
            "Draft 2–3 clarifying questions per pursued USDOT topic (26-OS2, 26-OS1, 26-FH1)? I'll mark them for Atharv to review.",
        },
        {
          id: 'd1',
          kind: 'decision',
          title: '3 items need decisions today',
          body:
            'ALIAS-Texas budget v2 is ready for review. SPWX triage has been pending 2 days. AFWERX-D2 triage has been pending 6 hours.',
        },
        {
          id: 'd2',
          kind: 'risk',
          title: 'NSF SBIR Phase I deadline at 19 days',
          body:
            'Niloufar is at 55% load. Consider re-allocating 10% from Urbanomy execution to NSF drafting.',
        },
        {
          id: 'd3',
          kind: 'reuse',
          title: 'AFWERX-D2 has 78% structural overlap with prior STTR Phase I',
          body: 'Sections 2.1, 3.1, 4 can be reused with light editing — projected 18 hours saved.',
        },
      ];
    if (route.screen === 'pipeline')
      return [
        {
          id: 'p1',
          kind: 'decision',
          title: '3 USDOT topics awaiting Q&A questions',
          body:
            'Q&A window closes May 29 (23 days). I can draft 2–3 clarifying questions per pursued topic and queue them for Atharv to review.',
        },
        {
          id: 'p2',
          kind: 'reuse',
          title: '12 new from discovery agent',
          body:
            'Most relevant: NASA TIPS-Y (similar to your 2023 TIPS-X concept), DARPA AIxCC (FireVision-adjacent).',
        },
      ];
    if (route.screen === 'team')
      return [
        {
          id: 't1',
          kind: 'risk',
          title: 'Niloufar is the bottleneck',
          body:
            'Currently lead on FIRE-WUI execution AND ALIAS-Texas drafting (40%). Recommend moving FIRE-WUI to Aria after submission.',
        },
      ];
    if (route.screen === 'kb')
      return [
        {
          id: 'k1',
          kind: 'note',
          title: 'Reuse markers updated',
          body:
            'Scanned 8 indexed proposals and tagged 33 reusable section blocks. Highest-quality: USDOT Urbanomy Phase I §2.4 (commercialization).',
        },
      ];
    if (activeStep === 'triage') {
      const opp = OPPS_BY_ID[route.oppId];
      if (opp?.id === 'usdot-os2')
        return [
          {
            id: 'tr-os2-1',
            kind: 'partner',
            title: 'Hit list: Tier 1 city LOIs',
            body:
              'Hit list calls for LA / Austin / Nashville LOIs. Draft outreach to your existing PM contacts in those cities?',
          },
          {
            id: 'tr-os2-2',
            kind: 'reuse',
            title: 'ATRI / NPMRDS data feeds',
            body:
              "You don't currently have ATRI freight pipelines (WIM, truck parking) wired up. I can scope the integration as a Phase I task.",
          },
        ];
      if (opp?.id === 'usdot-os1')
        return [
          {
            id: 'tr-os1-1',
            kind: 'partner',
            title: 'Fleet partner LOI is the gating item',
            body:
              'No motor-carrier or telematics relationships in your CRM. Search candidates (Samsara, Motive, Geotab) and draft cold outreach?',
          },
          {
            id: 'tr-os1-2',
            kind: 'reuse',
            title: 'Astro Adjuster as transferable capability',
            body:
              'Privacy-preserving data fusion posture from Astro Adjuster is the strongest narrative anchor here — pull §2.3 into the draft kit.',
          },
        ];
      if (opp?.id === 'usdot-fh1')
        return [
          {
            id: 'tr-fh1-1',
            kind: 'risk',
            title: 'Aiwaysion holds prior FHWA awards in this exact space',
            body:
              'Pull their abstracts (FY22, FY23) before committing proposal time. I can summarize the competitive delta.',
          },
          {
            id: 'tr-fh1-2',
            kind: 'partner',
            title: 'V2X / RSU integration partner needed',
            body:
              'Comms layer is outside core stack. State DOT or TMC partnership is the credibility play. Search candidates?',
          },
        ];
      if (opp?.triageDecision === 'reject')
        return [
          {
            id: 'tr-rej',
            kind: 'note',
            title: 'Rejection rationale logged',
            body:
              opp.rejectReason + '. This topic stays archived in pipeline for future cohort review.',
          },
        ];
      return [
        {
          id: 'tr1',
          kind: 'decision',
          title: 'Recommend Pursue',
          body:
            'Capability fit High, win likelihood 62% (above 55% portfolio threshold). Lockheed letter on file. JPL informally agreed.',
        },
        {
          id: 'tr2',
          kind: 'risk',
          title: 'Watch the response window',
          body:
            '4-week window with ITAR partner coordination is aggressive. Consider locking partner inputs in week 1.',
        },
      ];
    }
    if (activeStep === 'scope')
      return [
        {
          id: 'sc1',
          kind: 'partner',
          title: 'Multi-spacecraft swarm — 1 gap',
          body:
            'JPL (Federico Rossi) is the most plausible source. Subcontract scope and budget already estimated at $500K.',
        },
        {
          id: 'sc2',
          kind: 'enhance',
          title: 'Strengthen ITAR posture',
          body:
            'CMMC L2 attestation is current. DSP-83 is partial — confirm with Alison before kickoff.',
        },
      ];
    if (activeStep === 'collaborators')
      return [
        {
          id: 'co1',
          kind: 'partner',
          title: 'Suggested: Rain Industries',
          body:
            'Aerial response platform fills end-to-end story but adds scope risk. Recommend Phase III, not Phase II.',
        },
        {
          id: 'co2',
          kind: 'risk',
          title: 'CSIRO Data61 — ITAR friction',
          body:
            'Foreign-national restriction likely blocks meaningful collaboration on this SBIR XL.',
        },
      ];
    if (activeStep === 'draft') return ALIAS.draftSuggestions;
    if (activeStep === 'tasks')
      return [
        {
          id: 'ta1',
          kind: 'risk',
          title: 'Larry James at 92% available',
          body: 'Strategic review only requires ~5%. Confirm 2-hour read-through window in Week 3.',
        },
        {
          id: 'ta2',
          kind: 'enhance',
          title: 'Consider Aria Chen for ML support',
          body:
            'Aria has 30% capacity and built the FireVision training pipeline. Could shave 1 week off Technical Approach iteration.',
        },
      ];
    if (activeStep === 'timeline')
      return [
        {
          id: 'ti1',
          kind: 'schedule',
          title: 'Pull DSP-83 verification into Week 3',
          body:
            'Current 3-day buffer is below DARPA SBIR XL median (5.2 days). Pulling forward removes the amber risk.',
        },
      ];
    if (activeStep === 'budget')
      return [
        {
          id: 'budget-trim',
          kind: 'budget',
          title: 'Trim 2% across direct costs',
          body:
            'You are at 100.0% of ceiling. Reviewers consistently flag no-buffer budgets on DARPA SBIR XL. Recommend a 2% buffer.',
          acceptedNote: '2% applied · status flipped to In Review.',
        },
        {
          id: 'b2',
          kind: 'enhance',
          title: 'Equipment line ($10K) is well-justified',
          body:
            'GPU acquisition for fire model training is consistent with proposed work. Budget reviewers will accept without question.',
        },
      ];
    if (activeStep === 'assembly') {
      const fmt = ASSEMBLY_FORMAT[route.oppId];
      if (fmt?.kind === 'wp_deck')
        return [
          {
            id: 'as1',
            kind: 'risk',
            title: 'Slide 9 Quad Chart needs DARPA template',
            body:
              'Slide 9 (Technical Quad Chart) must use the DARPA template. The current slide does not match the template.',
          },
          {
            id: 'as2',
            kind: 'enhance',
            title: 'White paper has ~6 pages of headroom',
            body:
              'You are at 14/20 pages. The 5-page Commercialization section does NOT count against the limit. Consider expanding the Technical Plan.',
          },
        ];
      return [
        {
          id: 'as3',
          kind: 'risk',
          title: 'Technical Volume at 5.3 pages',
          body:
            'NASA EXPAND hard-cuts at 5 pages. Recommend trimming the Related R&D section before compile.',
        },
        {
          id: 'as4',
          kind: 'reuse',
          title: 'Reuse JPL swarm autonomy framing',
          body:
            'INNOVATE FIRE-WUI §3.2 has near-identical framing for distributed autonomy. Confidence: 0.84.',
        },
      ];
    }
    if (activeStep === 'submission') {
      const sugs = COMPLIANCE[route.oppId]?.aiSuggestions || [];
      return sugs.map((s, i) => ({
        id: `co-${route.oppId}-${i}`,
        kind: s.kind === 'warn' ? 'risk' : s.kind === 'nudge' ? 'decision' : 'enhance',
        title: s.kind === 'warn' ? 'Compliance flag' : s.kind === 'nudge' ? 'Action needed' : 'Suggestion',
        body: s.text,
      }));
    }
    return [];
  };

  const contextLabel =
    route.screen === 'opportunity'
      ? `${OPPS_BY_ID[route.oppId]?.title.split(' ').slice(0, 2).join(' ')} · ${activeStep}`
      : route.screen;

  const opp = route.oppId
    ? {
        ...OPPS_BY_ID[route.oppId],
        status: route.oppId === 'alias-tx' ? aliasStatus : OPPS_BY_ID[route.oppId].status,
      }
    : null;

  const reviewBadge = NEEDS.length;

  const workspaceContext = {
    opp,
    activeStep,
    statusMap,
    setActiveStep,
    triageDecided,
    setTriageDecided,
    collabDecisions,
    setCollabDecisions,
    activeSection,
    setActiveSection,
    sectionApprovals,
    setSectionApprovals,
    adjustedLines,
    total,
    ceiling,
    budgetTrimmed,
    setBudgetTrimmed,
  };

  // sidebar/topbar/airail expect a {screen, oppId} shape — keep parity.
  const routeShape = { screen: route.screen, oppId: route.oppId };

  // /welcome is a chrome-less brand splash — render outside the app shell.
  // Hooks are all declared above so this early return is hooks-rule safe.
  if (location.pathname === '/welcome') {
    return <Welcome />;
  }

  return (
    <div className="h-screen flex bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar
        route={routeShape}
        onNavigate={goNavigate}
        collapsed={collapsedSidebar}
        onToggleCollapse={() => setCollapsedSidebar((c) => !c)}
        reviewBadge={reviewBadge}
        onOpenWelcome={() => navigate('/welcome')}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar route={routeShape} onNavigate={goNavigate} syncedAgo="8 min ago" opp={opp} />
        <div className="flex-1 overflow-y-auto">
          <RouteErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard onOpenOpp={openOpp} onNavigate={goNavigate} />} />
              <Route path="/pipeline" element={<Pipeline onOpenOpp={openOpp} />} />
              <Route path="/reviews" element={<ReviewsScreen onOpenOpp={openOpp} />} />
              <Route path="/team" element={<TeamScreen onOpenOpp={openOpp} />} />
              <Route path="/kb" element={<KBScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/opp/:oppId" element={<Navigate to="budget" replace />} />
              <Route
                path="/opp/:oppId/:step"
                element={<OpportunityWorkspace ctx={workspaceContext} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </RouteErrorBoundary>
        </div>
      </main>
      <AIRail
        collapsed={collapsedRail}
        onToggle={() => setCollapsedRail((c) => !c)}
        suggestions={suggestionsForView()}
        decisions={aiDecisions}
        onDecide={decideAI}
        contextLabel={contextLabel}
      />

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout" />
        <TweakToggle
          label="AI right rail visible"
          value={t.showAIRail}
          onChange={(v) => setTweak('showAIRail', v)}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'regular']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakSection label="Theme" />
        <TweakRadio
          label="Accent"
          value={t.accent}
          options={['cyan', 'violet', 'emerald']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Demo" />
        <TweakButton
          onClick={() => {
            setBudgetTrimmed(false);
            setReadiness(READINESS_INITIAL);
            setAiDecisions({});
            setSectionApprovals({ execsum: 'approved' });
            if (route.oppId) navigate(`/opp/${route.oppId}/budget`);
          }}
        >
          Reset demo state
        </TweakButton>
        <TweakButton
          onClick={() => {
            navigate('/');
          }}
        >
          Jump to Dashboard
        </TweakButton>
      </TweaksPanel>
    </div>
  );
}

// Workspace route — reads ctx (passed by App) and resolves the active step.
function OpportunityWorkspace({ ctx }) {
  const { oppId } = useParams();
  const opp = ctx.opp && ctx.opp.id === oppId ? ctx.opp : OPPS_BY_ID[oppId];
  if (!opp) return <div className="px-6 py-8 text-slate-400">Opportunity not found.</div>;

  const Parts = WorkspaceParts;
  const { activeStep, statusMap, setActiveStep } = ctx;

  return (
    <div className="flex flex-col">
      <Parts.StepNav
        steps={STEPS}
        activeId={activeStep}
        statusMap={statusMap}
        onClickStep={(id) => statusMap[id] !== 'locked' && setActiveStep(id)}
      />
      <div className="px-6 py-5">
        {activeStep === 'intake' && <Parts.IntakePanel opp={opp} />}
        {activeStep === 'triage' && (
          <Parts.TriagePanel
            opp={opp}
            decided={ctx.triageDecided}
            onDecide={() => ctx.setTriageDecided(true)}
          />
        )}
        {activeStep === 'scope' && <Parts.ScopePanel />}
        {activeStep === 'collaborators' && (
          <Parts.CollaboratorsPanel
            decisions={ctx.collabDecisions}
            onDecide={(id, status) =>
              ctx.setCollabDecisions((p) => ({ ...p, [id]: status }))
            }
          />
        )}
        {activeStep === 'draft' && (
          <Parts.DraftPanel
            activeSection={ctx.activeSection}
            onSection={ctx.setActiveSection}
            sectionApprovals={ctx.sectionApprovals}
            onApproveSection={(id) =>
              ctx.setSectionApprovals((p) => ({ ...p, [id]: 'approved' }))
            }
          />
        )}
        {activeStep === 'tasks' && <Parts.TasksPanel />}
        {activeStep === 'timeline' && <Parts.TimelinePanel />}
        {activeStep === 'budget' && (
          <BudgetPanel
            lines={ctx.adjustedLines}
            indirect={BUDGET_INDIRECT_RATE}
            total={ctx.total}
            ceiling={ctx.ceiling}
            onTrim={() => ctx.setBudgetTrimmed(true)}
            trimmed={ctx.budgetTrimmed}
          />
        )}
        {activeStep === 'assembly' && <AssemblyPanel opp={opp} />}
        {activeStep === 'submission' && <CompliancePanel opp={opp} />}
      </div>
    </div>
  );
}
