import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Navigation } from '../components/layout/Navigation';
import { ContentCard } from '../components/content/ContentCard';
import { GlassButton } from '../components/ui/GlassModal';
import { searchContent, fetchByGenre } from '../api/tmdb';
import { useTheme } from '../stores';
import type { ContentItem, ContentType } from '../types';

const genres = [
  { id: 28, name: 'Бойовик' },
  { id: 12, name: 'Пригоди' },
  { id: 16, name: 'Мультфільм' },
  { id: 35, name: 'Комедія' },
  { id: 18, name: 'Драма' },
  { id: 14, name: 'Фентезі' },
  { id: 27, name: 'Жахи' },
  { id: 878, name: 'Наукова фантастика' },
  { id: 10749, name: 'Романтика' },
  { id: 53, name: 'Трилер' },
  { id: 10751, name: 'Сімейний' },
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode } = useTheme();
  const isCartoonMode = mode === 'cartoon';

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string, pageNum = 1) => {
    if (!searchQuery.trim() && !selectedGenre) return;

    setLoading(true);
    setError(null);

    try {
      let data: ContentItem[];

      if (selectedGenre) {
        data = await fetchByGenre(selectedType === 'all' ? 'movie' : selectedType, selectedGenre, pageNum);
      } else {
        data = await searchContent(searchQuery, pageNum);
      }

      if (selectedType !== 'all') {
        data = data.filter((item) => item.type === selectedType);
      }

      if (pageNum === 1) {
        setResults(data);
      } else {
        setResults((prev) => [...prev, ...data]);
      }

      setHasMore(data.length > 0);
      setPage(pageNum);
    } catch (err) {
      setError('Не вдалося виконати пошук');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setResults([]);
    setPage(1);

    if (genreId) {
      performSearch('', 1);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      performSearch(query, page + 1);
    }
  };

  const filteredResults = results.filter(
    (item) => selectedType === 'all' || item.type === selectedType
  );

  return (
    <div
      className={`min-h-screen ${
        isCartoonMode ? 'disney-gradient' : 'bg-netflix-bg'
      }`}
    >
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Пошук фільмів та серіалів..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-netflix-red/50 transition-all"
              />
            </div>
            <GlassButton type="submit" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
              ) : (
                'Знайти'
              )}
            </GlassButton>
          </form>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Filter className="w-4 h-4 text-white" />
              <span className="text-white">Фільтри</span>
            </button>

            {selectedGenre && (
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-netflix-red/20 text-white">
                <span>{genres.find((g) => g.id === selectedGenre)?.name}</span>
                <button onClick={() => handleGenreSelect(null)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedType === 'all'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Всі
            </button>
            <button
              onClick={() => setSelectedType('movie')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedType === 'movie'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Фільми
            </button>
            <button
              onClick={() => setSelectedType('tv')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedType === 'tv'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Серіали
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 glass-effect rounded-xl p-4"
          >
            <h3 className="text-white font-semibold mb-3">Жанри</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre.id === selectedGenre ? null : genre.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    genre.id === selectedGenre
                      ? 'bg-netflix-red text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && filteredResults.length === 0 && (query || selectedGenre) && (
          <div className="text-center py-12">
            <p className="text-white/60">Нічого не знайдено</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredResults.map((item, index) => (
            <ContentCard key={`${item.type}-${item.id}`} item={item} index={index} />
          ))}
        </div>

        {hasMore && filteredResults.length > 0 && (
          <div className="flex justify-center mt-8 pb-12">
            <GlassButton onClick={loadMore} disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
              ) : (
                'Завантажити ще'
              )}
            </GlassButton>
          </div>
        )}
      </main>
    </div>
  );
}
