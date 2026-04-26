import {
  approvalItems,
  clarityGaps,
  projectOverview,
  projectZones,
  proposals,
  timelineEvents,
  walkthroughs,
  workLogs,
  type ProjectSide,
  type StatusTone,
} from '@/lib/project-data';

export type HermesTone = StatusTone;

export type MemorySourceStatus =
  | 'Connected local'
  | 'Stub ready'
  | 'Needs review'
  | 'Approval gated';

export interface HermesRuntimeMode {
  mode: 'local-stub' | 'env-ready' | 'approval-gated';
  label: string;
  detail: string;
  outboundCallsEnabled: boolean;
  env: {
    honchoApiKey: 'configured' | 'missing';
    hermesMemoryWrites: 'enabled' | 'disabled';
  };
}

export interface MemorySource {
  id: string;
  label: string;
  kind: string;
  status: MemorySourceStatus;
  owner: string;
  cadence: string;
  coverage: string;
  lastObserved: string;
  tone: HermesTone;
  citedItems: number;
  examples: string[];
}

export interface Citation {
  id: string;
  sourceId: string;
  label: string;
  excerpt: string;
}

export interface InferredClarityGap {
  id: string;
  title: string;
  zone: string;
  owner: ProjectSide;
  priority: 'High' | 'Medium' | 'Low';
  confidence: number;
  inference: string;
  recommendedQuestionId: string;
  sourceIds: string[];
  citations: Citation[];
}

export interface DailyQuestion {
  id: string;
  prompt: string;
  zone: string;
  owner: ProjectSide;
  priority: 'High' | 'Medium' | 'Low';
  due: string;
  context: string;
  recommendedAnswer: string;
  sourceIds: string[];
  citations: Citation[];
  guardrail: string;
}

export interface RelationshipSignal {
  id: string;
  label: string;
  summary: string;
  confidence: number;
  tone: HermesTone;
  learnedFrom: Citation[];
  nextUse: string;
}

export type ObservationApprovalState = 'Pending' | 'Approved' | 'Held';

export interface CitedObservation {
  id: string;
  observation: string;
  whyItMatters: string;
  confidence: number;
  proposedAction: string;
  approvalState: ObservationApprovalState;
  citations: Citation[];
}

export interface ApprovalGuardrail {
  id: string;
  title: string;
  description: string;
  requiredBefore: string;
  blockedAction: string;
  reviewer: string;
  tone: HermesTone;
}

export interface HermesLoopStep {
  id: string;
  label: string;
  description: string;
  status: 'Ready' | 'Running locally' | 'Approval required';
  owner: string;
  tone: HermesTone;
}

export interface HermesMemoryMetric {
  label: string;
  value: string;
  detail: string;
  tone: HermesTone;
}

export interface HermesMemorySurface {
  generatedAt: string;
  workspaceName: string;
  dailyFocus: string;
  runtime: HermesRuntimeMode;
  metrics: HermesMemoryMetric[];
  loopSteps: HermesLoopStep[];
  memorySources: MemorySource[];
  clarityGaps: InferredClarityGap[];
  dailyQuestions: DailyQuestion[];
  relationshipSignals: RelationshipSignal[];
  observations: CitedObservation[];
  guardrails: ApprovalGuardrail[];
}

const generatedAt = 'April 26, 2026, 8:30 AM CT';

const sourceIds = {
  project: 'structured-project-memory',
  proposal: 'proposal-approval-memory',
  field: 'field-work-memory',
  walkthrough: 'walkthrough-memory',
  research: 'research-principle-memory',
  relationship: 'relationship-learning-memory',
} as const;

function ownerLabel(owner: ProjectSide) {
  if (owner === 'both') {
    return 'Spoetzl and Evergold';
  }

  return owner === 'spoetzl' ? 'Spoetzl Brewery' : 'Evergold Landscaping';
}

