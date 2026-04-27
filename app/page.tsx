import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Map,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  approvalItems,
  clarityGaps,
  projectMetrics,
  projectOverview,
  projectZones,
  timelineEvents,
  getToneClasses,
} from '@/lib/project-data';
import VisualAssetThumbnail from '@/components/media/VisualAssetThumbnail';
import {
  getClarityGapVisualProof,
  getProjectVisualProof,
  getZoneVisualProof,
  type VisualProofAsset,
} from '@/lib/visual-proof';

const highPriorityGaps = clarityGaps.filter((gap) => gap.priority === 'High');
const activeZones = projectZones.filter((zone) => zone.status !== 'Maintenance').slice(0, 4);
const projectProofAssets = getProjectVisualProof(6);

const quickActions = [
  {
    href: '/mapping',
    label: 'Open Map',
    detail: 'Draw zones, review beds, and connect visual work to place.',
    icon: Map,
    className: 'bg-emerald-700 text-white',
  },
  {
    href: '/proposals',
    label: 'Review Proposals',
    detail: 'See phase-one scope, assumptions, pricing, and approval language.',
    icon: ClipboardCheck,
    className: 'bg-blue-700 text-white',
  },
  {
    href: '/clarity',
    label: 'Resolve Gaps',
    detail: 'Answer the questions blocking alignment before work begins.',
    icon: HelpCircle,
    className: 'bg-amber-600 text-white',
  },
  {
    href: '/research',
    label: 'Inspiration Library',
    detail: 'Open Busch Gardens articles, adaptation notes, and visual references.',
    icon: Sparkles,
    className: 'bg-emerald-900 text-white',
  },
  {
    href: '/hermes',
    label: 'Ask Hermes',
    detail: 'Daily relationship memory, source-cited observations, and clarity prompts.',
    icon: Brain,
    className: 'bg-slate-900 text-white',
  },
];

type QuickAction = (typeof quickActions)[number];

function actionProofAsset(action: QuickAction, index: number): VisualProofAsset {
  if (action.href === '/mapping') {
    return getZoneVisualProof(activeZones[0] ?? projectZones[0], 1)[0];
  }

  if (action.href === '/clarity') {
    return getClarityGapVisualProof(highPriorityGaps[0] ?? clarityGaps[0], 1)[0];
  }

  return projectProofAssets[index % projectProofAssets.length];
}

function ProofImageTile({
  asset,
  href,
  className = '',
  priority = false,
  children,
}: {
  asset: VisualProofAsset;
  href: string;
  className?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-lg bg-slate-200 ${className}`}
      aria-label={asset.title}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 520px"
        className="object-cover transition duration-300 group-hover:scale-[1.035]"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/78 via-slate-950/28 to-transparent" />
      {children}
    </Link>
  );
}

function MetricTile({ metric }: { metric: (typeof projectMetrics)[number] }) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${getToneClasses(metric.tone)}`}>
      <p className="text-3xl font-black leading-none">{metric.value}</p>
      <p className="mt-1 text-[11px] font-black uppercase leading-3 tracking-wide">
        {metric.label}
      </p>
    </div>
  );
}

function ActionTile({ action, index }: { action: QuickAction; index: number }) {
  const Icon = action.icon;
  const asset = actionProofAsset(action, index);

  return (
    <Link
      href={action.href}
      className={`group relative block h-full min-h-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md ${
        index === quickActions.length - 1 ? 'col-span-2' : ''
      }`}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes="260px"
        className="object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/20 to-transparent" />
      <span className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg ${action.className}`}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="absolute inset-x-0 bottom-0 min-w-0 p-3 text-white">
        <span className="block text-base font-black leading-tight">{action.label}</span>
        <span className="mt-1 block truncate text-xs font-semibold text-white/75">
          {action.detail}
        </span>
      </span>
    </Link>
  );
}

function MobileActionTile({ action, index }: { action: QuickAction; index: number }) {
  const Icon = action.icon;
  const asset = actionProofAsset(action, index);

  return (
    <Link
      href={action.href}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition active:scale-[0.98]"
    >
      <div className="relative aspect-square bg-slate-100">
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes="45vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/70 to-transparent" />
        <span className={`absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg ${action.className}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="absolute inset-x-0 bottom-0 p-3 text-white">
          <span className="block text-sm font-black leading-tight">{action.label}</span>
        </span>
      </div>
    </Link>
  );
}

