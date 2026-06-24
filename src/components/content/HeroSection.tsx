import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Info, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ContentItem } from '../../types';
import { useTheme } from '../../stores';

interface HeroSectionProps {
  items: ContentItem[];
}

export function HeroSection({ items }: HeroSectionProps) {
  const { mode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isCartoonMode = mode === 'cartoon';

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <section className="relative h-[85vh] sm:h-screen overflow-hidden">
      <div className="absolute inset-0">
        {currentItem.backdropPath && (
          <motion.img
            key={currentItem.backdropPath}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            src={currentItem.backdropPath}
            alt={currentItem.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 gradient-overlay" />
        {isCartoonMode && (
          <div className="absolute inset-0 bg-gradient-to-r from-disney-blue/50 via-transparent to-disney-purple/30" />
        )}
      </div>

      <div className="absolute bottom-1/4 left-0 right-0 z-10 px-4 sm:px-8 lg:px-16">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 ${
              isCartoonMode ? 'font-cartoon text-glow' : ''
            }`}
          >
            {currentItem.title}
          </h1>

          <div className="flex items-center space-x-4 text-white/80 text-sm sm:text-base mb-4">
            <span className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-netflix-gold fill-netflix-gold" />
              <span className="font-semibold text-white">{currentItem.voteAverage.toFixed(1)}</span>
            </span>
            <span>{currentItem.releaseDate?.split('-')[0] || 'Невідомо'}</span>
            <span className="capitalize">{currentItem.type === 'tv' ? 'Серіал' : 'Фільм'}</span>
          </div>

          <p className="text-white/90 text-sm sm:text-base mb-6 line-clamp-3 hidden sm:block">
            {currentItem.overview}
          </p>

          <div className="flex items-center space-x-4">
            <Link to={`/${currentItem.type}/${currentItem.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isCartoonMode
                    ? 'bg-disney-gold text-black hover:bg-yellow-300'
                    : 'bg-netflix-red text-white hover:bg-red-600'
                }`}
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Дивитися</span>
              </motion.button>
            </Link>

            <Link to={`/${currentItem.type}/${currentItem.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all"
              >
                <Info className="w-5 h-5" />
                <span>Деталі</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {items.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? isCartoonMode
                    ? 'bg-disney-gold w-8'
                    : 'bg-netflix-red w-8'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
