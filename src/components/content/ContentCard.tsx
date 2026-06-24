import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import type { ContentItem } from '../../types';
import { useTheme } from '../../stores';

interface ContentCardProps {
  item: ContentItem;
  index?: number;
}

export function ContentCard({ item, index = 0 }: ContentCardProps) {
  const { mode } = useTheme();
  const isCartoonMode = mode === 'cartoon';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: isCartoonMode ? 1.15 : 1.08, y: -10 }}
      className={`relative flex-shrink-0 cursor-pointer carousel-item ${isCartoonMode ? 'w-40 sm:w-48' : 'w-36 sm:w-44'}`}
    >
      <Link to={`/${item.type}/${item.id}`}>
        <div className="relative overflow-hidden rounded-xl group">
          {item.posterPath ? (
            <img
              src={item.posterPath}
              alt={item.title}
              className="w-full aspect-[2/3] object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-white/10 flex items-center justify-center">
              <Play className="w-12 h-12 text-white/30" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div
              className={`p-3 rounded-full ${
                isCartoonMode ? 'bg-disney-gold' : 'bg-netflix-red'
              } shadow-lg`}
            >
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </motion.div>

          <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/60 rounded-full px-2 py-1 text-xs">
            <Star className="w-3 h-3 text-netflix-gold fill-netflix-gold" />
            <span className="text-white font-medium">{item.voteAverage.toFixed(1)}</span>
          </div>

          {item.type === 'tv' && (
            <div className="absolute top-2 left-2 bg-netflix-gold/90 text-black text-xs font-semibold rounded px-2 py-0.5">
              Серіал
            </div>
          )}
        </div>

        <div className="mt-2">
          <h3
            className={`text-sm font-medium text-white line-clamp-1 ${
              isCartoonMode ? 'font-cartoon' : ''
            }`}
          >
            {item.title}
          </h3>
          <p className="text-xs text-white/50">
            {item.releaseDate?.split('-')[0] || 'Невідомо'}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
