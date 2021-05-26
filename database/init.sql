CREATE TABLE hardiness (
  uid INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  value INT NOT NULL
);

CREATE TABLE species (
  uid INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  common_name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255) NOT NULL,
  min_hardiness INT NOT NULL,
  max_hardiness INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE materials (
  uid INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE images (
  uid INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE species_materials (
  uid INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  species_id INT REFERENCES species(uid) ON DELETE CASCADE,
  material_id INT REFERENCES materials(uid) ON DELETE CASCADE,
  image_id INT REFERENCES images(uid) ON DELETE CASCADE,
  link VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agro_eco_systems (
  uid INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  hardiness INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE species_agrosystems (
  uid INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  species_id INT REFERENCES species(uid) ON DELETE CASCADE,
  agrosystem_id INT REFERENCES agro_eco_systems(uid) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON species
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

INSERT into hardiness(value) VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10), (11), (12), (13), (14), (15);
