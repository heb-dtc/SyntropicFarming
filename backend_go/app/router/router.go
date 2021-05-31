package router

import (
	"backend/app/middleware"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"net/http/httputil"

	"github.com/gorilla/mux"
)

type AppRouter struct {
	Engine *mux.Router
}

func New() *AppRouter {
	return &AppRouter{
		Engine: mux.NewRouter(),
	}
}

func logHandler(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		x, err := httputil.DumpRequest(r, true)
		if err != nil {
			http.Error(w, fmt.Sprint(err), http.StatusInternalServerError)
			return
		}
		log.Println(fmt.Sprintf("%q", x))
		rec := httptest.NewRecorder()
		fn(rec, r)
		log.Println(fmt.Sprintf("%q", rec.Body))
	}
}

func MessageHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "A message was received")
}

func (router *AppRouter) RegisterDashboardRoutes(handler *middleware.Handler) {
	staticFileDirectory := http.Dir("./assets/")
	staticFileHandler := http.StripPrefix("/assets/", http.FileServer(staticFileDirectory))
	router.Engine.PathPrefix("/assets/").Handler(staticFileHandler).Methods("GET")

	router.Engine.HandleFunc("/gallery", handler.RenderGallery()).Methods("GET")

	router.Engine.HandleFunc("/agro/{id}", handler.RenderAgroSystem()).Methods("GET")
	router.Engine.HandleFunc("/agro", handler.RenderAgroSystem()).Methods("GET")

	router.Engine.HandleFunc("/species/{id}", handler.RenderSpecies()).Methods("GET")
	router.Engine.HandleFunc("/species", handler.RenderSpecies()).Methods("GET")

	router.Engine.HandleFunc("/materials", handler.RenderMaterial()).Methods("GET")
	router.Engine.HandleFunc("/materials/{id}", handler.RenderMaterial()).Methods("GET")

	router.Engine.HandleFunc("/associations", handler.RenderAssociation()).Methods("GET")
	router.Engine.HandleFunc("/association/{id}", handler.RenderAssociation()).Methods("GET")
	router.Engine.HandleFunc("/", handler.RenderHome()).Methods("GET")

	imageFileDirectory := http.Dir("./uploads/")
	imageFileHandler := http.StripPrefix("/uploads/", http.FileServer(imageFileDirectory))
	router.Engine.PathPrefix("/uploads/").Handler(imageFileHandler).Methods("GET")
}

func (router *AppRouter) RegisterApiRoutes(handler *middleware.Handler) {

	//router.HandleFunc("/", logHandler(MessageHandler))

	router.Engine.HandleFunc("/api/hardiness", handler.GetAllHardiness()).Methods("GET", "OPTIONS")

	router.Engine.HandleFunc("/api/associations", handler.GetAllAssociations()).Methods("GET", "OPTIONS")
	router.Engine.HandleFunc("/api/associations/create", handler.AddAssociation()).Methods("POST", "OPTIONS")
	router.Engine.HandleFunc("/api/associations/edit/{id}", handler.EditAssociation()).Methods("POST", "OPTIONS")
	router.Engine.HandleFunc("/api/associations/delete/{id}", handler.DeleteAssociation()).Methods("DELETE", "OPTIONS")
	router.Engine.HandleFunc("/api/associations/filter/{hardiness}", handler.FilterAssociations()).Methods("GET", "OPTIONS")
	router.Engine.HandleFunc("/api/associations/links", handler.CheckAssociations()).Methods("GET", "OPTIONS")

	router.Engine.HandleFunc("/api/materials", handler.GetAllMaterials()).Methods("GET", "OPTIONS")
	router.Engine.HandleFunc("/api/materials/new", handler.AddMaterial()).Methods("POST", "OPTIONS")
	router.Engine.HandleFunc("/api/materials/delete/{id}", handler.DeleteMaterial()).Methods("DELETE", "OPTIONS")
	router.Engine.HandleFunc("/api/materials/edit/{id}", handler.EditMaterials()).Methods("POST", "OPTIONS")

	router.Engine.HandleFunc("/api/species", handler.GetAllSpecies()).Methods("GET", "OPTIONS")
	router.Engine.HandleFunc("/api/species/new", handler.AddSpecies()).Methods("POST", "OPTIONS")
	router.Engine.HandleFunc("/api/species/delete/{id}", handler.DeleteSpecies()).Methods("DELETE", "OPTIONS")
	router.Engine.HandleFunc("/api/species/edit/{id}", handler.EditSpecies()).Methods("POST", "OPTIONS")

	router.Engine.HandleFunc("/api/agro", handler.GetAllAgroEcoSystems()).Methods("GET", "OPTIONS")
	router.Engine.HandleFunc("/api/agro/{id}/associations", handler.GetAssociationsForAgroEcoSystem()).Methods("GET", "OPTIONS")
	router.Engine.HandleFunc("/api/agro/new", handler.AddAgroEcoSystem()).Methods("POST", "OPTIONS")
	router.Engine.HandleFunc("/api/agro/populate", handler.PopulateAgroEcoSystem()).Methods("POST", "OPTIONS")
	router.Engine.HandleFunc("/api/agro/delete/{id}", handler.DeleteAgroEcoSystem()).Methods("DELETE", "OPTIONS")
}
