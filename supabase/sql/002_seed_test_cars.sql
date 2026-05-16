-- Optional test data for Islamcars.
-- Run after 001_initial_schema.sql if you want demo cars in Supabase.

insert into public.cars (
  slug,
  brand,
  model,
  year,
  daily_price,
  fuel_type,
  transmission,
  seats,
  description,
  status,
  featured
)
values
  ('renault-clio-4-blanche', 'Renault', 'Clio 4', 2019, 400, 'Diesel', 'Manuelle', 5, 'Voiture compacte adaptee aux trajets en ville et autour d Agadir.', 'available', true),
  ('renault-clio-5-grise', 'Renault', 'Clio 5', 2022, 400, 'Essence', 'Automatique', 5, 'Modele recent avec conduite confortable.', 'available', true),
  ('peugeot-208-noire', 'Peugeot', '208', 2021, 400, 'Diesel', 'Manuelle', 5, 'Citadine economique pour location courte duree.', 'available', true),
  ('renault-clio-4-rouge', 'Renault', 'Clio 4', 2018, 400, 'Diesel', 'Manuelle', 5, 'Modele fiable pour les deplacements quotidiens.', 'available', false),
  ('peugeot-208-blanche', 'Peugeot', '208', 2020, 400, 'Essence', 'Manuelle', 5, 'Voiture pratique avec faible consommation.', 'reserved', false),
  ('renault-clio-5-bleue', 'Renault', 'Clio 5', 2023, 400, 'Essence', 'Automatique', 5, 'Voiture moderne avec boite automatique.', 'available', false),
  ('renault-clio-4-grise', 'Renault', 'Clio 4', 2017, 400, 'Diesel', 'Manuelle', 5, 'Vehicule temporairement en maintenance.', 'maintenance', false),
  ('peugeot-208-grise', 'Peugeot', '208', 2022, 400, 'Diesel', 'Automatique', 5, 'Modele confortable pour ville et route.', 'available', false),
  ('renault-clio-5-blanche', 'Renault', 'Clio 5', 2021, 400, 'Essence', 'Manuelle', 5, 'Citadine recente facile a conduire.', 'available', false),
  ('peugeot-208-rouge', 'Peugeot', '208', 2019, 400, 'Diesel', 'Manuelle', 5, 'Voiture economique disponible a Agadir.', 'available', false)
on conflict (slug) do update set
  brand = excluded.brand,
  model = excluded.model,
  year = excluded.year,
  daily_price = excluded.daily_price,
  fuel_type = excluded.fuel_type,
  transmission = excluded.transmission,
  seats = excluded.seats,
  description = excluded.description,
  status = excluded.status,
  featured = excluded.featured;
