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
	SpeciesList   []models.Species
	HardinessList []models.Hardiness
}

type EditSpeciesPageData struct {
	Species       models.Species
  SpeciesList   []models.Species
	HardinessList []models.Hardiness
}

type AddMaterialPageData struct {
  Materials []models.Material
}

type EditMaterialPageData struct {
  Material models.Material
  Materials []models.Material
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

func RenderMaterial(w http.ResponseWriter, r *http.Request) {
	log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

  id, found := mux.Vars(r)["id"]

	lp := filepath.Join("templates", "layout.html")
  listTmpl := filepath.Join("templates/materials", "list_materials.tmpl")
  actionTmpl := ""
  if found {
    log.Printf("loading edit template")
	  actionTmpl = filepath.Join("templates/materials", "edit_materials.tmpl")
  } else {
    log.Printf("loading add template")
	  actionTmpl = filepath.Join("templates/materials", "add_materials.tmpl")
  }

	tmpl, err := template.ParseFiles(lp, listTmpl, actionTmpl)

	if err == nil {
		materials, _ := getAllMaterials()

    var items interface{}
    if found {
      materialId, _ := strconv.ParseInt(id, 10, 64)
      var material models.Material
      for _, v := range materials {
        if v.ID == materialId {
          material = v
          break
        }
      }

		  items = EditMaterialPageData{
        Material: material,
			  Materials: materials,
		  }
    } else {
      items = AddMaterialPageData {
        Materials: materials,
      }
    }
		tmpl.ExecuteTemplate(w, "layout", items)
	} else {
    log.Println(err)
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
		speciesList, _ := getAllSpecies()
		hardinessList, _ := getAllHardiness()

    var items interface{}
    if found {
      speciesId, _ := strconv.ParseInt(id, 10, 64)
      var species models.Species
      for _, v := range speciesList {
        if v.ID == speciesId {
          species = v
          break
        }
      }

		  items = EditSpeciesPageData{
        Species: species,
			  SpeciesList:   speciesList,
			  HardinessList: hardinessList,
		  }
    } else {
		  items = AddSpeciesPageData{
			  SpeciesList:   speciesList,
			  HardinessList: hardinessList,
		  }
    }

    log.Printf("found %d species", len(speciesList))

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
