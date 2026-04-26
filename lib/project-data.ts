export type ProjectSide = 'evergold' | 'spoetzl' | 'both';

export type StatusTone =
  | 'green'
  | 'amber'
  | 'blue'
  | 'red'
  | 'slate'
  | 'purple';

export interface ProjectMetric {
  label: string;
  value: string;
  detail: string;
  tone: StatusTone;
}

export interface VisionPrinciple {
  title: string;
  detail: string;
  proof: string;
}

export interface ProjectZone {
  id: string;
  name: string;
  area: string;
  status: 'Vision' | 'Clarifying' | 'Quoted' | 'Approved' | 'Scheduled' | 'In Progress' | 'Maintenance';
  tone: StatusTone;
  owner: ProjectSide;
  nextAction: string;
  summary: string;
  designIntent: string;
  plantPalette: string[];
  linkedProposalId?: string;
  openQuestions: number;
  photoStage: 'before' | 'concept' | 'progress' | 'after';
}

export interface ClarityGap {
  id: string;
  title: string;
  zone: string;
  owner: ProjectSide;
  priority: 'High' | 'Medium' | 'Low';
  due: string;
  status: 'Open' | 'Drafted' | 'Needs Spoetzl' | 'Needs Evergold' | 'Resolved';
  question: string;
  recommendation: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  target: string;
  requestedBy: string;
  approver: string;
  due: string;
  status: 'Ready' | 'Waiting' | 'Changes Requested' | 'Signed';
  lockedScope: string;
}

export interface ProposalLineItem {
  zone: string;
  scope: string;
  cost: string;
  status: 'Draft' | 'Ready' | 'Approved' | 'Needs Revision';
}

export interface Proposal {
  id: string;
  title: string;
  version: string;
  status: 'Draft' | 'Client Review' | 'Revision Needed' | 'Approved' | 'Scheduled';
  value: string;
  updated: string;
  summary: string;
  includes: string[];
  assumptions: string[];
  lineItems: ProposalLineItem[];
  approvalCopy: string;
}

export interface WorkLog {
  id: string;
  date: string;
  title: string;
  zone: string;
  author: string;
  side: ProjectSide;
  status: 'Logged' | 'Blocked' | 'Needs Review' | 'Complete';
  summary: string;
  visibleToClient: boolean;
}

export interface WalkthroughStop {
  zone: string;
  goal: string;
  evidence: string;
  openItem: string;
}

export interface Walkthrough {
  id: string;
  title: string;
  date: string;
  type: 'Requirements' | 'Progress' | 'Final';
  status: 'Scheduled' | 'Recorded' | 'Needs Summary' | 'Complete';
  attendees: string[];
  summary: string;
  stops: WalkthroughStop[];
}

export interface TimelineEvent {
  date: string;
  title: string;
  detail: string;
  status: 'Done' | 'Today' | 'Next' | 'Later';
}

export const projectOverview = {
  name: 'Spoetzl Brewery Landscape Vision',
  client: 'Spoetzl Brewery',
  contractor: 'Evergold Landscaping',
  location: 'Shiner, Texas',
  phase: 'Vision alignment and phase-one scoping',
  health: 'Needs 3 decisions before phase-one approval',
  today: 'Quiet maintenance day. No install crew scheduled. Best use of today is approval review, clarity cleanup, and field-photo organization.',
  nextMilestone: 'Phase-one scope review',
  nextMilestoneDate: 'May 3, 2026',
  primaryGoal:
    'Create a shared visual source of truth so Spoetzl and Evergold can align on vision, zones, quotes, decisions, and work progress without ambiguity.',
};

export const projectMetrics: ProjectMetric[] = [
  {
    label: 'Open clarity gaps',
    value: '7',
    detail: '3 high priority before approval',
    tone: 'amber',
  },
  {
    label: 'Pending approvals',
    value: '2',
    detail: 'Entrance concept and irrigation allowance',
    tone: 'blue',
  },
  {
    label: 'Mapped zones',
    value: '6',
    detail: 'Entrance, taproom edge, parking, tour path, utilities, event lawn',
    tone: 'green',
  },
  {
    label: 'Next event',
    value: '7 days',
    detail: 'Scope review packet due May 3',
    tone: 'purple',
  },
];

