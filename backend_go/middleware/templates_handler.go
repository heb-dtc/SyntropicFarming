package middleware

import (
	"backend/models"
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

type AddSpeciesPageData struct {
  Species []models.Species
  HardinessList []models.Hardiness
}

type AddAgroSystemPageData struct {
  AgroEcoSystems []models.AgroEcoSystem
  HardinessList []models.Hardiness
  Species []models.Species
  AgroEcoSystemAssociations []models.AgroEcoSystemAssociation
}

type AddAssociationPageData struct {
  Species []models.Species
  Materials []models.Material
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

func RenderEditAssociations(w http.ResponseWriter, r *http.Request) {
  log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

  lp := filepath.Join("templates", "layout.html")
  fp := filepath.Join("templates", "edit_associations.html")
  tmpl, err := template.ParseFiles(lp, fp)

  if err == nil {
    items, _ := getAllAssociations()
    tmpl.ExecuteTemplate(w, "layout", items)
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
    items := AddAssociationPageData {
      Species: species,
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

func RenderAddSpecies(w http.ResponseWriter, r *http.Request) {
  log.Printf("RenderTemplate %s", filepath.Clean(r.URL.Path))

  lp := filepath.Join("templates", "layout.html")
  fp := filepath.Join("templates", "species.html")
  tmpl, err := template.ParseFiles(lp, fp)

  if err == nil {
    species, _ := getAllSpecies()
    hardinessList, _ := getAllHardiness()

    items := AddSpeciesPageData {
      Species: species,
      HardinessList: hardinessList,
    }
    tmpl.ExecuteTemplate(w, "layout", items)
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

    items := AddAgroSystemPageData {
      AgroEcoSystems: agroSystems,
      HardinessList: hardinessList,
      Species: species,
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
