import axios from 'axios'
import { Hardiness, Association, LibraryFilter, Filter, FilterType, AgroEcoSystem } from '@/models'

export const getImageUrl = (imageName: string): string => {
  return `${BASE_URL}/uploads/${imageName}`
}

//export const BASE_URL = 'https://syntropic-api.hebus.net'
export const BASE_URL = 'http://127.0.0.1:3001'
const API_URL = `${BASE_URL}/api`

const buildFilterByHardinessUrl = (hardiness: number): string => {
  return hardiness === 0 ? `${API_URL}/associations` : `${API_URL}/associations/filter/${hardiness}`
}

const buildFilterByAgoEcoSystemUrl = (systemId: number): string => {
  return `${API_URL}/agro/${systemId}/associations`
}

export const fetchAssociations = async (filter: Filter): Promise<Array<Association>> => {
  if (filter.filterType == FilterType.HARDINESS) {
    const url = buildFilterByHardinessUrl(filter.value as number)
    const response = await axios(url)
    return response.data
  } else if (filter.filterType == FilterType.AGRO_ECO_SYSTEM) {
    const url = buildFilterByAgoEcoSystemUrl(filter.id)
    const response = await axios(url)
    return response.data
  }
}

export const fetchLibraryFilters = async (): Promise<Array<LibraryFilter>> => {
  const hardinessValues = await fetchHardinessValues()
  const hardinessFilterValues = hardinessValues.map(hardiness => { 
    return {
      id: hardiness.id,
      value: hardiness.value,
      filterType: FilterType.HARDINESS
    }})

  const hardinessFilers ={
    filters: hardinessFilterValues,
    name: 'Hardiness Zones'
  }

  const agroEcoSystems = await fetchAgroEcoSystems()
  const agroFilterValues = agroEcoSystems.map(system => {
    return {
      id: system.id,
      value: system.name,
      filterType: FilterType.AGRO_ECO_SYSTEM 
    }})
  const agroFilters = {
    filters: agroFilterValues,
    name: "Agro Eco Sytems"
  }

  return [hardinessFilers, agroFilters]
}

export const fetchHardinessValues = async (): Promise<Array<Hardiness>> => {
  const url = `${API_URL}/hardiness`
  const response = await axios(url)
  return response.data
}

export const fetchAgroEcoSystems = async (): Promise<Array<AgroEcoSystem>> => {
  const url = `${API_URL}/agro`
  const response = await axios(url)
  return response.data
}
