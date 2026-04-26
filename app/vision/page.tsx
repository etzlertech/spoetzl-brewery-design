import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Compass,
  Flag,
  Leaf,
  MapPinned,
  Milestone,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  projectMetrics,
  projectOverview,
  projectZones,
  timelineEvents,
  visionPrinciples,
} from '@/lib/project-data';
import type { StatusTone, TimelineEvent } from '@/lib/project-data';

export const metadata = {
  title: 'Vision | Spoetzl Brewery Landscape Design',
  description: 'North-star principles, project health, and zone intent for Spoetzl Brewery',
};

const toneClasses: Record<StatusTone, string> = {
  green: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-950',
  blue: 'border-blue-200 bg-blue-50 text-blue-950',
  red: 'border-red-200 bg-red-50 text-red-950',
  slate: 'border-slate-200 bg-slate-50 text-slate-900',
  purple: 'border-violet-200 bg-violet-50 text-violet-950',
};

const timelineClasses: Record<TimelineEvent['status'], string> = {
  Done: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Today: 'border-amber-200 bg-amber-50 text-amber-950',
  Next: 'border-blue-200 bg-blue-50 text-blue-900',
  Later: 'border-slate-200 bg-slate-50 text-slate-900',
};

const metricIcons = [Target, BadgeCheck, MapPinned, CalendarDays];

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8 md:pb-10">
        <section className="mb-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1 text-sm font-semibold text-green-900 shadow-sm">
                <Compass className="h-4 w-4" />
                {projectOverview.location}
              </div>
              <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">
                Vision and North Star
              </h1>
              <p className="mt-3 text-base leading-7 text-gray-700 sm:text-lg">
                {projectOverview.primaryGoal}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white/90 p-4 shadow-lg">
              <p className="text-sm font-semibold text-amber-900">Project health</p>
              <p className="mt-1 text-xl font-bold text-gray-950">{projectOverview.health}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                <Flag className="h-4 w-4 text-amber-700" />
                {projectOverview.nextMilestone} on {projectOverview.nextMilestoneDate}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {projectMetrics.map((metric, index) => {
            const Icon = metricIcons[index] ?? Sparkles;

            return (
              <div
                key={metric.label}
                className={`rounded-xl border p-4 shadow-sm ${toneClasses[metric.tone]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold">{metric.value}</p>
                  </div>
                  <Icon className="h-6 w-6 shrink-0" />
                </div>
                <p className="mt-3 text-sm opacity-80">{metric.detail}</p>
              </div>
            );
          })}
        </section>

        <section className="mb-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-950">North-star principles</h2>
              <p className="mt-1 text-sm text-gray-700">
                Decision rules for adapting inspiration into a Shiner, Texas landscape.
              </p>
            </div>
            <Link
              href="/clarity"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 transition hover:text-green-950"
            >
              Check open gaps
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {visionPrinciples.map((principle, index) => (
              <article
                key={principle.title}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg"
              >
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-950">{principle.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-700">{principle.detail}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-green-950">
                    <CheckCircle2 className="h-4 w-4" />
                    Proof standard
                  </p>
                  <p className="mt-1 text-sm leading-6 text-green-900">{principle.proof}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-green-950">Zone translation</h2>
              <p className="mt-1 text-sm text-gray-700">
                How the north star becomes specific field intent, plant palette, and next action.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                  <p className="mt-4 text-sm leading-6 text-gray-700">{zone.designIntent}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {zone.plantPalette.map((plant) => (
                      <span
                        key={plant}
                        className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-900"
                      >
                        {plant}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-xl font-bold text-green-950">Timeline</h2>
              <div className="mt-4 space-y-3">
                {timelineEvents.map((event) => (
                  <div key={`${event.date}-${event.title}`} className="flex gap-3">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${timelineClasses[event.status]}`}
                    >
                      <Milestone className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-gray-950">{event.title}</p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${timelineClasses[event.status]}`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-green-800">{event.date}</p>
                      <p className="mt-1 text-sm leading-5 text-gray-700">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-xl font-bold text-green-950">Source of truth</h2>
              <div className="mt-4 space-y-3">
                {[
                  { href: '/work', label: 'Field work log', icon: Leaf },
                  { href: '/walkthroughs', label: 'Walkthrough documentation', icon: ClipboardList },
                  { href: '/videos', label: 'Walkthrough media hub', icon: MapPinned },
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
      </main>
    </div>
  );
}
