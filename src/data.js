// data.jsx — All static content for the Kingmaker prototype.
// Real public solicitations + OpalAI team + ALIAS-Texas populated workspace.

const TEAM = [
  { id: 'ryan', name: 'Ryan Alimo', role: 'CEO / Principal Investigator', initials: 'RA', tone: 'cyan',
    skills: ['Adaptive sensing', 'Federal proposals', 'JPL alumni', 'Antenna scheduling'], availability: 0.62,
    bio: 'Founder/CEO. JPL veteran. PI of record on FireVision and Astro Adjuster lines.' },
  { id: 'alison', name: 'Alison Olmstead', role: 'COO / CFO', initials: 'AO', tone: 'amber',
    skills: ['Budgets & G&A', 'ITAR compliance', 'Contracts'], availability: 0.78,
    bio: 'Owns budget, compliance, and the ITAR checklist. Former program officer.' },
  { id: 'niloufar', name: 'Niloufar Abolfathian', role: 'Lead Scientist', initials: 'NA', tone: 'violet',
    skills: ['Computer vision', 'Wildfire modeling', 'NASA INNOVATE PI'], availability: 0.45,
    bio: 'Lead scientist for FireVision. PI on NASA INNOVATE FIRE-WUI submission.' },
  { id: 'ertugrul', name: 'Ertugrul Taciroglu', role: 'CIO', initials: 'ET', tone: 'sky',
    skills: ['Systems architecture', 'Structural eng. (UCLA)', 'Urbanomy'], availability: 0.68,
    bio: 'Awarded PI on Urbanomy Phase II at USDOT. UCLA structural engineering background.' },
  { id: 'larry', name: 'Larry James', role: 'Strategic Advisor (Lt. Gen., USAF Ret.)', initials: 'LJ', tone: 'rose',
    skills: ['DoD relationships', 'Strategic review', 'JPL deputy director (former)'], availability: 0.92,
    bio: 'Former Deputy Director of JPL. Strategic advisor on DoD pursuits.' },
  { id: 'aria', name: 'Aria Chen', role: 'Senior ML Engineer', initials: 'AC', tone: 'emerald',
    skills: ['Vision transformers', 'Edge inference', 'PyTorch'], availability: 0.30,
    bio: 'Owns FireVision model training pipeline. On rotation between FireVision and Urbanomy.' },
  { id: 'darius', name: 'Darius Whitfield', role: 'Proposal Manager', initials: 'DW', tone: 'cyan',
    skills: ['Federal proposals', 'SF-424', 'BD operations'], availability: 0.55,
    bio: 'Runs proposal ops day-to-day. SF-424 / DSP-83 specialist.' },
  { id: 'atharv', name: 'Atharv Arya', role: 'Research Analyst', initials: 'AA', tone: 'sky',
    skills: ['Solicitation triage', 'Q&A drafting', 'Competitive intel'], availability: 0.65,
    bio: 'Triages incoming solicitations and runs the Q&A drafting workflow during Pre-Solicitation phases.' },
  { id: 'priya', name: 'Priya Raman', role: 'Research Engineer', initials: 'PR', tone: 'violet',
    skills: ['Reinforcement learning', 'Multi-agent autonomy'], availability: 0.40,
    bio: 'Multi-agent autonomy. Recent PhD, Caltech.' },
  { id: 'jpl', name: 'Federico Rossi (JPL)', role: 'Subcontractor — JPL', initials: 'FR', tone: 'sky',
    skills: ['Multi-spacecraft swarm autonomy', 'Distributed planning'], availability: 0.20,
    bio: 'JPL principal researcher. Subcontract scoped at $500K on ALIAS-Texas.' },
];

const TEAM_BY_ID = Object.fromEntries(TEAM.map((p) => [p.id, p]));

const PRODUCT_LINES = {
  FireVision: { tone: 'rose', label: 'FireVision' },
  Urbanomy: { tone: 'sky', label: 'Urbanomy' },
  'Astro Adjuster': { tone: 'violet', label: 'Astro Adjuster' },
  ScanToBIM: { tone: 'amber', label: 'ScanToBIM' },
};

const STATUS_TONES = {
  New: 'sky',
  'Pre-Solicitation': 'sky',
  'In Triage': 'amber',
  Scoping: 'sky',
  Drafting: 'cyan',
  Selected: 'cyan',
  'In Review': 'amber',
  Ready: 'emerald',
  Submitted: 'emerald',
  Execution: 'emerald',
  Archived: 'slate',
  Saved: 'slate',
};

