import Link from 'next/link';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle2,
  ClipboardSignature,
  FileText,
  ListChecks,
  MapPinned,
  TriangleAlert,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import MediaContextGallery from '@/components/media/MediaContextGallery';
import {
  approvalItems,
  clarityGaps,
  getProposalById,
  getToneClasses,
  projectZones,
  proposals,
  type Proposal,
  type ProposalLineItem,
} from '@/lib/project-data';

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

export function generateStaticParams() {
  return proposals.map((proposal) => ({
    id: proposal.id,
  }));
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

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proposal = getProposalById(id);

  if (!proposal) {
    notFound();
  }

  const lineItemZones = new Set(proposal.lineItems.map((item) => item.zone));
  const linkedZones = projectZones.filter(
    (zone) => zone.linkedProposalId === proposal.id || lineItemZones.has(zone.name)
  );
  const openGaps = clarityGaps.filter(
    (gap) => lineItemZones.has(gap.zone) && gap.status !== 'Resolved'
  );
  const approval = approvalItems.find((item) =>
    item.target.toLowerCase().includes(proposal.title.toLowerCase().split(' ')[0])
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/proposals"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-green-900 transition hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to proposals
        </Link>

        <section className="rounded-lg border border-green-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusBadge className={proposalStatusClasses[proposal.status]}>
                  {proposal.status}
                </StatusBadge>
                <span className="text-sm font-semibold text-slate-500">
                  {proposal.version} | Updated {proposal.updated}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">
                {proposal.title}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
                {proposal.summary}
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-950">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BadgeDollarSign className="h-4 w-4" />
                Current value
              </div>
              <p className="mt-1 text-2xl font-bold">{proposal.value}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <section className="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-green-950">
                <FileText className="h-5 w-5" />
                <h2 className="text-lg font-bold">Scope included</h2>
              </div>
              <ul className="space-y-2 text-sm leading-6 text-slate-700">
                {proposal.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-amber-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-amber-900">
                <ClipboardSignature className="h-5 w-5" />
                <h2 className="text-lg font-bold">Signoff copy</h2>
              </div>
              <p className="text-sm leading-6 text-slate-700">{proposal.approvalCopy}</p>
              {approval ? (
                <p className="mt-4 border-l-4 border-amber-400 pl-3 text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-slate-950">Locked scope: </span>
                  {approval.lockedScope}
                </p>
              ) : null}
            </section>
          </div>

          <section className="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-green-950">
              <ListChecks className="h-5 w-5" />
              <h2 className="text-lg font-bold">Line-item review</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {proposal.lineItems.map((item) => (
                <div key={`${item.zone}-${item.scope}`} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{item.zone}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{item.scope}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                      <p className="text-sm font-bold text-green-900">{item.cost}</p>
                      <StatusBadge className={lineStatusClasses[item.status]}>
                        {item.status}
                      </StatusBadge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-green-950">
              <MapPinned className="h-5 w-5" />
              <h2 className="text-lg font-bold">Zone evidence</h2>
            </div>
            <div className="space-y-4">
              {linkedZones.map((zone) => (
                <div key={zone.id} className="border-l-4 border-green-600 pl-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{zone.name}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${getToneClasses(zone.tone)}`}>
                      {zone.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{zone.designIntent}</p>
                  <p className="mt-2 text-xs font-semibold uppercase text-slate-500">
                    Next: {zone.nextAction}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-amber-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-amber-900">
              <TriangleAlert className="h-5 w-5" />
              <h2 className="text-lg font-bold">Open assumptions</h2>
            </div>
            <ul className="space-y-2 text-sm leading-6 text-slate-700">
              {proposal.assumptions.map((assumption) => (
                <li key={assumption} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span>{assumption}</span>
                </li>
              ))}
            </ul>

            {openGaps.length > 0 ? (
              <div className="mt-5 border-t border-amber-100 pt-4">
                <h3 className="text-sm font-bold uppercase text-amber-900">
                  Needed before approval
                </h3>
                <div className="mt-3 space-y-3">
                  {openGaps.map((gap) => (
                    <div key={gap.id}>
                      <p className="text-sm font-semibold text-slate-950">{gap.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{gap.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </section>

        <section className="mt-5 rounded-lg border border-green-100 bg-white p-5 shadow-sm">
          <MediaContextGallery
            contextType="proposal"
            contextId={proposal.id}
            title="Proposal media packet"
            emptyMessage="No proposal photos, videos, or visual proof have been attached yet."
            showFilters
            limit={12}
          />
        </section>
      </main>
    </div>
  );
}
