import axios from 'axios'

export const ALL_HARDINESS = -1

const baseUrl = 'https://syntropic-api.hebus.net/api'

const buildUrl = hardiness => {
  let url
  if (hardiness === ALL_HARDINESS) {
    url = `${baseUrl}/associations`
  } else {
    url = `${baseUrl}/associations/filter/${hardiness}`
  }
  return url
}

export const fetchAssociations = async hardiness => {
  const url = buildUrl(hardiness)
  const response = await axios(url)
  return response.data
}

export const fetchHardinessValues = async () => {
  const url = `${baseUrl}/hardiness` 
  const response = await axios(url)
  return response.data
}
