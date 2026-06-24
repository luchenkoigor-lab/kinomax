import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Star,
  Calendar,
  Clock,
  ChevronLeft,
  Film,
  Tv,
  Share2,
} from 'lucide-react';
import { Navigation } from '../components/layout/Navigation';
import { SourceSelectionModal } from '../components/content/SourceSelectionModal';
import { ContentCarousel } from '../components/content/ContentCarousel';
import { GlassButton } from '../components/ui/GlassModal';
import { fetchContentDetails, fetchPopularMovies, fetchPopularTV, getTrailerUrl } from '../api';
import { useTheme } from '../stores';
import type { ContentDetails, VideoSource, ContentItem } from '../types';

export function ContentPage() {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const { mode } = useTheme();

  const [content, setContent] = useState<ContentDetails | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<VideoSource | null>(null);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarContent, setSimilarContent] = useState<ContentItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const isCartoonMode = mode === 'cartoon';

  useEffect(() => {
    async function loadContent() {
      if (!type || !id) return;

      setLoading(true);
      setError(null);
      setSelectedSource(null);
      setIsPlaying(false);

      try {
        const contentId = parseInt(id, 10);
        const [details, trailer] = await Promise.all([
          fetchContentDetails(contentId, type),
          getTrailerUrl(contentId, type),
        ]);

        setContent(details);
        setTrailerUrl(trailer);

        const randomContent = await (type === 'movie'
          ? fetchPopularMovies()
          : fetchPopularTV());
        setSimilarContent(
          randomContent.filter((item) => item.id !== contentId).slice(0, 10)
        );
      } catch (err) {
        setError('Не вдалося завантажити контент');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [type, id]);

  const handleSelectSource = (source: VideoSource) => {
    setSelectedSource(source);
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isCartoonMode ? 'disney-gradient' : 'bg-netflix-bg'}`}>
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className={`min-h-screen ${isCartoonMode ? 'disney-gradient' : 'bg-netflix-bg'}`}>
        <Navigation />
        <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
          <p className="text-red-500 text-xl mb-4">{error || 'Контент не знайдено'}</p>
          <GlassButton onClick={() => navigate('/')}>На головну</GlassButton>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isCartoonMode ? 'disney-gradient' : 'bg-netflix-bg'}`}>
      <Navigation />

      <div className="relative">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-20 left-4 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {content.backdropPath && (
          <div className="absolute inset-x-0 top-0 h-[50vh] md:h-[60vh] overflow-hidden">
            <img
              src={content.backdropPath}
              alt={content.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-bg via-netflix-bg/80 to-transparent" />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0 w-full lg:w-auto"
            >
              {content.posterPath ? (
                <img
                  src={content.posterPath}
                  alt={content.title}
                  className="w-48 mx-auto lg:mx-0 rounded-xl shadow-2xl"
                />
              ) : (
                <div className="w-48 h-72 mx-auto lg:mx-0 rounded-xl bg-white/10 flex items-center justify-center">
                  {type === 'tv' ? (
                    <Tv className="w-16 h-16 text-white/30" />
                  ) : (
                    <Film className="w-16 h-16 text-white/30" />
                  )}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <div className="mb-4">
                {type === 'tv' && (
                  <span className="inline-block bg-netflix-gold/90 text-black text-xs font-semibold px-2 py-1 rounded mb-2">
                    Серіал
                  </span>
                )}
                <h1
                  className={`text-3xl md:text-4xl font-bold text-white ${
                    isCartoonMode ? 'font-cartoon' : ''
                  }`}
                >
                  {content.title}
                </h1>
                {content.originalTitle !== content.title && (
                  <p className="text-white/60 text-sm mt-1">{content.originalTitle}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-white/80">
                <span className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-netflix-gold fill-netflix-gold" />
                  <span className="font-semibold text-white">
                    {content.voteAverage.toFixed(1)}
                  </span>
                  <span className="text-sm text-white/50">
                    ({content.voteCount.toLocaleString()})
                  </span>
                </span>

                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{content.releaseDate?.split('-')[0] || 'Невідомо'}</span>
                </span>

                {content.runtime && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(content.runtime / 60)}г {content.runtime % 60}хв</span>
                  </span>
                )}

                {content.numberOfSeasons && (
                  <span className="flex items-center space-x-1">
                    <Tv className="w-4 h-4" />
                    <span>
                      {content.numberOfSeasons} сезон{content.numberOfSeasons > 1 ? 'ів' : ''}
                    </span>
                  </span>
                )}
              </div>

              {content.genres && content.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {content.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="text-sm bg-white/10 text-white/80 px-3 py-1 rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {content.tagline && (
                <p className="text-white/60 italic mb-4">"{content.tagline}"</p>
              )}

              {content.overview && (
                <p className="text-white/90 mb-6 max-w-2xl">{content.overview}</p>
              )}

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSourceModalOpen(true)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    isCartoonMode
                      ? 'bg-disney-gold text-black hover:bg-yellow-300'
                      : 'bg-netflix-red text-white hover:bg-red-600'
                  }`}
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Дивитися</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Поділитися</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {isPlaying && selectedSource && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  src={selectedSource.url}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {similarContent.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <ContentCarousel title="Схоже" items={similarContent} showAll={false} />
        </div>
      )}

      <SourceSelectionModal
        open={sourceModalOpen}
        onOpenChange={setSourceModalOpen}
        content={content}
        onSelectSource={handleSelectSource}
        trailerUrl={trailerUrl}
      />
    </div>
  );
}
