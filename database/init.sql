CREATE TABLE climates (
  uid SERIAL PRIMARY KEY,
  climate VARCHAR(255)
);

CREATE TABLE species (
  uid SERIAL PRIMARY KEY,
  species VARCHAR(255),
  climate INT REFERENCES climates(uid)
);

CREATE TABLE parts (
  uid SERIAL PRIMARY KEY,
  part VARCHAR(255),
  species INT REFERENCES species(uid)
);

CREATE TABLE materials (
  uid SERIAL PRIMARY KEY,
  material VARCHAR(255),
  is_final BOOLEAN
);

CREATE TABLE processes (
  uid SERIAL PRIMARY KEY,
  process VARCHAR(255)
);

CREATE TABLE part_process (
  uid SERIAL PRIMARY KEY,
  part_id INT REFERENCES parts(uid),
  process_id INT REFERENCES processes(uid),
  material_id INT REFERENCES materials(uid)
);

CREATE TABLE material_process (
  uid SERIAL PRIMARY KEY,
  input_material_id INT REFERENCES materials(uid),
  process_id INT REFERENCES processes(uid),
  output_material_id INT REFERENCES materials(uid)
);

