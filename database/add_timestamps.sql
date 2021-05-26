ALTER TABLE species 
ADD created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE materials 
ADD created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER table species_agrosystems
ADD created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER table species_materials
ADD created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER table agro_eco_systems
ADD created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

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

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON materials
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON species_agrosystems
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON species_materials
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON agro_eco_systems
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

ALTER TABLE species_materials
DROP CONSTRAINT species_materials_species_id_fkey,
ADD CONSTRAINT species_materials_species_id_fkey 
FOREIGN KEY(species_id)
REFERENCES species(uid)
ON DELETE CASCADE;

ALTER TABLE species_materials
DROP CONSTRAINT species_materials_material_id_fkey,
ADD CONSTRAINT species_materials_material_id_fkey 
FOREIGN KEY(material_id)
REFERENCES materials(uid)
ON DELETE CASCADE;

ALTER TABLE species_materials
DROP CONSTRAINT species_materials_image_id_fkey,
ADD CONSTRAINT species_materials_image_id_fkey 
FOREIGN KEY(image_id)
REFERENCES images(uid)
ON DELETE CASCADE;

ALTER TABLE species_agrosystems
DROP CONSTRAINT species_agrosystems_species_id_fkey,
ADD CONSTRAINT species_agrosystems_species_id_fkey 
FOREIGN KEY(species_id)
REFERENCES species(uid)
ON DELETE CASCADE;

ALTER TABLE species_agrosystems
DROP CONSTRAINT species_agrosystems_agrosystem_id_fkey,
ADD CONSTRAINT species_agrosystems_agrosystem_id_fkey 
FOREIGN KEY(agrosystem_id)
REFERENCES agro_eco_systems(uid)
ON DELETE CASCADE;
