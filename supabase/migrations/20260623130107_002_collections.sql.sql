CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  tmdb_keywords TEXT[] DEFAULT '{}',
  tmdb_genres INTEGER[] DEFAULT '{}',
  tag TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "collections_select_all" ON collections FOR SELECT
  USING (true);

INSERT INTO collections (name, slug, description, tmdb_keywords, tmdb_genres, tag) VALUES
  ('НЛО та прибульці', 'aliens-ufo', 'Фільми та серіали про прибульців та НЛО', ARRAY['alien', 'ufo', 'extraterrestrial'], ARRAY[878], 'scifi'),
  ('Подорожі у часі', 'time-travel', 'Історії про подорожі у часі', ARRAY['time travel', 'time machine'], ARRAY[878, 12], 'scifi'),
  ('Апокаліпсис', 'apocalypse', 'Постапокаліптичні та антиутопічні світи', ARRAY['apocalypse', 'post-apocalyptic', 'dystopia'], ARRAY[878, 28], 'action'),
  ('Пригоди', 'adventures', 'Грандіозні пригоди та подорожі', ARRAY['adventure', 'expedition'], ARRAY[12], 'adventure'),
  ('Казки', 'fairy-tales', 'Чарівні казки та легенди', ARRAY['fairy tale', 'magic', 'fantasy'], ARRAY[10751, 14], 'family');