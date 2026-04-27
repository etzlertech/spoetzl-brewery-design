import type {
  ClarityGap,
  ProjectZone,
  Proposal,
  VisionPrinciple,
} from '@/lib/project-data';
import {
  clarityGaps,
  projectZones,
  proposals,
  visionPrinciples,
} from '@/lib/project-data';
import type {
  MediaAsset,
  MediaContextType,
  MediaKind,
  MediaStage,
} from '@/lib/media-assets';

export type VisualProofAssetSource = 'media' | 'curated-fallback';

export type VisualProofAsset = {
  id: string;
  src: string;
  kind: MediaKind;
  title: string;
  alt: string;
  label: string;
  description?: string;
  contextLabel?: string;
  stage?: MediaStage;
  source: VisualProofAssetSource;
  capturedAt?: string;
  href?: string;
  tags?: string[];
  mediaAsset?: MediaAsset;
};

export type VisualProofQuery = {
  contextType?: MediaContextType;
  contextId?: string;
  zoneId?: string;
  kind?: MediaKind | 'all';
  stage?: MediaStage | MediaStage[] | 'all';
};

export type VisualProofFallbackKey =
  | 'board'
  | 'dashboard'
  | 'proposal'
  | 'clarity'
  | 'plans'
  | 'specifications'
  | 'vision'
  | 'enhancements'
  | 'walkthrough'
  | 'zone';

export type SelectVisualProofAssetsOptions = VisualProofQuery & {
  limit?: number;
  zoneName?: string;
  tags?: string[];
  fallbackKey?: VisualProofFallbackKey;
  includeFallbacks?: boolean;
};

type CuratedAssetSeed = Omit<
  VisualProofAsset,
  'id' | 'src' | 'kind' | 'source' | 'mediaAsset' | 'capturedAt'
> & {
  file: string;
};

const imageBase = '/research/images';

const curatedAssets = {
  entrance: {
    file: '07-spring-tulips-display.jpg',
    title: 'Arrival color direction',
    alt: 'Large seasonal flower bed display with massed color',
    label: 'Concept',
    description: 'Seasonal color massing for the brewery sign approach.',
    contextLabel: 'Entrance Sign Bed',
    stage: 'concept',
    href: '/maps',
    tags: ['arrival', 'seasonal-color', 'entrance-sign-bed'],
  },
  path: {
    file: '14-bridge-architecture.jpg',
    title: 'Tour path rhythm',
    alt: 'Botanical garden path framed by layered planting',
    label: 'Before',
    description: 'Layered path-edge reference for walking routes and pinch points.',
    contextLabel: 'Tour Path Edge',
    stage: 'before',
    href: '/maps',
    tags: ['path', 'circulation', 'tour-path-edge'],
  },
  patio: {
    file: '23-river-cruise-scenery.jpg',
    title: 'Guest-facing photo edge',
    alt: 'Intensive theme park landscape with bold layered planting',
    label: 'Reference',
    description: 'High-impact landscape moment for patio and guest photos.',
    contextLabel: 'Taproom Patio Edge',
    stage: 'reference',
    href: '/vision',
    tags: ['patio', 'photo-moment', 'taproom-patio-edge'],
  },
  eventLawn: {
    file: '13-italian-architecture.jpg',
    title: 'Event-ready seasonal condition',
    alt: 'Autumn garden display showing seasonal color and event readiness',
    label: 'Progress',
    description: 'Seasonal field condition and event-readiness reference.',
    contextLabel: 'Event Lawn',
    stage: 'progress',
    href: '/work',
    tags: ['event-lawn', 'seasonal-color', 'maintenance'],
  },
  parking: {
    file: '21-french-garden-chateau.jpg',
    title: 'Parking arrival edge',
    alt: 'Themed pedestrian pathway framed by architecture and planting',
    label: 'Before',
    description: 'Arrival circulation and low-maintenance edge reference.',
    contextLabel: 'Parking Arrival Edge',
    stage: 'before',
    href: '/maps',
    tags: ['parking-arrival', 'arrival', 'path'],
  },
  utility: {
    file: '19-botanical-garden-path.jpg',
    title: 'Back-of-house constraints',
    alt: 'Greenhouse production reference for operational landscape constraints',
    label: 'Issue',
    description: 'Operational access and clearance evidence before screening.',
    contextLabel: 'Utility Screening',
    stage: 'issue',
    href: '/clarity',
    tags: ['utility-screening', 'operations', 'screening'],
  },
  formalGarden: {
    file: '14-bridge-architecture.jpg',
    title: 'Formal bed geometry',
    alt: 'Formal garden design with geometric planting structure',
    label: 'Reference',
    description: 'Structured planting geometry for scope and acceptance criteria.',
    contextLabel: 'Specifications',
    stage: 'reference',
    href: '/specifications',
    tags: ['specifications', 'geometry', 'acceptance-criteria'],
  },
  german: {
    file: '14-bridge-architecture.jpg',
    title: 'Brewery heritage cue',
    alt: 'German architectural reference with brewery-adjacent character',
    label: 'Inspiration',
    description: 'German architecture reference for translating heritage, not copying it.',
    contextLabel: 'Vision',
    stage: 'reference',
    href: '/vision',
    tags: ['heritage', 'architecture', 'vision'],
  },
  water: {
    file: '23-river-cruise-scenery.jpg',
    title: 'Material and water moment',
    alt: 'European-style fountain and landscape focal point',
    label: 'Reference',
    description: 'Hardscape and water feature reference for future visual study.',
    contextLabel: 'Future enhancement',
    stage: 'reference',
    href: '/enhancements',
    tags: ['enhancements', 'focal-point', 'water-feature'],
  },
} satisfies Record<string, CuratedAssetSeed>;

