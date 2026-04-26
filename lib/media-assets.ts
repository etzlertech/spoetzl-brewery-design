import {
  approvalItems,
  getZoneByName,
  projectZones,
  proposals,
  walkthroughs,
  workLogs,
} from '@/lib/project-data';

export type MediaKind = 'image' | 'video';

export type MediaContextType =
  | 'general'
  | 'zone'
  | 'walkthrough'
  | 'work-log'
  | 'proposal'
  | 'approval';

export type MediaStage =
  | 'before'
  | 'concept'
  | 'progress'
  | 'after'
  | 'walkthrough'
  | 'issue'
  | 'approval'
  | 'reference';

export interface MediaContextOption {
  key: string;
  type: MediaContextType;
  id: string;
  label: string;
  description: string;
  zoneId?: string;
  zoneName?: string;
}

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  title: string;
  note: string;
  originalName: string;
  contentType: string;
  size: number;
  bucket: string;
  path: string;
  publicUrl: string;
  createdAt: string;
  capturedAt: string;
  capturedBy: string;
  side: 'evergold' | 'spoetzl' | 'both';
  stage: MediaStage;
  contextType: MediaContextType;
  contextId: string;
  contextLabel: string;
  zoneId: string;
  zoneName: string;
  tags: string[];
  legacy?: boolean;
}

export const mediaStageOptions: Array<{
  value: MediaStage;
  label: string;
  description: string;
}> = [
  {
    value: 'before',
    label: 'Before',
    description: 'Baseline condition before work or decisions',
  },
  {
    value: 'concept',
    label: 'Concept',
    description: 'Mockup, inspiration, or proposed direction',
  },
  {
    value: 'progress',
    label: 'Progress',
    description: 'Current field work or active issue',
  },
  {
    value: 'after',
    label: 'After',
    description: 'Completed work or resolved condition',
  },
  {
    value: 'walkthrough',
    label: 'Walkthrough',
    description: 'Video, clip, or stop evidence from a walk',
  },
  {
    value: 'issue',
    label: 'Issue',
    description: 'Clarification, repair, risk, or blocked item',
  },
  {
    value: 'approval',
    label: 'Approval',
    description: 'Visual proof for signoff or estimate review',
  },
  {
    value: 'reference',
    label: 'Reference',
    description: 'General inspiration or supporting evidence',
  },
];

export function getMediaContextOptions(): MediaContextOption[] {
  const options: MediaContextOption[] = [
    {
      key: 'general:project',
      type: 'general',
      id: 'project',
      label: 'Project-wide clarity board',
      description: 'Use when the media supports the overall Spoetzl and Evergold relationship.',
    },
  ];

  projectZones.forEach((zone) => {
    options.push({
      key: `zone:${zone.id}`,
      type: 'zone',
      id: zone.id,
      label: zone.name,
      description: `Zone media - ${zone.photoStage} stage`,
      zoneId: zone.id,
      zoneName: zone.name,
    });
  });

  walkthroughs.forEach((walkthrough) => {
    options.push({
      key: `walkthrough:${walkthrough.id}`,
      type: 'walkthrough',
      id: walkthrough.id,
      label: walkthrough.title,
      description: `${walkthrough.type} walkthrough - ${walkthrough.date}`,
    });
  });

  workLogs.forEach((log) => {
    const zone = getZoneByName(log.zone);

    options.push({
      key: `work-log:${log.id}`,
      type: 'work-log',
      id: log.id,
      label: log.title,
      description: `${log.date} - ${log.zone}`,
      zoneId: zone?.id,
      zoneName: zone?.name ?? log.zone,
    });
  });

  proposals.forEach((proposal) => {
    options.push({
      key: `proposal:${proposal.id}`,
      type: 'proposal',
      id: proposal.id,
      label: proposal.title,
      description: `${proposal.version} - ${proposal.status}`,
    });
  });

  approvalItems.forEach((approval) => {
    options.push({
      key: `approval:${approval.id}`,
      type: 'approval',
      id: approval.id,
      label: approval.title,
      description: `${approval.status} - due ${approval.due}`,
    });
  });

  return options;
}

export function findMediaContextOption(
  type: MediaContextType,
  id: string,
): MediaContextOption | undefined {
  return getMediaContextOptions().find(
    (option) => option.type === type && option.id === id,
  );
}

export function inferMediaContextKey(pathname: string): string {
  if (pathname.startsWith('/proposals/')) {
    const id = pathname.split('/').filter(Boolean)[1];
    if (id) {
      return `proposal:${id}`;
    }
  }

  if (pathname.startsWith('/walkthroughs') || pathname.startsWith('/videos')) {
    return walkthroughs[0] ? `walkthrough:${walkthroughs[0].id}` : 'general:project';
  }

  if (pathname.startsWith('/work')) {
    return workLogs[0] ? `work-log:${workLogs[0].id}` : 'general:project';
  }

  if (pathname.startsWith('/maps') || pathname.startsWith('/mapping')) {
    return projectZones[0] ? `zone:${projectZones[0].id}` : 'general:project';
  }

  return 'general:project';
}

export function formatMediaSize(size: number): string {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