export const visionPrinciples: VisionPrinciple[] = [
  {
    title: 'Brewery heritage first',
    detail:
      'Landscape choices should feel rooted in Shiner, Texas and the German/Czech brewery story rather than copied directly from a theme park.',
    proof: 'Use stone, steel, oak shade, hardy seasonal color, and brewery-facing guest moments.',
  },
  {
    title: 'Busch Gardens as inspiration, not imitation',
    detail:
      'Borrow the clarity of themed zones, photo moments, seasonal rhythm, and layered planting while adapting every plant and material to Central Texas.',
    proof: 'Each proposal should cite which inspiration idea it translates and why it fits Shiner.',
  },
  {
    title: 'Every zone has a job',
    detail:
      'A flower bed, path edge, sign bed, or lawn should have an agreed purpose: arrival, shade, photos, queue comfort, maintenance, or event support.',
    proof: 'No quote should be approved unless its zones have purpose, scope, and acceptance criteria.',
  },
  {
    title: 'Visual proof beats long explanations',
    detail:
      'Before/after sets, zone maps, marked photos, and walkthrough summaries should make decisions easy for both teams to understand quickly.',
    proof: 'Every approval packet should include the map zone, visual board, cost, open risks, and signoff language.',
  },
];

export const projectZones: ProjectZone[] = [
  {
    id: 'entrance-sign-bed',
    name: 'Entrance Sign Bed',
    area: '2,450 sq ft',
    status: 'Quoted',
    tone: 'blue',
    owner: 'both',
    nextAction: 'Spoetzl to approve color direction or request one revision.',
    summary:
      'High-visibility arrival bed around the brewery sign and primary guest photo approach.',
    designIntent:
      'Create a stronger first impression with low-water seasonal color, limestone edging, and a photo-friendly frame that does not block the sign.',
    plantPalette: ['Texas sage', 'Gulf muhly', 'Dwarf yaupon', 'Seasonal lantana'],
    linkedProposalId: 'phase-one-arrival',
    openQuestions: 2,
    photoStage: 'concept',
  },
  {
    id: 'tour-path-edge',
    name: 'Tour Path Edge',
    area: '480 linear ft',
    status: 'Clarifying',
    tone: 'amber',
    owner: 'evergold',
    nextAction: 'Confirm irrigation coverage and pedestrian clear width.',
    summary:
      'Guest walking route between parking, tour entry, and brewery-facing view corridors.',
    designIntent:
      'Use rhythm, shade, and repeated plant masses to make the walk feel intentional without narrowing maintenance access.',
    plantPalette: ['Liriope', 'Autumn sage', 'Mexican feathergrass', 'Live oak understory mix'],
    linkedProposalId: 'phase-one-arrival',
    openQuestions: 3,
    photoStage: 'before',
  },
  {
    id: 'taproom-patio-edge',
    name: 'Taproom Patio Edge',
    area: '1,100 sq ft',
    status: 'Vision',
    tone: 'purple',
    owner: 'spoetzl',
    nextAction: 'Spoetzl to define event seating and photo-moment priority.',
    summary:
      'Guest-facing patio border with the strongest opportunity for before/after storytelling.',
    designIntent:
      'Soften the patio edge, preserve circulation, and create a seasonal photo backdrop that feels like Shiner rather than a resort.',
    plantPalette: ['Rosemary', 'Salvia greggii', 'Dwarf palmetto', 'Possumhaw holly'],
    openQuestions: 1,
    photoStage: 'before',
  },
  {
    id: 'event-lawn',
    name: 'Event Lawn',
    area: '0.8 acre',
    status: 'Maintenance',
    tone: 'green',
    owner: 'evergold',
    nextAction: 'Monitor turf stress after next hot week and log irrigation observations.',
    summary:
      'Flexible open lawn for brewery gatherings, overflow activity, and seasonal events.',
    designIntent:
      'Keep the lawn durable, clean-edged, and ready for event load while identifying future shade and path improvements.',
    plantPalette: ['Turf renovation mix', 'Live oak shade opportunities', 'Native perimeter grasses'],
    openQuestions: 0,
    photoStage: 'progress',
  },
  {
    id: 'parking-arrival',
    name: 'Parking Arrival Edge',
    area: '620 linear ft',
    status: 'Scheduled',
    tone: 'green',
    owner: 'evergold',
    nextAction: 'Prepare before-photo route and material staging plan.',
    summary:
      'Functional edge where first impressions, heat, drainage, and maintenance all meet.',
    designIntent:
      'Clarify arrival with hardy plant rhythm and cleaner bed geometry while keeping sightlines safe.',
    plantPalette: ['Agave', 'Red yucca', 'Texas sotol', 'Decomposed granite mulch'],
    linkedProposalId: 'phase-one-arrival',
    openQuestions: 1,
    photoStage: 'before',
  },
  {
    id: 'utility-screening',
    name: 'Utility Screening',
    area: '900 sq ft',
    status: 'Clarifying',
    tone: 'amber',
    owner: 'both',
    nextAction: 'Confirm clearance requirements before quoting screen planting.',
    summary:
      'Back-of-house views that need screening without causing access or code problems.',
    designIntent:
      'Use layered evergreen screening only where access, drainage, and brewery operations allow it.',
    plantPalette: ['Wax myrtle', 'Yaupon holly', 'Texas mountain laurel'],
    openQuestions: 2,
    photoStage: 'before',
  },
];