const zoneAssetKey: Record<string, keyof typeof curatedAssets> = {
  'entrance-sign-bed': 'entrance',
  'tour-path-edge': 'path',
  'taproom-patio-edge': 'patio',
  'event-lawn': 'eventLawn',
  'parking-arrival': 'parking',
  'utility-screening': 'utility',
};

const proposalAssetKeys: Record<string, Array<keyof typeof curatedAssets>> = {
  'phase-one-arrival': ['entrance', 'parking', 'path', 'formalGarden'],
  'patio-vision-study': ['patio', 'german', 'water'],
};

const principleAssetKeys: Record<string, keyof typeof curatedAssets> = {
  'Brewery heritage first': 'german',
  'Busch Gardens as inspiration, not imitation': 'formalGarden',
  'Every zone has a job': 'path',
  'Visual proof beats long explanations': 'entrance',
};

function fromSeed(key: keyof typeof curatedAssets): VisualProofAsset {
  const seed = curatedAssets[key];

  return {
    id: `curated-${key}`,
    src: `${imageBase}/${seed.file}`,
    kind: 'image',
    title: seed.title,
    alt: seed.alt,
    label: seed.label,
    description: seed.description,
    contextLabel: seed.contextLabel,
    stage: seed.stage,
    source: 'curated-fallback',
    href: seed.href,
    tags: seed.tags,
  };
}

