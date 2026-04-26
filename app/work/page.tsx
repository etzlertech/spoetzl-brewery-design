import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import MediaContextGallery from '@/components/media/MediaContextGallery';
import {
  ArrowRight,
  AlertTriangle,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  MapPin,
  NotebookText,
  ShieldCheck,
} from 'lucide-react';
import {
  clarityGaps,
  getZoneByName,
  projectOverview,
  projectZones,
  timelineEvents,
  workLogs,
} from '@/lib/project-data';
import type { ProjectSide, StatusTone, WorkLog } from '@/lib/project-data';

export const metadata = {
  title: 'Work Log | Spoetzl Brewery Landscape Design',
  description: 'Field work log and daily documentation for the Spoetzl Brewery landscape project',
};

const toneClasses: Record<StatusTone, string> = {
  green: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-950',
  blue: 'border-blue-200 bg-blue-50 text-blue-950',
  red: 'border-red-200 bg-red-50 text-red-950',
  slate: 'border-slate-200 bg-slate-50 text-slate-900',
  purple: 'border-violet-200 bg-violet-50 text-violet-950',
};

const workStatusClasses: Record<WorkLog['status'], string> = {
  Logged: 'border-blue-200 bg-blue-50 text-blue-900',
  Blocked: 'border-red-200 bg-red-50 text-red-900',
  'Needs Review': 'border-amber-200 bg-amber-50 text-amber-950',
  Complete: 'border-emerald-200 bg-emerald-50 text-emerald-900',
};

const sideClasses: Record<ProjectSide, string> = {
  spoetzl: 'border-red-200 bg-red-50 text-red-900',
  evergold: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  both: 'border-blue-200 bg-blue-50 text-blue-900',
};

const sideLabels: Record<ProjectSide, string> = {
  spoetzl: 'Spoetzl',
  evergold: 'Evergold',
  both: 'Joint',
};

const fieldStats = [
  {
    label: 'Work logs',
    value: workLogs.length.toString(),
    detail: `${workLogs.filter((log) => log.visibleToClient).length} client-visible`,
    icon: NotebookText,
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  {
    label: 'Blocked notes',
    value: workLogs.filter((log) => log.status === 'Blocked').length.toString(),
    detail: 'Need field or owner decision',
    icon: AlertTriangle,
    classes: 'border-red-200 bg-red-50 text-red-900',
  },
  {
    label: 'Open gaps',
    value: clarityGaps.length.toString(),
    detail: `${clarityGaps.filter((gap) => gap.priority === 'High').length} high priority`,
    icon: ClipboardList,
    classes: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    label: 'Mapped zones',
    value: projectZones.length.toString(),
    detail: 'Field areas with next actions',
    icon: MapPin,
    classes: 'border-blue-200 bg-blue-50 text-blue-900',
  },
];

const currentTimeline = timelineEvents.filter((event) =>
  ['Today', 'Next'].includes(event.status),
);

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8 md:pb-10">
        <section className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1 text-sm font-semibold text-green-900 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                {projectOverview.phase}
              </div>
              <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">
                Field Work Log
              </h1>
              <p className="mt-3 text-base leading-7 text-gray-700 sm:text-lg">
                {projectOverview.today}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white/90 p-4 shadow-lg lg:min-w-80">
              <p className="text-sm font-semibold text-amber-900">Next milestone</p>
              <p className="mt-1 text-xl font-bold text-gray-950">
                {projectOverview.nextMilestone}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                <CalendarDays className="h-4 w-4 text-amber-700" />
                {projectOverview.nextMilestoneDate}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fieldStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`rounded-xl border p-4 shadow-sm ${stat.classes}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="h-6 w-6 shrink-0" />
                </div>
                <p className="mt-3 text-sm opacity-80">{stat.detail}</p>
              </div>
            );
          })}
        </section>

        <section className="mb-10 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-green-950">Latest field notes</h2>
                <p className="mt-1 text-sm text-gray-700">
                  Daily work, inspection findings, and client-visible field documentation.
                </p>
              </div>
              <Link
                href="/field-captures"
                className="hidden items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-800 sm:inline-flex"
              >
                <Camera className="h-4 w-4" />
                Captures
              </Link>
            </div>

            <div className="space-y-4">
              {workLogs.map((log) => {
                const zone = getZoneByName(log.zone);

                return (
                  <article
                    key={log.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${workStatusClasses[log.status]}`}
                          >
                            {log.status}
                          </span>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${sideClasses[log.side]}`}
                          >
                            {sideLabels[log.side]}
                          </span>
                          {log.visibleToClient && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                              <Eye className="h-3.5 w-3.5" />
                              Client visible
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-950">{log.title}</h3>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                          <span>{log.date}</span>
                          <span>{log.zone}</span>
                          <span>{log.author}</span>
                        </p>
                      </div>
                      {log.status === 'Complete' ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      ) : (
                        <FileText className="h-6 w-6 text-amber-700" />
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-700">{log.summary}</p>

                    {zone && (
                      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm font-semibold text-gray-900">Zone next action</p>
                        <p className="mt-1 text-sm leading-6 text-gray-700">{zone.nextAction}</p>
                      </div>
                    )}

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <MediaContextGallery
                        contextType="work-log"
                        contextId={log.id}
                        title="Work-log media"
                        emptyMessage="No photos or videos are attached to this field note yet."
                        compact
                        limit={6}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-xl font-bold text-green-950">Near-term field calendar</h2>
              <div className="mt-4 space-y-3">
                {currentTimeline.map((event) => (
                  <div key={`${event.date}-${event.title}`} className="border-l-4 border-green-600 pl-3">
                    <p className="text-sm font-semibold text-gray-950">{event.title}</p>
                    <p className="text-xs font-semibold text-green-800">{event.date}</p>
                    <p className="mt-1 text-sm leading-5 text-gray-700">{event.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-xl font-bold text-green-950">Field packet links</h2>
              <div className="mt-4 grid gap-2">
                {[
                  { href: '/walkthroughs', label: 'Walkthrough docs', icon: ClipboardList },
                  { href: '/clarity', label: 'Clarity inbox', icon: AlertTriangle },
                  { href: '/videos', label: 'Media hub', icon: Camera },
                  { href: '/mapping', label: 'Property map', icon: MapPin },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-green-300 hover:bg-green-50"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-4 w-4 text-green-700" />
                        {item.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-green-950">Zone readiness</h2>
            <p className="mt-1 text-sm text-gray-700">
              Each field zone should carry a current status, owner, visual stage, and next action.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projectZones.map((zone) => (
              <article
                key={zone.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-950">{zone.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{zone.area}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[zone.tone]}`}
                  >
                    {zone.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-700">{zone.summary}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="font-semibold text-gray-950">Photo stage</p>
                    <p className="mt-1 capitalize text-gray-700">{zone.photoStage}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="font-semibold text-gray-950">Open questions</p>
                    <p className="mt-1 text-gray-700">{zone.openQuestions}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-gray-950">Next action</p>
                <p className="mt-1 text-sm leading-6 text-gray-700">{zone.nextAction}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
