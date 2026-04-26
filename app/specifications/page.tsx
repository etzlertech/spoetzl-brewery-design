import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  Leaf,
  ListChecks,
  MapPinned,
  Ruler,
  TriangleAlert,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import VisualAssetStrip from '@/components/media/VisualAssetStrip';
import {
  clarityGaps,
  getToneClasses,
  projectOverview,
  projectZones,
  proposals,
  visionPrinciples,
} from '@/lib/project-data';
import {
  getProjectVisualProof,
  getVisionPrincipleVisualProof,
  getZoneVisualProof,
} from '@/lib/visual-proof';

export const metadata = {
  title: 'Specifications | Spoetzl Brewery Landscape Design',
  description: 'Landscape specifications, project assumptions, and acceptance criteria.',
};

const assumptions = proposals.flatMap((proposal) =>
  proposal.assumptions.map((assumption) => ({
    assumption,
    proposalId: proposal.id,
    proposalTitle: proposal.title,
  }))
);

export default function SpecificationsPage() {
  const unresolvedGaps = clarityGaps.filter((gap) => gap.status !== 'Resolved');
  const quotedOrScheduledZones = projectZones.filter((zone) =>
    ['Quoted', 'Approved', 'Scheduled', 'In Progress'].includes(zone.status)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <section className="mb-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-lg border border-green-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-900">
              <Ruler className="h-4 w-4" />
              Specifications
            </div>
            <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">
              Specs and assumptions
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
              Zone-level intent, plant palettes, acceptance criteria, and proposal assumptions for
              the Spoetzl Brewery landscape work.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/proposals"
                className="inline-flex items-center gap-2 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900"
              >
                Review proposals
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/plans"
                className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-900 transition hover:bg-green-50"
              >
                Approval packet
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
                <TriangleAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-amber-900">
                  Approval readiness
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {quotedOrScheduledZones.length} zones priced or scheduled
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {unresolvedGaps.length} open assumptions should stay visible in the approval
                  packet through {projectOverview.nextMilestoneDate}.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mb-6 rounded-lg border border-green-100 bg-white p-4 shadow-sm sm:p-5">
          <VisualAssetStrip
            title="Specification proof set"
            eyebrow="Acceptance context"
            description="Visual references clarify the standard behind zone intent, assumptions, and before/after deliverables."
            fallbackAssets={getProjectVisualProof(6)}
            limit={6}
            size="sm"
            compact
            href="/images"
          />
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visionPrinciples.map((principle) => (
            <article
              key={principle.title}
              className="rounded-lg border border-green-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2 text-green-800">
                <Leaf className="h-5 w-5" />
                <h2 className="text-lg font-bold text-green-950">{principle.title}</h2>
              </div>
              <p className="text-sm leading-6 text-slate-700">{principle.detail}</p>
              <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-700">
                <span className="font-semibold text-slate-950">Proof: </span>
                {principle.proof}
              </p>
              <div className="mt-3">
                <VisualAssetStrip
                  fallbackAssets={getVisionPrincipleVisualProof(principle, 1)}
                  limit={1}
                  size="sm"
                  compact
                  showHeader={false}
                  showMeta={false}
                  interactiveAssets={false}
                />
              </div>
            </article>
          ))}
        </section>

        <section className="mb-6 rounded-lg border border-green-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-green-950">
              <MapPinned className="h-5 w-5" />
              <h2 className="text-xl font-bold">Zone specifications</h2>
            </div>
            <p className="text-sm font-semibold text-slate-500">
              {projectZones.length} mapped zones
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {projectZones.map((zone) => (
              <article key={zone.id} className="border-l-4 border-green-600 pl-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-green-950">{zone.name}</h3>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getToneClasses(zone.tone)}`}>
                    {zone.status}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {zone.area}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{zone.designIntent}</p>
                <div className="mt-3">
                  <VisualAssetStrip
                    fallbackAssets={getZoneVisualProof(zone, 2)}
                    limit={2}
                    size="xs"
                    compact
                    showHeader={false}
                    showMeta={false}
                    interactiveAssets={false}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {zone.plantPalette.map((plant) => (
                    <span
                      key={`${zone.id}-${plant}`}
                      className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-900"
                    >
                      {plant}
                    </span>
                  ))}
                </div>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-slate-500">Acceptance signal</dt>
                    <dd className="mt-1 leading-6 text-slate-700">{zone.summary}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Next action</dt>
                    <dd className="mt-1 leading-6 text-slate-700">{zone.nextAction}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-amber-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-amber-900">
              <ClipboardList className="h-5 w-5" />
              <h2 className="text-xl font-bold">Proposal assumptions</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {assumptions.map((item) => (
                <div key={`${item.proposalId}-${item.assumption}`} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-sm leading-6 text-slate-700">{item.assumption}</p>
                  <Link
                    href={`/proposals/${item.proposalId}`}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-bold uppercase text-green-800 hover:text-green-700"
                  >
                    {item.proposalTitle}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-green-950">
              <ListChecks className="h-5 w-5" />
              <h2 className="text-xl font-bold">Approval-ready specification</h2>
            </div>
            <ul className="space-y-3 text-sm leading-6 text-slate-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                Each approved zone has a named purpose, boundary, visible evidence, and owner.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                Plant palettes must stay hardy for Shiner conditions and compatible with brewery
                operations.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                Irrigation, clearance, and event-window assumptions stay explicit until resolved.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                Before/after proof is part of the deliverable for proposal packages that include
                documentation.
              </li>
            </ul>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="mb-3 flex items-center gap-2 text-slate-950">
                <FileText className="h-5 w-5" />
                <h3 className="text-lg font-bold">Open spec questions</h3>
              </div>
              <div className="space-y-3">
                {unresolvedGaps.slice(0, 4).map((gap) => (
                  <div key={gap.id} className="border-l-4 border-amber-400 pl-3">
                    <p className="text-sm font-semibold text-slate-950">{gap.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{gap.question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
