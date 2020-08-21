package models

type Hardiness struct {
  ID int64 `json:"id"`
  Value string `json:"value"`
}

type Material struct {
  ID int64 `json:"id"`
  Name string `json:"name"`
}

type Species struct {
  ID int64 `json:"id"`
  Name string `json:"name"`
  MinHardiness int `json:"min_hardiness"`
  MaxHardiness int  `json:"max_hardiness"`
}

type Association struct {
  ID int64 `json:"id"`
  SpeciesId int64 `json:"species_id"`
  MaterialId int64 `json:"material_id"`
  ImageId int64 `json:"image_id"`
  Link string `json:"link"`
}
