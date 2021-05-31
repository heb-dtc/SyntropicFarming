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

func (handler *Handler) AddAgroEcoSystem() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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

		//TODO fix this compile error
		//insertID := handler.DB.InsertAgroEcoSystem(agroSystem)
		insertID := int64(1)
		res := response{
			ID:      insertID,
			Message: "Agro eco system created successfully",
		}

		json.NewEncoder(w).Encode(res)
	}
}

func (handler *Handler) PopulateAgroEcoSystem() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
			handler.DB.InsertAgroSystemAssociation(int64(agroSystemId), int64(speciesId))
		}

		res := response{
			Message: "Agro eco system populated successfully",
		}

		json.NewEncoder(w).Encode(res)
	}
}

func (handler *Handler) GetAllAgroEcoSystems() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("getAllAgroEcoSystems")

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		systems, err := handler.DB.GetAllAgroEcoSystems()

		if err != nil {
			log.Fatalf("Unable to get all agro eco system. %v", err)
		}

		json.NewEncoder(w).Encode(systems)
	}
}

func (handler *Handler) GetAssociationsForAgroEcoSystem() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("getAllAgroEcoSystems")

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		params := mux.Vars(r)
		systemId, err := strconv.Atoi(params["id"])
		associations, err := handler.DB.GetAssociationsForAgroEcoSytem(systemId)

		if err != nil {
			log.Fatalf("Unable to get assocications for agro eco system. %v", err)
		}

		json.NewEncoder(w).Encode(associations)
	}
}

func (handler *Handler) DeleteAgroEcoSystem() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
		deletedRows, _ := handler.DB.Delete(sqlStatement, int64(id))
		msg := fmt.Sprintf("AgroEcoSystem deleted successfully. Total rows/record affected %v", deletedRows)

		res := response{
			ID:      int64(id),
			Message: msg,
		}
		json.NewEncoder(w).Encode(res)
	}
}
