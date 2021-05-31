package database

import (
	"backend/models"
	"fmt"
	"log"
)

func (d *DB) InsertAssociation(speciesId int64, materialId int64, link string, imageId int64) int64 {
	sqlStatement := `INSERT into species_materials (species_id, material_id, image_id, link) VALUES ($1, $2, $3, $4) RETURNING uid`
	var id int64
	err := d.db.QueryRow(sqlStatement, speciesId, materialId, imageId, link).Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Inserted association %v", id)
	return id
}

func (d *DB) InsertImage(imageName string) int64 {
	sqlStatement := `INSERT into images (name) VALUES ($1) RETURNING uid`

	var id int64
	err := d.db.QueryRow(sqlStatement, imageName).Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Inserted image %v", id)
	return id
}

func (d *DB) EditAssociation(id int64, speciesId int64, materialId int64, link string, imageId int64) int64 {
	var sqlStatement = ""
	var err error
	if imageId != -1 {
		sqlStatement = `UPDATE species_materials set species_id=$1, material_id=$2, image_id=$3, link=$4 WHERE uid=$5`
		_, err = d.db.Exec(sqlStatement, speciesId, materialId, imageId, link, id)
	} else {
		sqlStatement = `UPDATE species_materials set species_id=$1, material_id=$2, link=$3 WHERE uid=$4`
		_, err = d.db.Exec(sqlStatement, speciesId, materialId, link, id)
	}

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Edited association %v", id)
	return id
}

func (d *DB) GetAllAssociations() ([]models.AssociationDetails, error) {
	var associations []models.AssociationDetails

	sqlStatement := `select species_materials.uid, species_materials.updated_at, species."uid", species."common_name", materials."uid", materials."name", images."name", link from species_materials 
    inner join species on species_materials.species_id=species.uid
    inner join materials on species_materials.material_id=materials.uid
    inner join images on species_materials.image_id=images.uid
    order by species_materials.updated_at desc;`

	rows, err := d.db.Query(sqlStatement)

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var association models.AssociationDetails
		err = rows.Scan(&association.ID, &association.UpdatedAt, &association.SpeciesId, &association.SpeciesName, &association.MaterialId, &association.MaterialName, &association.ImageUrl, &association.Link)

		imageUrl := "/uploads/" + association.ImageUrl
		association.ImageUrl = imageUrl
		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		associations = append(associations, association)
	}

	return associations, err
}

func (d *DB) GetAssociation(id int64) (models.AssociationDetails, error) {
	var association models.AssociationDetails

	sqlStatement := `select species_materials.uid, species."uid", species."common_name", materials."uid", materials."name", images."name", link from species_materials 
    inner join species on species_materials.species_id=species.uid
    inner join materials on species_materials.material_id=materials.uid
    inner join images on species_materials.image_id=images.uid
		where species_materials.uid = $1;`

	row := d.db.QueryRow(sqlStatement, id)

	err := row.Scan(&association.ID, &association.SpeciesId, &association.SpeciesName, &association.MaterialId, &association.MaterialName, &association.ImageUrl, &association.Link)

	imageUrl := "/uploads/" + association.ImageUrl
	association.ImageUrl = imageUrl

	if err != nil {
		log.Fatalf("Unable to scan the row. %v", err)
	}

	return association, err
}

func (d *DB) GetAssociationsForAgroEcoSytem(id int) ([]models.AssociationDetails, error) {
	var associations []models.AssociationDetails

	sqlStatement := `select species_materials.uid, species."uid", species."common_name", materials."uid", materials."name", images."name", link from species_materials 
    inner join species on species_materials.species_id=species.uid
    inner join materials on species_materials.material_id=materials.uid
    inner join images on species_materials.image_id=images.uid
		where species_materials.species_id in (select species_id from species_agrosystems where agrosystem_id = $1)`

	rows, err := d.db.Query(sqlStatement, id)

	defer rows.Close()

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	for rows.Next() {
		var association models.AssociationDetails
		err = rows.Scan(&association.ID, &association.SpeciesId, &association.SpeciesName, &association.MaterialId, &association.MaterialName, &association.ImageUrl, &association.Link)

		imageUrl := "/uploads/" + association.ImageUrl
		association.ImageUrl = imageUrl
		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		associations = append(associations, association)
	}

	return associations, err
}

func (d *DB) FilterAssociations(hardiness int) ([]models.AssociationDetails, error) {
	var associations []models.AssociationDetails

	sqlStatement := `select species_materials.uid, species."uid", species."common_name", materials."uid", materials."name", images."name", link from species_materials 
    inner join species on species_materials.species_id=species.uid
    inner join materials on species_materials.material_id=materials.uid
    inner join images on species_materials.image_id=images.uid
	  where species.min_hardiness = $1 or species.max_hardiness = $1
	  or species.min_hardiness < $1 and species.max_hardiness > $1;`

	rows, err := d.db.Query(sqlStatement, hardiness)
	defer rows.Close()

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	for rows.Next() {
		var association models.AssociationDetails
		err = rows.Scan(&association.ID, &association.SpeciesId, &association.SpeciesName, &association.MaterialId, &association.MaterialName, &association.ImageUrl, &association.Link)

		imageUrl := "/uploads/" + association.ImageUrl
		association.ImageUrl = imageUrl
		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		associations = append(associations, association)
	}

	return associations, err
}
