package middleware

import (
	"backend/jobs"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func (handler *Handler) CheckAssociations() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("CheckAssociation")

		w.Header().Set("Context-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		items, _ := handler.DB.GetAllAssociations()
		flaggedItems := jobs.CheckLinks(items)

		json.NewEncoder(w).Encode(flaggedItems)
	}
}

func (handler *Handler) AddAssociation() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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

		image, fileHandler, err := r.FormFile("image")
		if err != nil {
			fmt.Println("Error Retrieving the File")
			fmt.Println(err)
			return
		}
		defer image.Close()

		log.Printf("Uploaded File: %+v\n", fileHandler.Filename)
		log.Printf("File Size: %+v\n", fileHandler.Size)
		log.Printf("MIME Header: %+v\n", fileHandler.Header)

		imageBytes, err := ioutil.ReadAll(image)
		if err != nil {
			fmt.Println(err)
		}

		err = ioutil.WriteFile("./uploads/"+fileHandler.Filename, imageBytes, 0666)
		if err != nil {
			fmt.Println(err)
		}

		imageId := handler.DB.InsertImage(fileHandler.Filename)
		insertID := handler.DB.InsertAssociation(int64(speciesId), int64(materialId), link, imageId)

		res := response{
			ID:      insertID,
			Message: "Association created successfully",
		}

		json.NewEncoder(w).Encode(res)
	}
}

func (handler *Handler) EditAssociation() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("EditAssociation")

		params := mux.Vars(r)
		id, err := strconv.Atoi(params["id"])
		if err != nil {
			log.Fatalf("Unable to convert the string into int.  %v", err)
		}

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

		image, fileHandler, err := r.FormFile("image")
		var imageId int64 = -1
		if err != nil {
			fmt.Println(err)
			fmt.Println("No image to update for the association")
			fmt.Println(err)
		} else {
			defer image.Close()
			log.Printf("Uploaded File: %+v\n", fileHandler.Filename)
			log.Printf("File Size: %+v\n", fileHandler.Size)
			log.Printf("MIME Header: %+v\n", fileHandler.Header)

			imageBytes, err := ioutil.ReadAll(image)
			if err != nil {
				fmt.Println(err)
			}

			err = ioutil.WriteFile("./uploads/"+fileHandler.Filename, imageBytes, 0666)
			if err != nil {
				// TODO: need to exit with error here
				fmt.Println(err)
			}

			imageId = handler.DB.InsertImage(fileHandler.Filename)
		}

		insertID := handler.DB.EditAssociation(int64(id), int64(speciesId), int64(materialId), link, imageId)

		res := response{
			ID:      insertID,
			Message: "Association edited successfully",
		}

		json.NewEncoder(w).Encode(res)
	}
}

func (handler *Handler) GetAllAssociations() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("GetAllAssociations")

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		associations, err := handler.DB.GetAllAssociations()

		if err != nil {
			log.Fatalf("Unable to get all associations. %v", err)
		}

		json.NewEncoder(w).Encode(associations)
	}
}

func (handler *Handler) FilterAssociations() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("FilterAssociations")

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		params := mux.Vars(r)
		hardiness, err := strconv.Atoi(params["hardiness"])
		if err != nil {
			log.Fatalf("Unable to convert the string into int.  %v", err)
		}

		associations, err := handler.DB.FilterAssociations(hardiness)

		if err != nil {
			log.Fatalf("Unable to get all associations. %v", err)
		}

		json.NewEncoder(w).Encode(associations)
	}
}

func (handler *Handler) DeleteAssociation() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("DeleteAssociation")

		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		id, err := strconv.Atoi(params["id"])
		if err != nil {
			log.Fatalf("Unable to convert the string into int.  %v", err)
		}

		sqlStatement := `DELETE FROM species_materials WHERE uid=$1`
		deletedRows, _ := handler.DB.Delete(sqlStatement, int64(id))
		msg := fmt.Sprintf("Association deleted successfully. Total rows/record affected %v", deletedRows)

		res := response{
			ID:      int64(id),
			Message: msg,
		}
		json.NewEncoder(w).Encode(res)
	}
}
