import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileSignature,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { approvalItems, proposals } from '@/lib/project-data';

const statusClasses = {
  Ready: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Waiting: 'border-amber-200 bg-amber-50 text-amber-950',
  'Changes Requested': 'border-red-200 bg-red-50 text-red-900',
  Signed: 'border-green-200 bg-green-50 text-green-900',
};

export const metadata = {
  title: 'Approvals | Spoetzl Brewery Landscape Design',
  description: 'Approval queue and signoff packets for Spoetzl Brewery and Evergold Landscaping.',
};

export default function ApprovalsPage() {
  const readyCount = approvalItems.filter((item) => item.status === 'Ready').length;

  return (
    <div className="min-h-screen bg-[#f7f4ec] pb-24 text-slate-950 md:pb-0">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-wide text-blue-800">
                Signoff center
              </p>
              <h1 className="mt-2 text-4xl font-black leading-tight text-emerald-950 lg:text-5xl">
                Approve the exact version, scope, and assumptions before work starts.
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Approvals should lock a packet, not a vague conversation. This
                page keeps the approver, target, due date, and locked language
                visible for both Spoetzl and Evergold.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-950">
              <p className="text-4xl font-black">{readyCount}</p>
              <p className="text-sm font-bold">ready for review</p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {approvalItems.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClasses[item.status]}`}>
                      {item.status}
                    </span>
                    <h2 className="mt-4 text-2xl font-black">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.target}</p>
                  </div>
                  {item.status === 'Ready' ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-700" />
                  ) : (
                    <Clock3 className="h-8 w-8 text-amber-700" />
                  )}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Requested by
                    </p>
                    <p className="mt-1 font-bold">{item.requestedBy}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Approver
                    </p>
                    <p className="mt-1 font-bold">{item.approver}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Due
                    </p>
                    <p className="mt-1 font-bold">{item.due}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <LockKeyhole className="mt-0.5 h-5 w-5 flex-none text-amber-800" />
                    <div>
                      <p className="font-black text-amber-950">What this locks</p>
                      <p className="mt-1 text-sm leading-6 text-amber-950/80">
                        {item.lockedScope}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
              <ShieldCheck className="h-8 w-8 text-emerald-300" />
              <h2 className="mt-4 text-2xl font-black">Approval rules</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                <li>Approvals target immutable proposal versions.</li>
                <li>Open clarity gaps stay visible inside the packet.</li>
                <li>Hermes may draft questions but cannot sign or silently update memory.</li>
                <li>Scope, price, schedule, and substitutions remain human-owned.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <FileSignature className="h-7 w-7 text-blue-700" />
                <h2 className="text-2xl font-black">Proposal packets</h2>
              </div>
              <div className="mt-4 space-y-3">
                {proposals.map((proposal) => (
                  <Link
                    key={proposal.id}
                    href={`/proposals/${proposal.id}`}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span>
                      <span className="block font-black">{proposal.title}</span>
                      <span className="mt-1 block text-sm text-slate-600">
                        {proposal.version} - {proposal.status}
                      </span>
                    </span>
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
