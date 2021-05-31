package database

import (
	"backend/models"
	"fmt"
	"log"
)

func (d *DB) EditSpecies(species models.Species) models.Species {
	sqlStatement := `UPDATE species set common_name=$1, min_hardiness=$2, max_hardiness=$3, scientific_name=$4 WHERE uid=$5`

	//TODO: read the number of row affected by the update
	_, err := d.db.Exec(sqlStatement, species.CommonName, species.MinHardiness, species.MaxHardiness, species.ScientificName, species.ID)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Edited specices %v", species.ID)
	return species
}

func (d *DB) InsertSpecies(species models.Species) int64 {
	sqlStatement := `INSERT into species (common_name, scientific_name, min_hardiness, max_hardiness) VALUES ($1, $2, $3, $4) RETURNING uid`

	var id int64
	err := d.db.QueryRow(sqlStatement, species.CommonName, species.ScientificName, species.MinHardiness, species.MaxHardiness).Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Inserted species %v", id)
	return id
}

func (d *DB) GetAllSpecies() ([]models.Species, error) {
	var speciesList []models.Species

	sqlStatement := `SELECT * FROM species order by updated_at desc;`
	rows, err := d.db.Query(sqlStatement)

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var species models.Species
		err = rows.Scan(&species.ID, &species.CommonName, &species.MinHardiness, &species.MaxHardiness, &species.CreatedAt, &species.UpdatedAt, &species.ScientificName)

		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		speciesList = append(speciesList, species)
	}

	return speciesList, err
}
