import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import VisualAssetStrip from '@/components/media/VisualAssetStrip';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  MapPinned,
  MessageSquarePlus,
  PencilLine,
  Sparkles,
  TriangleAlert,
  Zap,
} from 'lucide-react';
import {
  clarityGaps,
  getToneClasses,
  projectZones,
  proposals,
  type ProjectZone,
} from '@/lib/project-data';
import {
  getClarityGapVisualProof,
  getProjectVisualProof,
  getZoneVisualProof,
} from '@/lib/visual-proof';

const boardStages = [
  {
    title: 'Ready for proposal',
    description: 'Zones with active pricing or a linked package.',
    zones: projectZones.filter((zone) => zone.linkedProposalId || zone.status === 'Quoted'),
  },
  {
    title: 'Needs intake',
    description: 'Ideas that need owner decisions before pricing.',
    zones: projectZones.filter((zone) => !zone.linkedProposalId && zone.openQuestions > 0),
  },
  {
    title: 'Watch list',
    description: 'Maintenance or future-phase opportunities to keep visible.',
    zones: projectZones.filter((zone) => zone.openQuestions === 0 || zone.status === 'Maintenance'),
  },
];

function linkedProposalTitle(zone: ProjectZone) {
  if (!zone.linkedProposalId) {
    return null;
  }

  return proposals.find((proposal) => proposal.id === zone.linkedProposalId)?.title ?? null;
}

export default function EnhancementsPage() {
  const highPriorityGaps = clarityGaps.filter(
    (gap) => gap.priority === 'High' && gap.status !== 'Resolved'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <section className="mb-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-lg border border-green-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-900">
              <Zap className="h-4 w-4" />
              Enhancement intake
            </div>
            <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">
              Proposal idea board
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
              Enhancement ideas organized by proposal readiness, owner decisions, field evidence,
              and next action.
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
                href="/specifications"
                className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-900 transition hover:bg-green-50"
              >
                Specs and assumptions
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
                  Intake focus
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {highPriorityGaps.length} high-priority decisions
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Resolve these before turning enhancement ideas into a clean phase-one approval
                  packet.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-green-950">
              <MessageSquarePlus className="h-5 w-5" />
              <h2 className="text-xl font-bold">Intake worksheet</h2>
            </div>
            <div className="grid gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Idea title</span>
                <input
                  type="text"
                  placeholder="Example: Taproom photo backdrop"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Zone or area</span>
                <select className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100">
                  {projectZones.map((zone) => (
                    <option key={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Desired outcome</span>
                <textarea
                  rows={4}
                  placeholder="What should guests, operations, or maintenance notice after this improvement?"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Evidence needed</span>
                <textarea
                  rows={3}
                  placeholder="Photos, measurements, stakeholder notes, event constraints, or inspiration references."
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <VisualAssetStrip
                  title="Evidence preview"
                  eyebrow="Attach proof"
                  description="Keep intake lightweight: three visuals are enough to ground the next proposal conversation."
                  fallbackAssets={getProjectVisualProof(3)}
                  limit={3}
                  size="sm"
                  compact
                  href="/images"
                  actionLabel="Open media"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-green-950">
              <ClipboardList className="h-5 w-5" />
              <h2 className="text-xl font-bold">Proposal-ready checks</h2>
            </div>
            <ul className="space-y-3 text-sm leading-6 text-slate-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                The idea has one primary job: arrival, shade, photos, queue comfort, maintenance,
                or event support.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                Zone boundaries, access constraints, and irrigation assumptions are named before
                estimating.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                Spoetzl owner, Evergold owner, visual evidence, and acceptance criteria are clear.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                The enhancement can be tied to a proposal line item or deliberately deferred.
              </li>
            </ul>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="mb-3 flex items-center gap-2 text-slate-950">
                <Sparkles className="h-5 w-5 text-amber-700" />
                <h3 className="text-lg font-bold">Strongest next ideas</h3>
              </div>
              <div className="space-y-3">
                {highPriorityGaps.map((gap) => (
                  <div key={gap.id} className="border-l-4 border-amber-400 pl-3">
                    <p className="text-sm font-semibold text-slate-950">{gap.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{gap.recommendation}</p>
                    <div className="mt-3">
                      <VisualAssetStrip
                        fallbackAssets={getClarityGapVisualProof(gap, 2)}
                        limit={2}
                        size="xs"
                        compact
                        showHeader={false}
                        showMeta={false}
                        interactiveAssets={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          {boardStages.map((stage) => (
            <div key={stage.title} className="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-green-950">
                  <Lightbulb className="h-5 w-5" />
                  <h2 className="text-xl font-bold">{stage.title}</h2>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{stage.description}</p>
              </div>

              <div className="space-y-4">
                {stage.zones.map((zone) => {
                  const proposalTitle = linkedProposalTitle(zone);

                  return (
                    <article key={`${stage.title}-${zone.id}`} className="border-l-4 border-green-600 pl-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-950">{zone.name}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${getToneClasses(zone.tone)}`}>
                          {zone.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{zone.summary}</p>
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
                      <dl className="mt-3 grid gap-2 text-sm">
                        <div className="flex gap-2">
                          <dt className="shrink-0 font-semibold text-slate-500">Next</dt>
                          <dd className="leading-6 text-slate-700">{zone.nextAction}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="shrink-0 font-semibold text-slate-500">Open</dt>
                          <dd className="text-slate-700">{zone.openQuestions} questions</dd>
                        </div>
                      </dl>
                      {proposalTitle ? (
                        <Link
                          href={`/proposals/${zone.linkedProposalId}`}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase text-green-800 hover:text-green-700"
                        >
                          {proposalTitle}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase text-amber-800">
                          <PencilLine className="h-3.5 w-3.5" />
                          Draft intake
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-green-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-green-950">
            <MapPinned className="h-5 w-5" />
            <h2 className="text-xl font-bold">Idea-to-proposal path</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              'Name the zone and the job it should do.',
              'Attach evidence: photos, measurements, constraints, or inspiration.',
              'Resolve owner decisions and assumptions that affect cost.',
              'Move the idea into a proposal line item with signoff language.',
            ].map((step, index) => (
              <div key={step} className="border-l-4 border-green-600 pl-3">
                <p className="text-xs font-bold uppercase text-green-800">
                  Step {index + 1}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
