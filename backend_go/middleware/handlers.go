package middleware

import (
	"backend/models"
	"database/sql"
	"fmt"
	"log"
	"os"
  "strconv"
  "net/http"
  "encoding/json"
  "io/ioutil"
	"github.com/joho/godotenv"
  "github.com/gorilla/mux"
  _ "github.com/lib/pq"
)

type response struct {
    ID      int64  `json:"id,omitempty"`
    Message string `json:"message,omitempty"`
}

func createConnection() *sql.DB {
    host := os.Getenv("PGHOST")
    err := godotenv.Load(".env")
    
    // PGHOST can be overriden, so if it wasnt supplied we use the one from .env file
    if "" == host {
        host = os.Getenv("PGHOST")
    }

    if err != nil {
        log.Fatalf("Error loading .env file")
    }

    connectionString := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",  host, os.Getenv("PGPORT"), os.Getenv("PGUSER"), os.Getenv("PGPASSWORD"), os.Getenv("PGDATABASE"))
    fmt.Printf("Connecting to %s\n", connectionString)
    
    db, err := sql.Open("postgres", connectionString)

    if err != nil {
        panic(err)
    }

    err = db.Ping()

    if err != nil {
        panic(err)
    }

    fmt.Println("Successfully connected!")
    return db
}

func AddAssociation(w http.ResponseWriter, r *http.Request) {
    // max 10MB images
    r.ParseMultipartForm(10 << 20)

    speciesId, err := strconv.Atoi(r.FormValue("species"))
    if err != nil {
        log.Fatalf("Unable to convert the string into int.  %v", err)
    }
    materialId, err := strconv.Atoi(r.FormValue("material"))
    if err != nil {
        log.Fatalf("Unable to convert the string into int.  %v", err)
    }
    link := r.FormValue("link")
    
    fmt.Printf("creating association for species %d and material %d with link %s", speciesId, materialId, link)

    image, handler, err := r.FormFile("image")
    if err != nil {
        fmt.Println("Error Retrieving the File")
        fmt.Println(err)
        return
    }
    defer image.Close()

    fmt.Printf("Uploaded File: %+v\n", handler.Filename)
    fmt.Printf("File Size: %+v\n", handler.Size)
    fmt.Printf("MIME Header: %+v\n", handler.Header)

    imageBytes, err := ioutil.ReadAll(image)
    if err != nil {
        fmt.Println(err)
    }

    err = ioutil.WriteFile("./uploads/" + handler.Filename, imageBytes, 0666)
    if err != nil {
        fmt.Println(err)
    }
    fmt.Fprintf(w, "Successfully uploaded image\n")

    imageId := insertImage(handler.Filename)
    insertID := insertAssociation(int64(speciesId), int64(materialId), link, imageId)

    res := response{
        ID: insertID,
        Message: "Association created successfully",
    }

    json.NewEncoder(w).Encode(res)
}

func AddSpecies(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "POST")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

    var species models.Species
    err := json.NewDecoder(r.Body).Decode(&species)

    if err != nil {
        log.Fatalf("Unable to decode the request body.  %v", err)
    }

    insertID := insertSpecies(species)
    res := response{
        ID:      insertID,
        Message: "Species created successfully",
    }

    json.NewEncoder(w).Encode(res)
}

func GetAllAssociations(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
    w.Header().Set("Access-Control-Allow-Origin", "*")

    users, err := getAllAssociations()

    if err != nil {
        log.Fatalf("Unable to get all associations. %v", err)
    }

    json.NewEncoder(w).Encode(users)
}

func AddMaterial(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "POST")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

    var material models.Material
    err := json.NewDecoder(r.Body).Decode(&material)

    if err != nil {
        log.Fatalf("Unable to decode the request body.  %v", err)
    }

    insertID := insertMaterial(material)
    res := response{
        ID:      insertID,
        Message: "Material created successfully",
    }

    json.NewEncoder(w).Encode(res)
}

func GetAllMaterials(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
    w.Header().Set("Access-Control-Allow-Origin", "*")

    users, err := getAllMaterials()

    if err != nil {
        log.Fatalf("Unable to get all material. %v", err)
    }

    json.NewEncoder(w).Encode(users)
}

func GetAllHardiness(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
    w.Header().Set("Access-Control-Allow-Origin", "*")

    users, err := getAllHardiness()

    if err != nil {
        log.Fatalf("Unable to get all hardiness. %v", err)
    }

    json.NewEncoder(w).Encode(users)
}

func GetAllSpecies(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
    w.Header().Set("Access-Control-Allow-Origin", "*")

    users, err := getAllSpecies()

    if err != nil {
        log.Fatalf("Unable to get all species. %v", err)
    }

    json.NewEncoder(w).Encode(users)
}

func DeleteMaterial(w http.ResponseWriter, r *http.Request) {
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
    deletedRows := delete(sqlStatement, int64(id))
    msg := fmt.Sprintf("Material deleted successfully. Total rows/record affected %v", deletedRows)

    res := response{
        ID:      int64(id),
        Message: msg,
    }
    json.NewEncoder(w).Encode(res)
}

func DeleteSpecies(w http.ResponseWriter, r *http.Request) {
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
    deletedRows := delete(sqlStatement, int64(id))
    msg := fmt.Sprintf("Species deleted successfully. Total rows/record affected %v", deletedRows)

    res := response{
        ID:      int64(id),
        Message: msg,
    }
    json.NewEncoder(w).Encode(res)
}

