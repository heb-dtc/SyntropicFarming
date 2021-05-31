package middleware

import (
	"backend/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type response struct {
	ID      int64  `json:"id,omitempty"`
	Message string `json:"message,omitempty"`
}

func createConnection() *sql.DB {
	host := os.Getenv("PGHOST")
	err := godotenv.Load(".env")

	// PGHOST can be overriden, so if it wasnt supplied we use the one from .env file
	if "" == host {
		host = os.Getenv("PGHOST")
	}

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	connectionString := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, os.Getenv("PGPORT"), os.Getenv("PGUSER"), os.Getenv("PGPASSWORD"), os.Getenv("PGDATABASE"))
	log.Printf("opening connection to %s\n", connectionString)

	db, err := sql.Open("postgres", connectionString)

	if err != nil {
		panic(err)
	}

	err = db.Ping()

	if err != nil {
		panic(err)
	}

	return db
}

func GetAllHardiness(w http.ResponseWriter, r *http.Request) {
	log.Printf("GetAllHardiness")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	hardinessList, err := getAllHardiness()

	if err != nil {
		log.Fatalf("Unable to get all hardiness. %v", err)
	}

	json.NewEncoder(w).Encode(hardinessList)
}

func delete(query string, id int64) int64 {
	db := createConnection()
	defer db.Close()

	res, err := db.Exec(query, id)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		log.Fatalf("Error while checking the affected rows. %v", err)
	}

	fmt.Printf("Total rows/record affected %v", rowsAffected)
	return rowsAffected
}

func getAllHardiness() ([]models.Hardiness, error) {
	db := createConnection()
	defer db.Close()

	var hardinessList []models.Hardiness

	sqlStatement := `SELECT * FROM hardiness`
	rows, err := db.Query(sqlStatement)

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

func getStatistics() (StatisticPageData, error) {
	db := createConnection()
	defer db.Close()

	var speciesCount int
	sqlStatement := `SELECT COUNT(*) FROM species`
	err := db.QueryRow(sqlStatement).Scan(&speciesCount)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
		return StatisticPageData{}, err
	}

	var materialsCount int
	sqlStatement = `SELECT COUNT(*) FROM materials`
	err = db.QueryRow(sqlStatement).Scan(&materialsCount)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
		return StatisticPageData{}, err
	}

	var associationsCount int
	sqlStatement = `SELECT COUNT(*) FROM species_materials`
	err = db.QueryRow(sqlStatement).Scan(&associationsCount)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
		return StatisticPageData{}, err
	}

	var agroSystemsCount int
	sqlStatement = `SELECT COUNT(*) FROM agro_eco_systems`
	err = db.QueryRow(sqlStatement).Scan(&agroSystemsCount)
	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
		return StatisticPageData{}, err
	}

	return StatisticPageData{
		SpeciesNumber:      speciesCount,
		MaterialsNumber:    materialsCount,
		AssociationsNumber: associationsCount,
		AgroSystemsNumber:  agroSystemsCount,
	}, nil
}
