import axios from 'axios'
import { Hardiness, Association, LibraryFilter, FilterType } from '@/models'

export const getImageUrl = (imageName: string): string => {
  return `${BASE_URL}/uploads/${imageName}`
}

export const BASE_URL = 'https://syntropic-api.hebus.net'
const API_URL = `${BASE_URL}/api`

const buildUrl = (hardiness: number): string => {
  return hardiness === 0 ? `${API_URL}/associations` : `${API_URL}/associations/filter/${hardiness}`
}

export const fetchAssociations = async (hardiness: number): Promise<Array<Association>> => {
  const url = buildUrl(hardiness)
  const response = await axios(url)
  return response.data
}

export const fetchLibraryFilters = async (filterType: FilterType): Promise<Array<LibraryFilter>> => {
  if (filterType == FilterType.HARDINESS) {
    const hardinessValues = await fetchHardinessValues()
    return hardinessValues.map(hardiness =>{ return {
      id: hardiness.id,
      value: hardiness.value,
      filterType: filterType
    }})
  }
  return []
}

export const fetchHardinessValues = async (): Promise<Array<Hardiness>> => {
  const url = `${API_URL}/hardiness`
  const response = await axios(url)
  return response.data
}
