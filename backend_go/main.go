package main

import (
  "log"
  "net/http"
  "backend/router"
)

func main() {

  router := router.Router()
  log.Fatal(http.ListenAndServe(":3001", router))
}
