package jobs

import (
	"backend/models"
  "log"
	"net/http"
)

func CheckLinks(items []models.AssociationDetails) []models.AssociationDetails {
  var flaggedItems []models.AssociationDetails

  for _, v := range items {
    log.Println("Checking " + v.Link)
    working := linkIsValid(v.Link)
    if (!working) {
      log.Println("Link " + v.Link + " is broken")
      flaggedItems = append(flaggedItems, v)
    }
  }
  return flaggedItems
}

func linkIsValid(address string) bool {
  _, err := http.Get(address)
  return err == nil
}