// Opportunities — solicitations are real public IDs.
const OPPORTUNITIES = [
  {
    id: 'alias-tx', title: 'ALIAS Missionized Autonomy for Emergency Services',
    shortTitle: 'DARPA ALIAS-Texas SBIR XL',
    sol: 'HR0011SB20254XL-01', agency: 'DARPA', ceiling: 3500000,
    deadlineDays: 9, status: 'Drafting', stage: 6, owner: 'ryan',
    productLine: 'FireVision', addedAgo: '4d',
    inferred: 'Multi-platform autonomy for fire prediction',
    program: 'SBIR Direct to Phase II (DP2)',
    deadline: 'May 13, 2026 · 11:59 PM ET',
    vol2Format: 'wp_deck',
  },
  {
    id: 'expand', title: 'Autonomous Onboard Health Management for Small Spacecraft',
    shortTitle: 'NASA SBIR EXPAND.3.S26B',
    sol: 'EXPAND.3.S26B', agency: 'NASA', ceiling: 150000,
    deadlineDays: 17, status: 'Scoping', stage: 2, owner: 'niloufar',
    productLine: 'Astro Adjuster', addedAgo: '6d',
    inferred: 'Onboard health management leveraging JPL swarm autonomy heritage',
    program: 'SBIR Phase I',
    deadline: 'May 21, 2026 · 5:00 PM ET',
    vol2Format: 'nasa_standard',
  },
  {
    id: 'innovate-firewui', title: 'NASA INNOVATE FIRE-WUI',
    sol: 'NNH24ZHA001N', agency: 'NASA', ceiling: 850000,
    deadlineDays: -3, status: 'Submitted', stage: 9, owner: 'niloufar',
    productLine: 'FireVision', addedAgo: '46d',
  },
  {
    id: 'urbanomy-p2', title: 'USDOT Urbanomy Phase II',
    sol: '693JJ325SP00007', agency: 'USDOT', ceiling: 2000000,
    deadlineDays: -67, status: 'Execution', stage: 9, owner: 'ertugrul',
    productLine: 'Urbanomy', addedAgo: '129d', awarded: true,
  },
  {
    id: 'spwx', title: 'NASA SPWX.1.S26A',
    sol: 'NASA-2026-SPWX', agency: 'NASA', ceiling: 150000,
    deadlineDays: 41, status: 'Scoping', stage: 2, owner: 'ryan',
    productLine: 'FireVision', addedAgo: '11d', inferred: 'Space-weather-adjacent sensing tasking',
  },
  {
    id: 'nsf-p1', title: 'NSF SBIR Phase I',
    sol: '24-579', agency: 'NSF', ceiling: 305000,
    deadlineDays: 19, status: 'Selected', stage: 3, owner: 'niloufar',
    productLine: 'FireVision', addedAgo: '17d',
  },
  {
    id: 'afwerx-d2p2', title: 'AFWERX STTR Direct-to-Phase II',
    sol: 'AF254-D004', agency: 'AFWERX', ceiling: 1700000,
    deadlineDays: 33, status: 'In Triage', stage: 1, owner: 'ryan',
    productLine: 'Astro Adjuster', addedAgo: '2d',
  },
  {
    id: 'arpae-scaleup', title: 'DOE ARPA-E SCALEUP',
    sol: 'DE-FOA-0003421', agency: 'DOE', ceiling: 5000000,
    deadlineDays: 52, status: 'New', stage: 0, owner: null,
    productLine: 'ScanToBIM', addedAgo: '8h',
  },
  {
    id: 'nsf-conv', title: 'NSF Convergence Accelerator',
    sol: '25-509', agency: 'NSF', ceiling: 750000,
    deadlineDays: 67, status: 'Saved', stage: 0, owner: 'alison',
    productLine: 'Urbanomy', addedAgo: '14d',
  },
  // ─── USDOT FY26 SBIR Phase I — Pre-Solicitation cohort ──────────────
  // Q&A window open through May 29; submission opens Jun 3.
  // 3 PURSUE (OS2, OS1, FH1) · 7 REJECTED (FH2, FR1, FT1, PH1-4)
  { id: 'usdot-os2', title: 'Freight Corridor Predictive Intelligence',
    sol: '26-OS2', agency: 'U.S. DOT', subAgency: 'OST/FHWA', ceiling: 200000,
    deadlineDays: 23, qaDeadline: 'May 29, 2026', solOpens: 'Jun 3, 2026',
    status: 'Pre-Solicitation', stage: 1, owner: 'ryan',
    productLine: 'Urbanomy', addedAgo: '2d',
    triageDecision: 'pursue',
    triageRationale: "Strong Urbanomy adjacency. Topic requirements — multimodal data fusion, edge AI, federated learning, synthetic digital-twin data, decision dashboard — overlap ~80% with OpalAI's existing Urbanomy stack.",
    fit: 'Strong', winProb: 'Mod-High', stratValue: 'High',
    hitList: ['City LOIs from Tier 1 footprint (LA, Austin, Nashville)', 'ATRI / NPMRDS data integration', 'Federated learning across jurisdictions'],
    risks: ['ATRI freight pipelines (WIM, truck parking) are new data feeds'],
    decidedBy: 'Ryan Alimo', decidedAt: 'May 6, 2026' },
  { id: 'usdot-os1', title: 'Predictive Safety Analytics for Commercial Transport',
    sol: '26-OS1', agency: 'U.S. DOT', subAgency: 'OST', ceiling: 200000,
    deadlineDays: 23, qaDeadline: 'May 29, 2026', solOpens: 'Jun 3, 2026',
    status: 'Pre-Solicitation', stage: 1, owner: 'ryan',
    productLine: 'Astro Adjuster', addedAgo: '2d',
    triageDecision: 'pursue',
    triageRationale: "Moderate fit. AI predictive analytics, 'Trusted Intermediary' data fusion, and explainability map to OpalAI core. Astro Adjuster's privacy-preserving data-fusion posture is a transferable capability story.",
    fit: 'Moderate', winProb: 'Moderate', stratValue: 'Moderate',
    hitList: ['Fleet partner LOI (motor carrier or telematics provider) — GATING ITEM'],
    risks: ['Cold domain — no existing relationships in commercial trucking telematics or FMCSA'],
    decidedBy: 'Ryan Alimo', decidedAt: 'May 6, 2026' },
  { id: 'usdot-fh1', title: 'Edge AI-V2X Congestion Prevention',
    sol: '26-FH1', agency: 'U.S. DOT', subAgency: 'FHWA', ceiling: 200000,
    deadlineDays: 23, qaDeadline: 'May 29, 2026', solOpens: 'Jun 3, 2026',
    status: 'Pre-Solicitation', stage: 1, owner: 'ryan',
    productLine: 'Urbanomy', addedAgo: '2d',
    triageDecision: 'pursue',
    triageRationale: "Stretch but defensible. Multi-intersection congestion prediction with edge/cloud workload partitioning is Urbanomy-adjacent. AI/edge architecture is OpalAI's wheelhouse, but V2X comms layer is genuinely outside core stack.",
    fit: 'Stretch', winProb: 'Low-Mod', stratValue: 'Moderate',
    hitList: ['State DOT or TMC partner', 'Hardware-in-the-loop testbed', 'RSU integration story'],
    risks: ['Aiwaysion holds prior FHWA SBIR awards in this exact space — competitive signal', 'V2X comms outside OpalAI core stack'],
    decidedBy: 'Ryan Alimo', decidedAt: 'May 6, 2026' },
];

