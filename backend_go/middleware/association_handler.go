package middleware

import (
	"backend/models"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
)

func AddAssociation(w http.ResponseWriter, r *http.Request) {
	log.Printf("AddAssociation")

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

	log.Printf("association for species %d and material %d with link %s", speciesId, materialId, link)

	image, handler, err := r.FormFile("image")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}
	defer image.Close()

	log.Printf("Uploaded File: %+v\n", handler.Filename)
	log.Printf("File Size: %+v\n", handler.Size)
	log.Printf("MIME Header: %+v\n", handler.Header)

	imageBytes, err := ioutil.ReadAll(image)
	if err != nil {
		fmt.Println(err)
	}

	err = ioutil.WriteFile("./uploads/"+handler.Filename, imageBytes, 0666)
	if err != nil {
		fmt.Println(err)
	}

	imageId := insertImage(handler.Filename)
	insertID := insertAssociation(int64(speciesId), int64(materialId), link, imageId)

	res := response{
		ID:      insertID,
		Message: "Association created successfully",
	}

	json.NewEncoder(w).Encode(res)
}

func GetAllAssociations(w http.ResponseWriter, r *http.Request) {
  log.Printf("GetAllAssociations")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	associations, err := getAllAssociations()

	if err != nil {
		log.Fatalf("Unable to get all associations. %v", err)
	}

	json.NewEncoder(w).Encode(associations)
}

func FilterAssociations(w http.ResponseWriter, r *http.Request) {
  log.Printf("GetAllAssociations")

	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	params := mux.Vars(r)
	hardiness, err := strconv.Atoi(params["hardiness"])
	if err != nil {
		log.Fatalf("Unable to convert the string into int.  %v", err)
	}

	associations, err := filterAssociations(int64(hardiness))

	if err != nil {
		log.Fatalf("Unable to get all associations. %v", err)
	}

	json.NewEncoder(w).Encode(associations)
}

func filterAssociations(hardiness int64) ([]models.AssociationDetails, error) {
	db := createConnection()
	defer db.Close()

	var associations []models.AssociationDetails

	sqlStatement := `select species_materials.uid, species."name", materials."name", images."name", link from species_materials 
    inner join species on species_materials.species_id=species.uid
    inner join materials on species_materials.material_id=materials.uid
    inner join images on species_materials.image_id=images.uid
    where species.min_hardiness = $1 or species.max_hardiness = $1
    or species.min_hardiness < $1 and species.max_hardiness > $1`

	rows, err := db.Query(sqlStatement, hardiness)

	if err != nil {
		log.Fatalf("Unable to execute the query. %v", err)
	}

	defer rows.Close()

	for rows.Next() {
		var association models.AssociationDetails
		err = rows.Scan(&association.ID, &association.SpeciesName, &association.MaterialName, &association.ImageUrl, &association.Link)

    imageUrl := "/uploads/" + association.ImageUrl
    association.ImageUrl = imageUrl
		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		associations = append(associations, association)
	}

	return associations, err
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

    imageUrl := "/uploads/" + association.ImageUrl
    association.ImageUrl = imageUrl
		if err != nil {
			log.Fatalf("Unable to scan the row. %v", err)
		}

		associations = append(associations, association)
	}

	return associations, err
}
