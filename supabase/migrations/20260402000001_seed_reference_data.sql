-- ============================================================
-- Seed: flavor_tags (~32 common coffee flavor tags)
-- ============================================================

insert into flavor_tags (name, category, emoji) values
  -- Sweet
  ('Chocolate', 'sweet', '🍫'),
  ('Caramel', 'sweet', '🍮'),
  ('Honey', 'sweet', '🍯'),
  ('Vanilla', 'sweet', '🌿'),
  ('Brown Sugar', 'sweet', '🟤'),
  ('Toffee', 'sweet', '🧈'),
  -- Fruit
  ('Berry', 'fruit', '🫐'),
  ('Citrus', 'fruit', '🍊'),
  ('Tropical', 'fruit', '🥭'),
  ('Stone Fruit', 'fruit', '🍑'),
  ('Apple', 'fruit', '🍎'),
  ('Dried Fruit', 'fruit', '🍇'),
  -- Nutty
  ('Nutty', 'nutty', '🥜'),
  ('Almond', 'nutty', '🌰'),
  ('Hazelnut', 'nutty', '🌰'),
  ('Walnut', 'nutty', '🥜'),
  -- Floral
  ('Floral', 'floral', '🌸'),
  ('Jasmine', 'floral', '🌼'),
  ('Rose', 'floral', '🌹'),
  ('Lavender', 'floral', '💜'),
  -- Earth
  ('Earthy', 'earth', '🌍'),
  ('Woody', 'earth', '🪵'),
  ('Tobacco', 'earth', '🍂'),
  ('Mushroom', 'earth', '🍄'),
  -- Spice
  ('Spicy', 'spice', '🌶️'),
  ('Cinnamon', 'spice', '🫚'),
  ('Clove', 'spice', '✨'),
  ('Black Pepper', 'spice', '🫘'),
  -- Roast
  ('Smoky', 'roast', '🔥'),
  ('Dark Cocoa', 'roast', '☕'),
  ('Toasted', 'roast', '🍞'),
  ('Roasty', 'roast', '♨️');

-- ============================================================
-- Seed: neighborhoods (5 seed areas in Singapore)
-- ============================================================

insert into neighborhoods (name, display_name, latitude, longitude, is_seed) values
  ('tiong_bahru', 'Tiong Bahru', 1.2842, 103.8325, true),
  ('tanjong_pagar_telok_ayer', 'Tanjong Pagar / Telok Ayer', 1.2764, 103.8465, true),
  ('kampong_glam_bugis', 'Kampong Glam / Bugis', 1.3008, 103.8590, true),
  ('orchard_river_valley', 'Orchard / River Valley', 1.3050, 103.8310, true),
  ('holland_village_dempsey', 'Holland Village / Dempsey', 1.3112, 103.7960, true);
