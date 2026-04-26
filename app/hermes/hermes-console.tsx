'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Clock3,
  Database,
  FileText,
  GitBranch,
  Link2,
  Lock,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  XCircle,
} from 'lucide-react';
import type {
  Citation,
  DailyQuestion,
  HermesMemorySurface,
  HermesTone,
  ObservationApprovalState,
} from '@/lib/hermes-memory';

type HermesConsoleProps = {
  surface: HermesMemorySurface;
};

type Owner = DailyQuestion['owner'];

const toneStyles: Record<
  HermesTone,
  {
    chip: string;
    border: string;
    soft: string;
    text: string;
    accent: string;
  }
> = {
  green: {
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    border: 'border-emerald-200',
    soft: 'bg-emerald-50',
    text: 'text-emerald-900',
    accent: 'bg-emerald-600',
  },
  amber: {
    chip: 'border-amber-200 bg-amber-50 text-amber-950',
    border: 'border-amber-200',
    soft: 'bg-amber-50',
    text: 'text-amber-950',
    accent: 'bg-amber-500',
  },
  blue: {
    chip: 'border-blue-200 bg-blue-50 text-blue-950',
    border: 'border-blue-200',
    soft: 'bg-blue-50',
    text: 'text-blue-950',
    accent: 'bg-blue-600',
  },
  red: {
    chip: 'border-red-200 bg-red-50 text-red-950',
    border: 'border-red-200',
    soft: 'bg-red-50',
    text: 'text-red-950',
    accent: 'bg-red-600',
  },
  slate: {
    chip: 'border-slate-200 bg-slate-50 text-slate-900',
    border: 'border-slate-200',
    soft: 'bg-slate-50',
    text: 'text-slate-900',
    accent: 'bg-slate-700',
  },
  purple: {
    chip: 'border-violet-200 bg-violet-50 text-violet-950',
    border: 'border-violet-200',
    soft: 'bg-violet-50',
    text: 'text-violet-950',
    accent: 'bg-violet-600',
  },
};

const priorityStyles = {
  High: 'border-red-200 bg-red-50 text-red-900',
  Medium: 'border-amber-200 bg-amber-50 text-amber-900',
  Low: 'border-slate-200 bg-slate-50 text-slate-700',
};

const approvalStyles: Record<
  ObservationApprovalState,
  {
    label: string;
    className: string;
    icon: typeof CheckCircle2;
  }
> = {
  Pending: {
    label: 'Pending review',
    className: 'border-amber-200 bg-amber-50 text-amber-950',
    icon: Clock3,
  },
  Approved: {
    label: 'Approved locally',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: CheckCircle2,
  },
  Held: {
    label: 'Held for review',
    className: 'border-slate-200 bg-slate-100 text-slate-800',
    icon: XCircle,
  },
};

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function ownerName(owner: Owner) {
  if (owner === 'both') {
    return 'Both teams';
  }

  return owner === 'spoetzl' ? 'Spoetzl' : 'Evergold';
}

function CitationList({
  citations,
  compact = false,
}: {
  citations: Citation[];
  compact?: boolean;
}) {
  return (
    <div className={classNames('space-y-2', compact && 'space-y-1.5')}>
      {citations.map((citationItem) => (
        <a
          key={citationItem.id}
          href={`#${citationItem.sourceId}`}
          className="group flex gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
        >
          <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-emerald-700" />
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-slate-900">
              {citationItem.label}
            </span>
            <span
              className={classNames(
                'block text-slate-600',
                compact ? 'text-xs leading-5' : 'text-sm leading-6',
              )}
            >
              {citationItem.excerpt}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: HermesTone;
  children: ReactNode;
}) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold',
        toneStyles[tone].chip,
      )}
    >
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  icon,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  icon: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="mt-1 rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase text-emerald-800">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          {copy}
        </p>
      </div>
    </div>
  );
}

