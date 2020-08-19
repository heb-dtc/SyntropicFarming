package models

type Material struct {
  ID int64 `json:"id"`
  Name string `json:"name"`
}

type Species struct {
  ID int64 `json:"id"`
  Name string `json:"name"`
}

type Association struct {
  ID int64 `json:"id"`
  SpeciesId int64 `json:"species_id"`
  MaterialId int64 `json:"material_id"`
  ImageId int64 `json:"image_id"`
  Link string `json:"link"`
}