// Discovery Agent — filter log of solicitations the agent rejected on OpalAI's behalf.
const DISCOVERY_AGENT = {
  scanned: 47,
  surfaced: 3,
  filtered: 44,
  window: 'Last 24 hours',
  log: [
    { id: 'fl1', source: 'USDOT 26-FR1', title: 'Mobile BESS De-energizer for Rail Propulsion',
      reason: 'hardware/power electronics, outside OpalAI domain' },
    { id: 'fl2', source: 'USDOT 26-PH2', title: 'Thermal Indicator Coatings for HazMat Packaging',
      reason: 'materials chemistry, outside OpalAI domain' },
    { id: 'fl3', source: 'USDOT 26-FT1', title: 'Person-Centered Complete Trip Planning',
      reason: "consumer mobility, outside Urbanomy's enterprise focus" },
    { id: 'fl4', source: 'USDOT 26-FH2', title: 'Automated Mobile Catch-basin Inspection',
      reason: 'civil-hardware sensor product, outside OpalAI domain' },
    { id: 'fl5', source: 'USDOT 26-PH1', title: 'End-of-Life Battery Safety / Rare Earth Recovery',
      reason: 'battery hardware / chemistry, not an OpalAI domain' },
    { id: 'fl6', source: 'USDOT 26-PH3', title: 'Self-repairing Hazardous Materials Packaging',
      reason: 'materials chemistry, not an OpalAI domain' },
    { id: 'fl7', source: 'USDOT 26-PH4', title: 'Improved Response to Lithium-ion Battery Fires',
      reason: 'response hardware / chemistry, not an OpalAI domain' },
    { id: 'fl8', source: 'SAM.gov W912HZ-26-R-0042', title: 'USACE ERDC R&D IDIQ',
      reason: 'prime-only, OpalAI not eligible' },
    { id: 'fl9', source: 'DOD SBIR AF254-D012', title: 'Classified ISR Edge Inference',
      reason: 'classified, ITAR-restricted facility requirement OpalAI does not meet' },
  ],
  hidden: 39,
};

const OPPS_BY_ID = Object.fromEntries(OPPORTUNITIES.map((o) => [o.id, o]));

// 10-step workflow
const STEPS = [
  { id: 'intake',       label: 'Intake' },
  { id: 'triage',       label: 'Triage' },
  { id: 'scope',        label: 'Scope' },
  { id: 'collaborators',label: 'Collaborators' },
  { id: 'draft',        label: 'Draft' },
  { id: 'tasks',        label: 'Tasks' },
  { id: 'timeline',     label: 'Timeline' },
  { id: 'budget',       label: 'Budget' },
  { id: 'assembly',     label: 'Assembly' },
  { id: 'submission',   label: 'Compliance' },
];

