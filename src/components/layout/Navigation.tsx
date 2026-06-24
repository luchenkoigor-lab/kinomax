import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, Menu, X, Film, Home, Layers } from 'lucide-react';
import { useTheme } from '../../stores';

export function Navigation() {
  const { mode, toggleMode } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isCartoonMode = mode === 'cartoon';

  const navLinks = [
    { to: '/', label: 'Головна', icon: Home },
    { to: '/collections', label: 'Підбірки', icon: Layers },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isCartoonMode
          ? 'bg-gradient-to-b from-disney-blue/90 to-transparent'
          : 'bg-gradient-to-b from-netflix-bg/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Film className={`w-8 h-8 ${isCartoonMode ? 'text-disney-gold' : 'text-netflix-red'}`} />
            <span
              className={`text-2xl font-bold ${
                isCartoonMode ? 'font-cartoon text-disney-gold text-glow' : 'text-white'
              }`}
            >
              KinoMax
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === to
                    ? isCartoonMode
                      ? 'bg-disney-gold/20 text-disney-gold'
                      : 'bg-white/10 text-white'
                    : isCartoonMode
                    ? 'text-white/70 hover:text-white hover:bg-white/5'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пошук..."
                  className="bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-netflix-red/50 w-48 lg:w-64 transition-all"
                />
              </div>
            </form>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMode}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                isCartoonMode
                  ? 'bg-disney-gold text-black font-semibold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isCartoonMode ? 'animate-sparkle' : ''}`} />
              <span className="hidden sm:inline">{isCartoonMode ? 'Фільми' : 'Мультфільми'}</span>
            </motion.button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect rounded-xl p-4 mb-4"
          >
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пошук..."
                  className="w-full bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-netflix-red/50"
                />
              </div>
            </form>
            <div className="space-y-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === to
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
