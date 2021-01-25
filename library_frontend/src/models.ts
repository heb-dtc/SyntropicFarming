export interface Hardiness {
  id: number
  value: number
}

export interface Association {
  id: number
  species_name: string
  material_name: string
  image_url: string
  link: string
}

export interface AssociationModel {
  association: Association
  selected: boolean
}

export interface MenuItemModel {
  name: string
  selected: boolean
}

export interface GridItemModel {
  material: string
  imageUrl: string
  link: string
}

export interface DisplayRow {
  [speciesName: string]: GridItemModel
}

export interface AgroEcoSystem {
  id: number 
  name: string
  hardiness: number
}

export enum FilterType {
  HARDINESS,
  AGRO_ECO_SYSTEM
}

export interface Filter {
  id: number
  value: number | string
  filterType: FilterType
}

export interface LibraryFilter {
  filters: Array<Filter>
  name: string
}
