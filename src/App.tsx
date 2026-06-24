import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './stores';
import {
  HomePage,
  ContentPage,
  SearchPage,
  CollectionsPage,
} from './pages';

/* KinoMax - Ukrainian Online Cinema Platform */

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<ContentPage />} />
          <Route path="/tv/:id" element={<ContentPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collection/:slug" element={<CollectionsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
