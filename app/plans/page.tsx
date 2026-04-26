import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileSignature,
  ListChecks,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import {
  approvalItems,
  clarityGaps,
  projectOverview,
  proposals,
  timelineEvents,
  walkthroughs,
  type ApprovalItem,
} from '@/lib/project-data';

export const metadata = {
  title: 'Approval Plan | Spoetzl Brewery Landscape Design',
  description: 'Approval packet, review path, and signoff language for active proposals.',
};

const approvalStatusClasses: Record<ApprovalItem['status'], string> = {
  Ready: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Waiting: 'border-amber-200 bg-amber-50 text-amber-950',
  'Changes Requested': 'border-red-200 bg-red-50 text-red-900',
  Signed: 'border-green-200 bg-green-50 text-green-900',
};

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

export default function PlansPage() {
  const readyApprovals = approvalItems.filter((item) => item.status === 'Ready').length;
  const blockers = clarityGaps.filter((gap) => gap.priority === 'High' && gap.status !== 'Resolved');
  const activeProposal = proposals.find((proposal) => proposal.status === 'Client Review') ?? proposals[0];
  const scopeWalkthrough = walkthroughs.find((walkthrough) => walkthrough.id === 'walkthrough-phase-one-scope');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <section className="mb-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-lg border border-green-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-900">
              <ShieldCheck className="h-4 w-4" />
              Approval plan
            </div>
            <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">
              Approval packet and signoff
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
              Phase-one review language, locked scope, open conditions, and the dated path to
              Spoetzl approval.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/proposals/${activeProposal.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900"
              >
                Open active proposal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/specifications"
                className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-900 transition hover:bg-green-50"
              >
                Review assumptions
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-amber-900">
                  Packet due
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {projectOverview.nextMilestoneDate}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {readyApprovals} approval item is ready. {blockers.length} high-priority
                  decisions remain before the install schedule can be locked.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-green-950">
              <FileSignature className="h-5 w-5" />
              <h2 className="text-xl font-bold">Signoff language</h2>
            </div>
            <p className="text-sm leading-6 text-slate-700">{activeProposal.approvalCopy}</p>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="text-sm font-bold uppercase text-slate-500">
                Approval acknowledges
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                  Spoetzl approves design direction, zone boundaries, and review-ready scope.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                  Field measurements, irrigation findings, and event windows may adjust final
                  quantities or schedule.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                  Construction outside listed line items requires a revision or separate approval.
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-amber-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-amber-900">
              <TriangleAlert className="h-5 w-5" />
              <h2 className="text-xl font-bold">Conditions before scheduling</h2>
            </div>
            <div className="space-y-4">
              {blockers.map((gap) => (
                <div key={gap.id} className="border-l-4 border-amber-400 pl-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{gap.title}</p>
                    <StatusBadge className="border-amber-200 bg-amber-50 text-amber-950">
                      {gap.due}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{gap.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          {approvalItems.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-green-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <StatusBadge className={approvalStatusClasses[item.status]}>
                    {item.status}
                  </StatusBadge>
                  <h2 className="mt-3 text-xl font-bold text-green-950">{item.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{item.target}</p>
                </div>
                <p className="text-sm font-bold text-amber-900">Due {item.due}</p>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-500">Requested by</dt>
                  <dd className="mt-1 text-slate-900">{item.requestedBy}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Approver</dt>
                  <dd className="mt-1 text-slate-900">{item.approver}</dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-700">
                {item.lockedScope}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-green-950">
              <ListChecks className="h-5 w-5" />
              <h2 className="text-xl font-bold">Packet contents</h2>
            </div>
            <ul className="space-y-3 text-sm leading-6 text-slate-700">
              {activeProposal.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                  <span>{item}</span>
                </li>
              ))}
              {scopeWalkthrough ? (
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                  <span>
                    {scopeWalkthrough.title} on {scopeWalkthrough.date}
                  </span>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="rounded-lg border border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-green-950">
              <CalendarDays className="h-5 w-5" />
              <h2 className="text-xl font-bold">Review path</h2>
            </div>
            <div className="space-y-4">
              {timelineEvents.map((event) => (
                <div key={`${event.date}-${event.title}`} className="grid grid-cols-[6.5rem_1fr] gap-3">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    {event.date}
                  </p>
                  <div className="border-l-4 border-green-600 pl-3">
                    <p className="font-semibold text-slate-950">{event.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
