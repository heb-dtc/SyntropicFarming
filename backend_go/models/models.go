package models

type Hardiness struct {
	ID    int64  `json:"id"`
	Value int `json:"value"`
}

type Material struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type Species struct {
	ID             int64  `json:"id"`
	ScientificName string `json:"scientific_name"`
	CommonName     string `json:"common_name"`
	MinHardiness   int    `json:"min_hardiness"`
	MaxHardiness   int    `json:"max_hardiness"`
}

type Association struct {
	ID         int64  `json:"id"`
	SpeciesId  int64  `json:"species_id"`
	MaterialId int64  `json:"material_id"`
	ImageId    int64  `json:"image_id"`
	Link       string `json:"link"`
}

type AssociationDetails struct {
	ID           int64  `json:"id"`
	SpeciesId    int64  `json:"species_id"`
	SpeciesName  string `json:"species_name"`
	MaterialId   int64  `json:"material_id"`
	MaterialName string `json:"material_name"`
	ImageUrl     string `json:"image_url"`
	Link         string `json:"link"`
}

type AgroEcoSystem struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Hardiness int    `json:"hardiness"`
}

type AgroEcoSystemAssociation struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Hardiness   int    `json:"hardiness"`
	SpeciesName string `json:"speciesName"`
}
