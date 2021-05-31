package database

import (
	"backend/models"
	"fmt"
	"log"
)

func (d *DB) InsertAgroEcoSystem(agroSystem models.AgroEcoSystem) int64 {
	sqlStatement := `INSERT into agro_eco_systems (name, hardiness) VALUES ($1, $2) RETURNING uid`

	var id int64
	err := d.db.QueryRow(sqlStatement, agroSystem.Name, agroSystem.Hardiness).Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Inserted agro eco system %v", id)
	return id
}

func (d *DB) InsertAgroSystemAssociation(agroSystemId int64, speciesId int64) int64 {
	sqlStatement := `INSERT into species_agrosystems (species_id, agrosystem_id) VALUES ($1, $2) RETURNING uid`

	var id int64
	err := d.db.QueryRow(sqlStatement, speciesId, agroSystemId).Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Inserted agro eco system %v", id)
	return id
}

func (d *DB) GetAllAgroEcoSystems() ([]models.AgroEcoSystem, error) {
	var agroSystems []models.AgroEcoSystem

	sqlStatement := `SELECT * FROM agro_eco_systems`
	rows, err := d.db.Query(sqlStatement)

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var aes models.AgroEcoSystem
		err = rows.Scan(&aes.ID, &aes.Name, &aes.Hardiness, &aes.CreatedAt, &aes.UpdatedAt)

		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		agroSystems = append(agroSystems, aes)
	}

	return agroSystems, err
}

func (d *DB) GetAllAgroEcoSystemsAssociations() ([]models.AgroEcoSystemAssociation, error) {
	var associations []models.AgroEcoSystemAssociation

	sqlStatement := `SELECT species_agrosystems.uid, agro_eco_systems."name", agro_eco_systems."hardiness", species."common_name" FROM species_agrosystems
    inner join species on species_agrosystems.species_id=species.uid
    inner join agro_eco_systems on species_agrosystems.agrosystem_id=agro_eco_systems.uid`

	rows, err := d.db.Query(sqlStatement)

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var aes models.AgroEcoSystemAssociation
		err = rows.Scan(&aes.ID, &aes.Name, &aes.Hardiness, &aes.SpeciesName)

		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		associations = append(associations, aes)
	}

	return associations, err
}
