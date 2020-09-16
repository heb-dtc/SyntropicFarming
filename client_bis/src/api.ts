import axios from 'axios'
import { Hardiness } from '@/models'

export const BASE_URL = 'https://syntropic-api.hebus.net'
const API_URL = `${BASE_URL}/api`

const buildUrl = (hardiness: number) => {
  return hardiness === 0 ? `${API_URL}/associations` : `${API_URL}/associations/filter/${hardiness}`
}

export const fetchAssociations = async (hardiness: number) => {
  const url = buildUrl(hardiness)
  const response = await axios(url)
  return response.data
}

export const fetchHardinessValues = async (): Promise<Array<Hardiness>> => {
  const url = `${API_URL}/hardiness`
  const response = await axios(url)
  return response.data
}
