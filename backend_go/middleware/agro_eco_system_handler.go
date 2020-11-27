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

func AddAgroEcoSystem(w http.ResponseWriter, r *http.Request) {
	log.Printf("AddAgroEcoSystem")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var agroSystem models.AgroEcoSystem
	err := json.NewDecoder(r.Body).Decode(&agroSystem)

	if err != nil {
		log.Fatalf("Unable to decode the request body.  %v", err)
	}

	insertID := insertAgroEcoSystem(agroSystem)
	res := response{
		ID:      insertID,
		Message: "Agro eco system created successfully",
	}

	json.NewEncoder(w).Encode(res)
}

func GetAllAgroEcoSystems(w http.ResponseWriter, r *http.Request) {
	log.Printf("getAllAgroEcoSystems")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	users, err := getAllAgroEcoSystems()

	if err != nil {
		log.Fatalf("Unable to get all species. %v", err)
	}

	json.NewEncoder(w).Encode(users)
}

func DeleteAgroEcoSystem(w http.ResponseWriter, r *http.Request) {
	log.Printf("DeleteAgroEcoSystems")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		log.Fatalf("Unable to convert the string into int.  %v", err)
	}

	sqlStatement := `DELETE FROM agro_eco_systems WHERE uid=$1`
	deletedRows := delete(sqlStatement, int64(id))
	msg := fmt.Sprintf("AgroEcoSystem deleted successfully. Total rows/record affected %v", deletedRows)

	res := response{
		ID:      int64(id),
		Message: msg,
	}
	json.NewEncoder(w).Encode(res)
}

func insertAgroEcoSystem(agroSystem models.AgroEcoSystem) int64 {
	db := createConnection()
	defer db.Close()

	sqlStatement := `INSERT into agro_eco_systems (name, hardiness) VALUES ($1, $2) RETURNING uid`

	var id int64
	err := db.QueryRow(sqlStatement, agroSystem.Name, agroSystem.Hardiness).Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Inserted agro eco system %v", id)
	return id
}

func getAllAgroEcoSystems() ([]models.AgroEcoSystem, error) {
	db := createConnection()
	defer db.Close()

	var agroSystems []models.AgroEcoSystem

	sqlStatement := `SELECT * FROM agro_eco_systems`
	rows, err := db.Query(sqlStatement)

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var aes models.AgroEcoSystem
		err = rows.Scan(&aes.ID, &aes.Name, &aes.Hardiness)

		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		agroSystems = append(agroSystems, aes)
	}

	return agroSystems, err
}