export const clarityGaps: ClarityGap[] = [
  {
    id: 'cg-001',
    title: 'Entrance color story needs one owner decision',
    zone: 'Entrance Sign Bed',
    owner: 'spoetzl',
    priority: 'High',
    due: 'April 29, 2026',
    status: 'Needs Spoetzl',
    question:
      'Should phase one lean more Shiner brand red/gold or more natural Texas sage/purple with seasonal color accents?',
    recommendation:
      'Approve Texas sage/purple as the durable base, then reserve brand color for seasonal rotations and event weeks.',
  },
  {
    id: 'cg-002',
    title: 'Irrigation allowance is not locked',
    zone: 'Tour Path Edge',
    owner: 'evergold',
    priority: 'High',
    due: 'April 30, 2026',
    status: 'Drafted',
    question:
      'Does the current system support new beds, or should the proposal carry a separate irrigation repair/extension allowance?',
    recommendation:
      'Add a visible allowance line item and mark it as adjustable after field verification.',
  },
  {
    id: 'cg-003',
    title: 'Patio photo-moment priority is unclear',
    zone: 'Taproom Patio Edge',
    owner: 'spoetzl',
    priority: 'Medium',
    due: 'May 1, 2026',
    status: 'Open',
    question:
      'Is the patio edge primarily a seating comfort improvement, a branded photo backdrop, or a low-maintenance softening pass?',
    recommendation:
      'Choose one primary job for phase one and defer secondary goals to the next proposal version.',
  },
  {
    id: 'cg-004',
    title: 'Utility clearance requirements need confirmation',
    zone: 'Utility Screening',
    owner: 'both',
    priority: 'High',
    due: 'April 30, 2026',
    status: 'Needs Evergold',
    question:
      'What clearance must remain around utility equipment for brewery operations and service access?',
    recommendation:
      'Walk the zone with operations before any screen planting is quoted.',
  },
  {
    id: 'cg-005',
    title: 'Event week blackout dates needed',
    zone: 'Event Lawn',
    owner: 'spoetzl',
    priority: 'Medium',
    due: 'May 2, 2026',
    status: 'Open',
    question:
      'Which brewery events should block disruptive install work or require the site to look photo-ready?',
    recommendation:
      'Add event dates to the project calendar and use them as proposal schedule constraints.',
  },
];

