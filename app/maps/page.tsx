import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  ClipboardCheck,
  HelpCircle,
  Layers,
  MapPinned,
  Ruler,
} from 'lucide-react';
import { projectZones, clarityGaps, getToneClasses } from '@/lib/project-data';

export default function MapsPage() {
  const totalOpenQuestions = projectZones.reduce((sum, zone) => sum + zone.openQuestions, 0);

  return (
    <main className="min-h-screen bg-[#f7f4ec] pb-24 text-slate-950 md:pb-0">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-black text-emerald-900">
            Back to Today
          </Link>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-emerald-800">
                Spatial source of truth
              </p>
              <h1 className="mt-2 text-4xl font-black leading-tight text-emerald-950 lg:text-5xl">
                Zones turn the brewery vision into shared, visible scope.
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                Each zone carries its own design intent, photos, proposal links,
                open questions, and next action so Evergold and Spoetzl can talk
                about the same physical place.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-3xl font-black text-emerald-950">{projectZones.length}</p>
                <p className="text-xs font-bold text-emerald-900">Tracked zones</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-3xl font-black text-amber-950">{totalOpenQuestions}</p>
                <p className="text-xs font-bold text-amber-900">Open questions</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-3xl font-black text-blue-950">1</p>
                <p className="text-xs font-bold text-blue-900">Active proposal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
        <aside className="space-y-5">
          <Link
            href="/mapping"
            className="block rounded-3xl bg-slate-950 p-5 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <MapPinned className="h-8 w-8 text-emerald-300" />
            <p className="mt-5 text-2xl font-black">Open interactive map</p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Draw or edit real property zones on satellite imagery, then use
              this board to communicate status and decisions.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-emerald-200">
              Launch mapper <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-7 w-7 text-amber-700" />
              <h2 className="text-xl font-black">Map-related clarity gaps</h2>
            </div>
            <div className="mt-4 space-y-3">
              {clarityGaps.slice(0, 4).map((gap) => (
                <Link
                  key={gap.id}
                  href="/clarity"
                  className="block rounded-2xl border border-slate-200 p-4 transition hover:border-amber-300 hover:bg-amber-50"
                >
                  <p className="text-sm font-black">{gap.title}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{gap.zone}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="grid gap-4 md:grid-cols-2">
          {projectZones.map((zone) => (
            <article key={zone.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                    {zone.area}
                  </p>
                  <h2 className="mt-1 text-2xl font-black">{zone.name}</h2>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-black ${getToneClasses(zone.tone)}`}>
                  {zone.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-700">{zone.summary}</p>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Design intent
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{zone.designIntent}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-slate-200 p-3">
                  <Ruler className="h-5 w-5 text-slate-500" />
                  <p className="mt-2 font-black">{zone.area}</p>
                  <p className="text-xs text-slate-500">Measured scope</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-3">
                  <HelpCircle className="h-5 w-5 text-amber-700" />
                  <p className="mt-2 font-black">{zone.openQuestions}</p>
                  <p className="text-xs text-slate-500">Open questions</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {zone.plantPalette.map((plant) => (
                  <span
                    key={plant}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-950"
                  >
                    {plant}
                  </span>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <ClipboardCheck className="mt-0.5 h-4 w-4 flex-none text-blue-700" />
                  <span>{zone.nextAction}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Camera className="h-4 w-4 flex-none text-slate-500" />
                  <span>Photo stage: {zone.photoStage}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Layers className="h-4 w-4 flex-none text-slate-500" />
                  <span>Owner: {zone.owner === 'both' ? 'Evergold and Spoetzl' : zone.owner}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
