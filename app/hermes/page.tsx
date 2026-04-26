import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { getHermesMemorySurface } from '@/lib/hermes-memory';
import { HermesConsole } from './hermes-console';

export const metadata: Metadata = {
  title: 'Hermes Memory Alignment | Spoetzl Brewery Design',
  description:
    'Daily alignment intelligence loop for memory sources, clarity gaps, cited observations, and human approval guardrails.',
};

export default function HermesPage() {
  const surface = getHermesMemorySurface();

  return (
    <div className="min-h-screen bg-[#f7f7f1] text-slate-950">
      <Navbar />
      <HermesConsole surface={surface} />
    </div>
  );
}
