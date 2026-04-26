import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ClipboardList,
  HelpCircle,
  MessageSquareWarning,
  PenLine,
  ShieldQuestion,
  UserRoundCheck,
} from 'lucide-react';
import {
  approvalItems,
  clarityGaps,
  projectOverview,
  proposals,
} from '@/lib/project-data';
import type { ApprovalItem, ClarityGap, ProjectSide } from '@/lib/project-data';

export const metadata = {
  title: 'Clarity Inbox | Spoetzl Brewery Landscape Design',
  description: 'Decision gaps, recommendations, and approval blockers for Spoetzl Brewery',
};

const priorityClasses: Record<ClarityGap['priority'], string> = {
  High: 'border-red-200 bg-red-50 text-red-900',
  Medium: 'border-amber-200 bg-amber-50 text-amber-950',
  Low: 'border-blue-200 bg-blue-50 text-blue-900',
};

const gapStatusClasses: Record<ClarityGap['status'], string> = {
  Open: 'border-slate-200 bg-slate-50 text-slate-900',
  Drafted: 'border-blue-200 bg-blue-50 text-blue-900',
  'Needs Spoetzl': 'border-red-200 bg-red-50 text-red-900',
  'Needs Evergold': 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Resolved: 'border-green-200 bg-green-50 text-green-900',
};

const approvalStatusClasses: Record<ApprovalItem['status'], string> = {
  Ready: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Waiting: 'border-amber-200 bg-amber-50 text-amber-950',
  'Changes Requested': 'border-red-200 bg-red-50 text-red-900',
  Signed: 'border-green-200 bg-green-50 text-green-900',
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

const priorityRank: Record<ClarityGap['priority'], number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const sortedGaps = [...clarityGaps].sort((a, b) => {
  const priorityDelta = priorityRank[a.priority] - priorityRank[b.priority];

  if (priorityDelta !== 0) {
    return priorityDelta;
  }

  return a.due.localeCompare(b.due);
});

const inboxStats = [
  {
    label: 'Open gaps',
    value: clarityGaps.length.toString(),
    detail: `${clarityGaps.filter((gap) => gap.priority === 'High').length} high priority`,
    icon: MessageSquareWarning,
    classes: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    label: 'Needs Spoetzl',
    value: clarityGaps.filter((gap) => gap.status === 'Needs Spoetzl').length.toString(),
    detail: 'Client-side owner decisions',
    icon: UserRoundCheck,
    classes: 'border-red-200 bg-red-50 text-red-900',
  },
  {
    label: 'Needs Evergold',
    value: clarityGaps.filter((gap) => gap.status === 'Needs Evergold').length.toString(),
    detail: 'Field or estimating answers',
    icon: PenLine,
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  {
    label: 'Approval items',
    value: approvalItems.length.toString(),
    detail: `${approvalItems.filter((item) => item.status === 'Ready').length} ready to review`,
    icon: BadgeCheck,
    classes: 'border-blue-200 bg-blue-50 text-blue-900',
  },
];

const ownerGroups: ProjectSide[] = ['spoetzl', 'evergold', 'both'];

export default function ClarityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8 md:pb-10">
        <section className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-sm font-semibold text-amber-950 shadow-sm">
                <ShieldQuestion className="h-4 w-4" />
                {projectOverview.health}
              </div>
              <h1 className="text-3xl font-bold text-green-950 sm:text-4xl">
                Clarity Gap Inbox
              </h1>
              <p className="mt-3 text-base leading-7 text-gray-700 sm:text-lg">
                Decision gaps, recommended answers, and approval blockers that need a clear owner
                before phase-one scope can lock.
              </p>
            </div>

            <Link
              href="/walkthroughs"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-800"
            >
              <ClipboardList className="h-4 w-4" />
              Review walkthroughs
            </Link>
          </div>
        </section>

        <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {inboxStats.map((stat) => {
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
              <h2 className="text-2xl font-bold text-green-950">Decision queue</h2>
              <p className="mt-1 text-sm text-gray-700">
                Sorted by priority so phase-one approval risks stay at the top.
              </p>
            </div>

            <div className="space-y-4">
              {sortedGaps.map((gap) => (
                <article
                  key={gap.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityClasses[gap.priority]}`}
                        >
                          {gap.priority} priority
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${gapStatusClasses[gap.status]}`}
                        >
                          {gap.status}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${sideClasses[gap.owner]}`}
                        >
                          {sideLabels[gap.owner]}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-950">{gap.title}</h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                        <CalendarClock className="h-4 w-4 text-amber-700" />
                        {gap.zone} - due {gap.due}
                      </p>
                    </div>
                    <HelpCircle className="h-6 w-6 text-amber-700" />
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-gray-950">Question</p>
                      <p className="mt-1 text-sm leading-6 text-gray-700">{gap.question}</p>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <p className="text-sm font-semibold text-green-950">Recommended answer</p>
                      <p className="mt-1 text-sm leading-6 text-green-900">
                        {gap.recommendation}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-xl font-bold text-green-950">Approval blockers</h2>
              <div className="mt-4 space-y-3">
                {approvalItems.map((item) => (
                  <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${approvalStatusClasses[item.status]}`}
                      >
                        {item.status}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        Due {item.due}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-950">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-600">{item.target}</p>
                    <p className="mt-2 text-sm leading-5 text-gray-700">{item.lockedScope}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
              <h2 className="text-xl font-bold text-green-950">Owner lanes</h2>
              <div className="mt-4 space-y-3">
                {ownerGroups.map((owner) => {
                  const ownedGaps = clarityGaps.filter((gap) => gap.owner === owner);

                  return (
                    <div key={owner} className={`rounded-lg border p-4 ${sideClasses[owner]}`}>
                      <p className="text-sm font-bold">{sideLabels[owner]}</p>
                      <p className="mt-1 text-2xl font-bold">{ownedGaps.length}</p>
                      <p className="mt-1 text-sm opacity-80">
                        {ownedGaps.length === 1 ? 'decision gap' : 'decision gaps'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-950">Proposal impact</h2>
              <p className="mt-1 text-sm text-gray-700">
                Items that change pricing, schedule, or approval language.
              </p>
            </div>
            <Link
              href="/vision"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 transition hover:text-green-950"
            >
              Compare north star
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {proposals.map((proposal) => (
              <article
                key={proposal.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-green-800">{proposal.version}</p>
                    <h3 className="text-lg font-bold text-gray-950">{proposal.title}</h3>
                  </div>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900">
                    {proposal.status}
                  </span>
                </div>
                <p className="text-sm leading-6 text-gray-700">{proposal.summary}</p>
                <div className="mt-4 space-y-2">
                  {proposal.lineItems
                    .filter((item) => item.status === 'Needs Revision' || item.status === 'Draft')
                    .map((item) => (
                      <div
                        key={`${proposal.id}-${item.zone}-${item.scope}`}
                        className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3"
                      >
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                        <div>
                          <p className="text-sm font-semibold text-amber-950">{item.zone}</p>
                          <p className="text-sm leading-5 text-amber-900">{item.scope}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