function citation(
  sourceId: string,
  label: string,
  excerpt: string,
): Citation {
  return {
    id: `${sourceId}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    sourceId,
    label,
    excerpt,
  };
}

function gapSourceIds(zone: string) {
  const ids: string[] = [sourceIds.project, sourceIds.proposal];

  if (zone.includes('Path') || zone.includes('Lawn')) {
    ids.push(sourceIds.field);
  }

  if (zone.includes('Entrance') || zone.includes('Path') || zone.includes('Parking')) {
    ids.push(sourceIds.walkthrough);
  }

  return ids;
}

function gapCitations(gapId: string, zone: string, question: string) {
  const zoneRecord = projectZones.find((projectZone) => projectZone.name === zone);
  const gap = clarityGaps.find((clarityGap) => clarityGap.id === gapId);

  return [
    citation(
      sourceIds.project,
      zone,
      zoneRecord?.nextAction ?? 'Zone has an open next action in project memory.',
    ),
    citation(
      sourceIds.proposal,
      gap?.title ?? 'Open clarity gap',
      question,
    ),
  ];
}

export function getHermesRuntimeMode(): HermesRuntimeMode {
  const honchoApiKeyConfigured = Boolean(process.env.HONCHO_API_KEY);
  const memoryWritesEnabled = process.env.HERMES_ENABLE_MEMORY_WRITES === 'true';

  if (honchoApiKeyConfigured && memoryWritesEnabled) {
    return {
      mode: 'env-ready',
      label: 'Honcho adapter env-ready',
      detail:
        'Honcho credentials and the memory-write flag are configured. This UI still requires explicit human approval before any future write path is enabled.',
      outboundCallsEnabled: false,
      env: {
        honchoApiKey: 'configured',
        hermesMemoryWrites: 'enabled',
      },
    };
  }

  if (honchoApiKeyConfigured) {
    return {
      mode: 'approval-gated',
      label: 'Honcho credentials detected',
      detail:
        'Credentials are present, but memory writes remain disabled. The current page uses the local deterministic memory surface only.',
      outboundCallsEnabled: false,
      env: {
        honchoApiKey: 'configured',
        hermesMemoryWrites: 'disabled',
      },
    };
  }

  return {
    mode: 'local-stub',
    label: 'Local memory stub',
    detail:
      'No external memory calls are made. Hermes is reading project data locally and shaping the Honcho-facing contract for day-one review.',
    outboundCallsEnabled: false,
    env: {
      honchoApiKey: 'missing',
      hermesMemoryWrites: 'disabled',
    },
  };
}

function getMemorySources(): MemorySource[] {
  return [
    {
      id: sourceIds.project,
      label: 'Structured project memory',
      kind: 'Zones, metrics, timeline, open decisions',
      status: 'Connected local',
      owner: 'Hermes',
      cadence: 'Every daily alignment run',
      coverage: `${projectZones.length} zones, ${clarityGaps.length} clarity gaps, ${timelineEvents.length} timeline events`,
      lastObserved: generatedAt,
      tone: 'green',
      citedItems: projectZones.length + clarityGaps.length,
      examples: [
        projectOverview.health,
        projectZones[0]?.nextAction ?? 'Zone next actions',
      ],
    },
    {
      id: sourceIds.proposal,
      label: 'Proposal and approval memory',
      kind: 'Proposal versions, assumptions, approval locks',
      status: 'Approval gated',
      owner: 'Evergold and Spoetzl',
      cadence: 'Before client review packets',
      coverage: `${proposals.length} proposals and ${approvalItems.length} approval items`,
      lastObserved: proposals[0]?.updated ?? generatedAt,
      tone: 'blue',
      citedItems: proposals.length + approvalItems.length,
      examples: [
        proposals[0]?.title ?? 'Phase proposal',
        approvalItems[0]?.title ?? 'Approval item',
      ],
    },
    {
      id: sourceIds.field,
      label: 'Field work memory',
      kind: 'Work logs, site constraints, maintenance signals',
      status: 'Connected local',
      owner: 'Evergold field team',
      cadence: 'After each field note or photo walk',
      coverage: `${workLogs.length} logged field events`,
      lastObserved: workLogs[0]?.date ?? generatedAt,
      tone: 'amber',
      citedItems: workLogs.length,
      examples: [
        workLogs[0]?.title ?? 'Field observation',
        workLogs[2]?.summary ?? 'Field constraint',
      ],
    },
    {
      id: sourceIds.walkthrough,
      label: 'Walkthrough memory',
      kind: 'Stops, attendees, evidence, open items',
      status: 'Stub ready',
      owner: 'Hermes',
      cadence: 'Before and after scheduled walkthroughs',
      coverage: `${walkthroughs.length} walkthrough records`,
      lastObserved: walkthroughs[0]?.date ?? generatedAt,
      tone: 'purple',
      citedItems: walkthroughs.flatMap((walkthrough) => walkthrough.stops).length,
      examples: [
        walkthroughs[0]?.title ?? 'Walkthrough',
        walkthroughs[0]?.stops[0]?.openItem ?? 'Open walkthrough item',
      ],
    },
    {
      id: sourceIds.research,
      label: 'Design principle memory',
      kind: 'Research-backed design intent',
      status: 'Connected local',
      owner: 'Hermes',
      cadence: 'When translating research into decisions',
      coverage: 'Busch Gardens inspiration, Shiner adaptation, visual proof rules',
      lastObserved: generatedAt,
      tone: 'slate',
      citedItems: 4,
      examples: [
        'Busch Gardens as inspiration, not imitation',
        'Visual proof beats long explanations',
      ],
    },
    {
      id: sourceIds.relationship,
      label: 'Relationship learning memory',
      kind: 'Stakeholder preferences and collaboration patterns',
      status: 'Needs review',
      owner: 'Human reviewers',
      cadence: 'After approved observations only',
      coverage: 'Decision style, proof expectations, operating constraints',
      lastObserved: generatedAt,
      tone: 'red',
      citedItems: 3,
      examples: [
        'Spoetzl needs owner decisions framed as concrete choices',
        'Evergold needs site constraints separated from final quote scope',
      ],
    },
  ];
}

function getDailyQuestions(): DailyQuestion[] {
  return clarityGaps.map((gap) => ({
    id: `dq-${gap.id}`,
    prompt: gap.question,
    zone: gap.zone,
    owner: gap.owner,
    priority: gap.priority,
    due: gap.due,
    context: `${gap.title}. Hermes should ask ${ownerLabel(gap.owner)} for the smallest answer that unblocks the next action.`,
    recommendedAnswer: gap.recommendation,
    sourceIds: gapSourceIds(gap.zone),
    citations: gapCitations(gap.id, gap.zone, gap.question),
    guardrail:
      'Capture the answer as a proposed memory update, but do not write it to relationship or project memory until a human reviewer approves the cited summary.',
  }));
}

function getInferredClarityGaps(questions: DailyQuestion[]): InferredClarityGap[] {
  return clarityGaps.map((gap) => {
    const question = questions.find((dailyQuestion) => dailyQuestion.id === `dq-${gap.id}`);
    const zone = projectZones.find((projectZone) => projectZone.name === gap.zone);
    const priorityBoost = gap.priority === 'High' ? 8 : gap.priority === 'Medium' ? 4 : 0;
    const fieldSignal = zone?.openQuestions ?? 0;

    return {
      id: `infer-${gap.id}`,
      title: gap.title,
      zone: gap.zone,
      owner: gap.owner,
      priority: gap.priority,
      confidence: Math.min(96, 78 + priorityBoost + fieldSignal),
      inference:
        zone?.nextAction ??
        'Hermes found a clarity gap that needs a human answer before the next alignment run.',
      recommendedQuestionId: question?.id ?? `dq-${gap.id}`,
      sourceIds: question?.sourceIds ?? gapSourceIds(gap.zone),
      citations: question?.citations ?? gapCitations(gap.id, gap.zone, gap.question),
    };
  });
}

function getRelationshipSignals(): RelationshipSignal[] {
  return [
    {
      id: 'spoetzl-choice-framing',
      label: 'Spoetzl prefers concrete owner choices',
      summary:
        'Open questions are most useful when they present a small set of decision paths, not a broad request for more input.',
      confidence: 87,
      tone: 'blue',
      learnedFrom: [
        citation(
          sourceIds.project,
          'Entrance Sign Bed next action',
          'Spoetzl to approve color direction or request one revision.',
        ),
        citation(
          sourceIds.proposal,
          'Patio priority gap',
          'Is the patio edge primarily seating comfort, a branded photo backdrop, or a low-maintenance softening pass?',
        ),
      ],
      nextUse:
        'Ask Spoetzl to choose between named options and preserve the rationale as a reviewed memory.',
    },
    {
      id: 'evergold-field-before-quote',
      label: 'Evergold protects quote accuracy with field constraints',
      summary:
        'Irrigation, access, event windows, and utility clearance should remain explicit assumptions until the field team confirms them.',
      confidence: 92,
      tone: 'amber',
      learnedFrom: [
        citation(
          sourceIds.field,
          'Tour path irrigation uncertainty',
          workLogs.find((workLog) => workLog.id === 'wl-003')?.summary ??
            'Observed inconsistent irrigation coverage near the tour path.',
        ),
        citation(
          sourceIds.proposal,
          'Phase One Arrival assumption',
          proposals[0]?.assumptions[1] ??
            'Irrigation repair is carried as an allowance until inspection is complete.',
        ),
      ],
      nextUse:
        'Keep field-verification language attached to estimates and approval packets until resolved.',
    },
    {
      id: 'shared-visual-proof',
      label: 'Both teams align faster around visual proof',
      summary:
        'Marked photos, zone maps, and citation-backed summaries reduce ambiguity better than longer narrative updates.',
      confidence: 89,
      tone: 'green',
      learnedFrom: [
        citation(
          sourceIds.research,
          'Visual proof principle',
          'Every approval packet should include the map zone, visual board, cost, open risks, and signoff language.',
        ),
        citation(
          sourceIds.walkthrough,
          'Phase-one scope walkthrough',
          walkthroughs[0]?.summary ??
            'A zone-by-zone walkthrough to resolve phase-one questions before proposal approval.',
        ),
      ],
      nextUse:
        'Attach every daily observation to the source that proves it and the approval it affects.',
    },
  ];
}

function getCitedObservations(): CitedObservation[] {
  return [
    {
      id: 'obs-approval-bottleneck',
      observation:
        'Phase-one approval is blocked more by three high-priority decisions than by missing design work.',
      whyItMatters:
        'Hermes should focus today on answer collection, not generating another broad concept pass.',
      confidence: 94,
      proposedAction:
        'Queue high-priority questions for entrance color, irrigation allowance, and utility clearance.',
      approvalState: 'Pending',
      citations: [
        citation(sourceIds.project, 'Project health', projectOverview.health),
        citation(
          sourceIds.proposal,
          'High priority clarity gaps',
          clarityGaps
            .filter((gap) => gap.priority === 'High')
            .map((gap) => gap.title)
            .join('; '),
        ),
      ],
    },
    {
      id: 'obs-irrigation-allowance',
      observation:
        'The tour path should remain approval-gated until irrigation coverage is verified or carried as a visible allowance.',
      whyItMatters:
        'This protects Evergold estimate accuracy and makes Spoetzl approval language clearer.',
      confidence: 91,
      proposedAction:
        'Keep the irrigation allowance attached to the daily question and proposal assumptions.',
      approvalState: 'Pending',
      citations: [
        citation(
          sourceIds.field,
          'Blocked field work log',
          workLogs.find((workLog) => workLog.id === 'wl-003')?.summary ??
            'Needs irrigation verification before quantities are locked.',
        ),
        citation(
          sourceIds.proposal,
          'Irrigation allowance approval',
          approvalItems.find((item) => item.id === 'approval-irrigation-allowance')
            ?.lockedScope ?? 'Approval covers inspection and required irrigation work.',
        ),
      ],
    },
    {
      id: 'obs-entrance-choice',
      observation:
        'The entrance color story is ready for a human choice; Hermes should not infer brand preference from incomplete context.',
      whyItMatters:
        'Relationship memory should learn Spoetzl preference only after the cited decision is explicitly approved.',
      confidence: 88,
      proposedAction:
        'Ask Spoetzl to choose the base color direction, then route the answer through approval.',
      approvalState: 'Pending',
      citations: [
        citation(
          sourceIds.project,
          'Entrance next action',
          projectZones.find((zone) => zone.id === 'entrance-sign-bed')?.nextAction ??
            'Spoetzl to approve color direction.',
        ),
        citation(
          sourceIds.proposal,
          'Entrance approval item',
          approvalItems.find((item) => item.id === 'approval-entrance-v1')?.lockedScope ??
            'Approves the concept direction, color strategy, and zone boundaries.',
        ),
      ],
    },
    {
      id: 'obs-event-memory',
      observation:
        'Event dates should become a first-class memory source because they directly constrain install timing.',
      whyItMatters:
        'Daily alignment should surface blackout dates before any schedule recommendation is drafted.',
      confidence: 84,
      proposedAction:
        'Ask Spoetzl for event-week blackout dates and mark scheduling suggestions as draft until approved.',
      approvalState: 'Pending',
      citations: [
        citation(
          sourceIds.proposal,
          'Event week blackout dates needed',
          clarityGaps.find((gap) => gap.id === 'cg-005')?.question ??
            'Which brewery events should block disruptive install work?',
        ),
        citation(
          sourceIds.project,
          'Earliest scheduling window',
          timelineEvents.find((event) => event.title.includes('Earliest'))?.detail ??
            'Install timing depends on approvals, event calendar, and material availability.',
        ),
      ],
    },
  ];
}

function getGuardrails(): ApprovalGuardrail[] {
  return [
    {
      id: 'guardrail-no-write',
      title: 'No silent memory writes',
      description:
        'Hermes can draft a memory update locally, but relationship and project memory stay unchanged until a reviewer approves the cited summary.',
      requiredBefore: 'Any Honcho memory write',
      blockedAction: 'Persisting stakeholder preferences or project decisions automatically',
      reviewer: 'Human project owner',
      tone: 'red',
    },
    {
      id: 'guardrail-source-required',
      title: 'Citations are required',
      description:
        'Every inferred observation must carry source citations from project data, proposal records, field logs, or walkthrough notes.',
      requiredBefore: 'Publishing an observation',
      blockedAction: 'Using uncited claims in the daily alignment summary',
      reviewer: 'Hermes reviewer',
      tone: 'blue',
    },
    {
      id: 'guardrail-sensitive-relationship',
      title: 'Relationship learning stays editable',
      description:
        'Stakeholder preferences are treated as provisional learning, not as permanent personality labels.',
      requiredBefore: 'Using a relationship signal',
      blockedAction: 'Personalizing questions from unreviewed behavioral assumptions',
      reviewer: 'Spoetzl and Evergold leads',
      tone: 'amber',
    },
    {
      id: 'guardrail-commercial',
      title: 'Commercial decisions remain human-owned',
      description:
        'Schedule, quote, scope, and approval language can be prepared by Hermes but must remain human-owned until signed.',
      requiredBefore: 'Changing quote, schedule, or approval status',
      blockedAction: 'Treating a draft answer as a signed decision',
      reviewer: 'Approver listed on the item',
      tone: 'green',
    },
  ];
}

function getLoopSteps(): HermesLoopStep[] {
  return [
    {
      id: 'loop-ingest',
      label: 'Ingest',
      description: 'Read local project, field, proposal, and walkthrough data into one memory context.',
      status: 'Running locally',
      owner: 'Hermes',
      tone: 'green',
    },
    {
      id: 'loop-infer',
      label: 'Infer gaps',
      description: 'Compare next actions against unresolved questions and approval blockers.',
      status: 'Running locally',
      owner: 'Hermes',
      tone: 'amber',
    },
    {
      id: 'loop-ask',
      label: 'Ask daily',
      description: 'Promote the smallest useful question for the right owner and zone.',
      status: 'Ready',
      owner: 'Hermes',
      tone: 'blue',
    },
    {
      id: 'loop-learn',
      label: 'Learn relationship',
      description: 'Draft provisional working-preference memories from approved observations only.',
      status: 'Approval required',
      owner: 'Human reviewer',
      tone: 'purple',
    },
    {
      id: 'loop-publish',
      label: 'Publish with citations',
      description: 'Show observations with source trails, confidence, and proposed next actions.',
      status: 'Approval required',
      owner: 'Hermes reviewer',
      tone: 'slate',
    },
  ];
}

export function getHermesMemorySurface(): HermesMemorySurface {
  const questions = getDailyQuestions();
  const highPriorityQuestions = questions.filter((question) => question.priority === 'High').length;
  const observations = getCitedObservations();

  return {
    generatedAt,
    workspaceName: projectOverview.name,
    dailyFocus:
      'Turn today into a concise alignment run: cite the sources, ask the smallest unblocker questions, and only promote reviewed answers into memory.',
    runtime: getHermesRuntimeMode(),
    metrics: [
      {
        label: 'Memory sources',
        value: String(getMemorySources().length),
        detail: 'Local project context shaped for Honcho',
        tone: 'green',
      },
      {
        label: 'Daily questions',
        value: String(questions.length),
        detail: `${highPriorityQuestions} high priority before approval`,
        tone: 'amber',
      },
      {
        label: 'Cited observations',
        value: String(observations.length),
        detail: 'All require human approval before writeback',
        tone: 'blue',
      },
      {
        label: 'Approval guardrails',
        value: '4',
        detail: 'No external calls, no silent memory writes',
        tone: 'red',
      },
    ],
    loopSteps: getLoopSteps(),
    memorySources: getMemorySources(),
    clarityGaps: getInferredClarityGaps(questions),
    dailyQuestions: questions,
    relationshipSignals: getRelationshipSignals(),
    observations,
    guardrails: getGuardrails(),
  };
}
