CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id INTEGER NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'tv')),
  source_id TEXT,
  is_playing BOOLEAN DEFAULT false,
  playback_position REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rooms_select_all" ON rooms FOR SELECT
  USING (true);

CREATE POLICY "rooms_insert_all" ON rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "rooms_update_all" ON rooms FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE POLICY "rooms_delete_all" ON rooms FOR DELETE
  USING (true);

CREATE INDEX idx_rooms_created_at ON rooms(created_at DESC);