// ALIAS-Texas — populated state for the workspace
const ALIAS = {
  triage: {
    rationale:
      "This solicitation aligns with FireVision's adaptive sensing loop, which DARPA program staff described as 'part of the holy grail' in the Feb 2026 program review. Fire prediction was confirmed as the program's top priority for FY26. Lockheed letter of support is already in hand from the prior MATRIX engagement, and JPL has informally agreed to subcontract on swarm autonomy.",
    decidedBy: 'ryan', decidedAt: 'Mar 18, 2026 · 2:14 PM',
    comments: [
      { who: 'alison', at: 'Mar 17 · 4:02 PM',
        text: 'Strong fit. Lockheed letter of support already in hand. We should confirm DSP-83 status before kickoff.' },
      { who: 'niloufar', at: 'Mar 18 · 9:48 AM',
        text: 'Confirmed with Federico — JPL can scope at $500K. We should align with the MATRIX integration window.' },
    ],
  },

  scope: {
    requirements: [
      // Technical
      { group: 'Technical', text: 'Multi-platform adaptive sensing across air + ground + space tier', cov: 'partial' },
      { group: 'Technical', text: 'Real-time fire prediction from EO/IR + multispectral', cov: 'internal' },
      { group: 'Technical', text: 'Autonomy integration with Lockheed MATRIX / ALIAS', cov: 'partial' },
      { group: 'Technical', text: 'Multi-spacecraft swarm tasking algorithms', cov: 'gap' },
      { group: 'Technical', text: 'Edge inference @ ≤ 250 ms on rugged hardware', cov: 'internal' },
      // Compliance
      { group: 'Compliance', text: 'ITAR controlled — DSP-83 required for foreign nationals', cov: 'partial' },
      { group: 'Compliance', text: 'CMMC Level 2 for handling CUI', cov: 'internal' },
      { group: 'Compliance', text: 'Cost accounting standards (CAS) coverage', cov: 'internal' },
      // Submission
      { group: 'Submission', text: 'Volume I: Technical (≤ 25 pages, 11pt)', cov: 'internal' },
      { group: 'Submission', text: 'Volume II: Cost (with G&A breakdown)', cov: 'internal' },
      { group: 'Submission', text: 'SF-424 + SBIR Cover + DSP-83', cov: 'partial' },
    ],
    capabilities: [
      { name: 'FireVision adaptive sensing loop', match: 'Real-time fire prediction', tone: 'emerald' },
      { name: 'Edge runtime (Jetson Orin)', match: 'Edge inference @ ≤ 250 ms', tone: 'emerald' },
      { name: 'Multi-spectral fusion model v3.2', match: 'EO/IR + multispectral fusion', tone: 'emerald' },
      { name: 'Antenna scheduling (2024 IEEE paper)', match: 'Sensor tasking', tone: 'cyan' },
      { name: 'Swarm tasking — partial', match: 'Multi-platform autonomy', tone: 'amber' },
      { name: 'Multi-spacecraft swarm — gap', match: 'Constellation tasking', tone: 'rose' },
      { name: 'ITAR DSP-83 — partial', match: 'Compliance', tone: 'amber' },
    ],
    gaps: [
      { title: 'Multi-platform autonomy integration',
        recommendation: 'Recommend JPL subcontract — Federico Rossi has direct experience on DARPA OFFSET swarm tasking.' },
      { title: 'MATRIX/ALIAS platform integration',
        recommendation: 'Recommend Lockheed Martin as integration partner — letter of support already on file.' },
      { title: 'ITAR-cleared autonomy SME',
        recommendation: 'Open headcount: Research Scientist (proposed hire), $100K loaded.' },
    ],
  },

  collaborators: [
    { id: 'lockheed', name: 'Lockheed Martin', kind: 'Prime contractor — integration partner',
      fills: 'Platform integration (ALIAS / MATRIX)', fit: 95,
      note: 'Letter of support secured. Prior collaboration on MATRIX adaptive autonomy demo (2024).',
      status: 'accepted' },
    { id: 'jpl', name: 'NASA / JPL', kind: 'Subcontractor — algorithm partner',
      fills: 'Multi-spacecraft swarm autonomy algorithms', fit: 92,
      note: 'Subcontract scoped at $500K. Federico Rossi confirmed availability through Q3 2026.',
      status: 'accepted' },
    { id: 'rain', name: 'Rain Industries', kind: 'Suggested partner — aerial response',
      fills: 'Aerial fire response platform (autonomous helicopter)', fit: 78,
      note: 'AI suggestion. Compelling end-to-end story but adds scope risk on a 4-week response window.',
      status: 'pending' },
    { id: 'csiro', name: 'CSIRO Data61', kind: 'Suggested partner — international',
      fills: 'Wildfire dataset (Australia, 2019–2025)', fit: 64,
      note: 'AI suggestion. ITAR friction — likely not viable for SBIR XL given foreign-national restrictions.',
      status: 'pending' },
  ],

  sections: [
    { id: 'execsum', label: 'Executive Summary', pct: 100, status: 'approved', approvedBy: 'ryan', approvedAt: 'Mar 24 · 3:15 PM' },
    { id: 'tech',    label: 'Technical Approach', pct: 74, status: 'in-progress' },
    { id: 'sota',    label: 'State of the Art', pct: 60, status: 'in-progress' },
    { id: 'innov',   label: 'Innovation', pct: 40, status: 'in-progress' },
    { id: 'team',    label: 'Team & Qualifications', pct: 90, status: 'review' },
    { id: 'comm',    label: 'Commercialization', pct: 20, status: 'in-progress' },
    { id: 'refs',    label: 'References', pct: 0,  status: 'pending' },
  ],

  // The center editor — Technical Approach. Mix of AI / edited / approved paragraphs.
  draft: {
    section: 'tech',
    title: 'Technical Approach',
    paragraphs: [
      { kind: 'approved',
        author: 'ryan', when: 'Mar 23 · 11:02 AM',
        text: "FireVision's core innovation is an adaptive sensing loop that closes the gap between detection and decision. Unlike static threshold detectors, the loop continuously re-tasks sensors — airborne EO/IR, ground LiDAR, and orbital multispectral — based on a posterior fire-risk field that updates every 90 seconds. The proposed work extends this loop to a heterogeneous platform tier, integrating Lockheed Martin's MATRIX/ALIAS autonomy stack as the airborne controller and JPL multi-spacecraft swarm tasking for the orbital tier."
      },
      { kind: 'edited',
        author: 'ryan', when: '2h ago',
        text: "We validated the adaptive sensing loop against the January 2025 Palisades Fire using post-event CalFire ground truth. FireVision achieved 70%+ accuracy on 6-hour fire-front prediction at the 30 m grid scale, against a CalFire operational baseline of approximately 42% on the same event. Critically, prediction quality was preserved when sensor availability dropped by 40% — the adaptive loop re-tasked remaining sensors to maximize information gain on the predicted front."
      },
      { kind: 'ai',
        text: "For the Texas deployment region, the proposed integration with MATRIX/ALIAS will extend platform support from a single EO/IR-equipped UAV to a heterogeneous fleet including rotary-wing assets. The autonomy hand-off is mediated by a thin contract layer (FireVision-MATRIX bridge) which translates the posterior risk field into platform-native tasking primitives. This decoupling is the key technical risk reduction over Phase I, where we relied on a hand-tuned per-platform integration."
      },
      { kind: 'ai',
        text: "Multi-spacecraft swarm tasking is the most novel component of this proposal. We will integrate JPL's distributed planner (Rossi et al., 2022, building on DARPA OFFSET) as the orbital tier scheduler, with antenna-scheduling primitives drawn from our 2024 IEEE TAES paper on dynamic ground-station handoff. This combination has not been demonstrated in the wildfire domain to our knowledge, and we expect it to surface a 2–3× improvement in revisit cadence on the predicted fire front during Phase II."
      },
    ],
  },

  // Right-rail drafting suggestions
  draftSuggestions: [
    { id: 'cite',
      kind: 'enhance',
      title: 'Strengthen the technical claim with a citation',
      body: 'The antenna-scheduling claim in paragraph 4 is currently uncited. Recommend citing your 2024 IEEE TAES paper on dynamic ground-station handoff — directly substantiates the swarm-tasking primitive.',
    },
    { id: 'reuse',
      kind: 'reuse',
      title: 'Reuse framing from FireVision NASA INNOVATE',
      body: 'Section 3.2 of the FIRE-WUI proposal frames the adaptive sensing loop in 180 words. That framing scored well with NASA reviewers and would compress the current 320-word opening of Technical Approach.',
    },
    { id: 'risk',
      kind: 'risk',
      title: 'Section is ~30% shorter than past winning DARPA proposals',
      body: 'Mean Technical Approach length on Phase II SBIR XL winners (n=14) is 18.2 pages. Current draft will land at ~12.6 pages.',
    },
  ],

  tasks: [
    { who: 'ryan', role: 'CEO / PI', stream: 'Technical Vision & Strategy', alloc: 0.15, current: 0.62, rationale: 'PI of record' },
    { who: 'niloufar', role: 'Lead Scientist', stream: 'Technical Approach lead', alloc: 0.40, current: 0.45, rationale: 'Matched on NASA INNOVATE FIRE-WUI' },
    { who: 'ertugrul', role: 'CIO', stream: 'Systems Architecture', alloc: 0.25, current: 0.68, rationale: 'UCLA structural eng. — overlap on hardware enclosure' },
    { who: 'alison', role: 'COO / CFO', stream: 'Budget & compliance', alloc: 0.10, current: 0.78, rationale: 'Owns ITAR checklist and CAS' },
    { who: 'larry', role: 'Strategic Advisor', stream: 'Strategic review', alloc: 0.05, current: 0.92, rationale: 'DoD relationships, prior MATRIX context' },
    { who: 'jpl', role: 'Subcontractor', stream: 'Algorithm consulting', alloc: 0.05, current: 0.20, rationale: 'Multi-spacecraft swarm SME' },
  ],

  timeline: {
    weeks: 4, todayWeek: 2.4,
    bands: [
      { id: 'kick',   label: 'Kickoff & framing',          start: 0.0, end: 0.4, lane: 0, owner: 'ryan',     tone: 'cyan' },
      { id: 'tech',   label: 'Technical drafting',         start: 0.4, end: 2.4, lane: 0, owner: 'niloufar', tone: 'cyan' },
      { id: 'review', label: 'Internal review (round 1)',  start: 2.0, end: 2.7, lane: 1, owner: 'ryan',     tone: 'sky' },
      { id: 'partner',label: 'Partner inputs (Lockheed, JPL)', start: 1.4, end: 2.6, lane: 2, owner: 'larry', tone: 'violet' },
      { id: 'budget', label: 'Budget build',               start: 1.8, end: 3.0, lane: 3, owner: 'alison',   tone: 'cyan' },
      { id: 'compl',  label: 'Compliance check',           start: 3.0, end: 3.4, lane: 3, owner: 'alison',   tone: 'amber', risk: true },
      { id: 'asm',    label: 'Final assembly',             start: 3.3, end: 3.85, lane: 0, owner: 'darius',  tone: 'cyan' },
      { id: 'sub',    label: 'Submission',                 start: 3.85, end: 4.0, lane: 0, owner: 'darius',  tone: 'emerald' },
    ],
    deps: [
      ['kick', 'tech'], ['tech', 'review'], ['partner', 'review'],
      ['review', 'asm'], ['budget', 'compl'], ['compl', 'asm'], ['asm', 'sub'],
    ],
  },
};

