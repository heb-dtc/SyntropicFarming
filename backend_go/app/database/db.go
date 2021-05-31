package database

import (
	"backend/models"
	"database/sql"
	"log"
)

type SyntropicDb interface {
	Open(connectionString string) error
	Close() error
	Delete(query string, id int64) (int64, error)

	GetAllHardiness() ([]models.Hardiness, error)

	GetStatistics() ([]int, error)

	EditSpecies(species models.Species) models.Species
	InsertSpecies(species models.Species) int64
	GetAllSpecies() ([]models.Species, error)

	GetAllMaterials() ([]models.Material, error)
	InsertMaterial(material models.Material) int64
	EditMaterial(material models.Material) models.Material

	InsertAssociation(speciesId int64, materialId int64, link string, imageId int64) int64
	EditAssociation(id int64, speciesId int64, materialId int64, link string, imageId int64) int64
	GetAllAssociations() ([]models.AssociationDetails, error)
	GetAssociation(id int64) (models.AssociationDetails, error)
	GetAssociationsForAgroEcoSytem(id int) ([]models.AssociationDetails, error)
	FilterAssociations(hardiness int) ([]models.AssociationDetails, error)

	InsertAgroEcoSystem(agroSystem models.AgroEcoSystem) int64
	InsertAgroSystemAssociation(agroSystemId int64, speciesId int64) int64
	GetAllAgroEcoSystems() ([]models.AgroEcoSystem, error)
	GetAllAgroEcoSystemsAssociations() ([]models.AgroEcoSystemAssociation, error)

	InsertImage(imageName string) int64
}

type DB struct {
	db *sql.DB
}

func (d *DB) Open(connectionString string) error {
	log.Printf("Opening connection to %s\n", connectionString)

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		return err
	}

	err = db.Ping()
	if err != nil {
		return err
	}

	log.Println("Database connection established")
	d.db = db

	return nil
}

func (d *DB) Close() error {
	return d.db.Close()
}

func (d *DB) GetStatistics() ([]int, error) {
	var speciesCount int
	sqlStatement := `SELECT COUNT(*) FROM species`
	err := d.db.QueryRow(sqlStatement).Scan(&speciesCount)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
		return nil, err
	}

	var materialsCount int
	sqlStatement = `SELECT COUNT(*) FROM materials`
	err = d.db.QueryRow(sqlStatement).Scan(&materialsCount)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
		return nil, err
	}

	var associationsCount int
	sqlStatement = `SELECT COUNT(*) FROM species_materials`
	err = d.db.QueryRow(sqlStatement).Scan(&associationsCount)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
		return nil, err
	}

	var agroSystemsCount int
	sqlStatement = `SELECT COUNT(*) FROM agro_eco_systems`
	err = d.db.QueryRow(sqlStatement).Scan(&agroSystemsCount)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
		return nil, err
	}

	return nil, nil
}

func (d *DB) GetAllHardiness() ([]models.Hardiness, error) {
	var hardinessList []models.Hardiness

	sqlStatement := `SELECT * FROM hardiness`
	rows, err := d.db.Query(sqlStatement)

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var hardiness models.Hardiness
		err = rows.Scan(&hardiness.ID, &hardiness.Value)

		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		hardinessList = append(hardinessList, hardiness)
	}

	return hardinessList, err
}
