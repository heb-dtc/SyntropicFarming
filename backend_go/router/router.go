package router

import (
  "net/http"
  "backend/middleware"
  "github.com/gorilla/mux"
)

func Router() *mux.Router {
  router := mux.NewRouter()

  router.HandleFunc("/api/associations", middleware.GetAllAssociations).Methods("GET", "OPTIONS")
  router.HandleFunc("/api/associations/create", middleware.UploadImage).Methods("POST", "OPTIONS")
  
  router.HandleFunc("/api/materials", middleware.GetAllMaterials).Methods("GET", "OPTIONS")
  router.HandleFunc("/api/materials/new", middleware.AddMaterial).Methods("POST", "OPTIONS")
  router.HandleFunc("/api/materials/delete/{id}", middleware.DeleteMaterial).Methods("DELETE", "OPTIONS")

  router.HandleFunc("/api/species", middleware.GetAllSpecies).Methods("GET", "OPTIONS")
  router.HandleFunc("/api/species/new", middleware.AddSpecies).Methods("POST", "OPTIONS")
  router.HandleFunc("/api/species/delete/{id}", middleware.DeleteSpecies).Methods("DELETE", "OPTIONS")

  staticFileDirectory := http.Dir("./assets/")	
  staticFileHandler := http.StripPrefix("/assets/", http.FileServer(staticFileDirectory))
  router.PathPrefix("/assets/").Handler(staticFileHandler).Methods("GET")

  return router
}
