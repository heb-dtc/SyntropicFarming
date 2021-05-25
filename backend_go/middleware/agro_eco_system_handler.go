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

func PopulateAgroEcoSystem(w http.ResponseWriter, r *http.Request) {
	log.Printf("PopulateAgroEcoSystem")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	agroSystemId, err := strconv.Atoi(r.FormValue("agroEcoSystem"))
	if err != nil {
		log.Fatalf("Unable to convert the string into int.  %v", err)
	}

	speciesIdList := r.Form["species"]
	if err != nil {
		log.Fatalf("Unable to convert the string into int.  %v", err)
	}

	for _, s := range speciesIdList {
		speciesId, _ := strconv.Atoi(s)
		insertAgroSystemAssociation(int64(agroSystemId), int64(speciesId))
	}

	res := response{
		Message: "Agro eco system populated successfully",
	}

	json.NewEncoder(w).Encode(res)
}

func GetAllAgroEcoSystems(w http.ResponseWriter, r *http.Request) {
	log.Printf("getAllAgroEcoSystems")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	systems, err := getAllAgroEcoSystems()

	if err != nil {
		log.Fatalf("Unable to get all agro eco system. %v", err)
	}

	json.NewEncoder(w).Encode(systems)
}

func GetAssociationsForAgroEcoSystem(w http.ResponseWriter, r *http.Request) {
	log.Printf("getAllAgroEcoSystems")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	params := mux.Vars(r)
	systemId, err := strconv.Atoi(params["id"])
	associations, err := getAssociationsForAgroEcoSytem(systemId)

	if err != nil {
		log.Fatalf("Unable to get assocications for agro eco system. %v", err)
	}

	json.NewEncoder(w).Encode(associations)

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

func insertAgroSystemAssociation(agroSystemId int64, speciesId int64) int64 {
	db := createConnection()
	defer db.Close()

	sqlStatement := `INSERT into species_agrosystems (species_id, agrosystem_id) VALUES ($1, $2) RETURNING uid`

	var id int64
	err := db.QueryRow(sqlStatement, speciesId, agroSystemId).Scan(&id)

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
		err = rows.Scan(&aes.ID, &aes.Name, &aes.Hardiness, &aes.CreatedAt, &aes.UpdatedAt)

		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		agroSystems = append(agroSystems, aes)
	}

	return agroSystems, err
}

func getAllAgroEcoSystemsAssociations() ([]models.AgroEcoSystemAssociation, error) {
	db := createConnection()
	defer db.Close()

	var associations []models.AgroEcoSystemAssociation

	sqlStatement := `SELECT species_agrosystems.uid, agro_eco_systems."name", agro_eco_systems."hardiness", species."name" FROM species_agrosystems
    inner join species on species_agrosystems.species_id=species.uid
    inner join agro_eco_systems on species_agrosystems.agrosystem_id=agro_eco_systems.uid`

	rows, err := db.Query(sqlStatement)

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
