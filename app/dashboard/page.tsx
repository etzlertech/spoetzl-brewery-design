import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  MapPinned,
  NotebookTabs,
  ShieldAlert,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import {
  clarityGaps,
  projectMetrics,
  projectOverview,
  projectZones,
  proposals,
  timelineEvents,
  workLogs,
  getToneClasses,
} from '@/lib/project-data';

const sections = [
  {
    href: '/vision',
    label: 'Vision',
    detail: 'North star, constraints, design principles, and acceptance criteria.',
    icon: NotebookTabs,
  },
  {
    href: '/maps',
    label: 'Zones',
    detail: 'Every bed and property area connected to scope, photos, logs, and questions.',
    icon: MapPinned,
  },
  {
    href: '/proposals',
    label: 'Proposals',
    detail: 'Versioned estimates, assumptions, line items, and signoff language.',
    icon: FileSignature,
  },
  {
    href: '/hermes',
    label: 'Hermes',
    detail: 'Daily alignment intelligence and memory-backed clarity prompts.',
    icon: Brain,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ec] pb-24 text-slate-950 md:pb-0">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <p className="text-sm font-black uppercase tracking-wide text-emerald-800">
              Shared project truth
            </p>
            <h1 className="mt-2 max-w-4xl text-4xl font-black leading-tight text-emerald-950 lg:text-5xl">
              {projectOverview.client} and {projectOverview.contractor} need one visible source of alignment.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
              This dashboard turns vision, mapped zones, proposals, approvals,
              field work, and clarity questions into one readable operating surface.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {projectMetrics.map((metric) => (
                <div key={metric.label} className={`rounded-2xl border p-4 ${getToneClasses(metric.tone)}`}>
                  <p className="text-3xl font-black">{metric.value}</p>
                  <p className="mt-1 text-sm font-black">{metric.label}</p>
                  <p className="mt-1 text-xs leading-5 opacity-80">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-amber-300" />
              <div>
                <p className="text-sm font-bold text-white/65">Needs attention</p>
                <h2 className="text-2xl font-black">Before phase one can lock</h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {clarityGaps.slice(0, 3).map((gap) => (
                <Link
                  key={gap.id}
                  href="/clarity"
                  className="block rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:bg-white/15"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold">{gap.title}</p>
                    <span className="rounded-full bg-amber-300 px-2 py-1 text-[11px] font-black text-slate-950">
                      {gap.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-white/70">{gap.zone}</p>
                </Link>
              ))}
            </div>
            <Link
              href="/clarity"
              className="mt-5 inline-flex items-center gap-2 text-sm font-black text-amber-200"
            >
              Resolve clarity gaps <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon className="h-7 w-7 text-emerald-800" />
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
                <p className="mt-5 text-xl font-black">{section.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{section.detail}</p>
              </Link>
            );
          })}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-blue-800">
                  Proposal status
                </p>
                <h2 className="mt-1 text-2xl font-black">Versioned work, visible assumptions</h2>
              </div>
              <FileSignature className="h-8 w-8 text-blue-700" />
            </div>
            <div className="mt-5 space-y-3">
              {proposals.map((proposal) => (
                <Link
                  key={proposal.id}
                  href="/proposals"
                  className="block rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black">{proposal.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {proposal.version} - {proposal.value}
                      </p>
                    </div>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-900">
                      {proposal.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-emerald-800">
                  Work and timeline
                </p>
                <h2 className="mt-1 text-2xl font-black">What happened, what is next</h2>
              </div>
              <ClipboardList className="h-8 w-8 text-emerald-700" />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                {workLogs.map((log) => (
                  <Link
                    key={log.id}
                    href="/work"
                    className="block rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      {log.date} - {log.zone}
                    </p>
                    <p className="mt-1 font-black">{log.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
                      {log.summary}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                {timelineEvents.slice(0, 4).map((event) => (
                  <div key={`${event.date}-${event.title}`} className="flex gap-3 pb-4 last:pb-0">
                    <CheckCircle2
                      className={`mt-0.5 h-5 w-5 flex-none ${
                        event.status === 'Done' ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                        {event.date}
                      </p>
                      <p className="font-bold">{event.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-emerald-800">
                Zone inventory
              </p>
              <h2 className="mt-1 text-2xl font-black">Mapped areas that carry the project</h2>
            </div>
            <Link
              href="/maps"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-800 px-5 py-3 text-sm font-black text-white"
            >
              Open zone board <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {projectZones.map((zone) => (
              <div key={zone.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-black">{zone.name}</p>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-black ${getToneClasses(zone.tone)}`}>
                    {zone.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-5 text-slate-600">{zone.nextAction}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
