CREATE TABLE daily_cartoon_backgrounds (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  poster_urls TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE daily_cartoon_backgrounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_cartoon_bgs_select_all" ON daily_cartoon_backgrounds FOR SELECT
  USING (true);
