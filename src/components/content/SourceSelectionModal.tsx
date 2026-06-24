import { useState, useEffect } from 'react';
import { Play, Youtube, Tv, Globe, Check, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassModal, GlassButton } from '../ui/GlassModal';
import type { ContentDetails, VideoSource } from '../../types';
import { type SourceConfig, VIDEO_SOURCES } from '../../types/video-source';

interface SourceSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ContentDetails | null;
  onSelectSource: (source: VideoSource) => void;
  trailerUrl: string | null;
}

const sourceIcons: Record<string, React.FC<{ className?: string }>> = {
  youtube: Youtube,
  tubi: Tv,
  plutotv: Tv,
  vimeo: Play,
};

export function SourceSelectionModal({
  open,
  onOpenChange,
  content,
  onSelectSource,
  trailerUrl,
}: SourceSelectionModalProps) {
  const [selectedSource, setSelectedSource] = useState<VideoSource | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!content || !open) return;

    // Simulated sources - in real app would fetch from database
    const uaSources: VideoSource[] = [
      {
        id: `uakino-${content.id}`,
        type: 'uakino',
        name: 'UAKino',
        url: `https://uakino.club/embed/${content.type}/${content.id}`,
        language: 'UA',
        quality: 'HD 720p',
      },
      {
        id: `hdrezka-ua-${content.id}`,
        type: 'hdrezka',
        name: 'HDRezka (UA)',
        url: `https://rezka.ag/ajax/loader.php?content_type=${content.type}&id=${content.id}&lang=ua`,
        language: 'UA',
        quality: 'HD 1080p',
      },
    ];

    const ruSources: VideoSource[] = [
      {
        id: `hdrezka-ru-${content.id}`,
        type: 'hdrezka',
        name: 'HDRezka (RU)',
        url: `https://rezka.ag/ajax/loader.php?content_type=${content.type}&id=${content.id}`,
        language: 'RU',
        quality: 'HD 1080p',
      },
    ];

    const legalSources: VideoSource[] = [];
    if (trailerUrl) {
      legalSources.push({
        id: `youtube-trailer-${content.id}`,
        type: 'youtube',
        name: 'YouTube (Трейлер)',
        url: trailerUrl,
        language: 'EN',
        quality: 'HD',
      });
    }

    // Default select UA source if available
    if (uaSources.length > 0) {
      setSelectedSource(uaSources[0]);
    }
  }, [content, open, trailerUrl]);

  const handleSelect = () => {
    if (selectedSource) {
      setLoading(true);
      setTimeout(() => {
        onSelectSource(selectedSource);
        setLoading(false);
        onOpenChange(false);
      }, 500);
    }
  };

  if (!content) return null;

  const SourceItem = ({
    source,
    isSelected,
    onClick,
  }: {
    source: VideoSource;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    const config = VIDEO_SOURCES.find((s) => s.type === source.type);
    const Icon = sourceIcons[source.type] || Play;

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
          isSelected
            ? 'bg-netflix-red/20 border-2 border-netflix-red'
            : 'bg-white/5 border border-white/10 hover:bg-white/10'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`p-2 rounded-lg ${
              config?.isLegal ? 'bg-green-500/20' : 'bg-white/10'
            }`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{source.name}</span>
              {config?.isLegal && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                  Легально
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-white/60">
              <span>{source.quality}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span>{source.language}</span>
              </span>
            </div>
          </div>
        </div>
        {isSelected && <Check className="w-5 h-5 text-netflix-red" />}
      </motion.button>
    );
  };

  return (
    <GlassModal open={open} onOpenChange={onOpenChange} title="Обрати джерело">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-netflix-gold mb-2 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Українська озвучка
          </h3>
          <SourceItem
            source={{
              id: `uakino-${content.id}`,
              type: 'uakino',
              name: 'UAKino',
              url: `https://uakino.club/embed/${content.type}/${content.id}`,
              language: 'UA',
              quality: 'HD 720p',
            }}
            isSelected={selectedSource?.type === 'uakino'}
            onClick={() =>
              setSelectedSource({
                id: `uakino-${content.id}`,
                type: 'uakino',
                name: 'UAKino',
                url: `https://uakino.club/embed/${content.type}/${content.id}`,
                language: 'UA',
                quality: 'HD 720p',
              })
            }
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/70 mb-2">Російська озвучка</h3>
          <SourceItem
            source={{
              id: `hdrezka-${content.id}`,
              type: 'hdrezka',
              name: 'HDRezka',
              url: `https://rezka.ag/embed/${content.type}/${content.id}`,
              language: 'RU',
              quality: 'HD 1080p',
            }}
            isSelected={selectedSource?.type === 'hdrezka'}
            onClick={() =>
              setSelectedSource({
                id: `hdrezka-${content.id}`,
                type: 'hdrezka',
                name: 'HDRezka',
                url: `https://rezka.ag/embed/${content.type}/${content.id}`,
                language: 'RU',
                quality: 'HD 1080p',
              })
            }
          />
        </div>

        {trailerUrl && (
          <div>
            <h3 className="text-sm font-semibold text-green-400 mb-2">Офіційний трейлер</h3>
            <SourceItem
              source={{
                id: `youtube-trailer-${content.id}`,
                type: 'youtube',
                name: 'YouTube',
                url: trailerUrl,
                language: 'EN',
                quality: 'HD',
              }}
              isSelected={selectedSource?.type === 'youtube'}
              onClick={() =>
                setSelectedSource({
                  id: `youtube-trailer-${content.id}`,
                  type: 'youtube',
                  name: 'YouTube',
                  url: trailerUrl,
                  language: 'EN',
                  quality: 'HD',
                })
              }
            />
          </div>
        )}

        <div className="pt-4 flex justify-end space-x-3">
          <GlassButton variant="secondary" onClick={() => onOpenChange(false)}>
            Скасувати
          </GlassButton>
          <GlassButton
            variant="primary"
            onClick={handleSelect}
            disabled={!selectedSource || loading}
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Play className="w-4 h-4 mr-2 inline" />
                Дивитися
              </>
            )}
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}