export const approvalItems: ApprovalItem[] = [
  {
    id: 'approval-entrance-v1',
    title: 'Entrance Sign Bed concept direction',
    target: 'Phase One Arrival Proposal v1.2',
    requestedBy: 'Evergold Landscaping',
    approver: 'Spoetzl Brewery',
    due: 'May 3, 2026',
    status: 'Ready',
    lockedScope:
      'Approves the concept direction, color strategy, and zone boundaries. Final quantities remain subject to field verification.',
  },
  {
    id: 'approval-irrigation-allowance',
    title: 'Irrigation inspection allowance',
    target: 'Tour Path Edge and Parking Arrival Edge',
    requestedBy: 'Evergold Landscaping',
    approver: 'Spoetzl Brewery',
    due: 'May 3, 2026',
    status: 'Waiting',
    lockedScope:
      'Approves Evergold to inspect, document, and quote required irrigation work before plant installation begins.',
  },
];

export const proposals: Proposal[] = [
  {
    id: 'phase-one-arrival',
    title: 'Phase One Arrival Experience',
    version: 'v1.2',
    status: 'Client Review',
    value: '$38,400 estimate',
    updated: 'April 25, 2026',
    summary:
      'A first-phase package focused on arrival clarity, brewery sign presence, parking edge cleanup, and the tour path experience.',
    includes: [
      'Mapped zone boundaries with before-photo requirements',
      'Entrance sign bed concept and planting direction',
      'Parking arrival edge cleanup and hardy plant rhythm',
      'Tour path planting allowance pending irrigation verification',
    ],
    assumptions: [
      'Final plant counts adjust after field measurements are approved.',
      'Irrigation repair is carried as an allowance until inspection is complete.',
      'No disruptive work scheduled during confirmed brewery event windows.',
    ],
    lineItems: [
      {
        zone: 'Entrance Sign Bed',
        scope: 'Bed reshaping, limestone edge, base planting, seasonal color allowance',
        cost: '$14,200',
        status: 'Ready',
      },
      {
        zone: 'Parking Arrival Edge',
        scope: 'Bed cleanup, decomposed granite mulch, low-water accent planting',
        cost: '$9,800',
        status: 'Ready',
      },
      {
        zone: 'Tour Path Edge',
        scope: 'Rhythm planting and path-edge refresh after irrigation confirmation',
        cost: '$11,900',
        status: 'Needs Revision',
      },
      {
        zone: 'Project Documentation',
        scope: 'Before/after photo set, walkthrough summary, approval packet',
        cost: '$2,500',
        status: 'Ready',
      },
    ],
    approvalCopy:
      'By approving this version, Spoetzl approves the phase-one design direction and authorizes Evergold to prepare the final install schedule after resolving listed clarity gaps.',
  },
  {
    id: 'patio-vision-study',
    title: 'Taproom Patio Vision Study',
    version: 'v0.4',
    status: 'Draft',
    value: '$8,500 study allowance',
    updated: 'April 24, 2026',
    summary:
      'A visual study for the taproom edge before pricing construction work, focused on guest comfort and photo opportunities.',
    includes: [
      'Three visual directions for the patio edge',
      'Before/after mockups from current field photos',
      'Rough order-of-magnitude budget bands',
    ],
    assumptions: [
      'Final construction pricing waits for Spoetzl to choose the patio priority.',
      'Shade structures, electrical, and furnishings are excluded unless added later.',
    ],
    lineItems: [
      {
        zone: 'Taproom Patio Edge',
        scope: 'Vision board, material palette, and marked-up photo concepts',
        cost: '$5,600',
        status: 'Draft',
      },
      {
        zone: 'Taproom Patio Edge',
        scope: 'Optional after-hours walkthrough with Spoetzl stakeholder group',
        cost: '$2,900',
        status: 'Draft',
      },
    ],
    approvalCopy:
      'Approval authorizes concept exploration only. It does not approve construction, plant purchase, or installation.',
  },
];

