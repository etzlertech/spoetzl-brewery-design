import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Map,
  MessageSquare,
  PenLine,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  approvalItems,
  clarityGaps,
  projectMetrics,
  projectOverview,
  projectZones,
  timelineEvents,
  getToneClasses,
} from '@/lib/project-data';

const highPriorityGaps = clarityGaps.filter((gap) => gap.priority === 'High');
const activeZones = projectZones.filter((zone) => zone.status !== 'Maintenance').slice(0, 4);

const quickActions = [
  {
    href: '/mapping',
    label: 'Open Map',
    detail: 'Draw zones, review beds, and connect visual work to place.',
    icon: Map,
    className: 'bg-emerald-700 text-white',
  },
  {
    href: '/proposals',
    label: 'Review Proposals',
    detail: 'See phase-one scope, assumptions, pricing, and approval language.',
    icon: ClipboardCheck,
    className: 'bg-blue-700 text-white',
  },
  {
    href: '/clarity',
    label: 'Resolve Gaps',
    detail: 'Answer the questions blocking alignment before work begins.',
    icon: HelpCircle,
    className: 'bg-amber-600 text-white',
  },
  {
    href: '/hermes',
    label: 'Ask Hermes',
    detail: 'Daily relationship memory, source-cited observations, and clarity prompts.',
    icon: Brain,
    className: 'bg-slate-900 text-white',
  },
];

