import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  FileVideo,
  Image,
  MapPin,
  PlayCircle,
  Video,
} from 'lucide-react';
import {
  projectOverview,
  projectZones,
  walkthroughs,
  workLogs,
} from '@/lib/project-data';
import type { Walkthrough } from '@/lib/project-data';

export const metadata = {
  title: 'Videos | Spoetzl Brewery Landscape Design',
  description: 'Walkthrough media hub for field videos, stop evidence, and visual packets',
};

const walkthroughStatusClasses: Record<Walkthrough['status'], string> = {
  Scheduled: 'border-blue-200 bg-blue-50 text-blue-900',
  Recorded: 'border-violet-200 bg-violet-50 text-violet-900',
  'Needs Summary': 'border-amber-200 bg-amber-50 text-amber-950',
  Complete: 'border-emerald-200 bg-emerald-50 text-emerald-900',
};

const mediaStats = [
  {
    label: 'Walkthroughs',
    value: walkthroughs.length.toString(),
    detail: `${walkthroughs.filter((walkthrough) => walkthrough.status === 'Recorded').length} recorded`,
    icon: Video,
    classes: 'border-blue-200 bg-blue-50 text-blue-900',
  },
  {
    label: 'Stop clips needed',
    value: walkthroughs
      .reduce((count, walkthrough) => count + walkthrough.stops.length, 0)
      .toString(),
    detail: 'Capture targets across all walks',
    icon: PlayCircle,
    classes: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    label: 'Photo stages',
    value: projectZones.filter((zone) => zone.photoStage !== 'after').length.toString(),
    detail: 'Zones still building visual proof',
    icon: Image,
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  {
    label: 'Recent logs',
    value: workLogs.length.toString(),
    detail: 'Field notes tied to media packets',
    icon: FileVideo,
    classes: 'border-violet-200 bg-violet-50 text-violet-900',
  },
];

const mediaPacketLinks = [
  { href: '/walkthroughs', label: 'Walkthrough documentation', icon: FileVideo },
  { href: '/field-captures', label: 'Field captures', icon: Camera },
  { href: '/work', label: 'Field work log', icon: Clock },
  { href: '/mapping', label: 'Mapped zones', icon: MapPin },
];

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8 md:pb-10">
        <section className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1 text-sm font-semibold text-green-900 shadow-sm">
                <Video className="h-4 w-4" />
                Walkthrough media hub
              </div>
              <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">
                Videos and Visual Packets
              </h1>
              <p className="mt-3 text-base leading-7 text-gray-700 sm:text-lg">
                A field-media command center for walkthrough recordings, stop-level evidence,
                before/after packets, and visual proof tied to the phase-one scope.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white/90 p-4 shadow-lg lg:min-w-80">
              <p className="text-sm font-semibold text-amber-900">Current media focus</p>
              <p className="mt-1 text-xl font-bold text-gray-950">
                {projectOverview.nextMilestone}
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-700">
                Build a clean evidence packet before {projectOverview.nextMilestoneDate}.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {mediaStats.map((stat) => {
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
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-green-950">Walkthrough media queue</h2>
              <p className="mt-1 text-sm text-gray-700">
                Each walkthrough carries the clips and photos needed to make scope decisions clear.
              </p>
            </div>

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
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                          {walkthrough.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-950">{walkthrough.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {walkthrough.date} - {walkthrough.stops.length} media stops
                      </p>
                    </div>
                    {walkthrough.status === 'Recorded' || walkthrough.status === 'Complete' ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <Clock className="h-6 w-6 text-amber-700" />
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-700">{walkthrough.summary}</p>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {walkthrough.stops.map((stop) => (
                      <div
                        key={`${walkthrough.id}-${stop.zone}`}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-700" />
                          <p className="text-sm font-bold text-gray-950">{stop.zone}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-950">Clip purpose</p>
                        <p className="mt-1 text-sm leading-5 text-gray-700">{stop.goal}</p>
                        <p className="mt-3 text-sm font-semibold text-gray-950">Evidence</p>
                        <p className="mt-1 text-sm leading-5 text-gray-700">{stop.evidence}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-xl font-bold text-green-950">Media packet links</h2>
              <div className="mt-4 grid gap-2">
                {mediaPacketLinks.map((item) => {
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

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-xl font-bold text-green-950">Recent media signals</h2>
              <div className="mt-4 space-y-3">
                {workLogs.map((log) => (
                  <div key={log.id} className="border-l-4 border-green-600 pl-3">
                    <p className="text-sm font-semibold text-gray-950">{log.title}</p>
                    <p className="text-xs font-semibold text-green-800">{log.date}</p>
                    <p className="mt-1 text-sm leading-5 text-gray-700">{log.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-green-950">Zone visual status</h2>
            <p className="mt-1 text-sm text-gray-700">
              Photo and video readiness by zone, tied to the current design intent.
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
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-900">
                    {zone.photoStage}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-700">{zone.designIntent}</p>
                <p className="mt-4 text-sm font-semibold text-gray-950">Next visual need</p>
                <p className="mt-1 text-sm leading-6 text-gray-700">{zone.nextAction}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
