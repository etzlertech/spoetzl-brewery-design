import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import MediaContextGallery from '@/components/media/MediaContextGallery';
import {
  AlertCircle,
  CalendarCheck,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileVideo,
  ListChecks,
  MapPin,
  Users,
} from 'lucide-react';
import {
  clarityGaps,
  projectOverview,
  projectZones,
  walkthroughs,
} from '@/lib/project-data';
import type { Walkthrough } from '@/lib/project-data';

export const metadata = {
  title: 'Walkthroughs | Spoetzl Brewery Landscape Design',
  description: 'Walkthrough agendas, stop notes, and documentation requirements for Spoetzl Brewery',
};

const walkthroughStatusClasses: Record<Walkthrough['status'], string> = {
  Scheduled: 'border-blue-200 bg-blue-50 text-blue-900',
  Recorded: 'border-violet-200 bg-violet-50 text-violet-900',
  'Needs Summary': 'border-amber-200 bg-amber-50 text-amber-950',
  Complete: 'border-emerald-200 bg-emerald-50 text-emerald-900',
};

const walkthroughTypeClasses: Record<Walkthrough['type'], string> = {
  Requirements: 'border-amber-200 bg-amber-50 text-amber-950',
  Progress: 'border-blue-200 bg-blue-50 text-blue-900',
  Final: 'border-emerald-200 bg-emerald-50 text-emerald-900',
};

const scheduledWalkthroughs = walkthroughs.filter(
  (walkthrough) => walkthrough.status === 'Scheduled',
);

const totalStops = walkthroughs.reduce(
  (count, walkthrough) => count + walkthrough.stops.length,
  0,
);

const highPriorityGaps = clarityGaps.filter((gap) => gap.priority === 'High');

const walkthroughStats = [
  {
    label: 'Walkthroughs',
    value: walkthroughs.length.toString(),
    detail: `${scheduledWalkthroughs.length} scheduled`,
    icon: ClipboardList,
    classes: 'border-blue-200 bg-blue-50 text-blue-900',
  },
  {
    label: 'Documented stops',
    value: totalStops.toString(),
    detail: 'Zones with goal, evidence, and open item',
    icon: MapPin,
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  {
    label: 'High-priority gaps',
    value: highPriorityGaps.length.toString(),
    detail: 'Need answers before approval',
    icon: AlertCircle,
    classes: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    label: 'Media packets',
    value: projectZones.filter((zone) => zone.photoStage !== 'after').length.toString(),
    detail: 'Zones still needing visual proof',
    icon: FileVideo,
    classes: 'border-violet-200 bg-violet-50 text-violet-900',
  },
];

export default function WalkthroughsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8 md:pb-10">
        <section className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1 text-sm font-semibold text-green-900 shadow-sm">
                <CalendarCheck className="h-4 w-4" />
                {projectOverview.nextMilestone} - {projectOverview.nextMilestoneDate}
              </div>
              <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">
                Walkthrough Documentation
              </h1>
              <p className="mt-3 text-base leading-7 text-gray-700 sm:text-lg">
                Zone-by-zone agendas, evidence prompts, attendee notes, and open items for every
                field walkthrough.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Link
                href="/clarity"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-800"
              >
                <ListChecks className="h-4 w-4" />
                Open clarity inbox
              </Link>
              <Link
                href="/videos"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-3 text-sm font-semibold text-green-900 shadow-sm transition hover:bg-green-50"
              >
                <Camera className="h-4 w-4" />
                Media hub
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {walkthroughStats.map((stat) => {
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

        <section className="mb-10 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <div className="space-y-4">
            {walkthroughs.map((walkthrough) => (
              <article
                key={walkthrough.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${walkthroughStatusClasses[walkthrough.status]}`}
                      >
                        {walkthrough.status}
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${walkthroughTypeClasses[walkthrough.type]}`}
                      >
                        {walkthrough.type}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-950">{walkthrough.title}</h2>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <CalendarCheck className="h-4 w-4 text-green-700" />
                      {walkthrough.date}
                    </p>
                  </div>
                  {walkthrough.status === 'Complete' ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <ClipboardCheck className="h-6 w-6 text-amber-700" />
                  )}
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-700">{walkthrough.summary}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  {walkthrough.attendees.map((attendee) => (
                    <span
                      key={attendee}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
                    >
                      {attendee}
                    </span>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  {walkthrough.stops.map((stop, index) => (
                    <div
                      key={`${walkthrough.id}-${stop.zone}`}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-950">{stop.zone}</h3>
                          <p className="text-sm text-gray-700">{stop.goal}</p>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-950">Evidence to capture</p>
                          <p className="mt-1 text-sm leading-5 text-gray-700">{stop.evidence}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-950">Open item</p>
                          <p className="mt-1 text-sm leading-5 text-gray-700">{stop.openItem}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <MediaContextGallery
                    contextType="walkthrough"
                    contextId={walkthrough.id}
                    title="Walkthrough media"
                    emptyMessage="No walkthrough clips or photos are attached yet."
                    compact
                    limit={6}
                  />
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-xl font-bold text-green-950">Before the next walk</h2>
              <div className="mt-4 space-y-3">
                {highPriorityGaps.map((gap) => (
                  <div key={gap.id} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-bold text-amber-950">{gap.title}</p>
                    <p className="mt-1 text-xs font-semibold text-amber-800">
                      {gap.zone} - due {gap.due}
                    </p>
                    <p className="mt-2 text-sm leading-5 text-amber-950">{gap.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-xl font-bold text-green-950">Capture priorities</h2>
              <div className="mt-4 space-y-3">
                {projectZones
                  .filter((zone) => zone.photoStage !== 'after')
                  .slice(0, 4)
                  .map((zone) => (
                    <div key={zone.id} className="flex gap-3">
                      <Camera className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                      <div>
                        <p className="text-sm font-semibold text-gray-950">{zone.name}</p>
                        <p className="text-sm leading-5 text-gray-700">{zone.designIntent}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