export function HermesConsole({ surface }: HermesConsoleProps) {
  const firstQuestionId = surface.dailyQuestions[0]?.id ?? '';
  const [selectedQuestionId, setSelectedQuestionId] = useState(firstQuestionId);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [reviewedQuestions, setReviewedQuestions] = useState<string[]>([]);
  const [observationStates, setObservationStates] = useState<
    Record<string, ObservationApprovalState>
  >(() =>
    Object.fromEntries(
      surface.observations.map((observation) => [observation.id, observation.approvalState]),
    ),
  );

  const selectedQuestion =
    surface.dailyQuestions.find((question) => question.id === selectedQuestionId) ??
    surface.dailyQuestions[0];

  const selectedGap = surface.clarityGaps.find(
    (gap) => gap.recommendedQuestionId === selectedQuestion?.id,
  );

  const activeSourceIds = useMemo(
    () => new Set(selectedQuestion?.sourceIds ?? []),
    [selectedQuestion],
  );

  const approvedObservationCount = Object.values(observationStates).filter(
    (state) => state === 'Approved',
  ).length;
  const heldObservationCount = Object.values(observationStates).filter(
    (state) => state === 'Held',
  ).length;

  const selectedDraft = selectedQuestion ? draftAnswers[selectedQuestion.id] ?? '' : '';
  const selectedQuestionReviewed = selectedQuestion
    ? reviewedQuestions.includes(selectedQuestion.id)
    : false;

  function updateDraft(questionId: string, value: string) {
    setDraftAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  }

  function markQuestionReviewed(questionId: string) {
    setReviewedQuestions((current) =>
      current.includes(questionId) ? current : [...current, questionId],
    );
  }

  function setObservationState(id: string, state: ObservationApprovalState) {
    setObservationStates((current) => ({
      ...current,
      [id]: state,
    }));
  }

  return (
    <main className="pb-24 md:pb-10">
      <section className="border-b border-stone-200 bg-[#f2efe4]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-10">
          <div className="flex min-w-0 flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-900 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Hermes / Honcho memory surface
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Daily alignment intelligence, ready for human-approved memory.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
              {surface.dailyFocus}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#daily-questions"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
              >
                Review today&apos;s questions
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#guardrails"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
              >
                Inspect guardrails
                <Lock className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Runtime</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">{surface.runtime.label}</h2>
              </div>
              <Badge tone={surface.runtime.mode === 'local-stub' ? 'slate' : 'green'}>
                No outbound calls
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{surface.runtime.detail}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <dt className="text-xs font-semibold text-slate-500">HONCHO_API_KEY</dt>
                <dd className="mt-1 text-sm font-bold text-slate-950">
                  {surface.runtime.env.honchoApiKey}
                </dd>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <dt className="text-xs font-semibold text-slate-500">Memory writes</dt>
                <dd className="mt-1 text-sm font-bold text-slate-950">
                  {surface.runtime.env.hermesMemoryWrites}
                </dd>
              </div>
            </dl>
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
                <Workflow className="h-4 w-4" />
                Daily loop checkpoint
              </div>
              <p className="mt-2 text-sm leading-6 text-emerald-950">
                Generated {surface.generatedAt} for {surface.workspaceName}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Hermes memory metrics">
          {surface.metrics.map((metric) => (
            <article
              key={metric.label}
              className={classNames(
                'rounded-lg border bg-white p-4 shadow-sm',
                toneStyles[metric.tone].border,
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-slate-600">{metric.label}</p>
                <span className={classNames('h-2.5 w-2.5 rounded-full', toneStyles[metric.tone].accent)} />
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-950">{metric.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section>
          <SectionHeading
            eyebrow="Daily loop"
            title="From memory intake to approval"
            copy="Hermes keeps the operating loop explicit: collect grounded context, infer blockers, ask the smallest daily question, learn only from reviewed evidence, then publish observations with citations."
            icon={<RefreshCw className="h-5 w-5" />}
          />
          <div className="grid gap-3 md:grid-cols-5">
            {surface.loopSteps.map((step, index) => (
              <article
                key={step.id}
                className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={classNames(
                      'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white',
                      toneStyles[step.tone].accent,
                    )}
                  >
                    {index + 1}
                  </span>
                  <Badge tone={step.tone}>{step.status}</Badge>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-950">{step.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                <p className="mt-4 text-xs font-semibold text-slate-500">Owner: {step.owner}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Sources"
            title="Memory sources Hermes can cite today"
            copy="The page starts from local, deterministic data and makes each memory source reviewable before any future Honcho write path is connected."
            icon={<Database className="h-5 w-5" />}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {surface.memorySources.map((source) => {
              const isActive = activeSourceIds.has(source.id);

              return (
                <article
                  key={source.id}
                  id={source.id}
                  className={classNames(
                    'scroll-mt-24 rounded-lg border bg-white p-4 shadow-sm transition',
                    isActive
                      ? 'border-emerald-400 ring-2 ring-emerald-700/10'
                      : 'border-slate-200',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{source.label}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{source.kind}</p>
                    </div>
                    <Badge tone={source.tone}>{source.status}</Badge>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <dt className="text-slate-500">Owner</dt>
                      <dd className="font-semibold text-slate-900">{source.owner}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <dt className="text-slate-500">Cadence</dt>
                      <dd className="text-right font-semibold text-slate-900">{source.cadence}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <dt className="text-slate-500">Cited items</dt>
                      <dd className="font-semibold text-slate-900">{source.citedItems}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm leading-6 text-slate-700">{source.coverage}</p>
                  <div className="mt-4 space-y-2">
                    {source.examples.map((example) => (
                      <p
                        key={example}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-700"
                      >
                        {example}
                      </p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="daily-questions" className="scroll-mt-24">
          <SectionHeading
            eyebrow="Questions"
            title="Inferred clarity gaps and today's ask"
            copy="Hermes ranks the unresolved gaps, ties each one to cited source memory, and turns it into a focused daily question with a draftable answer."
            icon={<MessageSquare className="h-5 w-5" />}
          />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,430px)]">
            <div className="space-y-3">
              {surface.dailyQuestions.map((question) => {
                const inference = surface.clarityGaps.find(
                  (gap) => gap.recommendedQuestionId === question.id,
                );
                const selected = selectedQuestion?.id === question.id;

                return (
                  <button
                    type="button"
                    key={question.id}
                    onClick={() => setSelectedQuestionId(question.id)}
                    aria-pressed={selected}
                    className={classNames(
                      'w-full rounded-lg border bg-white p-4 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-700/30',
                      selected
                        ? 'border-emerald-500 ring-2 ring-emerald-700/10'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={classNames(
                          'rounded-md border px-2 py-1 text-xs font-bold',
                          priorityStyles[question.priority],
                        )}
                      >
                        {question.priority}
                      </span>
                      <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                        {ownerName(question.owner)}
                      </span>
                      <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-950">
                        {inference?.confidence ?? 80}% confidence
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-bold text-slate-950">{question.zone}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{question.prompt}</p>
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                      <span>Due {question.due}</span>
                      <span>{question.sourceIds.length} sources</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedQuestion && (
              <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-20 lg:self-start">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Selected ask</p>
                    <h3 className="mt-1 text-xl font-bold text-slate-950">
                      {selectedQuestion.zone}
                    </h3>
                  </div>
                  <span
                    className={classNames(
                      'rounded-md border px-2 py-1 text-xs font-bold',
                      priorityStyles[selectedQuestion.priority],
                    )}
                  >
                    {selectedQuestion.priority}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-700">
                  {selectedQuestion.context}
                </p>
                {selectedGap && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
                      <AlertTriangle className="h-4 w-4" />
                      Inference
                    </div>
                    <p className="mt-2 text-sm leading-6 text-amber-950">
                      {selectedGap.inference}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <label
                    htmlFor="question-answer"
                    className="text-sm font-bold text-slate-950"
                  >
                    Draft answer for review
                  </label>
                  <textarea
                    id="question-answer"
                    value={selectedDraft}
                    onChange={(event) => updateDraft(selectedQuestion.id, event.target.value)}
                    rows={5}
                    className="mt-2 min-h-32 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
                    placeholder="Capture the human answer here before it becomes a reviewed memory update."
                  />
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateDraft(selectedQuestion.id, selectedQuestion.recommendedAnswer)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                    >
                      <Sparkles className="h-4 w-4" />
                      Use recommendation
                    </button>
                    <button
                      type="button"
                      disabled={!selectedDraft.trim()}
                      onClick={() => markQuestionReviewed(selectedQuestion.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/40 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <ClipboardCheck className="h-4 w-4" />
                      Mark reviewed
                    </button>
                  </div>
                </div>

                <div
                  className={classNames(
                    'mt-4 rounded-lg border p-3',
                    selectedQuestionReviewed
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-slate-200 bg-slate-50',
                  )}
                  aria-live="polite"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                    {selectedQuestionReviewed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-500" />
                    )}
                    Memory update preview
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {selectedDraft.trim()
                      ? selectedDraft
                      : 'No draft answer yet. Hermes will keep this question open in the daily loop.'}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    Guardrail: {selectedQuestion.guardrail}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-bold text-slate-950">Citations</p>
                  <CitationList citations={selectedQuestion.citations} compact />
                </div>
              </aside>
            )}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Relationship learning"
            title="Provisional patterns, grounded in evidence"
            copy="Hermes can draft working preferences for better questions, but these signals stay editable and cite the source that taught them."
            icon={<Users className="h-5 w-5" />}
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {surface.relationshipSignals.map((signal) => (
              <article
                key={signal.id}
                className={classNames(
                  'rounded-lg border bg-white p-4 shadow-sm',
                  toneStyles[signal.tone].border,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{signal.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{signal.summary}</p>
                  </div>
                  <Badge tone={signal.tone}>{signal.confidence}%</Badge>
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-bold uppercase text-slate-500">Next use</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{signal.nextUse}</p>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-bold text-slate-950">Learned from</p>
                  <CitationList citations={signal.learnedFrom} compact />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Observations"
            title="Source-cited observations awaiting approval"
            copy="Each observation shows what Hermes believes, why it matters, the proposed action, and the exact source trail a reviewer can inspect before allowing writeback."
            icon={<BookOpen className="h-5 w-5" />}
          />
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-600">Pending</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {surface.observations.length - approvedObservationCount - heldObservationCount}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-emerald-900">Approved locally</p>
              <p className="mt-2 text-2xl font-bold text-emerald-950">
                {approvedObservationCount}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-600">Held</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{heldObservationCount}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {surface.observations.map((observation) => {
              const state = observationStates[observation.id] ?? observation.approvalState;
              const StateIcon = approvalStyles[state].icon;

              return (
                <article
                  key={observation.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={classNames(
                        'inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs font-bold',
                        approvalStyles[state].className,
                      )}
                    >
                      <StateIcon className="h-3.5 w-3.5" />
                      {approvalStyles[state].label}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {observation.confidence}% confidence
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-7 text-slate-950">
                    {observation.observation}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {observation.whyItMatters}
                  </p>
                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-blue-950">
                      <GitBranch className="h-4 w-4" />
                      Proposed action
                    </div>
                    <p className="mt-2 text-sm leading-6 text-blue-950">
                      {observation.proposedAction}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-bold text-slate-950">Source trail</p>
                    <CitationList citations={observation.citations} compact />
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setObservationState(observation.id, 'Approved')}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve locally
                    </button>
                    <button
                      type="button"
                      onClick={() => setObservationState(observation.id, 'Held')}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-700/20"
                    >
                      <XCircle className="h-4 w-4" />
                      Hold
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="guardrails" className="scroll-mt-24">
          <SectionHeading
            eyebrow="Guardrails"
            title="Human approval stays in the path"
            copy="The architecture placeholder is intentionally useful without being risky: it can draft, cite, and route memory updates, while commercial and relationship decisions remain human-owned."
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {surface.guardrails.map((guardrail) => (
              <article
                key={guardrail.id}
                className={classNames(
                  'rounded-lg border bg-white p-4 shadow-sm',
                  toneStyles[guardrail.tone].border,
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={classNames(
                      'rounded-lg p-2 text-white',
                      toneStyles[guardrail.tone].accent,
                    )}
                  >
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{guardrail.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {guardrail.description}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <dt className="font-bold text-slate-950">Required before</dt>
                    <dd className="mt-1 leading-6 text-slate-700">
                      {guardrail.requiredBefore}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <dt className="font-bold text-slate-950">Blocked action</dt>
                    <dd className="mt-1 leading-6 text-slate-700">
                      {guardrail.blockedAction}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <dt className="font-bold text-slate-950">Reviewer</dt>
                    <dd className="mt-1 leading-6 text-slate-700">{guardrail.reviewer}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Architecture placeholder</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Local today, Honcho-facing tomorrow
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-900">
                  lib/hermes-memory.ts
                </code>{' '}
                models the adapter boundary: source intake, inferred gaps, daily questions,
                relationship learning, cited observations, and approval gates. The UI exercises
                those shapes without making external calls.
              </p>
            </div>
            <div className="grid min-w-48 grid-cols-2 gap-2 text-center">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <Activity className="mx-auto h-5 w-5 text-emerald-800" />
                <p className="mt-2 text-xs font-bold text-emerald-950">Runnable</p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <FileText className="mx-auto h-5 w-5 text-blue-800" />
                <p className="mt-2 text-xs font-bold text-blue-950">Typed</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
