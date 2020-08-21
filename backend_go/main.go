package main

import (
	"backend/router"
	"log"
	"net/http"
)

func main() {
	router := router.Router()
	log.Printf("Starting server @3001")
	log.Fatal(http.ListenAndServe(":3001", router))
}
