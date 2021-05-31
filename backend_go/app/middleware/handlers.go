package middleware

import (
	"backend/app/database"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

type response struct {
	ID      int64  `json:"id,omitempty"`
	Message string `json:"message,omitempty"`
}

type Handler struct {
	DB database.SyntropicDb
}

func New(db database.SyntropicDb) *Handler {
	return &Handler{
		DB: db,
	}
}

func (handler *Handler) GetAllHardiness() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("GetAllHardiness")

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		hardinessList, err := handler.DB.GetAllHardiness()

		if err != nil {
			log.Fatalf("Unable to get all hardiness. %v", err)
		}

		json.NewEncoder(w).Encode(hardinessList)
	}
}
