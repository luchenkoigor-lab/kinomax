export type VideoSourceType = 'hdrezka' | 'uakino' | 'youtube' | 'vimeo' | 'tubi' | 'plutotv' | 'other';

export type VideoLanguage = 'UA' | 'RU' | 'EN' | 'OTHER';

export interface VideoSource {
  id: string;
  type: VideoSourceType;
  name: string;
  url: string;
  language: VideoLanguage;
  quality: string;
  icon?: string;
}

export interface SourceConfig {
  type: VideoSourceType;
  name: string;
  baseUrl: string;
  embedPattern: (contentId: string, params?: Record<string, string>) => string;
  languages: VideoLanguage[];
  icon: string;
  isOfficial: boolean;
  isLegal: boolean;
}

export const VIDEO_SOURCES: SourceConfig[] = [
  {
    type: 'hdrezka',
    name: 'HDRezka',
    baseUrl: 'https://rezka.ag',
    embedPattern: (id) => `https://rezka.ag/ajax/loader.php?id=${id}`,
    languages: ['UA', 'RU'],
    icon: 'play',
    isOfficial: false,
    isLegal: false,
  },
  {
    type: 'uakino',
    name: 'UAKino',
    baseUrl: 'https://uakino.club',
    embedPattern: (id) => `https://uakino.club/embed/${id}`,
    languages: ['UA'],
    icon: 'play',
    isOfficial: false,
    isLegal: false,
  },
  {
    type: 'youtube',
    name: 'YouTube',
    baseUrl: 'https://youtube.com',
    embedPattern: (videoId) => `https://www.youtube.com/embed/${videoId}`,
    languages: ['EN', 'UA', 'RU', 'OTHER'],
    icon: 'youtube',
    isOfficial: true,
    isLegal: true,
  },
  {
    type: 'vimeo',
    name: 'Vimeo',
    baseUrl: 'https://vimeo.com',
    embedPattern: (videoId) => `https://player.vimeo.com/video/${videoId}`,
    languages: ['EN', 'UA', 'RU', 'OTHER'],
    icon: 'video',
    isOfficial: true,
    isLegal: true,
  },
  {
    type: 'tubi',
    name: 'Tubi',
    baseUrl: 'https://tubitv.com',
    embedPattern: (id) => `https://tubitv.com/embed/${id}`,
    languages: ['EN'],
    icon: 'tv',
    isOfficial: true,
    isLegal: true,
  },
  {
    type: 'plutotv',
    name: 'Pluto TV',
    baseUrl: 'https://pluto.tv',
    embedPattern: (id) => `https://pluto.tv/embed/${id}`,
    languages: ['EN'],
    icon: 'tv',
    isOfficial: true,
    isLegal: true,
  },
];

export function getSourceConfig(type: VideoSourceType): SourceConfig | undefined {
  return VIDEO_SOURCES.find((s) => s.type === type);
}

export function categorizeSources(sources: VideoSource[]): {
  ukrainian: VideoSource[];
  russian: VideoSource[];
  legal: VideoSource[];
} {
  return {
    ukrainian: sources.filter((s) => s.language === 'UA'),
    russian: sources.filter((s) => s.language === 'RU'),
    legal: sources.filter((s) => {
      const config = getSourceConfig(s.type);
      return config?.isLegal ?? false;
    }),
  };
}