// Budget — initial state. Indirect rate is calculated on direct totals.
const BUDGET_LINES_INITIAL = [
  { id: 'p-ryan',  category: 'Personnel',     item: 'Ryan Alimo (PI, 15%)',                      amount: 52000,  rationale: '' },
  { id: 'p-nilo',  category: 'Personnel',     item: 'Niloufar Abolfathian (40%)',                amount: 148000, rationale: '' },
  { id: 'p-ert',   category: 'Personnel',     item: 'Ertugrul Taciroglu (25%)',                  amount: 94000,  rationale: '' },
  { id: 'p-hire',  category: 'Personnel',     item: 'Research Scientist (proposed hire)',         amount: 100000, rationale: 'Capability gap: ITAR-cleared autonomy SME', ai: true },
  { id: 's-jpl',   category: 'Subcontracts',  item: 'JPL — multi-spacecraft swarm autonomy',     amount: 500000, rationale: 'Cap per JPL agreement', ai: true },
  { id: 's-lm',    category: 'Subcontracts',  item: 'Lockheed Martin — MATRIX integration',       amount: 180000, rationale: 'Platform integration support', ai: true },
  { id: 'e-gpu',   category: 'Equipment',     item: '2× H100 GPU server',                         amount: 10000,  rationale: 'Required for fire model training', ai: true },
  { id: 'c-azure', category: 'Cloud / Software', item: 'Azure compute',                           amount: 25000,  rationale: '' },
  { id: 'c-data',  category: 'Cloud / Software', item: 'Data subscriptions (Planet, Maxar)',       amount: 8000,   rationale: '' },
  { id: 't-trav',  category: 'Travel',        item: 'DARPA site visits, conferences',             amount: 12000,  rationale: '' },
];

const BUDGET_INDIRECT_RATE = 0.67; // applied to direct costs to hit ceiling

// Knowledge base — past proposals
const KB = [
  { id: 'firewui',  title: 'NASA INNOVATE FIRE-WUI',           agency: 'NASA',   year: '2024', tags: ['FireVision', 'Fire'], status: 'Submitted', reuse: 4 },
  { id: 'urbano1',  title: 'USDOT Urbanomy Phase I',           agency: 'USDOT',  year: '2024', tags: ['Urbanomy'],            status: 'Won', reuse: 7 },
  { id: 'afwerx-p1',title: 'AFWERX STTR Phase I',              agency: 'AFWERX', year: '2024', tags: ['Astro Adjuster'],      status: 'Won', reuse: 3 },
  { id: 'arpae',    title: 'ARPA-E SWARM SOLAR (concept)',     agency: 'DOE',    year: '2024', tags: ['ScanToBIM'],           status: 'Lost', reuse: 2 },
  { id: 'darpa-am', title: 'DARPA AI Mission Initiative',      agency: 'DARPA',  year: '2023', tags: ['FireVision'],          status: 'Won', reuse: 11 },
  { id: 'nsf-p1',   title: 'NSF SBIR Phase I (FireVision)',    agency: 'NSF',    year: '2025', tags: ['FireVision'],          status: 'Won', reuse: 5 },
  { id: 'nasa-tipx',title: 'NASA TIPS-X Concept Study',        agency: 'NASA',   year: '2023', tags: ['Astro Adjuster'],      status: 'Lost', reuse: 1 },
  { id: 'sba-bfa',  title: 'SBA Boots-to-Business Application',agency: 'SBA',    year: '2022', tags: ['Ops'],                  status: 'Won', reuse: 0 },
];

