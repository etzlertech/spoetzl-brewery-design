import { Camera, ShieldCheck } from 'lucide-react';
import type { VisualProofAsset, VisualProofQuery } from '@/lib/visual-proof';
import VisualAssetStrip from '@/components/media/VisualAssetStrip';

interface VisualEvidencePreviewProps {
  title: string;
  detail?: string;
  query?: VisualProofQuery;
  assets: VisualProofAsset[];
  limit?: number;
  href?: string;
  tone?: 'light' | 'dark' | 'amber';
  className?: string;
}

const toneClasses = {
  light: 'border-slate-200 bg-white text-slate-950',
  dark: 'border-white/10 bg-white/10 text-white',
  amber: 'border-amber-200 bg-amber-50 text-amber-950',
};

export default function VisualEvidencePreview({
  title,
  detail,
  query,
  assets,
  limit = 3,
  href,
  tone = 'light',
  className = '',
}: VisualEvidencePreviewProps) {
  const isDark = tone === 'dark';

  return (
    <aside className={`rounded-lg border p-4 ${toneClasses[tone]} ${className}`}>
      <div className="mb-3 flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            isDark ? 'bg-white/15 text-emerald-200' : 'bg-emerald-50 text-emerald-800'
          }`}
        >
          {isDark ? <Camera className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        </span>
        <div className="min-w-0">
          <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {title}
          </p>
          {detail ? (
            <p className={`mt-1 text-sm leading-5 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              {detail}
            </p>
          ) : null}
        </div>
      </div>
      <VisualAssetStrip
        query={query}
        fallbackAssets={assets}
        limit={limit}
        size="sm"
        compact
        showHeader={false}
        showMeta={false}
        href={href}
        interactiveAssets={Boolean(href)}
      />
    </aside>
  );
}

