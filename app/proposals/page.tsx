import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  ClipboardCheck,
  FileSignature,
  ListChecks,
  MapPinned,
  PackageCheck,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import {
  approvalItems,
  clarityGaps,
  getToneClasses,
  projectOverview,
  projectZones,
  proposals,
  type Proposal,
  type ProposalLineItem,
} from '@/lib/project-data';

export const metadata = {
  title: 'Proposals | Spoetzl Brewery Landscape Design',
  description: 'Proposal review cards, scope details, assumptions, and approval language.',
};

const proposalStatusClasses: Record<Proposal['status'], string> = {
  Draft: 'border-slate-200 bg-slate-50 text-slate-800',
  'Client Review': 'border-blue-200 bg-blue-50 text-blue-900',
  'Revision Needed': 'border-amber-200 bg-amber-50 text-amber-950',
  Approved: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Scheduled: 'border-violet-200 bg-violet-50 text-violet-900',
};

const lineStatusClasses: Record<ProposalLineItem['status'], string> = {
  Draft: 'border-slate-200 bg-slate-50 text-slate-800',
  Ready: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Approved: 'border-green-200 bg-green-50 text-green-900',
  'Needs Revision': 'border-amber-200 bg-amber-50 text-amber-950',
};

function linkedZonesFor(proposal: Proposal) {
  const lineItemZones = new Set(proposal.lineItems.map((item) => item.zone));

  return projectZones.filter(
    (zone) => zone.linkedProposalId === proposal.id || lineItemZones.has(zone.name)
  );
}

function openGapsFor(proposal: Proposal) {
  const lineItemZones = new Set(proposal.lineItems.map((item) => item.zone));

  return clarityGaps.filter((gap) => lineItemZones.has(gap.zone) && gap.status !== 'Resolved');
}

function StatusBadge({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

export default function ProposalsPage() {
  const reviewCount = proposals.filter((proposal) => proposal.status === 'Client Review').length;
  const readyLineItems = proposals.flatMap((proposal) =>
    proposal.lineItems.filter((item) => item.status === 'Ready' || item.status === 'Approved')
  ).length;
  const estimateTotal = proposals.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <section className="mb-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-lg border border-green-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-900">
              <ClipboardCheck className="h-4 w-4" />
              Proposal review
            </div>
            <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">
              Proposal center
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
              Current Spoetzl and Evergold proposal packages with scope, cost, assumptions, and
              approval language kept together for review.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/plans"
                className="inline-flex items-center gap-2 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900"
              >
                Approval packet
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
                <FileSignature className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-amber-900">
                  Next milestone
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {projectOverview.nextMilestone}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Packet due {projectOverview.nextMilestoneDate}. Approval review is blocked by
                  the high-priority clarity gaps listed inside each proposal.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-600">In client review</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">{reviewCount}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Ready line items</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">{readyLineItems}</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Active packages</p>
            <p className="mt-2 text-3xl font-bold text-violet-700">{estimateTotal}</p>
          </div>
        </section>

        <section className="space-y-5">
          {proposals.map((proposal) => {
            const linkedZones = linkedZonesFor(proposal);
            const openGaps = openGapsFor(proposal);
            const relatedApproval = approvalItems.find((item) =>
              item.target.toLowerCase().includes(proposal.title.toLowerCase().split(' ')[0])
            );

            return (
              <article
                key={proposal.id}
                id={proposal.id}
                className="rounded-lg border border-green-100 bg-white p-4 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <StatusBadge className={proposalStatusClasses[proposal.status]}>
                        {proposal.status}
                      </StatusBadge>
                      <span className="text-sm font-semibold text-slate-500">
                        {proposal.version} | Updated {proposal.updated}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-green-950">{proposal.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 sm:text-base">
                      {proposal.summary}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-bold text-green-950">
                      <BadgeDollarSign className="h-4 w-4" />
                      {proposal.value}
                    </div>
                    <Link
                      href={`/proposals/${proposal.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                      Open detail
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                  <section>
                    <div className="mb-3 flex items-center gap-2 text-green-950">
                      <PackageCheck className="h-5 w-5" />
                      <h3 className="text-lg font-bold">Included scope</h3>
                    </div>
                    <ul className="space-y-2 text-sm leading-6 text-slate-700">
                      {proposal.includes.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5">
                      <div className="mb-3 flex items-center gap-2 text-green-950">
                        <MapPinned className="h-5 w-5" />
                        <h3 className="text-lg font-bold">Linked zones</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {linkedZones.map((zone) => (
                          <span
                            key={zone.id}
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getToneClasses(zone.tone)}`}
                          >
                            {zone.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="mb-3 flex items-center gap-2 text-green-950">
                      <ListChecks className="h-5 w-5" />
                      <h3 className="text-lg font-bold">Line items</h3>
                    </div>

                    <div className="divide-y divide-slate-100 md:hidden">
                      {proposal.lineItems.map((item) => (
                        <div key={`${proposal.id}-${item.zone}-${item.scope}`} className="py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-950">{item.zone}</p>
                              <p className="mt-1 text-sm leading-6 text-slate-700">{item.scope}</p>
                            </div>
                            <p className="shrink-0 text-sm font-bold text-green-900">{item.cost}</p>
                          </div>
                          <StatusBadge className={`mt-2 ${lineStatusClasses[item.status]}`}>
                            {item.status}
                          </StatusBadge>
                        </div>
                      ))}
                    </div>

                    <div className="hidden overflow-x-auto rounded-lg border border-slate-200 md:block">
                      <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-600">
                          <tr>
                            <th className="px-4 py-3">Zone</th>
                            <th className="px-4 py-3">Scope</th>
                            <th className="px-4 py-3">Cost</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {proposal.lineItems.map((item) => (
                            <tr key={`${proposal.id}-${item.zone}-${item.scope}`}>
                              <td className="px-4 py-3 font-semibold text-slate-950">{item.zone}</td>
                              <td className="px-4 py-3 leading-6 text-slate-700">{item.scope}</td>
                              <td className="px-4 py-3 font-bold text-green-900">{item.cost}</td>
                              <td className="px-4 py-3">
                                <StatusBadge className={lineStatusClasses[item.status]}>
                                  {item.status}
                                </StatusBadge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>

                <div className="mt-6 grid gap-5 border-t border-slate-100 pt-5 lg:grid-cols-[1fr_1fr]">
                  <section>
                    <h3 className="text-sm font-bold uppercase text-slate-500">
                      Assumptions
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {proposal.assumptions.map((assumption) => (
                        <li key={assumption} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                          <span>{assumption}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold uppercase text-slate-500">
                      Approval language
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {proposal.approvalCopy}
                    </p>
                    {relatedApproval ? (
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        <span className="font-semibold text-slate-950">Locked scope: </span>
                        {relatedApproval.lockedScope}
                      </p>
                    ) : null}
                  </section>
                </div>

                {openGaps.length > 0 ? (
                  <div className="mt-5 border-t border-amber-100 pt-5">
                    <h3 className="text-sm font-bold uppercase text-amber-900">
                      Decisions before signoff
                    </h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {openGaps.map((gap) => (
                        <div key={gap.id} className="border-l-4 border-amber-400 pl-3">
                          <p className="text-sm font-semibold text-slate-950">{gap.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">{gap.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
