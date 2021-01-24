package router

import (
	"backend/middleware"
	"github.com/gorilla/mux"
	"net/http"
)

func Router() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/api/hardiness", middleware.GetAllHardiness).Methods("GET", "OPTIONS")

	router.HandleFunc("/api/associations", middleware.GetAllAssociations).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/associations/create", middleware.AddAssociation).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/associations/edit/{id}", middleware.EditAssociation).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/associations/filter/{hardiness}", middleware.FilterAssociations).Methods("GET", "OPTIONS")

	router.HandleFunc("/api/materials", middleware.GetAllMaterials).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/materials/new", middleware.AddMaterial).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/materials/delete/{id}", middleware.DeleteMaterial).Methods("DELETE", "OPTIONS")

	router.HandleFunc("/api/species", middleware.GetAllSpecies).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/species/new", middleware.AddSpecies).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/species/delete/{id}", middleware.DeleteSpecies).Methods("DELETE", "OPTIONS")

	router.HandleFunc("/api/agro", middleware.GetAllAgroEcoSystems).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/agro/{id}/associations", middleware.GetAssociationsForAgroEcoSystem).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/agro/new", middleware.AddAgroEcoSystem).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/agro/populate", middleware.PopulateAgroEcoSystem).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/agro/delete/{id}", middleware.DeleteAgroEcoSystem).Methods("DELETE", "OPTIONS")

	staticFileDirectory := http.Dir("./assets/")
	staticFileHandler := http.StripPrefix("/assets/", http.FileServer(staticFileDirectory))
	router.PathPrefix("/assets/").Handler(staticFileHandler).Methods("GET")

	router.HandleFunc("/gallery", middleware.RenderGallery).Methods("GET")
	router.HandleFunc("/agro", middleware.RenderAddAgroSystem).Methods("GET")
	router.HandleFunc("/species", middleware.RenderAddSpecies).Methods("GET")
	router.HandleFunc("/materials", middleware.RenderAddMaterial).Methods("GET")
	router.HandleFunc("/associations", middleware.RenderAddAssociation).Methods("GET")
	router.HandleFunc("/association/{id}", middleware.RenderAssociationDetails).Methods("GET")
	router.HandleFunc("/", middleware.RenderHome).Methods("GET")

	imageFileDirectory := http.Dir("./uploads/")
	imageFileHandler := http.StripPrefix("/uploads/", http.FileServer(imageFileDirectory))
	router.PathPrefix("/uploads/").Handler(imageFileHandler).Methods("GET")

	return router
}
