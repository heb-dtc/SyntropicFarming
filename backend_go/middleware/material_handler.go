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

func EditMaterials(w http.ResponseWriter, r *http.Request) {
	log.Printf("EditMaterial")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var material models.Material
	err := json.NewDecoder(r.Body).Decode(&material)

	if err != nil {
		log.Fatalf("Unable to decode the request body.  %v", err)
	}

	material = editMaterial(material)
	res := response{
		ID: material.ID,
		Message: "Material edited successfully",
	}

	json.NewEncoder(w).Encode(res)
}

func editMaterial(material models.Material) models.Material {
	db := createConnection()
	defer db.Close()

	sqlStatement := `UPDATE materials set name=$1 WHERE uid=$2`

  //TODO: read the number of row affected by the update
	_, err := db.Exec(sqlStatement, material.Name, material.ID)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Edited material %v", material.ID)
	return material
}

func AddMaterial(w http.ResponseWriter, r *http.Request) {
	log.Printf("AddMaterial")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var material models.Material
	err := json.NewDecoder(r.Body).Decode(&material)

	if err != nil {
		log.Fatalf("Unable to decode the request body.  %v", err)
	}

	insertID := insertMaterial(material)
	res := response{
		ID:      insertID,
		Message: "Material created successfully",
	}

	json.NewEncoder(w).Encode(res)
}

func GetAllMaterials(w http.ResponseWriter, r *http.Request) {
	log.Printf("GetAllMaterials")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	users, err := getAllMaterials()

	if err != nil {
		log.Fatalf("Unable to get all material. %v", err)
	}

	json.NewEncoder(w).Encode(users)
}

func DeleteMaterial(w http.ResponseWriter, r *http.Request) {
	log.Printf("DeleteMaterial")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		log.Fatalf("Unable to convert the string into int.  %v", err)
	}

	sqlStatement := `DELETE FROM materials WHERE uid=$1`
	deletedRows := delete(sqlStatement, int64(id))
	msg := fmt.Sprintf("Material deleted successfully. Total rows/record affected %v", deletedRows)

	res := response{
		ID:      int64(id),
		Message: msg,
	}
	json.NewEncoder(w).Encode(res)
}

func insertMaterial(material models.Material) int64 {
	db := createConnection()
	defer db.Close()

	sqlStatement := `INSERT into materials (name) VALUES ($1) RETURNING uid`

	var id int64
	err := db.QueryRow(sqlStatement, material.Name).Scan(&id)

	if err != nil {
		log.Fatalf("Unable to execute the query, %v", err)
	}

	fmt.Printf("Inserted material %v", id)
	return id
}

func getAllMaterials() ([]models.Material, error) {
	db := createConnection()
	defer db.Close()

	var materials []models.Material

	sqlStatement := `SELECT * FROM materials order by updated_at desc;`
	rows, err := db.Query(sqlStatement)

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
