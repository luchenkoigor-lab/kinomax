import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Sparkles, Clock, Rocket, Globe, Crown } from 'lucide-react';
import { Navigation } from '../components/layout/Navigation';
import { ContentCarousel } from '../components/content/ContentCarousel';
import { useTheme } from '../stores';
import { fetchByKeyword, searchContent } from '../api';
import type { ContentItem } from '../types';
import { supabase } from '../api/supabase';

interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  tmdb_keywords: string[];
  tmdb_genres: number[];
  tag: string;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  scifi: Rocket,
  adventure: Globe,
  action: Sparkles,
  family: Crown,
};

const gradientMap: Record<string, string> = {
  scifi: 'from-purple-600 to-blue-600',
  adventure: 'from-green-600 to-teal-600',
  action: 'from-red-600 to-orange-600',
  family: 'from-pink-600 to-purple-600',
};

const defaultCollections = [
  {
    id: 1,
    name: 'НЛО та прибульці',
    slug: 'aliens-ufo',
    description: 'Фільми та серіали про прибульців та НЛО',
    tmdb_keywords: ['alien', 'ufo'],
    tmdb_genres: [878],
    tag: 'scifi',
  },
  {
    id: 2,
    name: 'Подорожі у часі',
    slug: 'time-travel',
    description: 'Історії про подорожі у часі',
    tmdb_keywords: ['time travel'],
    tmdb_genres: [878, 12],
    tag: 'scifi',
  },
  {
    id: 3,
    name: 'Апокаліпсис',
    slug: 'apocalypse',
    description: 'Постапокаліптичні та антиутопічні світи',
    tmdb_keywords: ['apocalypse', 'zombie'],
    tmdb_genres: [878, 28],
    tag: 'action',
  },
  {
    id: 4,
    name: 'Пригоди',
    slug: 'adventures',
    description: 'Грандіозні пригоди та подорожі',
    tmdb_keywords: ['adventure'],
    tmdb_genres: [12],
    tag: 'adventure',
  },
  {
    id: 5,
    name: 'Казки',
    slug: 'fairy-tales',
    description: 'Чарівні казки та легенди',
    tmdb_keywords: ['fairy tale', 'magic'],
    tmdb_genres: [10751, 14],
    tag: 'family',
  },
];

const defaultImages: Record<string, string> = {
  'aliens-ufo': 'https://images.pexels.com/videos/3633862/pexels-photo-3633862.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'time-travel': 'https://images.pexels.com/photos/39561/space-universe-outer-space-galaxy-39561.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'apocalypse': 'https://images.pexels.com/photos/891259/pexels-photo-891259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'adventures': 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'fairy-tales': 'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
};

export function CollectionsPage() {
  const { mode } = useTheme();
  const isCartoonMode = mode === 'cartoon';

  const [collections, setCollections] = useState(defaultCollections);
  const [collectionContent, setCollectionContent] = useState<Record<string, ContentItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('collections').select('*');
        if (data && data.length > 0) {
          setCollections(data as Collection[]);
        }

        const contentPromises = defaultCollections.map(async (col) => {
          let content: ContentItem[] = [];
          if (col.tmdb_keywords.length > 0) {
            for (const keyword of col.tmdb_keywords) {
              const results = await searchContent(keyword);
              content = [...content, ...results];
            }
          }

          content.sort((a, b) => b.popularity - a.popularity);
          content = content.filter((item, idx, arr) =>
            arr.findIndex((i) => i.id === item.id) === idx
          );

          return { [col.slug]: content.slice(0, 15) };
        });

        const results = await Promise.all(contentPromises);
        const contentMap = results.reduce((acc, cur) => ({ ...acc, ...cur }), {});
        setCollectionContent(contentMap);
      } catch (err) {
        console.error('Failed to load collections:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCollections();
  }, []);

  const CollectionCard = ({ collection }: { collection: typeof defaultCollections[0] }) => {
    const Icon = iconMap[collection.tag] || Layers;
    const gradient = gradientMap[collection.tag] || 'from-gray-600 to-gray-600';

    return (
      <Link to={`/collection/${collection.slug}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className="relative rounded-xl overflow-hidden group cursor-pointer h-48"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="relative h-full flex flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              <div
                className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{collection.name}</h3>
              <p className="text-white/80 text-sm">{collection.description}</p>
            </div>

            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  return (
    <div
      className={`min-h-screen ${
        isCartoonMode ? 'disney-gradient' : 'bg-netflix-bg'
      }`}
    >
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Підбірки
          </h1>
          <p className="text-white/60">
            Досліджуйте тематичні колекції фільмів та серіалів
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
          </div>
        ) : (
          <>
            {/* Featured Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {collections.slice(0, 6).map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>

            {/* Content from each collection */}
            {collections.slice(0, 3).map((collection) => (
              <div key={collection.slug} className="mb-8">
                {collectionContent[collection.slug] && (
                  <ContentCarousel
                    title={collection.name}
                    items={collectionContent[collection.slug]}
                    viewAllLink={`/collection/${collection.slug}`}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
