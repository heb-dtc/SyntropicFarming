package middleware

import (
	"backend/models"
	"github.com/gorilla/mux"
	"html/template"
	"log"
	"net/http"
	"path/filepath"
	"strconv"
)

type AddSpeciesPageData struct {
	Species       []models.Species
	HardinessList []models.Hardiness
}

type EditSpeciesPageData struct {
	SpeciesId            int64
  Species       []models.Species
	HardinessList []models.Hardiness
}

type AddAgroSystemPageData struct {
	AgroEcoSystems            []models.AgroEcoSystem
	HardinessList             []models.Hardiness
	Species                   []models.Species
	AgroEcoSystemAssociations []models.AgroEcoSystemAssociation
}

type AddAssociationPageData struct {
	Species   []models.Species
	Materials []models.Material
}

type AssociationDetailsPageData struct {
	AssociationDetails models.AssociationDetails
	Species            []models.Species
	Materials          []models.Material
}

func RenderHome(w http.ResponseWriter, r *http.Request) {
	log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates", "index.html")
	tmpl, err := template.ParseFiles(lp, fp)

	if err == nil {
		items, _ := getAllAssociations()
		tmpl.ExecuteTemplate(w, "layout", items)
	} else {
		log.Fatal(err)
	}
}

func RenderAssociationDetails(w http.ResponseWriter, r *http.Request) {
	log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates", "association_details.html")
	tmpl, err := template.ParseFiles(lp, fp)

	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])

	if err == nil {
		association, _ := getAssociation(id)
		materials, _ := getAllMaterials()
		species, _ := getAllSpecies()
		pageData := AssociationDetailsPageData{
			AssociationDetails: association,
			Species:            species,
			Materials:          materials,
		}
		tmpl.ExecuteTemplate(w, "layout", pageData)
	} else {
		log.Fatal(err)
	}
}

func RenderGallery(w http.ResponseWriter, r *http.Request) {
	log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates", "gallery.html")
	tmpl, err := template.ParseFiles(lp, fp)

	if err == nil {
		items, _ := getAllAssociations()
		tmpl.ExecuteTemplate(w, "layout", items)
	} else {
		log.Fatal(err)
	}
}

func RenderAddAssociation(w http.ResponseWriter, r *http.Request) {
	log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates", "associations.html")
	tmpl, err := template.ParseFiles(lp, fp)

	if err == nil {
		materials, _ := getAllMaterials()
		species, _ := getAllSpecies()
		items := AddAssociationPageData{
			Species:   species,
			Materials: materials,
		}
		tmpl.ExecuteTemplate(w, "layout", items)
	}
}

func RenderAddMaterial(w http.ResponseWriter, r *http.Request) {
	log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates", "materials.html")
	tmpl, err := template.ParseFiles(lp, fp)

	if err == nil {
		items, _ := getAllMaterials()
		tmpl.ExecuteTemplate(w, "layout", items)
	}
}

func RenderSpecies(w http.ResponseWriter, r *http.Request) {
	log.Printf("Render Template %s", filepath.Clean(r.URL.Path))

  id, found := mux.Vars(r)["id"]

	lp := filepath.Join("templates", "layout.html")
  listTmpl := filepath.Join("templates/species", "list_species.tmpl")
  actionTmpl := ""
  if found {
    log.Printf("loading edit template")
	  actionTmpl = filepath.Join("templates/species", "edit_species.tmpl")
  } else {
    log.Printf("loading add template")
	  actionTmpl = filepath.Join("templates/species", "add_species.tmpl")
  }

	tmpl, err := template.ParseFiles(lp, listTmpl, actionTmpl)

	if err == nil {
		species, _ := getAllSpecies()
		hardinessList, _ := getAllHardiness()

    var items interface{}
    if found {
		  items = AddSpeciesPageData{
			  Species:       species,
			  HardinessList: hardinessList,
		  }
    } else {
      speciesId, _ := strconv.ParseInt(id, 10, 64)
		  items = EditSpeciesPageData{
        SpeciesId: speciesId,
			  Species:       species,
			  HardinessList: hardinessList,
		  }
    }
		tmpl.ExecuteTemplate(w, "layout", items)
	} else {
    log.Println(err)
  }
}

func RenderAddSpecies(w http.ResponseWriter, r *http.Request) {
	log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates/species", "add_species.tmpl")
  tp := filepath.Join("templates/species", "list_species.tmpl")
	tmpl, err := template.ParseFiles(lp, fp, tp)

	if err == nil {
		species, _ := getAllSpecies()
		hardinessList, _ := getAllHardiness()

		items := AddSpeciesPageData{
			Species:       species,
			HardinessList: hardinessList,
		}
		tmpl.ExecuteTemplate(w, "layout", items)
	} else {
    log.Println(err)
  }
}

func RenderEditSpecies(w http.ResponseWriter, r *http.Request) {
	log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates/species", "edit_species.tmpl")
  tp := filepath.Join("templates/species", "list_species.tmpl")
	tmpl, err := template.ParseFiles(lp, fp, tp)

	if err == nil {
		species, _ := getAllSpecies()
		hardinessList, _ := getAllHardiness()
    speciesId, _ := strconv.ParseInt(r.URL.Query().Get("id"), 10, 64)

		items := EditSpeciesPageData{
      SpeciesId:     speciesId,
			Species:       species,
			HardinessList: hardinessList,
		}
		tmpl.ExecuteTemplate(w, "layout", items)
	} else {
    log.Println(err)
  }
}

func RenderAddAgroSystem(w http.ResponseWriter, r *http.Request) {
	log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates", "agro.html")
	tmpl, err := template.ParseFiles(lp, fp)

	if err == nil {
		agroSystems, _ := getAllAgroEcoSystems()
		agroSystemsAssociations, _ := getAllAgroEcoSystemsAssociations()
		hardinessList, _ := getAllHardiness()
		species, _ := getAllSpecies()

		items := AddAgroSystemPageData{
			AgroEcoSystems:            agroSystems,
			HardinessList:             hardinessList,
			Species:                   species,
			AgroEcoSystemAssociations: agroSystemsAssociations,
		}
		tmpl.ExecuteTemplate(w, "layout", items)
	}
}

func RenderTemplate(w http.ResponseWriter, r *http.Request) {
	log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates", "material_gallery.html")
	tmpl, err := template.ParseFiles(lp, fp)

	if err == nil {
		items, _ := getAllAssociations()
		tmpl.ExecuteTemplate(w, "layout", items)
	}
}
