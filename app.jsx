// app.jsx — Top-level App. Wires routing, workspace state, AI suggestions, Tweaks.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "cyan",
  "density": "compact",
  "showAIRail": true,
  "headline": "Good morning, Ryan"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Routing
  const [route, setRoute] = React.useState({ screen: 'dashboard', oppId: null });
  const [collapsedSidebar, setCollapsedSidebar] = React.useState(false);
  const [collapsedRail, setCollapsedRail] = React.useState(!t.showAIRail);
  React.useEffect(() => { setCollapsedRail(!t.showAIRail); }, [t.showAIRail]);

  // Workspace state — ALIAS-Texas
  const [activeStep, setActiveStep] = React.useState('budget'); // start on Budget per brief
  const [activeSection, setActiveSection] = React.useState('tech');

  // Triage decision (already pursued in fixture, but allow re-decide)
  const [triageDecided, setTriageDecided] = React.useState(true);

  // Collaborator decisions
  const [collabDecisions, setCollabDecisions] = React.useState({});

  // Section approvals
  const [sectionApprovals, setSectionApprovals] = React.useState({ execsum: 'approved' });

  // Budget
  const [budgetTrimmed, setBudgetTrimmed] = React.useState(false);
  const baseLines = window.BUDGET_LINES_INITIAL;
  const directs = baseLines.reduce((s, l) => s + l.amount, 0);
  const adjustedLines = budgetTrimmed
    ? baseLines.map((l) => ({ ...l, amount: Math.round(l.amount * 0.98), trimmed: true }))
    : baseLines;
  const adjustedDirects = adjustedLines.reduce((s, l) => s + l.amount, 0);
  const indirectAmt = Math.round(adjustedDirects * window.BUDGET_INDIRECT_RATE);
  const total = adjustedDirects + indirectAmt;
  const ceiling = 3500000;
  // When trimmed, status flips from "Drafting" to "In Review"
  const aliasStatus = budgetTrimmed ? 'In Review' : 'Drafting';

  // Submission readiness
  const [readiness, setReadiness] = React.useState(window.READINESS_INITIAL);
  const allReady = readiness.every((r) => r.ok);
  const [marked, setMarked] = React.useState(false);
  const onResolve = (id) => setReadiness((rs) => rs.map((r) => r.id === id ? { ...r, ok: true } : r));

  // AI suggestion decisions (per-screen scoped)
  const [aiDecisions, setAiDecisions] = React.useState({});
  const decideAI = (id, kind, s) => {
    setAiDecisions((prev) => ({ ...prev, [id]: kind === 'modify' ? prev[id] : kind }));
    // Side effects for specific suggestions
    if (id === 'budget-trim' && kind === 'accepted') setBudgetTrimmed(true);
  };

  // Navigation helpers
  const navigate = (screen) => setRoute({ screen, oppId: null });
  const openOpp = (oppId, step) => {
    setRoute({ screen: 'opportunity', oppId });
    if (step) setActiveStep(step);
  };

  // ── Step nav status map ──────────────────────────────────────────────
  const stepOrder = window.STEPS.map((s) => s.id);
  const activeIdx = stepOrder.indexOf(activeStep);
  // First 6 steps done; budget is the active per fixture (or whichever user clicks)
  // Allow click-back to any earlier step AND forward to remaining steps for the demo.
  const baseDoneIdx = budgetTrimmed ? 7 : 6; // budget done if trimmed accepted
  const statusMap = {};
  stepOrder.forEach((id, i) => {
    if (i === activeIdx) statusMap[id] = 'active';
    else if (i < baseDoneIdx) statusMap[id] = 'done';
    else statusMap[id] = 'available';
  });

  // ── Per-screen AI suggestions ────────────────────────────────────────
  const suggestionsForView = () => {
    if (route.screen === 'dashboard') return [
      { id: 'd0', kind: 'decision', title: 'Q&A forum closes May 29 (23 days)',
        body: 'Draft 2–3 clarifying questions per pursued USDOT topic (26-OS2, 26-OS1, 26-FH1)? I\'ll mark them for Atharv to review.' },
      { id: 'd1', kind: 'decision', title: '3 items need decisions today',
        body: 'ALIAS-Texas budget v2 is ready for review. SPWX triage has been pending 2 days. AFWERX-D2 triage has been pending 6 hours.' },
      { id: 'd2', kind: 'risk', title: 'NSF SBIR Phase I deadline at 19 days',
        body: 'Niloufar is at 55% load. Consider re-allocating 10% from Urbanomy execution to NSF drafting.' },
      { id: 'd3', kind: 'reuse', title: 'AFWERX-D2 has 78% structural overlap with prior STTR Phase I',
        body: 'Sections 2.1, 3.1, 4 can be reused with light editing — projected 18 hours saved.' },
    ];
    if (route.screen === 'pipeline') return [
      { id: 'p1', kind: 'decision', title: 'DOE ARPA-E SCALEUP unassigned',
        body: 'New from agent · 8h ago. ScanToBIM fit is high but ceiling is $5M (Phase III scale). Recommend triaging this week.' },
      { id: 'p2', kind: 'reuse', title: '12 new from discovery agent',
        body: 'Most relevant: NASA TIPS-Y (similar to your 2023 TIPS-X concept), DARPA AIxCC (FireVision-adjacent).' },
    ];
    if (route.screen === 'team') return [
      { id: 't1', kind: 'risk', title: 'Niloufar is the bottleneck',
        body: 'Currently lead on FIRE-WUI execution AND ALIAS-Texas drafting (40%). Recommend moving FIRE-WUI to Aria after submission.' },
    ];
    if (route.screen === 'kb') return [
      { id: 'k1', kind: 'note', title: 'Reuse markers updated',
        body: 'Scanned 8 indexed proposals and tagged 33 reusable section blocks. Highest-quality: USDOT Urbanomy Phase I §2.4 (commercialization).' },
    ];
    // opportunity workspace — per-step
    if (activeStep === 'triage') {
      const opp = window.OPPS_BY_ID[route.oppId];
      if (opp?.id === 'usdot-os2') return [
        { id: 'tr-os2-1', kind: 'partner', title: 'Hit list: Tier 1 city LOIs',
          body: 'Hit list calls for LA / Austin / Nashville LOIs. Draft outreach to your existing PM contacts in those cities?' },
        { id: 'tr-os2-2', kind: 'reuse', title: 'ATRI / NPMRDS data feeds',
          body: 'You don\'t currently have ATRI freight pipelines (WIM, truck parking) wired up. I can scope the integration as a Phase I task.' },
      ];
      if (opp?.id === 'usdot-os1') return [
        { id: 'tr-os1-1', kind: 'partner', title: 'Fleet partner LOI is the gating item',
          body: 'No motor-carrier or telematics relationships in your CRM. Search candidates (Samsara, Motive, Geotab) and draft cold outreach?' },
        { id: 'tr-os1-2', kind: 'reuse', title: 'Astro Adjuster as transferable capability',
          body: 'Privacy-preserving data fusion posture from Astro Adjuster is the strongest narrative anchor here — pull §2.3 into the draft kit.' },
      ];
      if (opp?.id === 'usdot-fh1') return [
        { id: 'tr-fh1-1', kind: 'risk', title: 'Aiwaysion holds prior FHWA awards in this exact space',
          body: 'Pull their abstracts (FY22, FY23) before committing proposal time. I can summarize the competitive delta.' },
        { id: 'tr-fh1-2', kind: 'partner', title: 'V2X / RSU integration partner needed',
          body: 'Comms layer is outside core stack. State DOT or TMC partnership is the credibility play. Search candidates?' },
      ];
      if (opp?.triageDecision === 'reject') return [
        { id: 'tr-rej', kind: 'note', title: 'Rejection rationale logged',
          body: opp.rejectReason + '. This topic stays archived in pipeline for future cohort review.' },
      ];
      return [
        { id: 'tr1', kind: 'decision', title: 'Recommend Pursue',
          body: 'Capability fit High, win likelihood 62% (above 55% portfolio threshold). Lockheed letter on file. JPL informally agreed.' },
        { id: 'tr2', kind: 'risk', title: 'Watch the response window',
          body: '4-week window with ITAR partner coordination is aggressive. Consider locking partner inputs in week 1.' },
      ];
    }
    if (activeStep === 'scope') return [
      { id: 'sc1', kind: 'partner', title: 'Multi-spacecraft swarm — 1 gap',
        body: 'JPL (Federico Rossi) is the most plausible source. Subcontract scope and budget already estimated at $500K.' },
      { id: 'sc2', kind: 'enhance', title: 'Strengthen ITAR posture',
        body: 'CMMC L2 attestation is current. DSP-83 is partial — confirm with Alison before kickoff.' },
    ];
    if (activeStep === 'collaborators') return [
      { id: 'co1', kind: 'partner', title: 'Suggested: Rain Industries',
        body: 'Aerial response platform fills end-to-end story but adds scope risk. Recommend Phase III, not Phase II.' },
      { id: 'co2', kind: 'risk', title: 'CSIRO Data61 — ITAR friction',
        body: 'Foreign-national restriction likely blocks meaningful collaboration on this SBIR XL.' },
    ];
    if (activeStep === 'draft') return window.ALIAS.draftSuggestions;
    if (activeStep === 'tasks') return [
      { id: 'ta1', kind: 'risk', title: 'Larry James at 92% available',
        body: 'Strategic review only requires ~5%. Confirm 2-hour read-through window in Week 3.' },
      { id: 'ta2', kind: 'enhance', title: 'Consider Aria Chen for ML support',
            body: 'Aria has 30% capacity and built the FireVision training pipeline. Could shave 1 week off Technical Approach iteration.' },
    ];
    if (activeStep === 'timeline') return [
      { id: 'ti1', kind: 'schedule', title: 'Pull DSP-83 verification into Week 3',
        body: 'Current 3-day buffer is below DARPA SBIR XL median (5.2 days). Pulling forward removes the amber risk.' },
    ];
    if (activeStep === 'budget') return [
      { id: 'budget-trim', kind: 'budget', title: 'Trim 2% across direct costs',
        body: 'You are at 100.0% of ceiling. Reviewers consistently flag no-buffer budgets on DARPA SBIR XL. Recommend a 2% buffer.',
        acceptedNote: '2% applied · status flipped to In Review.' },
      { id: 'b2', kind: 'enhance', title: 'Equipment line ($10K) is well-justified',
        body: 'GPU acquisition for fire model training is consistent with proposed work. Budget reviewers will accept without question.' },
    ];
    if (activeStep === 'assembly') {
      const fmt = window.ASSEMBLY_FORMAT[route.oppId];
      if (fmt?.kind === 'wp_deck') return [
        { id: 'as1', kind: 'risk', title: 'Slide 9 Quad Chart needs DARPA template',
          body: 'Slide 9 (Technical Quad Chart) must use the DARPA template. The current slide does not match the template.' },
        { id: 'as2', kind: 'enhance', title: 'White paper has ~6 pages of headroom',
          body: 'You are at 14/20 pages. The 5-page Commercialization section does NOT count against the limit. Consider expanding the Technical Plan.' },
      ];
      return [
        { id: 'as3', kind: 'risk', title: 'Technical Volume at 5.3 pages',
          body: 'NASA EXPAND hard-cuts at 5 pages. Recommend trimming the Related R&D section before compile.' },
        { id: 'as4', kind: 'reuse', title: 'Reuse JPL swarm autonomy framing',
          body: 'INNOVATE FIRE-WUI §3.2 has near-identical framing for distributed autonomy. Confidence: 0.84.' },
      ];
    }
    if (activeStep === 'submission') {
      const sugs = window.COMPLIANCE[route.oppId]?.aiSuggestions || [];
      return sugs.map((s, i) => ({
        id: `co-${route.oppId}-${i}`,
        kind: s.kind === 'warn' ? 'risk' : s.kind === 'nudge' ? 'decision' : 'enhance',
        title: s.kind === 'warn' ? 'Compliance flag' : s.kind === 'nudge' ? 'Action needed' : 'Suggestion',
        body: s.text,
      }));
    }
    return [];
  };

  const contextLabel = route.screen === 'opportunity'
    ? `${window.OPPS_BY_ID[route.oppId]?.title.split(' ').slice(0, 2).join(' ')} · ${activeStep}`
    : route.screen;

  // ── Render the screen ────────────────────────────────────────────────
  let screen;
  const opp = route.oppId ? { ...window.OPPS_BY_ID[route.oppId], status: route.oppId === 'alias-tx' ? aliasStatus : window.OPPS_BY_ID[route.oppId].status } : null;

  if (route.screen === 'dashboard') {
    screen = <Dashboard onOpenOpp={openOpp} onNavigate={navigate} />;
  } else if (route.screen === 'pipeline') {
    screen = <Pipeline onOpenOpp={openOpp} />;
  } else if (route.screen === 'reviews') {
    screen = <window.OtherScreens.ReviewsScreen onOpenOpp={openOpp} />;
  } else if (route.screen === 'team') {
    screen = <window.OtherScreens.TeamScreen />;
  } else if (route.screen === 'kb') {
    screen = <window.OtherScreens.KBScreen />;
  } else if (route.screen === 'settings') {
    screen = <window.OtherScreens.SettingsScreen />;
  } else if (route.screen === 'opportunity') {
    const Parts = window.WorkspaceParts;
    screen = (
      <div className="flex flex-col">
        <Parts.StepNav steps={window.STEPS} activeId={activeStep}
          statusMap={statusMap} onClickStep={(id) => statusMap[id] !== 'locked' && setActiveStep(id)} />
        <div className="px-6 py-5">
          {activeStep === 'intake' && <Parts.IntakePanel opp={opp} />}
          {activeStep === 'triage' && <Parts.TriagePanel opp={opp} decided={triageDecided}
            onDecide={(d) => setTriageDecided(true)} />}
          {activeStep === 'scope' && <Parts.ScopePanel />}
          {activeStep === 'collaborators' && <Parts.CollaboratorsPanel decisions={collabDecisions}
            onDecide={(id, status) => setCollabDecisions((p) => ({ ...p, [id]: status }))} />}
          {activeStep === 'draft' && <Parts.DraftPanel
            activeSection={activeSection} onSection={setActiveSection}
            sectionApprovals={sectionApprovals}
            onApproveSection={(id) => setSectionApprovals((p) => ({ ...p, [id]: 'approved' }))} />}
          {activeStep === 'tasks' && <Parts.TasksPanel />}
          {activeStep === 'timeline' && <Parts.TimelinePanel />}
          {activeStep === 'budget' && <window.OtherScreens.BudgetPanel
            lines={adjustedLines} indirect={window.BUDGET_INDIRECT_RATE}
            total={total} ceiling={ceiling}
            onTrim={() => setBudgetTrimmed(true)} trimmed={budgetTrimmed} />}
          {activeStep === 'assembly' && <window.OtherScreens.AssemblyPanel opp={opp} />}
          {activeStep === 'submission' && <window.OtherScreens.CompliancePanel opp={opp} />}
        </div>
      </div>
    );
  }

  // Review badge
  const reviewBadge = window.NEEDS.length;

  return (
    <div className="h-screen flex bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar route={route} onNavigate={navigate}
        collapsed={collapsedSidebar}
        onToggleCollapse={() => setCollapsedSidebar((c) => !c)}
        reviewBadge={reviewBadge} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar route={{ ...route }} onNavigate={navigate} syncedAgo="8 min ago"
          opp={opp} />
        <div className="flex-1 overflow-y-auto">
          {screen}
        </div>
      </main>
      <AIRail collapsed={collapsedRail} onToggle={() => setCollapsedRail((c) => !c)}
        suggestions={suggestionsForView()}
        decisions={aiDecisions}
        onDecide={decideAI}
        contextLabel={contextLabel} />

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout" />
        <TweakToggle label="AI right rail visible" value={t.showAIRail}
          onChange={(v) => setTweak('showAIRail', v)} />
        <TweakRadio label="Density" value={t.density} options={['compact', 'regular']}
          onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Theme" />
        <TweakRadio label="Accent" value={t.accent} options={['cyan', 'violet', 'emerald']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Demo" />
        <TweakButton onClick={() => { setBudgetTrimmed(false); setMarked(false); setReadiness(window.READINESS_INITIAL); setAiDecisions({}); setSectionApprovals({ execsum: 'approved' }); setActiveStep('budget'); }}>
          Reset demo state
        </TweakButton>
        <TweakButton onClick={() => { setRoute({ screen: 'dashboard', oppId: null }); }}>
          Jump to Dashboard
        </TweakButton>
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
