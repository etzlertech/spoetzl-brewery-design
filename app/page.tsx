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

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f4ec] pb-24 text-slate-950 md:pb-0">
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