// AI activity feed — recent
const AI_FEED = [
  { at: '14m ago', text: 'Drafted Technical Approach §3 for ALIAS-Texas using FIRE-WUI §3.2 framing.' },
  { at: '38m ago', text: 'Flagged compliance risk: 3-day buffer between compliance check and submission.' },
  { at: '1h ago',  text: 'Recommended JPL ($500K) and Lockheed ($180K) subcontracts for ALIAS-Texas.' },
  { at: '2h ago',  text: 'Auto-extracted 47 requirements from HR0011SB20254XL-01 and tagged 11 gaps.' },
  { at: '4h ago',  text: 'Synced 12 new opportunities from SAM.gov, SBIR.gov, and 3 agency portals.' },
  { at: '6h ago',  text: 'Suggested FireVision NASA INNOVATE references for State of the Art section.' },
];

// "Needs your attention" queue items — spans both hero opportunities
const NEEDS = [
  { id: 'na-os2', oppId: 'usdot-os2', text: 'Q&A questions + Tier 1 city LOI outreach needed', urgency: 'low',    ago: '12m ago', daysLeft: 23, ownerOverride: 'atharv', routeStep: 'triage' },
  { id: 'na-os1', oppId: 'usdot-os1', text: 'Fleet partner LOI is gating — source telematics relationships', urgency: 'low',    ago: '12m ago', daysLeft: 23, ownerOverride: 'atharv', routeStep: 'triage' },
  { id: 'na-fh1', oppId: 'usdot-fh1', text: 'Aiwaysion incumbent risk — review prior awards before committing', urgency: 'review', ago: '12m ago', daysLeft: 23, ownerOverride: 'atharv', routeStep: 'triage' },
  { id: 'na1', oppId: 'alias-tx', text: 'Volume 7 (Foreign Affiliations) not started',  urgency: 'high',   ago: '32m ago', daysLeft: 9 },
  { id: 'na2', oppId: 'expand',   text: 'OSDMP not drafted — NASA-specific',            urgency: 'medium', ago: '1h ago',  daysLeft: 17 },
  { id: 'na3', oppId: 'alias-tx', text: '4 of 5 letters of support outstanding',        urgency: 'medium', ago: '2h ago',  daysLeft: 9 },
  { id: 'na4', oppId: 'alias-tx', text: 'Budget v2 ready for your review',              urgency: 'medium', ago: '14m ago', daysLeft: 9 },
  { id: 'na5', oppId: 'expand',   text: 'Niloufar requested input on Technical §2',     urgency: 'low',    ago: '4h ago',  daysLeft: 17 },
  { id: 'na6', oppId: 'afwerx-d2p2', text: 'Triage decision pending',                   urgency: 'low',    ago: '6h ago',  daysLeft: 33 },
];

// Pipeline funnel data
const FUNNEL = [
  { stage: 'New',       count: 12 },
  { stage: 'Triage',    count: 6 },
  { stage: 'Scoping',   count: 4 },
  { stage: 'Drafting',  count: 3 },
  { stage: 'Review',    count: 2 },
  { stage: 'Submitted', count: 1 },
];

// Compliance / assembly checklist
const ASSEMBLY = {
  outline: [
    { id: 'cover', label: 'Cover Sheet',          ok: true },
    { id: 'execsum', label: 'Executive Summary',  ok: true },
    { id: 'tech',  label: 'Technical Approach',   ok: true },
    { id: 'sota',  label: 'State of the Art',     ok: true },
    { id: 'innov', label: 'Innovation',           ok: true },
    { id: 'team',  label: 'Team & Qualifications',ok: true },
    { id: 'comm',  label: 'Commercialization',    ok: false },
    { id: 'refs',  label: 'References',           ok: false },
    { id: 'cost',  label: 'Cost Volume',          ok: true },
  ],
  forms: [
    { id: 'sf424',  label: 'SF-424',                 ok: true,  note: 'Generated, signed by Ryan' },
    { id: 'sbir',   label: 'SBIR Cover Sheet',       ok: true,  note: 'Generated' },
    { id: 'dsp83',  label: 'DSP-83 (ITAR)',          ok: false, note: 'Pending — Alison verifying' },
    { id: 'cas',    label: 'Cost Accounting Disclosure', ok: true, note: 'Disclosed; no CAS coverage required at <$10M' },
  ],
  approvals: [
    { who: 'niloufar', role: 'Technical', status: 'approved', at: 'Apr 9 · 4:32 PM' },
    { who: 'alison',   role: 'Budget',    status: 'approved', at: 'Apr 10 · 11:08 AM' },
    { who: 'ryan',     role: 'Final',     status: 'pending',  at: null },
  ],
  compliance: [
    { req: 'Vol. I ≤ 25 pages, 11 pt',                 ok: true },
    { req: 'Vol. II Cost — G&A breakdown included',    ok: true },
    { req: 'SF-424 attached, signed',                  ok: true },
    { req: 'SBIR Cover Sheet attached',                ok: true },
    { req: 'DSP-83 attached (ITAR)',                   ok: false },
    { req: 'CMMC Level 2 attestation',                 ok: true },
    { req: 'Direct-to-Phase II eligibility statement', ok: true },
    { req: 'Letters of support — Lockheed Martin',      ok: true },
    { req: 'Subcontract scope — JPL',                  ok: true },
    { req: 'Commercialization plan',                   ok: false },
  ],
};

// ─────────────────────────────────────────────────────────────────
// Compliance & Documents — format-aware per opportunity
// ─────────────────────────────────────────────────────────────────

