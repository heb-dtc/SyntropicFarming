package middleware

import (
	"backend/models"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"log"
	"net/http"
	"strconv"
)

func AddSpecies(w http.ResponseWriter, r *http.Request) {
	log.Printf("AddSpecies")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var species models.Species
	err := json.NewDecoder(r.Body).Decode(&species)

	if err != nil {
		log.Fatalf("Unable to decode the request body.  %v", err)
	}

	insertID := insertSpecies(species)
	res := response{
		ID:      insertID,
		Message: "Species created successfully",
	}

	json.NewEncoder(w).Encode(res)
}

func GetAllSpecies(w http.ResponseWriter, r *http.Request) {
	log.Printf("GetAllSpecies")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	users, err := getAllSpecies()

	if err != nil {
		log.Fatalf("Unable to get all species. %v", err)
	}

	json.NewEncoder(w).Encode(users)
}

func DeleteSpecies(w http.ResponseWriter, r *http.Request) {
	log.Printf("DeleteSpecies")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		log.Fatalf("Unable to convert the string into int.  %v", err)
	}

	sqlStatement := `DELETE FROM species WHERE uid=$1`
	deletedRows := delete(sqlStatement, int64(id))
	msg := fmt.Sprintf("Species deleted successfully. Total rows/record affected %v", deletedRows)

	res := response{
		ID:      int64(id),
		Message: msg,
	}
	json.NewEncoder(w).Encode(res)
}

func insertSpecies(species models.Species) int64 {
	db := createConnection()
	defer db.Close()

	sqlStatement := `INSERT into species (name, min_hardiness, max_hardiness) VALUES ($1, $2, $3) RETURNING uid`

	var id int64
	err := db.QueryRow(sqlStatement, species.CommonName, species.MinHardiness, species.MaxHardiness).Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Inserted species %v", id)
	return id
}

func getAllSpecies() ([]models.Species, error) {
	db := createConnection()
	defer db.Close()

	var speciesList []models.Species

	sqlStatement := `SELECT * FROM species`
	rows, err := db.Query(sqlStatement)

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var species models.Species
		err = rows.Scan(&species.ID, &species.CommonName, &species.MinHardiness, &species.MaxHardiness)

		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		speciesList = append(speciesList, species)
	}

	return speciesList, err
}