function Pin({ className = 'bg-emerald-500' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-1/2 top-3 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-white/70 shadow-md ring-2 ring-black/10 ${className}`}
    />
  );
}

function DesktopHome() {
  const nextEvent = timelineEvents.find((event) => event.status !== 'Done') ?? timelineEvents[0];

  return (
    <main
      className="hidden h-screen overflow-hidden text-slate-950 lg:block"
      style={{
        backgroundColor: '#8a5a2f',
        backgroundImage:
          'linear-gradient(90deg, rgba(53,30,13,.28) 0 1px, transparent 1px 170px), repeating-linear-gradient(100deg, rgba(255,255,255,.06) 0 6px, transparent 6px 22px), linear-gradient(135deg, #a36b39 0%, #7c4b25 48%, #936034 100%)',
        backgroundPosition: '0 0, 0 0, 0 0',
        backgroundSize: '170px 100%, 260px 100%, 100% 100%',
      }}
    >
      <section className="mx-auto grid h-full max-w-[1500px] grid-cols-[270px_minmax(0,1fr)_335px] gap-5 p-6">
        <aside className="flex min-h-0 flex-col gap-4">
          <div className="relative rounded-[1.65rem] border border-white/70 bg-white p-5 pt-8 shadow-xl shadow-black/20">
            <Pin />
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-900">
                Evergold
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-amber-950">
                Spoetzl
              </span>
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-amber-800">
              Board mission
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-emerald-950">
              Alignment and clarity
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Achieve alignment through visual collaboration, exchanged ideas,
              articulated terms, and signed agreements.
            </p>
          </div>

          <nav className="relative rounded-[1.65rem] border border-white/70 bg-white/95 p-4 pt-8 shadow-xl shadow-black/15">
            <Pin className="bg-blue-500" />
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500">
              Open a board tile
            </p>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-slate-950">
                        {action.label}
                      </span>
                      <span className="line-clamp-1 text-xs text-slate-500">
                        {action.detail}
                      </span>
                    </span>
                    <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-800" />
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="relative mt-auto rounded-[1.65rem] border border-amber-200 bg-amber-50 p-4 pt-8 shadow-xl shadow-black/15">
            <Pin className="bg-amber-500" />
            <p className="text-xs font-black uppercase tracking-wide text-amber-800">
              Next milestone
            </p>
            <p className="mt-1 text-xl font-black text-amber-950">
              {projectOverview.nextMilestone}
            </p>
            <p className="mt-1 text-sm font-semibold text-amber-900/80">
              {projectOverview.nextMilestoneDate}
            </p>
          </div>
        </aside>

        <section className="grid min-h-0 grid-rows-[260px_minmax(0,1fr)] gap-5">
          <div className="relative h-full rounded-[1.85rem] border border-white/70 bg-white p-6 pt-8 shadow-xl shadow-black/20">
            <Pin />
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-emerald-800">
                  {projectOverview.location}
                </p>
                <h2 className="mt-2 max-w-3xl text-5xl font-black leading-[0.98] text-emerald-950">
                  Clarity Board
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                  {projectOverview.name} turns zones, evidence, terms, approvals,
                  and next actions into one shared visual workspace.
                </p>
              </div>
              <div className="w-60 rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
                <div className="flex items-center gap-2 text-amber-800">
                  <CalendarDays className="h-5 w-5" />
                  <p className="text-xs font-black uppercase tracking-wide">
                    What good looks like today
                  </p>
                </div>
                <p className="mt-2 text-sm leading-5 text-amber-950/85">
                  {projectOverview.today}
                </p>
              </div>
            </div>
          </div>

          <div className="grid min-h-0 grid-cols-[1.15fr_0.85fr] gap-5">
            <div className="relative flex min-h-0 flex-col rounded-[1.85rem] bg-slate-950 p-5 pt-8 text-white shadow-xl shadow-black/20">
              <Pin className="bg-emerald-400" />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-200">
                    Visual collaboration
                  </p>
                  <h3 className="mt-1 text-2xl font-black">Property zones</h3>
                </div>
                <Map className="h-8 w-8 text-emerald-300" />
              </div>

              <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
                {projectZones.slice(0, 3).map((zone, index) => (
                  <Link
                    key={zone.id}
                    href="/maps"
                    className={`group rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
                      index === 0
                        ? 'col-span-2 border-emerald-300/40 bg-emerald-500/15'
                        : 'border-white/10 bg-white/8 hover:bg-white/12'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-lg font-black">{zone.name}</p>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-black ${getToneClasses(zone.tone)}`}>
                        {zone.status}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/70">
                      {zone.summary}
                    </p>
                    <p className="mt-3 text-xs font-black uppercase tracking-wide text-emerald-200">
                      {zone.openQuestions} open question{zone.openQuestions === 1 ? '' : 's'}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex min-h-0 flex-col gap-5">
              <div className="relative rounded-[1.65rem] border border-white/70 bg-white p-4 pt-8 shadow-xl shadow-black/15">
                <Pin className="bg-blue-500" />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-blue-800">
                      Terms and agreements
                    </p>
                    <h3 className="mt-1 text-2xl font-black">Decision queue</h3>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-blue-700" />
                </div>
                <div className="mt-3 space-y-2.5">
                  {approvalItems.map((approval) => (
                    <Link
                      key={approval.id}
                      href="/proposals"
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-3.5 py-2.5 transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <span>
                        <span className="block text-sm font-black">{approval.title}</span>
                        <span className="text-xs text-slate-500">Due {approval.due}</span>
                      </span>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-900">
                        {approval.status}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

            <div className="relative min-h-0 flex-1 rounded-[1.65rem] border border-white/70 bg-white p-4 pt-8 shadow-xl shadow-black/15">
                <Pin className="bg-slate-700" />
                <div className="flex items-center gap-3">
                  <Brain className="h-7 w-7 text-slate-900" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Hermes
                    </p>
                    <h3 className="text-2xl font-black">Clarity question</h3>
                  </div>
                </div>
                {highPriorityGaps.slice(0, 1).map((gap) => (
                  <Link
                    key={gap.id}
                    href="/clarity"
                    className="mt-4 block rounded-2xl border border-amber-200 bg-amber-50 p-4 transition hover:border-amber-300"
                  >
                    <p className="text-xs font-black uppercase tracking-wide text-amber-800">
                      {gap.zone}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-5 text-amber-950">
                      {gap.question}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col gap-4">
          <div className="relative rounded-[1.65rem] border border-white/70 bg-white p-4 pt-8 shadow-xl shadow-black/15">
            <Pin />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Current phase
                </p>
                <h3 className="mt-1 text-2xl font-black text-slate-950">
                  {projectOverview.phase}
                </h3>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-700" />
            </div>
            <div className="mt-3 rounded-2xl bg-slate-950 p-4 text-white">
              <p className="text-xs font-black uppercase tracking-wide text-white/55">
                Project health
              </p>
              <p className="mt-1 text-xl font-black text-amber-200">
                {projectOverview.health}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {projectMetrics.map((metric) => (
              <div key={metric.label} className={`relative rounded-2xl border p-3.5 pt-6 shadow-xl shadow-black/10 ${getToneClasses(metric.tone)}`}>
                <Pin className="top-2 h-2.5 w-2.5 bg-white" />
                <p className="text-3xl font-black">{metric.value}</p>
                <p className="mt-1 text-xs font-black leading-4">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-auto rounded-[1.65rem] border border-white/70 bg-white p-4 pt-8 shadow-xl shadow-black/15">
            <Pin className="bg-amber-500" />
            <div className="flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-amber-700" />
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-amber-800">
                  Timeline
                </p>
                <h3 className="text-2xl font-black">Next movement</h3>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                {nextEvent.date} - {nextEvent.status}
              </p>
              <p className="mt-1 font-black">{nextEvent.title}</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{nextEvent.detail}</p>
            </div>
            <Link
              href="/walkthroughs"
              className="mt-4 inline-flex items-center gap-2 text-sm font-black text-emerald-800"
            >
              Open walkthroughs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </aside>
      </section>
    </main>
  );
}

function MobileHome() {
  return (
    <main className="min-h-screen bg-[#f7f4ec] pb-24 text-slate-950 lg:hidden">
      <section className="border-b border-amber-900/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-10">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-900">
                Evergold x Spoetzl
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950">
                Shiner, Texas
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">
                Today command center
              </p>
              <h1 className="mt-2 max-w-4xl text-4xl font-black leading-[1.02] text-emerald-950 sm:text-5xl lg:text-6xl">
                {projectOverview.name}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
                {projectOverview.primaryGoal}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-5">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-1 h-5 w-5 flex-none text-amber-700" />
                <div>
                  <p className="font-bold text-amber-950">What good looks like today</p>
                  <p className="mt-1 text-sm leading-6 text-amber-950/80">
                    {projectOverview.today}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`${action.className} group rounded-2xl p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <Icon className="h-6 w-6" />
                      <ArrowRight className="h-5 w-5 opacity-70 transition group-hover:translate-x-1" />
                    </div>
                    <p className="mt-5 text-lg font-black">{action.label}</p>
                    <p className="mt-1 text-sm leading-5 opacity-85">{action.detail}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-xl lg:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-200">Current phase</p>
                <h2 className="mt-1 text-2xl font-black">{projectOverview.phase}</h2>
              </div>
              <ShieldCheck className="h-9 w-9 text-emerald-300" />
            </div>

            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-semibold text-white/70">Project health</p>
              <p className="mt-2 text-xl font-black text-amber-200">{projectOverview.health}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {projectMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-white p-4 text-slate-950">
                  <p className="text-2xl font-black">{metric.value}</p>
                  <p className="mt-1 text-sm font-bold">{metric.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{metric.detail}</p>
                </div>
              ))}
            </div>

            <Link
              href="/walkthroughs"
              className="mt-5 flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-bold transition hover:bg-white/15"
            >
              <span>
                Next milestone: {projectOverview.nextMilestone}
                <span className="block text-white/65">{projectOverview.nextMilestoneDate}</span>
              </span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-800">
                  Approval queue
                </p>
                <h2 className="mt-1 text-2xl font-black">Ready for clean decisions</h2>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-700" />
            </div>

            <div className="mt-5 space-y-3">
              {approvalItems.map((approval) => (
                <Link
                  key={approval.id}
                  href="/proposals"
                  className="block rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black">{approval.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">{approval.target}</p>
                    </div>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-900">
                      {approval.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-500">Due {approval.due}</p>
                </Link>
              ))}
            </div>

            <Link
              href="/proposals"
              className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-800"
            >
              Review approval packet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Brain className="h-7 w-7 text-slate-900" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Hermes daily intelligence
                </p>
                <h2 className="text-2xl font-black">Memory-backed clarity loop</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              Hermes watches the relationship between Evergold and Spoetzl for
              misalignment: unclear scope, missing decisions, risky assumptions,
              and approvals that should be locked before work starts.
            </p>
            <div className="mt-4 grid gap-3">
              {highPriorityGaps.slice(0, 2).map((gap) => (
                <div key={gap.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-amber-800">
                    Hermes question
                  </p>
                  <p className="mt-1 text-sm font-bold text-amber-950">{gap.question}</p>
                </div>
              ))}
            </div>
            <Link
              href="/hermes"
              className="mt-4 inline-flex items-center gap-2 text-sm font-black text-slate-900"
            >
              Open Hermes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-800">
                  Zone focus
                </p>
                <h2 className="mt-1 text-2xl font-black">The property as shared language</h2>
              </div>
              <Map className="h-8 w-8 text-emerald-700" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {activeZones.map((zone) => (
                <Link
                  key={zone.id}
                  href="/maps"
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-black">{zone.name}</p>
                    <span className={`rounded-full border px-2 py-1 text-[11px] font-black ${getToneClasses(zone.tone)}`}>
                      {zone.status}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                    {zone.summary}
                  </p>
                  <p className="mt-3 text-xs font-bold text-slate-500">
                    {zone.openQuestions} open question{zone.openQuestions === 1 ? '' : 's'}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-amber-700" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-amber-800">
                  Timeline
                </p>
                <h2 className="text-2xl font-black">From idea to signed scope</h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {timelineEvents.map((event) => (
                <div key={`${event.date}-${event.title}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        event.status === 'Today'
                          ? 'bg-amber-600'
                          : event.status === 'Done'
                            ? 'bg-emerald-600'
                            : 'bg-slate-300'
                      }`}
                    />
                    <div className="mt-1 h-full min-h-10 w-px bg-slate-200" />
                  </div>
                  <div className="pb-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {event.date} - {event.status}
                    </p>
                    <p className="mt-1 font-black">{event.title}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/work"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <PenLine className="h-7 w-7 text-emerald-700" />
              <p className="mt-4 text-lg font-black">Work log</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                Daily field updates, blockers, and client-visible notes.
              </p>
            </Link>
            <Link
              href="/walkthroughs"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
            >
              <MessageSquare className="h-7 w-7 text-blue-700" />
              <p className="mt-4 text-lg font-black">Walkthroughs</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                Requirement walks, progress reviews, punch lists, and summaries.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <>
      <DesktopHome />
      <MobileHome />
    </>
  );
}