function uniqueAssets(assets: VisualProofAsset[]) {
  const seen = new Set<string>();

  return assets.filter((asset) => {
    const key = `${asset.source}:${asset.src}:${asset.title}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function getProjectVisualProof(limit = 6): VisualProofAsset[] {
  return [
    fromSeed('entrance'),
    fromSeed('path'),
    fromSeed('parking'),
    fromSeed('patio'),
    fromSeed('eventLawn'),
    fromSeed('utility'),
  ].slice(0, limit);
}

export function getZoneVisualProof(
  zoneOrId: ProjectZone | string,
  limit = 3,
): VisualProofAsset[] {
  const zone =
    typeof zoneOrId === 'string'
      ? projectZones.find((item) => item.id === zoneOrId || item.name === zoneOrId)
      : zoneOrId;

  if (!zone) {
    return getProjectVisualProof(limit);
  }

  const preferred = zoneAssetKey[zone.id] ?? 'formalGarden';
  const supporting = getProjectVisualProof().filter((asset) => asset.id !== `curated-${preferred}`);

  return uniqueAssets([
    {
      ...fromSeed(preferred),
      title: zone.name,
      label: zone.photoStage,
      description: zone.summary,
      contextLabel: zone.status,
      stage: zone.photoStage,
      href: '/maps',
    },
    ...supporting,
  ]).slice(0, limit);
}

export function getProposalVisualProof(
  proposalOrId: Proposal | string,
  limit = 4,
): VisualProofAsset[] {
  const proposal =
    typeof proposalOrId === 'string'
      ? proposals.find((item) => item.id === proposalOrId)
      : proposalOrId;

  if (!proposal) {
    return getProjectVisualProof(limit);
  }

  const keys = proposalAssetKeys[proposal.id] ?? ['formalGarden', 'path', 'entrance'];

  return uniqueAssets(
    keys.map((key) => ({
      ...fromSeed(key),
      contextLabel: proposal.title,
      href: `/proposals/${proposal.id}`,
    })),
  ).slice(0, limit);
}

export function getClarityGapVisualProof(
  gapOrId: ClarityGap | string,
  limit = 2,
): VisualProofAsset[] {
  const gap =
    typeof gapOrId === 'string'
      ? clarityGaps.find((item) => item.id === gapOrId)
      : gapOrId;

  if (!gap) {
    return getProjectVisualProof(limit);
  }

  const zone = projectZones.find((item) => item.name === gap.zone);
  const zoneProof = getZoneVisualProof(zone ?? gap.zone, limit);

  return zoneProof.map((asset, index) => ({
    ...asset,
    title: index === 0 ? gap.title : asset.title,
    label: index === 0 ? gap.priority : asset.label,
    description: index === 0 ? gap.question : asset.description,
    contextLabel: gap.zone,
    href: '/clarity',
  }));
}

export function getApprovalVisualProof(approvalId: string, limit = 3): VisualProofAsset[] {
  const relatedProposal =
    approvalId === 'approval-entrance-v1'
      ? 'phase-one-arrival'
      : undefined;

  if (relatedProposal) {
    return getProposalVisualProof(relatedProposal, limit);
  }

  return [fromSeed('path'), fromSeed('parking'), fromSeed('utility')].slice(0, limit);
}

export function getVisionPrincipleVisualProof(
  principleOrTitle: VisionPrinciple | string,
  limit = 1,
): VisualProofAsset[] {
  const principle =
    typeof principleOrTitle === 'string'
      ? visionPrinciples.find((item) => item.title === principleOrTitle)
      : principleOrTitle;

  if (!principle) {
    return getProjectVisualProof(limit);
  }

  const key = principleAssetKeys[principle.title] ?? 'formalGarden';

  return [
    {
      ...fromSeed(key),
      title: principle.title,
      description: principle.proof,
      contextLabel: 'Proof standard',
      href: '/vision',
    },
  ].slice(0, limit);
}

export function getVisualProofQueryForZone(zone: ProjectZone): VisualProofQuery {
  return {
    contextType: 'zone',
    contextId: zone.id,
    zoneId: zone.id,
    kind: 'all',
  };
}

export function getVisualProofQueryForProposal(proposal: Proposal): VisualProofQuery {
  return {
    contextType: 'proposal',
    contextId: proposal.id,
    kind: 'all',
  };
}

function normalizeList<T>(value?: T | T[] | 'all') {
  if (!value || value === 'all') {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function normalizeToken(value?: string) {
  return value?.trim().toLowerCase();
}

function hasTagMatch(assetTags: string[] | undefined, requestedTags: string[]) {
  if (requestedTags.length === 0) {
    return true;
  }

  const normalizedAssetTags = new Set(
    (assetTags ?? []).map((tag) => tag.toLowerCase()),
  );

  return requestedTags.some((tag) => normalizedAssetTags.has(tag.toLowerCase()));
}

function mediaAssetMatches(
  asset: MediaAsset,
  options: SelectVisualProofAssetsOptions,
) {
  const stages = normalizeList(options.stage);

  if (options.kind && options.kind !== 'all' && asset.kind !== options.kind) {
    return false;
  }

  if (options.contextType && asset.contextType !== options.contextType) {
    return false;
  }

  if (options.contextId && asset.contextId !== options.contextId) {
    return false;
  }

  if (options.zoneId && asset.zoneId !== options.zoneId) {
    return false;
  }

  if (
    options.zoneName &&
    normalizeToken(asset.zoneName) !== normalizeToken(options.zoneName)
  ) {
    return false;
  }

  if (stages.length > 0 && !stages.includes(asset.stage)) {
    return false;
  }

  return hasTagMatch(asset.tags, options.tags ?? []);
}

function visualProofAssetMatches(
  asset: VisualProofAsset,
  options: SelectVisualProofAssetsOptions,
) {
  const stages = normalizeList(options.stage);

  if (options.kind && options.kind !== 'all' && asset.kind !== options.kind) {
    return false;
  }

  if (stages.length > 0 && asset.stage && !stages.includes(asset.stage)) {
    return false;
  }

  return hasTagMatch(asset.tags, options.tags ?? []);
}

function mediaAssetTime(asset: MediaAsset) {
  const parsed = Date.parse(asset.capturedAt || asset.createdAt);
  return Number.isFinite(parsed) ? parsed : 0;
}

function fromMediaAsset(asset: MediaAsset): VisualProofAsset {
  return {
    id: asset.id,
    src: asset.publicUrl,
    kind: asset.kind,
    title: asset.title,
    alt: asset.title,
    label: asset.stage,
    description: asset.note,
    contextLabel: asset.contextLabel,
    stage: asset.stage,
    source: 'media',
    capturedAt: asset.capturedAt,
    tags: asset.tags,
    mediaAsset: asset,
  };
}

function getFallbackVisualProof(
  options: SelectVisualProofAssetsOptions,
  limit: number,
) {
  if (options.contextType === 'proposal' && options.contextId) {
    return getProposalVisualProof(options.contextId, limit);
  }

  if (options.contextType === 'approval' && options.contextId) {
    return getApprovalVisualProof(options.contextId, limit);
  }

  if (options.contextType === 'zone' && options.contextId) {
    return getZoneVisualProof(options.contextId, limit);
  }

  if (options.zoneId) {
    return getZoneVisualProof(options.zoneId, limit);
  }

  if (options.zoneName) {
    return getZoneVisualProof(options.zoneName, limit);
  }

  if (options.fallbackKey === 'proposal') {
    return uniqueAssets(
      proposals.flatMap((proposal) => getProposalVisualProof(proposal, limit)),
    ).slice(0, limit);
  }

  if (options.fallbackKey === 'clarity') {
    return uniqueAssets(
      clarityGaps.flatMap((gap) => getClarityGapVisualProof(gap, limit)),
    ).slice(0, limit);
  }

  if (options.fallbackKey === 'vision') {
    return uniqueAssets(
      visionPrinciples.flatMap((principle) =>
        getVisionPrincipleVisualProof(principle, 1),
      ),
    ).slice(0, limit);
  }

  return getProjectVisualProof(limit);
}

export function selectVisualProofAssets(
  mediaAssets: MediaAsset[],
  options: SelectVisualProofAssetsOptions = {},
): VisualProofAsset[] {
  const limit = Math.max(0, options.limit ?? 4);

  if (limit === 0) {
    return [];
  }

  const realAssets = mediaAssets
    .filter((asset) => mediaAssetMatches(asset, options))
    .sort((a, b) => mediaAssetTime(b) - mediaAssetTime(a))
    .slice(0, limit)
    .map(fromMediaAsset);

  if (realAssets.length >= limit || options.includeFallbacks === false) {
    return realAssets;
  }

  const fallbackAssets = getFallbackVisualProof(options, limit)
    .filter((asset) => visualProofAssetMatches(asset, options))
    .slice(0, limit - realAssets.length);

  return [...realAssets, ...fallbackAssets];
}
