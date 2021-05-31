package database

import (
	"backend/models"
	"fmt"
	"log"
)

func (d *DB) EditMaterial(material models.Material) models.Material {
	sqlStatement := `UPDATE materials set name=$1 WHERE uid=$2`

	//TODO: read the number of row affected by the update
	_, err := d.db.Exec(sqlStatement, material.Name, material.ID)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Edited material %v", material.ID)
	return material
}

func (d *DB) InsertMaterial(material models.Material) int64 {
	sqlStatement := `INSERT into materials (name) VALUES ($1) RETURNING uid`

	var id int64
	err := d.db.QueryRow(sqlStatement, material.Name).Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Inserted material %v", id)
	return id
}

func (d *DB) GetAllMaterials() ([]models.Material, error) {
	var materials []models.Material

	sqlStatement := `SELECT * FROM materials order by updated_at desc;`
	rows, err := d.db.Query(sqlStatement)

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var material models.Material
		err = rows.Scan(&material.ID, &material.Name, &material.CreatedAt, &material.UpdatedAt)

		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		materials = append(materials, material)
	}

	return materials, err
}