function DesktopHome() {
  const nextEvent = timelineEvents.find((event) => event.status !== 'Done') ?? timelineEvents[0];
  const primaryGap = highPriorityGaps[0] ?? clarityGaps[0];
  const zoneTiles = activeZones.slice(0, 4);

  return (
    <main
      className="hidden h-screen overflow-hidden bg-[#f4f1e8] text-slate-950 lg:block"
    >
      <section className="mx-auto grid h-full max-w-[1500px] grid-rows-[88px_minmax(0,1fr)] gap-4 p-5">
        <header className="grid min-h-0 grid-cols-[minmax(0,1fr)_680px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 shadow-sm">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200">
              <Image
                src={projectProofAssets[0].src}
                alt={projectProofAssets[0].alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-800">
                Evergold x Spoetzl - {projectOverview.location}
              </p>
              <h1 className="truncate text-4xl font-black leading-none text-emerald-950">
                Clarity Board
              </h1>
              <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                {projectOverview.phase}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {projectMetrics.map((metric) => (
              <MetricTile key={metric.label} metric={metric} />
            ))}
          </div>
        </header>

        <section className="grid min-h-0 grid-cols-[minmax(0,1fr)_330px] gap-4">
          <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_182px] gap-4">
            <div className="grid min-h-0 grid-cols-[1.05fr_0.95fr] gap-4">
              <section className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Today proof
                    </p>
                    <h2 className="text-2xl font-black text-slate-950">
                      See first, decide faster
                    </h2>
                  </div>
                  <Link
                    href="/images"
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
                  >
                    Photos <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="mt-3 grid min-h-0 flex-1 grid-cols-[minmax(0,1.18fr)_0.82fr] gap-3">
                  <ProofImageTile
                    asset={projectProofAssets[0]}
                    href="/images"
                    className="h-full min-h-0"
                  >
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <p className="text-[11px] font-black uppercase tracking-wide text-white/70">
                        Visual evidence
                      </p>
                      <p className="mt-1 text-2xl font-black leading-tight">
                        {projectProofAssets[0].title}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white/75">
                        Open image board
                      </p>
                    </div>
                  </ProofImageTile>

                  <div className="grid min-h-0 grid-rows-3 gap-3">
                    {projectProofAssets.slice(1, 4).map((asset) => (
                      <ProofImageTile
                        key={asset.id}
                        asset={asset}
                        href={asset.href ?? '/images'}
                        className="min-h-0"
                      >
                        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                          <p className="truncate text-sm font-black">{asset.title}</p>
                          <p className="truncate text-[11px] font-semibold text-white/70">
                            {asset.contextLabel}
                          </p>
                        </div>
                      </ProofImageTile>
                    ))}
                  </div>
                </div>
              </section>

              <nav className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Board tiles
                    </p>
                    <h2 className="text-2xl font-black text-slate-950">Where to go</h2>
                  </div>
                  <Map className="h-7 w-7 text-emerald-700" />
                </div>
                <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 auto-rows-fr gap-3">
                  {quickActions.map((action, index) => (
                    <ActionTile key={action.href} action={action} index={index} />
                  ))}
                </div>
              </nav>
            </div>

            <section className="grid min-h-0 grid-cols-4 gap-4">
              {zoneTiles.map((zone) => (
                <Link
                  key={zone.id}
                  href="/maps"
                  className="group min-h-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                >
                  <VisualAssetThumbnail
                    asset={getZoneVisualProof(zone, 1)[0]}
                    size="full"
                    aspect="landscape"
                    showTitle={false}
                    showMeta={false}
                    interactive={false}
                    className="border-0 bg-transparent p-0 shadow-none"
                  />
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-black text-slate-950">
                        {zone.name}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-500">
                        {zone.openQuestions} open question{zone.openQuestions === 1 ? '' : 's'}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-black ${getToneClasses(zone.tone)}`}>
                      {zone.status}
                    </span>
                  </div>
                </Link>
              ))}
            </section>
          </div>

          <aside className="flex min-h-0 flex-col gap-4">
            <section className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide text-white/50">
                    Project health
                  </p>
                  <p className="mt-1 line-clamp-2 text-xl font-black leading-tight text-amber-200">
                    {projectOverview.health}
                  </p>
                </div>
                <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-300" />
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-blue-800">
                    Decisions
                  </p>
                  <h2 className="text-xl font-black">Approval queue</h2>
                </div>
                <CheckCircle2 className="h-7 w-7 text-blue-700" />
              </div>
              <div className="mt-3 space-y-2">
                {approvalItems.slice(0, 2).map((approval) => (
                  <Link
                    key={approval.id}
                    href="/proposals"
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">
                        {approval.title}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Due {approval.due}
                      </span>
                    </span>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-black text-blue-900">
                      {approval.status}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Brain className="h-7 w-7 shrink-0 text-amber-800" />
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide text-amber-800">
                    Top clarity need
                  </p>
                  <h2 className="truncate text-xl font-black text-amber-950">
                    {primaryGap.zone}
                  </h2>
                </div>
              </div>
              <Link
                href="/clarity"
                className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 rounded-lg border border-amber-200 bg-white/70 p-2 transition hover:border-amber-300 hover:bg-white"
              >
                <VisualAssetThumbnail
                  asset={getClarityGapVisualProof(primaryGap, 1)[0]}
                  size="full"
                  showTitle={false}
                  showMeta={false}
                  interactive={false}
                  className="border-0 bg-transparent p-0 shadow-none"
                />
                <span className="min-w-0 py-1">
                  <span className="block line-clamp-2 text-sm font-black text-amber-950">
                    {primaryGap.title}
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-amber-800">
                    Open question details
                  </span>
                </span>
              </Link>
            </section>

            <section className="mt-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-7 w-7 text-emerald-700" />
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Next movement
                  </p>
                  <h2 className="truncate text-xl font-black">{nextEvent.title}</h2>
                </div>
              </div>
              <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500">
                {nextEvent.date} - {nextEvent.status}
              </p>
              <Link
                href="/walkthroughs"
                className="mt-3 inline-flex items-center gap-2 text-sm font-black text-emerald-800"
              >
                Walkthroughs <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}

function MobileHome() {
  const nextEvent = timelineEvents.find((event) => event.status !== 'Done') ?? timelineEvents[0];
  const primaryGap = highPriorityGaps[0] ?? clarityGaps[0];
  const zoneTiles = activeZones.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f7f4ec] pb-24 text-slate-950 lg:hidden">
      <section className="px-4 pb-6 pt-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-900">
            Evergold x Spoetzl
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-950">
            Shiner, Texas
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-black uppercase tracking-wide text-amber-800">
            Today command center
          </p>
          <h1 className="mt-1 text-4xl font-black leading-none text-emerald-950">
            Clarity Board
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {projectOverview.name}
          </p>
        </div>

        <ProofImageTile
          asset={projectProofAssets[0]}
          href="/images"
          className="mt-5 aspect-[4/3]"
        >
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="text-[11px] font-black uppercase tracking-wide text-white/70">
              Today proof
            </p>
            <p className="mt-1 text-2xl font-black leading-tight">
              {projectProofAssets[0].title}
            </p>
            <p className="mt-1 text-sm font-semibold text-white/75">
              Tap for field media
            </p>
          </div>
        </ProofImageTile>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {projectMetrics.map((metric) => (
            <MetricTile key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              Board tiles
            </p>
            <h2 className="text-2xl font-black">Choose a path</h2>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <MobileActionTile key={action.href} action={action} index={index} />
          ))}
        </div>
      </section>

      <section className="space-y-4 px-4 pb-6">
        <Link
          href="/clarity"
          className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-sm"
        >
          <VisualAssetThumbnail
            asset={getClarityGapVisualProof(primaryGap, 1)[0]}
            size="full"
            showTitle={false}
            showMeta={false}
            interactive={false}
            className="border-0 bg-transparent p-0 shadow-none"
          />
          <span className="min-w-0 py-1">
            <span className="block text-xs font-black uppercase tracking-wide text-amber-800">
              Top clarity need
            </span>
            <span className="mt-1 block line-clamp-2 text-lg font-black leading-tight text-amber-950">
              {primaryGap.title}
            </span>
            <span className="mt-1 block text-sm font-semibold text-amber-800">
              Open details
            </span>
          </span>
        </Link>

        <Link
          href="/proposals"
          className="flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-white p-4 shadow-sm"
        >
          <span>
            <span className="block text-xs font-black uppercase tracking-wide text-blue-800">
              Approval queue
            </span>
            <span className="mt-1 block text-lg font-black">
              {approvalItems.length} decisions waiting
            </span>
          </span>
          <CheckCircle2 className="h-8 w-8 text-blue-700" />
        </Link>
      </section>

      <section className="px-4 pb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-800">
              Property zones
            </p>
            <h2 className="text-2xl font-black">Visual map cues</h2>
          </div>
          <Map className="h-7 w-7 text-emerald-700" />
        </div>
        <div className="grid gap-3">
          {zoneTiles.map((zone) => (
            <Link
              key={zone.id}
              href="/maps"
              className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition active:scale-[0.98]"
            >
              <VisualAssetThumbnail
                asset={getZoneVisualProof(zone, 1)[0]}
                size="full"
                aspect="square"
                showTitle={false}
                showMeta={false}
                interactive={false}
                className="border-0 bg-transparent p-0 shadow-none"
              />
              <span className="min-w-0 py-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="truncate font-black">{zone.name}</span>
                  <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-black ${getToneClasses(zone.tone)}`}>
                    {zone.status}
                  </span>
                </span>
                <span className="mt-2 block text-sm font-semibold text-slate-500">
                  {zone.openQuestions} open question{zone.openQuestions === 1 ? '' : 's'}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-7 w-7 text-emerald-700" />
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                Next movement
              </p>
              <h2 className="truncate text-xl font-black">{nextEvent.title}</h2>
            </div>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {nextEvent.date} - {nextEvent.status}
          </p>
          <Link
            href="/walkthroughs"
            className="mt-3 inline-flex items-center gap-2 text-sm font-black text-emerald-800"
          >
            Walkthroughs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <>
      <DesktopHome />
      <MobileHome />
    </>
  );
}
