import { useState, useEffect } from 'react';
import { Navigation, ParticleBackground, CastleSilhouette } from '../components/layout';
import { HeroSection, ContentCarousel } from '../components/content';
import { useTheme } from '../stores';
import type { ContentItem } from '../types';
import {
  fetchPopularMovies,
  fetchPopularTV,
  fetchTopRatedMovies,
  fetchTopRatedTV,
  fetchPopularAnimations,
  fetchTopCartoons,
  fetchKidsContent,
} from '../api';

export function HomePage() {
  const { mode } = useTheme();
  const [heroItems, setHeroItems] = useState<ContentItem[]>([]);
  const [popular, setPopular] = useState<ContentItem[]>([]);
  const [topRated, setTopRated] = useState<ContentItem[]>([]);
  const [animations, setAnimations] = useState<ContentItem[]>([]);
  const [topCartoons, setTopCartoons] = useState<ContentItem[]>([]);
  const [kidsContent, setKidsContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isCartoonMode = mode === 'cartoon';

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      try {
        if (isCartoonMode) {
          const [popularAnim, topAnim, kids] = await Promise.all([
            fetchPopularAnimations(),
            fetchTopCartoons(),
            fetchKidsContent(),
          ]);
          setHeroItems(popularAnim.slice(0, 5));
          setPopular(popularAnim);
          setAnimations(topAnim);
          setKidsContent(kids);
          setTopRated([]);
        } else {
          const [movies, tv, topMovies, topTV] = await Promise.all([
            fetchPopularMovies(),
            fetchPopularTV(),
            fetchTopRatedMovies(),
            fetchTopRatedTV(),
          ]);

          const allPopular = [...movies.slice(0, 10), ...tv.slice(0, 10)].sort(
            (a, b) => b.popularity - a.popularity
          );
          const allTopRated = [...topMovies.slice(0, 10), ...topTV.slice(0, 10)].sort(
            (a, b) => b.voteAverage - a.voteAverage
          );

          setHeroItems(allTopRated.slice(0, 5));
          setPopular(allPopular);
          setTopRated(allTopRated);
          setAnimations([]);
          setTopCartoons([]);
          setKidsContent([]);
        }
      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [isCartoonMode]);

  return (
    <div
      className={`min-h-screen ${
        isCartoonMode
          ? 'disney-gradient'
          : 'bg-netflix-bg'
      }`}
    >
      {isCartoonMode && <ParticleBackground />}
      {isCartoonMode && <CastleSilhouette />}

      <Navigation />

      <main className="relative z-10">
        {!loading && <HeroSection items={heroItems} />}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
            </div>
          ) : (
            <>
              {isCartoonMode ? (
                <>
                  <ContentCarousel
                    title="Популярні мультфільми"
                    items={popular}
                    viewAllLink="/discover/animation"
                  />
                  <ContentCarousel
                    title="Топ мультфільмів"
                    items={animations}
                    viewAllLink="/discover/top-animation"
                  />
                  <ContentCarousel
                    title="Для малюків"
                    items={kidsContent}
                    viewAllLink="/discover/kids"
                  />
                </>
              ) : (
                <>
                  <ContentCarousel
                    title="Зараз популярне"
                    items={popular}
                    viewAllLink="/discover/popular"
                  />
                  <ContentCarousel
                    title="Топ за IMDb"
                    items={topRated}
                    viewAllLink="/discover/top-rated"
                  />
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