func delete(query string, id int64) int64 {
    db := createConnection()
    defer db.Close()

    res, err := db.Exec(query, id)
    if err != nil {
        log.Fatalf("Unable to execute the query. %v", err)
    }

    rowsAffected, err := res.RowsAffected()
    if err != nil {
        log.Fatalf("Error while checking the affected rows. %v", err)
    }

    fmt.Printf("Total rows/record affected %v", rowsAffected)
    return rowsAffected
}

func insertAssociation(speciesId int64, materialId int64, link string, imageId int64) int64 {
    db := createConnection()
    defer db.Close()
  
    sqlStatement := `INSERT into species_materials (species_id, material_id, image_id, link) VALUES ($1, $2, $3, $4) RETURNING uid`
    var id int64
    err := db.QueryRow(sqlStatement, speciesId, materialId, imageId, link).Scan(&id)
  
    if err != nil {
      log.Fatalf("Unable to execute the query, %v", err)
    }
  
    fmt.Printf("Inserted association %v", id)
    return id
}

func insertImage(imageName string) int64 {
    db := createConnection()
    defer db.Close()
  
    sqlStatement := `INSERT into images (name) VALUES ($1) RETURNING uid`
  
    var id int64
    err := db.QueryRow(sqlStatement, imageName).Scan(&id)
  
    if err != nil {
      log.Fatalf("Unable to execute the query, %v", err)
    }
  
    fmt.Printf("Inserted image %v", id)
    return id
}

func insertSpecies(species models.Species) int64 {
    db := createConnection()
    defer db.Close()
  
    sqlStatement := `INSERT into species (name, min_hardiness, max_hardiness) VALUES ($1, $2, $3) RETURNING uid`
  
    var id int64
    err := db.QueryRow(sqlStatement, species.Name, species.MinHardiness, species.MaxHardiness).Scan(&id)
  
    if err != nil {
      log.Fatalf("Unable to execute the query, %v", err)
    }
  
    fmt.Printf("Inserted species %v", id)
    return id
}

func insertMaterial(material models.Material) int64 {
  db := createConnection()
  defer db.Close()

  sqlStatement := `INSERT into materials (name) VALUES ($1) RETURNING uid`

  var id int64
  err := db.QueryRow(sqlStatement, material.Name).Scan(&id)

  if err != nil {
    log.Fatalf("Unable to execute the query, %v", err)
  }

  fmt.Printf("Inserted material %v", id)
  return id
}

func getAllAssociations() ([]models.AssociationDetails, error) {
    db := createConnection()
    defer db.Close()

    var associations []models.AssociationDetails

    sqlStatement := `select species_materials.uid, species."name", materials."name", images."name", link from species_materials 
    inner join species on species_materials.species_id=species.uid
    inner join materials on species_materials.material_id=materials.uid
    inner join images on species_materials.image_id=images.uid;`

    rows, err := db.Query(sqlStatement)

    if err != nil {
        log.Fatalf("Unable to execute the query. %v", err)
    }

    defer rows.Close()

    for rows.Next() {
        var association models.AssociationDetails
        err = rows.Scan(&association.ID, &association.SpeciesName, &association.MaterialName, &association.ImageUrl, &association.Link)

        if err != nil {
            log.Fatalf("Unable to scan the row. %v", err)
        }

        associations = append(associations, association)
    }

    return associations, err
}

func getAllMaterials() ([]models.Material, error) {
    db := createConnection()
    defer db.Close()

    var materials []models.Material

    sqlStatement := `SELECT * FROM materials`
    rows, err := db.Query(sqlStatement)

    if err != nil {
        log.Fatalf("Unable to execute the query. %v", err)
    }

    defer rows.Close()

    for rows.Next() {
        var material models.Material
        err = rows.Scan(&material.ID, &material.Name)

        if err != nil {
            log.Fatalf("Unable to scan the row. %v", err)
        }

        materials = append(materials, material)
    }

    return materials, err
}

func getAllHardiness() ([]models.Hardiness, error) {
    db := createConnection()
    defer db.Close()

    var hardinessList []models.Hardiness

    sqlStatement := `SELECT * FROM hardiness`
    rows, err := db.Query(sqlStatement)

    if err != nil {
        log.Fatalf("Unable to execute the query. %v", err)
    }

    defer rows.Close()

    for rows.Next() {
        var hardiness models.Hardiness
        err = rows.Scan(&hardiness.ID, &hardiness.Value)

        if err != nil {
            log.Fatalf("Unable to scan the row. %v", err)
        }

        hardinessList = append(hardinessList, hardiness)
    }

    return hardinessList, err
}

func getAllSpecies() ([]models.Species, error) {
    db := createConnection()
    defer db.Close()

    var speciesList []models.Species

    sqlStatement := `SELECT * FROM species`
    rows, err := db.Query(sqlStatement)

    if err != nil {
        log.Fatalf("Unable to execute the query. %v", err)
    }

    defer rows.Close()

    for rows.Next() {
        var species models.Species
        err = rows.Scan(&species.ID, &species.Name, &species.MinHardiness, &species.MaxHardiness)

        if err != nil {
            log.Fatalf("Unable to scan the row. %v", err)
        }

        speciesList = append(speciesList, species)
    }

    return speciesList, err
}