export const workLogs: WorkLog[] = [
  {
    id: 'wl-001',
    date: 'April 25, 2026',
    title: 'Maintenance pass and visual inspection',
    zone: 'Event Lawn',
    author: 'Evergold field team',
    side: 'evergold',
    status: 'Logged',
    summary:
      'Routine maintenance completed. Turf stress should be watched if heat increases next week.',
    visibleToClient: true,
  },
  {
    id: 'wl-002',
    date: 'April 24, 2026',
    title: 'Entrance bed photo route captured',
    zone: 'Entrance Sign Bed',
    author: 'Evergold design',
    side: 'evergold',
    status: 'Complete',
    summary:
      'Captured reference angles for before/after comparison and proposal mockup alignment.',
    visibleToClient: true,
  },
  {
    id: 'wl-003',
    date: 'April 23, 2026',
    title: 'Tour path irrigation uncertainty',
    zone: 'Tour Path Edge',
    author: 'Evergold field team',
    side: 'evergold',
    status: 'Blocked',
    summary:
      'Observed inconsistent irrigation coverage near the tour path. Needs inspection before plant quantities are locked.',
    visibleToClient: true,
  },
];

export const walkthroughs: Walkthrough[] = [
  {
    id: 'walkthrough-phase-one-scope',
    title: 'Phase-one scope walkthrough',
    date: 'May 1, 2026',
    type: 'Requirements',
    status: 'Scheduled',
    attendees: ['Spoetzl operations', 'Evergold design', 'Evergold estimator'],
    summary:
      'A zone-by-zone walkthrough to resolve phase-one questions before proposal approval.',
    stops: [
      {
        zone: 'Entrance Sign Bed',
        goal: 'Confirm color story and sign visibility.',
        evidence: 'Review marked photos and concept direction.',
        openItem: 'Choose brand-forward or Texas-natural seasonal color balance.',
      },
      {
        zone: 'Tour Path Edge',
        goal: 'Verify path width and irrigation coverage.',
        evidence: 'Capture sprinkler/head locations and path pinch points.',
        openItem: 'Decide whether irrigation is allowance or fixed scope.',
      },
      {
        zone: 'Parking Arrival Edge',
        goal: 'Confirm safety sightlines and maintenance access.',
        evidence: 'Mark areas that must remain low and clean.',
        openItem: 'Validate event-week install restrictions.',
      },
    ],
  },
  {
    id: 'walkthrough-maintenance-baseline',
    title: 'Maintenance baseline photo walk',
    date: 'April 25, 2026',
    type: 'Progress',
    status: 'Recorded',
    attendees: ['Evergold field team'],
    summary:
      'Baseline photo walk for quiet maintenance day. Useful for tracking turf and irrigation observations.',
    stops: [
      {
        zone: 'Event Lawn',
        goal: 'Document turf condition before heat period.',
        evidence: 'Field photos and maintenance notes.',
        openItem: 'Continue monitoring irrigation coverage.',
      },
    ],
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    date: 'April 25, 2026',
    title: 'Maintenance day logged',
    detail: 'No install work scheduled. Turf and irrigation watch noted.',
    status: 'Done',
  },
  {
    date: 'April 26, 2026',
    title: 'Alignment cleanup',
    detail: 'Resolve clarity gaps and prepare phase-one approval packet.',
    status: 'Today',
  },
  {
    date: 'May 1, 2026',
    title: 'Phase-one scope walkthrough',
    detail: 'Walk key zones and document answers before approval.',
    status: 'Next',
  },
  {
    date: 'May 3, 2026',
    title: 'Approval packet due',
    detail: 'Spoetzl reviews phase-one arrival proposal and irrigation allowance.',
    status: 'Next',
  },
  {
    date: 'May 10, 2026',
    title: 'Earliest phase-one scheduling window',
    detail: 'Install timing depends on approvals, event calendar, and material availability.',
    status: 'Later',
  },
];

export function getZoneByName(name: string) {
  return projectZones.find((zone) => zone.name === name);
}

export function getProposalById(id: string) {
  return proposals.find((proposal) => proposal.id === id);
}

export function getToneClasses(tone: StatusTone) {
  const classes: Record<StatusTone, string> = {
    green: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    amber: 'bg-amber-50 text-amber-950 border-amber-200',
    blue: 'bg-blue-50 text-blue-950 border-blue-200',
    red: 'bg-red-50 text-red-950 border-red-200',
    slate: 'bg-slate-50 text-slate-900 border-slate-200',
    purple: 'bg-violet-50 text-violet-950 border-violet-200',
  };

  return classes[tone];
}