const COMPLIANCE = {
  'alias-tx': {
    volumes: [
      { n: 1, title: 'Proposal Cover Sheet', status: 'complete', meta: '2,847 / 3,000 chars' },
      { n: 2, title: 'Technical Volume', subtitle: 'White Paper + Slide Deck', status: 'progress', meta: 'WP 14/20 pg · Deck 11/15 slides' },
      { n: 3, title: 'Cost Volume', status: 'progress', meta: 'DARPA topic-specific Excel template' },
      { n: 4, title: 'Company Commercialization Report', subtitle: 'CCR', status: 'complete', meta: 'Auto-generated from DSIP' },
      { n: 5, title: 'Supporting Documents', status: 'partial', meta: '4 of 7 items uploaded' },
      { n: 6, title: 'Fraud, Waste & Abuse Training', status: 'complete', meta: 'Annual cert valid through Dec 2026' },
      { n: 7, title: 'Foreign Affiliations Disclosure', status: 'notstarted', meta: 'DSIP webform — must complete in portal', webform: true },
    ],
    format: [
      '10 pt font minimum',
      '8.5" × 11" paper, 1-inch margins',
      'White Paper ≤ 20 pages',
      'Slide Deck ≤ 15 slides',
      'Commercialization section ≤ 5 pages (does NOT count against page limit)',
      'Single PDF for upload, no embedded video',
      'Header on every page: company name + topic # + DSIP proposal #',
    ],
    checklist: {
      'Letters of Support': [
        { id: 'los-lm',    label: 'Lockheed Martin', ok: true,  meta: 'draft prepared, awaiting signature' },
        { id: 'los-cf',    label: 'CAL FIRE',         ok: false, meta: 'requested 4/29, no response' },
        { id: 'los-ab',    label: 'Air Brothers',     ok: false, meta: 'private firefighting agency' },
        { id: 'los-la',    label: 'LADWP',            ok: false, meta: 'Mona Freels — relationship from FireVision' },
        { id: 'los-sb',    label: 'San Bernardino County Fire Dept.', ok: false, meta: '' },
      ],
      'Registration & Admin': [
        { id: 'ra-dsip',   label: 'DSIP registration', ok: true, meta: 'Defense SBIR/STTR Innovation Portal' },
        { id: 'ra-sam',    label: 'SAM.gov registration current', ok: true, meta: 'expires Mar 2027' },
        { id: 'ra-nist',   label: 'NIST SP 800-171 DoD Assessment', ok: true, meta: 'complete' },
        { id: 'ra-darpa',  label: 'DARPAConnect membership', ok: true, meta: '' },
        { id: 'ra-fwa1',   label: 'Fraud/Waste/Abuse Training (Ryan, Alison)', ok: true, meta: 'complete in DSIP' },
        { id: 'ra-fwa2',   label: 'Fraud/Waste/Abuse Training (Niloufar)', ok: false, meta: 'pending' },
      ],
      'Pre-Submission': [
        { id: 'ps-ot1',    label: 'OT Agreement template downloaded', ok: true,  meta: '' },
        { id: 'ps-ot2',    label: 'OT Agreement completed and reviewed', ok: false, meta: '' },
        { id: 'ps-cp1',    label: 'Cost Proposal template downloaded', ok: true,  meta: '' },
        { id: 'ps-cp2',    label: 'Cost Proposal completed', ok: false, meta: '' },
        { id: 'ps-tq',     label: 'Technical questions submitted', ok: false, meta: 'SBIR_BAA@darpa.mil' },
        { id: 'ps-loi',    label: 'Non-DARPA funding partner LOI ($500K match)', ok: false, meta: '' },
        { id: 'ps-itar1',  label: 'ITAR compliance verified — Ryan, Alison, Niloufar', ok: true, meta: '' },
        { id: 'ps-itar2',  label: 'ITAR compliance verified — Ertugrul', ok: false, meta: '' },
      ],
    },
    keyDates: [
      { label: 'Solicitation opens', when: 'Wed after SBIR reauthorization' },
      { label: 'Submission window', when: '4 weeks' },
      { label: 'One-on-one discussions end', when: 'when solicitation opens' },
      { label: 'Selection notification', when: 'within 90 days of BAA closing' },
      { label: 'Exercise timeline', when: 'late 2027 / early 2028 · RELLIS campus' },
    ],
    aiSuggestions: [
      { kind: 'warn',  text: 'Volume 7 (Foreign Affiliations) is a DSIP webform — not a PDF. It must be completed inside the portal. Estimated time: 30 minutes.' },
      { kind: 'info',  text: 'Your white paper is currently 14 pages. The 5-page Commercialization section does NOT count against the 20-page limit, so you have ~6 pages of headroom. Consider expanding the Technical Plan.' },
      { kind: 'nudge', text: 'CAL FIRE letter of support has been outstanding for 5 days. Want me to draft a follow-up to Mona Freels?' },
      { kind: 'warn',  text: 'Slide 9 (Technical Quad Chart) must use the DARPA template. The current slide does not match the template.' },
    ],
  },
  'expand': {
    volumes: [
      { n: 'A', title: 'NSPIRES Cover Page & Forms', status: 'progress', meta: 'Forms 1426, 1427' },
      { n: 'B', title: 'Technical Volume', subtitle: '≤5 pages', status: 'progress', meta: '3 of 5 pages drafted' },
      { n: 'C', title: 'References & Citations', status: 'na', meta: 'Separate from page count' },
      { n: 'D', title: 'Open-Source Data Mgmt Plan', subtitle: 'OSDMP', status: 'notstarted', meta: 'NASA-specific requirement' },
      { n: 'E', title: 'Budget Justification', status: 'progress', meta: 'NASA template' },
      { n: 'F', title: 'Key Personnel Bio Sketches', status: 'partial', meta: '2 of 4 complete' },
      { n: 'G', title: 'Letters of Commitment / Support', status: 'partial', meta: 'JPL secured' },
      { n: 'H', title: 'Cost Volume', subtitle: 'NASA SBIR template', status: 'notstarted', meta: '' },
    ],
    format: [
      '12 pt Times New Roman or 11 pt Arial',
      '1-inch margins',
      'Technical Volume ≤ 5 pages',
      'References excluded from page count',
      'PDF with embedded fonts',
    ],
    checklist: {
      'Letters of Commitment': [
        { id: 'eloc-jpl', label: 'JPL — multi-spacecraft swarm autonomy', ok: true,  meta: 'signed by Federico Rossi' },
        { id: 'eloc-cal', label: 'Caltech — academic partner', ok: false, meta: 'requested 5/2' },
      ],
      'Registration & Admin': [
        { id: 'era-nspires', label: 'NSPIRES account verified',     ok: true,  meta: '' },
        { id: 'era-sam',     label: 'SAM.gov registration current', ok: true,  meta: 'expires Mar 2027' },
        { id: 'era-nasa',    label: 'NASA SBIR firm registration',  ok: true,  meta: '' },
        { id: 'era-cage',    label: 'CAGE/UEI on file',             ok: true,  meta: '' },
      ],
      'Pre-Submission': [
        { id: 'eps-osdmp', label: 'OSDMP drafted',                  ok: false, meta: 'reuse INNOVATE FIRE-WUI OSDMP' },
        { id: 'eps-bio1',  label: 'Bio sketches — Niloufar, JPL',   ok: true,  meta: '' },
        { id: 'eps-bio2',  label: 'Bio sketches — Ryan, Aria',      ok: false, meta: '' },
        { id: 'eps-cost',  label: 'Cost Volume drafted',            ok: false, meta: '' },
        { id: 'eps-page',  label: 'Technical Volume within 5 pages', ok: false, meta: 'currently 5.3 pp' },
      ],
    },
    keyDates: [
      { label: 'Solicitation opens',   when: 'Apr 14, 2026' },
      { label: 'Proposal due',         when: 'May 21, 2026 · 5:00 PM ET' },
      { label: 'Selection notification', when: 'within 60 days of close' },
      { label: 'Period of performance', when: '6 months from award' },
    ],
    aiSuggestions: [
      { kind: 'info',  text: 'NASA OSDMP (Open-Source Data Management Plan) is required. I can draft based on your INNOVATE FIRE-WUI OSDMP — accept?' },
      { kind: 'warn',  text: 'Your Technical Volume is at 5.3 pages. NASA hard-cuts at 5. Recommend trimming the Related R&D section.' },
      { kind: 'nudge', text: 'Caltech letter of commitment requested 2 days ago. Want me to nudge Federico to follow up?' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────
// Assembly — format-aware Volume 2 outline
// ─────────────────────────────────────────────────────────────────

const ASSEMBLY_FORMAT = {
  'alias-tx': {
    kind: 'wp_deck',
    whitePaper: {
      pageLimit: 20,
      pages: 14,
      sections: [
        { id: 'goals',  label: 'Goals and Impact',                                 pages: 2, status: 'approved' },
        { id: 'feas',   label: 'Phase I Feasibility',                              pages: 3, status: 'approved', note: 'DP2-specific — must show feasibility achieved outside SBIR' },
        { id: 'plan',   label: 'Technical Plan',                                   pages: 5, status: 'review',   note: 'Milestones at ≤1-month increments' },
        { id: 'mgmt',   label: 'Management and Capabilities',                     pages: 2, status: 'draft' },
        { id: 'comm',   label: 'Transition and Commercialization Plan',           pages: 5, status: 'draft',    note: '≤5 pages, does NOT count against limit' },
      ],
    },
    deck: {
      slideLimit: 15,
      slides: 11,
      mandatory: [
        { n: 1,  label: 'What are you doing and how does it relate to the topic?',  status: 'approved' },
        { n: 2,  label: 'Technology and commercial product',                        status: 'approved' },
        { n: 3,  label: 'State of the art today',                                   status: 'review' },
        { n: 4,  label: 'Technical and commercial value proposition',               status: 'review' },
        { n: 5,  label: 'Technical and commercial risks',                           status: 'draft' },
        { n: 6,  label: 'Market analysis',                                          status: 'draft' },
        { n: 7,  label: 'Cost, schedule, and milestones',                           status: 'draft' },
        { n: 8,  label: 'Management overview',                                      status: 'draft' },
        { n: 9,  label: 'Technical Quad Chart',                                     status: 'todo', template: 'DARPA template required' },
        { n: 10, label: 'Commercialization Quad Chart',                             status: 'todo', template: 'DARPA TCSP template required' },
      ],
    },
  },
  'expand': {
    kind: 'nasa_standard',
    sections: [
      { id: 'inn',    label: 'Identification and Significance of the Innovation',  status: 'approved' },
      { id: 'obj',    label: 'Technical Objectives',                                status: 'review' },
      { id: 'plan',   label: 'Work Plan',                                           status: 'draft' },
      { id: 'rd',     label: 'Related R&D',                                         status: 'draft' },
      { id: 'kp',     label: 'Key Personnel',                                       status: 'draft' },
      { id: 'fut',    label: 'Relationship with Future R&D',                        status: 'todo' },
      { id: 'fac',    label: 'Facilities and Equipment',                            status: 'draft' },
      { id: 'sub',    label: 'Subcontracts and Consultants',                        status: 'todo' },
      { id: 'post',   label: 'Potential Post-Applications',                         status: 'todo' },
      { id: 'eep',    label: 'Essentially Equivalent Proposals or Awards',          status: 'todo' },
    ],
  },
};

// Submission readiness
const READINESS_INITIAL = [
  { id: 'r1', label: 'All sections approved',                  ok: false, blocker: 'Commercialization & References pending' },
  { id: 'r2', label: 'All forms attached',                     ok: false, blocker: 'DSP-83 pending' },
  { id: 'r3', label: 'Budget reconciled to ceiling',           ok: true },
  { id: 'r4', label: 'Compliance checks pass',                 ok: true },
  { id: 'r5', label: 'PDF compiled & paginated',               ok: true },
  { id: 'r6', label: 'Section 508 / accessibility attestation',ok: true },
  { id: 'r7', label: 'Final approver sign-off',                ok: false, blocker: 'Awaiting Ryan' },
];

export {
  TEAM,
  TEAM_BY_ID,
  PRODUCT_LINES,
  STATUS_TONES,
  OPPORTUNITIES,
  OPPS_BY_ID,
  STEPS,
  ALIAS,
  DISCOVERY_AGENT,
  BUDGET_LINES_INITIAL,
  BUDGET_INDIRECT_RATE,
  KB,
  AI_FEED,
  NEEDS,
  FUNNEL,
  ASSEMBLY,
  READINESS_INITIAL,
  COMPLIANCE,
  ASSEMBLY_FORMAT,
};
