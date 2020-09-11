import axios from 'axios'

export const BASE_URL = 'https://syntropic-api.hebus.net'
const API_URL = `${BASE_URL}/api`
export const ALL_HARDINESS = -1

const buildUrl = hardiness => {
  let url
  if (hardiness != 0) {
    url = `${API_URL}/associations/filter/${hardiness}`
  } else {
    url = `${API_URL}/associations`
  }
  return url
}

export const fetchAssociations = async hardiness => {
  const url = buildUrl(hardiness)
  const response = await axios(url)
  return response.data
}

export const fetchHardinessValues = async () => {
  const url = `${API_URL}/hardiness` 
  const response = await axios(url)
  return response.data
}
