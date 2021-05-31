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

func (handler *Handler) EditSpecies() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("EditSpecies")

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		var species models.Species
		err := json.NewDecoder(r.Body).Decode(&species)

		if err != nil {
			log.Fatalf("Unable to decode the request body.  %v", err)
		}

		species = handler.DB.EditSpecies(species)
		res := response{
			ID:      species.ID,
			Message: "Species edit successfully",
		}

		json.NewEncoder(w).Encode(res)
	}
}

func (handler *Handler) AddSpecies() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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

		insertID := handler.DB.InsertSpecies(species)
		res := response{
			ID:      insertID,
			Message: "Species created successfully",
		}

		json.NewEncoder(w).Encode(res)
	}
}

func (handler *Handler) GetAllSpecies() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("GetAllSpecies")

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		users, err := handler.DB.GetAllSpecies()

		if err != nil {
			log.Fatalf("Unable to get all species. %v", err)
		}

		json.NewEncoder(w).Encode(users)
	}
}

func (handler *Handler) DeleteSpecies() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
		deletedRows, _ := handler.DB.Delete(sqlStatement, int64(id))
		msg := fmt.Sprintf("Species deleted successfully. Total rows/record affected %v", deletedRows)

		res := response{
			ID:      int64(id),
			Message: msg,
		}
		json.NewEncoder(w).Encode(res)
	}
}
