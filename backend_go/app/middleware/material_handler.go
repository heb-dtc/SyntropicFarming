package middleware

import (
	"backend/models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func (handler *Handler) EditMaterials() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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

		material = handler.DB.EditMaterial(material)
		res := response{
			ID:      material.ID,
			Message: "Material edited successfully",
		}

		json.NewEncoder(w).Encode(res)
	}
}

func (handler *Handler) AddMaterial() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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

		insertID := handler.DB.InsertMaterial(material)
		res := response{
			ID:      insertID,
			Message: "Material created successfully",
		}

		json.NewEncoder(w).Encode(res)
	}
}

func (handler *Handler) GetAllMaterials() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("GetAllMaterials")

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		users, err := handler.DB.GetAllMaterials()

		if err != nil {
			log.Fatalf("Unable to get all material. %v", err)
		}

		json.NewEncoder(w).Encode(users)
	}
}

func (handler *Handler) DeleteMaterial() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
		deletedRows, _ := handler.DB.Delete(sqlStatement, int64(id))
		msg := fmt.Sprintf("Material deleted successfully. Total rows/record affected %v", deletedRows)

		res := response{
			ID:      int64(id),
			Message: msg,
		}
		json.NewEncoder(w).Encode(res)
	}
}
